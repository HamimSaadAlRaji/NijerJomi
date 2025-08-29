import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletContext } from "@/contexts/WalletContext";
import { UserRole } from "../../types";
import { isRole } from "@/lib/roleUtils";
import {
  getAllProperties,
  getAllTransferRequests,
  getTransferRequest,
  registerProperty,
  approveTransferAsRegistrar,
  resolveDispute,
  markTaxPaid,
} from "@/services/blockchainService";
import * as biddingServices from "@/services/biddingServices";
import { API_BASE_URL } from "@/config/constants";
import {
  Building,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  FileText,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Loader2,
  MapPin,
  Calendar,
  User,
  Wallet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { getUserNidFromWallet } from "@/services/userServices";
import { all } from "axios";

interface Property {
  id: number;
  ownerAddress: string;
  tokenURI: string;
  isForSale: boolean;
  hasDispute: boolean;
  marketValue: bigint;
  location: string;
  area: number;
  imageUrl: string;
}

interface TransferRequest {
  id: number;
  propertyId: number;
  seller: string;
  buyer: string;
  agreedPrice: bigint;
  buyerApproved: boolean;
  sellerApproved: boolean;
  registrarApproved: boolean;
  completed: boolean;
}

const AdminPropertyManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, user, web3State } = useWalletContext();

  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(
    []
  );
  const [buyerNIDs, setBuyerNIDs] = useState<Map<string, string>>(new Map());
  const [sellerNIDs, setSellerNIDs] = useState<Map<string, string>>(new Map());

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Dialog states
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  // Transfer details dialog states
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<TransferRequest | null>(null);
  const [nidData, setNidData] = useState<{
    seller: string | null;
    buyer: string | null;
  }>({ seller: null, buyer: null });
  // Fetch NID for selected transfer
  useEffect(() => {
    const fetchNid = async () => {
      try {
        // Seller NID
        if (selectedTransfer?.seller) {
          const sellerRes = await fetch(
            `${API_BASE_URL}/user/nid-by-wallet/${selectedTransfer.seller.toLowerCase()}`
          );
          const sellerData = await sellerRes.json();
          if (sellerRes.ok && sellerData.success) {
            setNidData((prev) => ({ ...prev, seller: sellerData.nidNumber }));
          }
        }
        // Buyer NID
        if (selectedTransfer?.buyer) {
          const buyerRes = await fetch(
            `${API_BASE_URL}/user/nid-by-wallet/${selectedTransfer.buyer.toLowerCase()}`
          );
          const buyerData = await buyerRes.json();
          if (buyerRes.ok && buyerData.success) {
            setNidData((prev) => ({ ...prev, buyer: buyerData.nidNumber }));
          }
        }
      } catch (error) {
        console.error("Error fetching NID:", error);
      }
    };
    if (selectedTransfer) fetchNid();
  }, [selectedTransfer]);

  // Show transfer details dialog
  const showTransferDetails = async (transferId: number) => {
    if (!web3State.contract) return;
    try {
      const transfer = await getTransferRequest(web3State.contract, transferId);
      if (transfer) {
        setSelectedTransfer(transfer);
        setDetailsDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching transfer details:", error);
      toast({
        title: "Error",
        description: "Failed to load transfer details.",
        variant: "destructive",
      });
    }
  };

  // Form states for property registration
  const [ownerAddress, setOwnerAddress] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [marketValue, setMarketValue] = useState("");

  // Check admin/registrar access - but don't redirect immediately, wait for data to load
  useEffect(() => {
    if (!isConnected) {
      navigate("/dashboard");
      return;
    }

    // Don't redirect if we're still loading or don't have user data yet
    if (!user || web3State.isLoading) {
      return;
    }

    // Check multiple role sources
    const backendRole = user.userRole || "";
    const blockchainRole = user.blockchainRole || UserRole.NONE;
    const web3Role = web3State.role || UserRole.NONE;

    const hasBackendAccess =
      isRole(backendRole, UserRole.ADMIN) ||
      isRole(backendRole, UserRole.REGISTRAR);
    const hasBlockchainAccess =
      blockchainRole === UserRole.ADMIN ||
      blockchainRole === UserRole.REGISTRAR;
    const hasWeb3Access =
      web3Role === UserRole.ADMIN || web3Role === UserRole.REGISTRAR;

    console.log("Role check:", {
      backendRole,
      blockchainRole,
      web3Role,
      hasBackendAccess,
      hasBlockchainAccess,
      hasWeb3Access,
      isLoading: web3State.isLoading,
    });

    // Only redirect if we have complete data and no access
    if (
      !web3State.isLoading &&
      !hasBackendAccess &&
      !hasBlockchainAccess &&
      !hasWeb3Access
    ) {
      console.log("Access denied - redirecting to dashboard");
      navigate("/dashboard");
      return;
    }
  }, [isConnected, user, navigate, web3State.role, web3State.isLoading]);

  // Fetch data
  const fetchData = async () => {
    if (!web3State.contract) {
      console.log("No contract available for fetching data");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting to fetch data...");

      const [allProperties, allTransfers] = await Promise.all([
        getAllProperties(web3State.contract),
        getAllTransferRequests(web3State.contract),
      ]);

      setProperties(allProperties);
      setTransferRequests(allTransfers);

      // load the buyer and seller nid map
      const buyerMap = new Map<string, string>();
      const sellerMap = new Map<string, string>();
      for (const transfer of allTransfers) {
        const buyerNID = await getUserNidFromWallet(
          transfer.buyer.toLowerCase()
        );
        const sellerNID = await getUserNidFromWallet(
          transfer.seller.toLowerCase()
        );
        buyerMap.set(transfer.buyer.toLowerCase(), buyerNID);
        sellerMap.set(transfer.seller.toLowerCase(), sellerNID);
      }

      setBuyerNIDs(buyerMap);
      setSellerNIDs(sellerMap);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    console.log("Contract state changed:", {
      contractExists: !!web3State.contract,
      account: web3State.account,
      role: web3State.role,
      isLoading: web3State.isLoading,
    });

    // Only fetch data if we have contract and web3 is not loading
    // if (web3State.contract && web3State.isLoading) {
    //   fetchData();
    // }
    if (web3State.contract && web3State.account) {
      fetchData();
    }
  }, [web3State.contract, web3State.isLoading]);

  // Register new property
  const handleRegisterProperty = async () => {
    if (
      !web3State.contract ||
      !ownerAddress ||
      !location ||
      !area ||
      !marketValue
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading("register-property");

      const res = await fetch(
        `${API_BASE_URL}/user/wallet-by-nid/${ownerAddress}`
      );
      const data = await res.json();

      if (!data.success) {
        toast({
          title: "Invalid NID",
          description: "No wallet linked to this NID. Please check again.",
          variant: "destructive",
        });
        setActionLoading(null);
        return;
      }

      const owneraddress = data.walletAddress;

      // Create metadata object
      const metadata = {
        name: `Property at ${location}`,
        description: description || `Property located at ${location}`,
        image:
          imageUrl ||
          "https://gateway.pinata.cloud/ipfs/bafkreierbmgzqa4h7hpcdsyxjvcjromsamqbffj4z2zwv2dyjk3ttaubcu",
        location: location,
        area: parseInt(area),
        imageUrl:
          imageUrl ||
          "https://gateway.pinata.cloud/ipfs/bafkreierbmgzqa4h7hpcdsyxjvcjromsamqbffj4z2zwv2dyjk3ttaubcu",
      };

      // For demo purposes, we'll use a simple JSON string as tokenURI
      // In production, this would be uploaded to IPFS
      const tokenURI = `data:application/json,${encodeURIComponent(
        JSON.stringify(metadata)
      )}`;

      await registerProperty(
        web3State.contract,
        owneraddress,
        tokenURI,
        marketValue
      );

      toast({
        title: "Property Registered",
        description: `Property at ${location} has been registered successfully.`,
        variant: "success" as any,
      });

      // Reset form
      setOwnerAddress("");
      setLocation("");
      setArea("");
      setDescription("");
      setImageUrl("");
      setMarketValue("");
      setRegisterDialogOpen(false);

      // Refresh data
      await refreshData();
    } catch (error) {
      console.error("Error registering property:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Approve transfer as registrar
  const handleApproveTransfer = async (transfer: TransferRequest) => {
    if (!web3State.contract) return;

    try {
      setActionLoading(`approve-${transfer.id}`);

      await approveTransferAsRegistrar(web3State.contract, transfer.id);
      await biddingServices.deleteBiddingsByPropertyId(transfer.propertyId);

      toast({
        title: "Transfer Approved",
        description: "Transfer request has been approved as registrar.",
        variant: "success" as any,
      });

      await refreshData();
    } catch (error) {
      console.error("Error approving transfer:", error);
      toast({
        title: "Approval Failed",
        description: "Failed to approve transfer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Resolve dispute
  const handleResolveDispute = async (
    propertyId: number,
    resolved: boolean
  ) => {
    if (!web3State.contract) return;

    try {
      setActionLoading(`dispute-${propertyId}`);

      await resolveDispute(web3State.contract, propertyId, resolved);

      toast({
        title: "Dispute Resolved",
        description: `Dispute has been ${resolved ? "resolved" : "rejected"}.`,
        variant: "success" as any,
      });

      await refreshData();
    } catch (error) {
      console.error("Error resolving dispute:", error);
      toast({
        title: "Resolution Failed",
        description: "Failed to resolve dispute. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Mark tax as paid
  const handleMarkTaxPaid = async (propertyId: number) => {
    if (!web3State.contract) return;

    try {
      setActionLoading(`tax-${propertyId}`);

      await markTaxPaid(web3State.contract, propertyId);

      toast({
        title: "Tax Marked as Paid",
        description: "Property tax has been marked as paid.",
        variant: "success" as any,
      });

      await refreshData();
    } catch (error) {
      console.error("Error marking tax as paid:", error);
      toast({
        title: "Tax Update Failed",
        description: "Failed to mark tax as paid. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const formatEther = (value: bigint) => {
    return parseFloat(ethers.formatEther(value)).toFixed(4);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTransferStatus = (transfer: TransferRequest) => {
    if (transfer.completed) return "Completed";
    if (
      transfer.buyerApproved &&
      transfer.sellerApproved &&
      transfer.registrarApproved
    )
      return "Ready to Execute";
    if (transfer.registrarApproved) return "Approved by Registrar";
    if (transfer.buyerApproved && transfer.sellerApproved)
      return "Pending Registrar Approval";
    return "Pending Approvals";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success text-success-foreground";
      case "Ready to Execute":
        return "bg-info text-info-foreground";
      case "Approved by Registrar":
        return "bg-property-approved text-property-approved-foreground";
      case "Pending Registrar Approval":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-property-pending text-property-pending-foreground";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading user data...</span>
      </div>
    );
  }

  // Check if user has access (ADMIN or REGISTRAR)
  const backendRole = user.userRole || "";
  const blockchainRole = user.blockchainRole || UserRole.NONE;
  const web3Role = web3State.role || UserRole.NONE;

  const hasBackendAccess =
    isRole(backendRole, UserRole.ADMIN) ||
    isRole(backendRole, UserRole.REGISTRAR);
  const hasBlockchainAccess =
    blockchainRole === UserRole.ADMIN || blockchainRole === UserRole.REGISTRAR;
  const hasWeb3Access =
    web3Role === UserRole.ADMIN || web3Role === UserRole.REGISTRAR;

  if (!hasBackendAccess && !hasBlockchainAccess && !hasWeb3Access) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Roles: {backendRole || "None"} | {blockchainRole || "None"} |{" "}
            {web3Role || "None"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold mb-2"
              style={{
                background:
                  "linear-gradient(135deg, #465465 0%, #465465 50%, #293842 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Property Management System
            </h1>
            <p style={{ color: "#293842" }}>
              Admin controls for property registration and transfer management
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={refreshData}
              disabled={refreshing}
              className="border hover:bg-green-50 hover:text-green-700 hover:-translate-y-1 hover:shadow-lg transition-transform duration-150"
              style={{
                borderColor: "#a1d99b",
                color: "#006d2c",
                backgroundColor: "#fff",
              }}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Dialog
              open={registerDialogOpen}
              onOpenChange={setRegisterDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  className="text-white hover:-translate-y-1 hover:shadow-lg transition-transform duration-150"
                  style={{ backgroundColor: "#006d2c" }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register Property
                </Button>
              </DialogTrigger>
              <DialogContent
                className="max-w-md bg-white border"
                style={{ borderColor: "#4caf50" }}
              >
                <DialogHeader>
                  <DialogTitle style={{ color: "#151269" }}>
                    Register New Property
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="owner-address" style={{ color: "#151269" }}>
                      Owner NID Number *
                    </Label>
                    <Input
                      id="owner-address"
                      placeholder="Enter your NID Number"
                      value={ownerAddress}
                      onChange={(e) => setOwnerAddress(e.target.value)}
                      className="border"
                      style={{ borderColor: "#aad6ec" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" style={{ color: "#151269" }}>
                      Location *
                    </Label>
                    <Input
                      id="location"
                      placeholder="Property address/location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border"
                      style={{ borderColor: "#81b1ce" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="area" style={{ color: "#151269" }}>
                      Area (sq ft) *
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="1000"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="border"
                      style={{ borderColor: "#113065" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="market-value" style={{ color: "#151269" }}>
                      Market Value (BDT) *
                    </Label>
                    <Input
                      id="market-value"
                      type="number"
                      step="0.001"
                      placeholder="1.0"
                      value={marketValue}
                      onChange={(e) => setMarketValue(e.target.value)}
                      className="border"
                      style={{ borderColor: "#0f1056" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" style={{ color: "#151269" }}>
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Property description..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border"
                      style={{ borderColor: "#aad6ec" }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-url" style={{ color: "#151269" }}>
                      Image URL
                    </Label>
                    <Input
                      id="image-url"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="border"
                      style={{ borderColor: "#81b1ce" }}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setRegisterDialogOpen(false)}
                      className="border"
                      style={{ borderColor: "#aad6ec", color: "#151269" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRegisterProperty}
                      disabled={actionLoading === "register-property"}
                      className="text-white"
                      style={{ backgroundColor: "#113065" }}
                    >
                      {actionLoading === "register-property" && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}
                      Register
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card
            className="bg-white shadow-sm border"
            style={{ borderColor: "#a1d99b" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="w-8 h-8" style={{ color: "#293842" }} />
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#465465" }}
                  >
                    Total Properties
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#293842" }}
                  >
                    {properties.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white shadow-sm border"
            style={{ borderColor: "#a1d99b" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8" style={{ color: "#293842" }} />
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#465465" }}
                  >
                    Transfer Requests
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#293842" }}
                  >
                    {transferRequests.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white shadow-sm border"
            style={{ borderColor: "#a1d99b" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle
                  className="w-8 h-8"
                  style={{ color: "#dc2626" }}
                />
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#465465" }}
                  >
                    Disputes
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#dc2626" }}
                  >
                    {properties.filter((p) => p.hasDispute).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white shadow-sm border"
            style={{ borderColor: "#a1d99b" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8" style={{ color: "#293842" }} />
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#465465" }}
                  >
                    Pending Approvals
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#293842" }}
                  >
                    {
                      transferRequests.filter(
                        (t) => !t.registrarApproved && !t.completed
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="properties" className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 bg-white border"
            style={{ borderColor: "#a1d99b" }}
          >
            <TabsTrigger
              value="properties"
              className="data-[state=active]:bg-green-300/20"
              style={{ color: "#006d2c" }}
            >
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="transfers"
              className="data-[state=active]:bg-green-300/20"
              style={{ color: "#006d2c" }}
            >
              Transfer Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "#a1d99b" }}
                />
                <span className="ml-2" style={{ color: "#006d2c" }}>
                  Loading properties...
                </span>
              </div>
            ) : (
              <div className="space-y-6">
                {properties.map((property) => {
                  const getPropertyType = () => {
                    const area = property.area || 0;
                    if (area > 10000) return "Large Commercial Land";
                    if (area > 5000) return "Commercial Land";
                    if (area > 2000) return "Residential Plot";
                    if (area > 1000) return "Building Plot";
                    return "Land Plot";
                  };

                  return (
                    <Card
                      key={property.id}
                      className="group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden shadow-md bg-white cursor-pointer"
                      style={{
                        border: "1px solid #a1d99b",
                        backgroundColor: "#f7fcf5",
                      }}
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      <div className="flex">
                        {/* Property Image */}
                        <div className="relative w-[450px] h-full rounded-lg overflow-hidden flex-shrink-0 p-6">
                          <img
                            src={property.imageUrl}
                            alt={`Property ${property.id}`}
                            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://gateway.pinata.cloud/ipfs/bafkreierbmgzqa4h7hpcdsyxjvcjromsamqbffj4z2zwv2dyjk3ttaubcu";
                            }}
                          />

                          {/* Property Status Badges */}
                          <div className="absolute top-3 left-3 flex gap-2">
                            {property.hasDispute && (
                              <Badge
                                className="text-white shadow-lg"
                                style={{ backgroundColor: "#dc2626" }}
                              >
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Dispute
                              </Badge>
                            )}
                            {property.isForSale && (
                              <Badge
                                className="text-white shadow-lg"
                                style={{ backgroundColor: "#4677d3ff" }}
                              >
                                For Sale
                              </Badge>
                            )}
                            <Badge
                              className="text-white shadow-lg"
                              style={{ backgroundColor: "#16a34a" }}
                            >
                              Registered
                            </Badge>
                          </div>

                          {/* Admin icon */}
                          <div className="absolute top-3 right-3">
                            <div className="w-9 h-9 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
                              <Building
                                className="w-6 h-6"
                                style={{ color: "#293842" }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Property Details */}
                        <CardContent className="flex-1 p-6">
                          <div className="h-full flex flex-col justify-between">
                            <div>
                              {/* Price and basic info */}
                              <div className="mb-4">
                                <div
                                  className="text-3xl font-bold mb-2"
                                  style={{ color: "#293842" }}
                                >
                                  {formatEther(property.marketValue)} BDT
                                </div>
                                <h3
                                  className="text-xl font-semibold mb-2"
                                  style={{ color: "#006d2c" }}
                                >
                                  {getPropertyType()} #{property.id.toString()}
                                </h3>
                                <div className="flex items-center text-gray-600 mb-3">
                                  <MapPin
                                    className="w-5 h-5 mr-2"
                                    style={{ color: "#41ab5d" }}
                                  />
                                  <span
                                    className="text-lg font-medium"
                                    style={{ color: "#006d2c" }}
                                  >
                                    {property.location}
                                  </span>
                                </div>
                              </div>

                              {/* Owner Information */}
                              <div
                                className="p-3 rounded-lg mb-4"
                                style={{
                                  backgroundColor: "#f7fcf5",
                                  border: "1px solid #c7e9c0",
                                }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <User
                                    className="w-4 h-4"
                                    style={{ color: "#293842" }}
                                  />
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "#293842" }}
                                  >
                                    Property Owner
                                  </span>
                                </div>
                                <div
                                  className="text-base font-bold"
                                  style={{ color: "#293842" }}
                                >
                                  {truncateAddress(property.ownerAddress)}
                                </div>
                              </div>

                              {/* Property Features */}
                              <div className="flex items-center gap-4 mb-4 text-sm">
                                <span
                                  className="flex items-center gap-1"
                                  style={{ color: "#41ab5d" }}
                                >
                                  <Building className="w-4 h-4" />
                                  {property.area.toLocaleString()} sq ft
                                </span>
                                <span
                                  className="flex items-center gap-1"
                                  style={{ color: "#41ab5d" }}
                                >
                                  <FileText className="w-4 h-4" />
                                  ID: {property.id}
                                </span>
                              </div>
                            </div>

                            {/* Admin Action Buttons */}
                            <div className="space-y-3">
                              {property.hasDispute && (
                                <div className="flex gap-2">
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResolveDispute(property.id, true);
                                    }}
                                    disabled={
                                      actionLoading === `dispute-${property.id}`
                                    }
                                    className="flex-1 text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                                    style={{ backgroundColor: "#16a34a" }}
                                  >
                                    {actionLoading ===
                                    `dispute-${property.id}` ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4" />
                                    )}
                                    Resolve Dispute
                                  </Button>
                                  <Button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleResolveDispute(property.id, false);
                                    }}
                                    disabled={
                                      actionLoading === `dispute-${property.id}`
                                    }
                                    className="flex-1 text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                                    style={{ backgroundColor: "#dc2626" }}
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Reject Dispute
                                  </Button>
                                </div>
                              )}
                              <div className="flex justify-end">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/property/${property.id}`);
                                  }}
                                  variant="outline"
                                  className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border hover:bg-[#c7e9c0] hover:border-[#a1d99b] hover:text-[#006d2c] hover:shadow-md"
                                  style={{
                                    borderColor: "#aad6ec",
                                    color: "#006d2c",
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transfers" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "#a1d99b" }}
                />
                <span className="ml-2" style={{ color: "#006d2c" }}>
                  Loading transfer requests...
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {transferRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <p style={{ color: "#006d2c" }}>
                      No transfer requests found.
                    </p>
                    <p className="text-xs mt-2" style={{ color: "#465465" }}>
                      Contract:{" "}
                      {web3State.contract ? "Connected" : "Not connected"} |
                      Role: {user?.blockchainRole || user?.userRole || "None"}
                    </p>
                  </div>
                ) : (
                  [...transferRequests]
                    .sort((a, b) => {
                      if (a.completed === b.completed) return 0;
                      return a.completed ? 1 : -1;
                    })
                    .map((transfer) => {
                      const property = properties.find(
                        (p) => p.id === transfer.propertyId
                      );
                      const status = getTransferStatus(transfer);
                      return (
                        <Card
                          key={transfer.id}
                          className="bg-white shadow-sm border"
                          style={{ borderColor: "#a1d99b" }}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="space-y-2">
                                <h4
                                  className="font-semibold"
                                  style={{ color: "#293842" }}
                                >
                                  Transfer #{transfer.id} -{" "}
                                  {property?.location ||
                                    `Property #${transfer.propertyId}`}
                                </h4>
                                <div
                                  className="grid grid-cols-2 gap-4 text-sm"
                                  style={{ color: "#6b7280" }}
                                >
                                  <div>
                                    <p>
                                      <strong style={{ color: "#293842" }}>
                                        Seller:
                                      </strong>{" "}
                                      {sellerNIDs.get(
                                        transfer.seller.toLowerCase()
                                      )}
                                    </p>
                                    <p>
                                      <strong style={{ color: "#293842" }}>
                                        Buyer:
                                      </strong>{" "}
                                      {buyerNIDs.get(
                                        transfer.buyer.toLowerCase()
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p>
                                      <strong style={{ color: "#293842" }}>
                                        Price:
                                      </strong>{" "}
                                      {formatEther(transfer.agreedPrice)} BDT
                                    </p>
                                    <p>
                                      <strong style={{ color: "#293842" }}>
                                        Property ID:
                                      </strong>{" "}
                                      {transfer.propertyId}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-2 text-xs">
                                  <Badge
                                    className={
                                      transfer.buyerApproved
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600"
                                    }
                                  >
                                    Buyer:{" "}
                                    {transfer.buyerApproved
                                      ? "Approved"
                                      : "Pending"}
                                  </Badge>
                                  <Badge
                                    className={
                                      transfer.sellerApproved
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600"
                                    }
                                  >
                                    Seller:{" "}
                                    {transfer.sellerApproved
                                      ? "Approved"
                                      : "Pending"}
                                  </Badge>
                                  <Badge
                                    className={
                                      transfer.registrarApproved
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600"
                                    }
                                  >
                                    Registrar:{" "}
                                    {transfer.registrarApproved
                                      ? "Approved"
                                      : "Pending"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                <Badge className={getStatusColor(status)}>
                                  {status}
                                </Badge>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      showTransferDetails(transfer.id)
                                    }
                                    className="border hover:bg-[#c7e9c0] hover:border-[#a1d99b] hover:text-[#006d2c]"
                                    style={{
                                      borderColor: "#a1d99b",
                                      color: "#293842",
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Details
                                  </Button>
                                  {!transfer.registrarApproved &&
                                    !transfer.completed && (
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleApproveTransfer(transfer)
                                        }
                                        disabled={
                                          actionLoading ===
                                            `approve-${transfer.id}` ||
                                          !transfer.buyerApproved
                                        }
                                        className="text-white hover:opacity-90"
                                        style={{ backgroundColor: "#006d2c" }}
                                      >
                                        {actionLoading ===
                                        `approve-${transfer.id}` ? (
                                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        ) : (
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                        )}
                                        Approve as Registrar
                                      </Button>
                                    )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        {/* Transfer Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent
            className="max-w-2xl bg-white border"
            style={{ borderColor: "#aad6ec" }}
          >
            <DialogHeader>
              <DialogTitle style={{ color: "#151269" }}>
                Transfer Request Details
              </DialogTitle>
            </DialogHeader>
            {selectedTransfer && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: "#151269" }}
                    >
                      Transfer Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong style={{ color: "#151269" }}>
                          Transfer ID:
                        </strong>{" "}
                        <span style={{ color: "#81b1ce" }}>
                          {selectedTransfer.id}
                        </span>
                      </p>
                      <p>
                        <strong style={{ color: "#151269" }}>
                          Property ID:
                        </strong>{" "}
                        <span style={{ color: "#81b1ce" }}>
                          {selectedTransfer.propertyId}
                        </span>
                      </p>
                      <p>
                        <strong style={{ color: "#151269" }}>
                          Agreed Price:
                        </strong>{" "}
                        <span style={{ color: "#81b1ce" }}>
                          {formatEther(selectedTransfer.agreedPrice)} BDT
                        </span>
                      </p>
                      <p>
                        <strong style={{ color: "#151269" }}>Status:</strong>{" "}
                        <span style={{ color: "#113065" }}>
                          {getTransferStatus(selectedTransfer)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: "#151269" }}
                    >
                      Parties
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong style={{ color: "#151269" }}>
                          Seller NID:
                        </strong>{" "}
                        <span style={{ color: "#81b1ce" }}>
                          {nidData.seller || "Loading..."}
                        </span>
                      </p>
                      <p>
                        <strong style={{ color: "#151269" }}>Buyer NID:</strong>{" "}
                        <span style={{ color: "#81b1ce" }}>
                          {nidData.buyer || "Loading..."}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Approval Status</h4>
                  <div className="relative flex items-center justify-between w-full mb-6">
                    {/* Step 1 - Seller */}
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedTransfer.sellerApproved
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        1
                      </div>
                      <span className="mt-2 text-sm">Seller</span>
                    </div>
                    {/* Line between Seller -> Buyer */}
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        selectedTransfer.sellerApproved &&
                        selectedTransfer.buyerApproved
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    {/* Step 2 - Buyer */}
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedTransfer.buyerApproved
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        2
                      </div>
                      <span className="mt-2 text-sm">Buyer</span>
                    </div>
                    {/* Line between Buyer -> Registrar */}
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        selectedTransfer.buyerApproved &&
                        selectedTransfer.registrarApproved
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    {/* Step 3 - Registrar */}
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          selectedTransfer.registrarApproved
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        3
                      </div>
                      <span className="mt-2 text-sm">Registrar</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={`p-3 rounded border text-center ${
                        selectedTransfer.sellerApproved
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="font-medium">Seller</div>
                      <div
                        className={
                          selectedTransfer.sellerApproved
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {selectedTransfer.sellerApproved
                          ? "✓ Approved"
                          : "⏳ Pending"}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded border text-center ${
                        selectedTransfer.buyerApproved
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="font-medium">Buyer</div>
                      <div
                        className={
                          selectedTransfer.buyerApproved
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {selectedTransfer.buyerApproved
                          ? "✓ Approved"
                          : "⏳ Pending"}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded border text-center ${
                        selectedTransfer.registrarApproved
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="font-medium">Registrar</div>
                      <div
                        className={
                          selectedTransfer.registrarApproved
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {selectedTransfer.registrarApproved
                          ? "✓ Approved"
                          : "⏳ Pending"}
                      </div>
                    </div>
                  </div>
                </div>
                {properties.find(
                  (p) => p.id === selectedTransfer.propertyId
                ) && (
                  <div>
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: "#151269" }}
                    >
                      Property Details
                    </h4>
                    <div
                      className="p-4 rounded"
                      style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #aad6ec",
                      }}
                    >
                      {(() => {
                        const property = properties.find(
                          (p) => p.id === selectedTransfer.propertyId
                        );
                        return property ? (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p>
                                <strong style={{ color: "#151269" }}>
                                  Location:
                                </strong>{" "}
                                <span style={{ color: "#81b1ce" }}>
                                  {property.location}
                                </span>
                              </p>
                              <p>
                                <strong style={{ color: "#151269" }}>
                                  Area:
                                </strong>{" "}
                                <span style={{ color: "#81b1ce" }}>
                                  {property.area} sq ft
                                </span>
                              </p>
                            </div>
                            <div>
                              <p>
                                <strong style={{ color: "#151269" }}>
                                  Market Value:
                                </strong>{" "}
                                <span style={{ color: "#81b1ce" }}>
                                  {formatEther(property.marketValue)} BDT
                                </span>
                              </p>
                              <p>
                                <strong style={{ color: "#151269" }}>
                                  For Sale:
                                </strong>{" "}
                                <span style={{ color: "#81b1ce" }}>
                                  {property.isForSale ? "Yes" : "No"}
                                </span>
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminPropertyManagement;
