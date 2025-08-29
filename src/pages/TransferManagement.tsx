import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletContext } from "@/contexts/WalletContext";
import {
  getAllTransferRequests,
  getTransferRequest,
  approveTransferAsBuyer,
  getAllProperties,
} from "@/services/blockchainService";
import { API_BASE_URL } from "@/config/constants";
import {
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Clock,
  DollarSign,
  RefreshCw,
  Loader2,
  MapPin,
  User,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

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

const TransferManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, user, web3State } = useWalletContext();

  // State
  const [properties, setProperties] = useState<Property[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(
    []
  );
  const [userTransfers, setUserTransfers] = useState<{
    asBuyer: TransferRequest[];
    asSeller: TransferRequest[];
  }>({ asBuyer: [], asSeller: [] });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [userVerificationStatus, setUserVerificationStatus] = useState<
    boolean | null
  >(null);

  // Dialog states
  const [selectedTransfer, setSelectedTransfer] =
    useState<TransferRequest | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [nidData, setNidData] = useState({ seller: null, buyer: null });

  // Check user access
  useEffect(() => {
    if (!isConnected || !user || !web3State.account) {
      navigate("/connect-wallet");
      return;
    }
    const fetchNid = async () => {
      try {
        // Seller NID
        if (selectedTransfer?.seller) {
          const sellerRes = await fetch(
            `${API_BASE_URL}/user/nid-by-wallet/${selectedTransfer.seller.toLowerCase()}`
          );
          console.log("Seller NID Response:", selectedTransfer.seller);
          const sellerData = await sellerRes.json();
          console.log("Seller NID Response:", sellerData);

          if (sellerRes.ok && sellerData.success) {
            setNidData((prev) => ({
              ...prev,
              seller: sellerData.nidNumber,
            }));
          }
        }

        // Buyer NID
        if (selectedTransfer?.buyer) {
          const buyerRes = await fetch(
            `${API_BASE_URL}/user/nid-by-wallet/${selectedTransfer.buyer.toLowerCase()}`
          );
          console.log("Buyer NID Response:", selectedTransfer.buyer);
          const buyerData = await buyerRes.json();

          if (buyerRes.ok && buyerData.success) {
            setNidData((prev) => ({
              ...prev,
              buyer: buyerData.nidNumber,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching NID:", error);
      }
    };
    fetchNid();
  }, [isConnected, user, web3State.account, navigate, selectedTransfer]);

  // Fetch data
  const fetchData = async () => {
    if (!web3State.contract || !web3State.account) return;

    try {
      setLoading(true);

      const [allProperties, allTransfers] = await Promise.all([
        getAllProperties(web3State.contract),
        getAllTransferRequests(web3State.contract),
      ]);

      setProperties(allProperties);
      setTransferRequests(allTransfers);
      setUserVerificationStatus(user?.status === "accepted" || false);

      // Filter transfers for current user
      const userAddress = web3State.account.toLowerCase();
      const asBuyer = allTransfers.filter(
        (t) => t.buyer.toLowerCase() === userAddress
      );
      const asSeller = allTransfers.filter(
        (t) => t.seller.toLowerCase() === userAddress
      );

      setUserTransfers({ asBuyer, asSeller });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load transfer data. Please try again.",
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
    if (web3State.contract && web3State.account) {
      fetchData();
    }
  }, [web3State.contract, web3State.account]);

  // Approve transfer as buyer
  const handleApproveAsBuyer = async (transferId: number) => {
    if (!web3State.contract || !web3State.account) return;

    try {
      setActionLoading(`approve-buyer-${transferId}`);

      // Check if buyer (current user) is verified
      if (user?.status !== "accepted") {
        toast({
          title: "Buyer Not Verified",
          description:
            "You must be verified before approving transfers. Please complete your verification first.",
          variant: "destructive",
        });
        return;
      }

      await approveTransferAsBuyer(web3State.contract, transferId);

      toast({
        title: "Transfer Approved",
        description: "You have approved this transfer as the buyer.",
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

  // Show transfer details
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
    if (transfer.buyerApproved) return "Waiting for Seller";
    if (transfer.sellerApproved) return "Waiting for Buyer";
    return "Pending All Approvals";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Ready to Execute":
        return "bg-blue-100 text-blue-800";
      case "Approved by Registrar":
        return "bg-purple-100 text-purple-800";
      case "Pending Registrar Approval":
        return "bg-orange-100 text-orange-800";
      case "Waiting for Seller":
        return "bg-yellow-100 text-yellow-800";
      case "Waiting for Buyer":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPropertyForTransfer = (propertyId: number) => {
    return properties.find((p) => p.id === propertyId);
  };

  const canApproveAsBuyer = (transfer: TransferRequest) => {
    return (
      !transfer.buyerApproved &&
      !transfer.completed &&
      transfer.buyer.toLowerCase() === web3State.account?.toLowerCase()
    );
  };

  if (!user || !web3State.account) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">
              Transfer Management
            </h1>
            <p className="text-gray-600">
              Manage your property transfer requests and approvals
            </p>
          </div>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            variant="outline"
            className="transition-colors"
            style={{
              borderColor: "#a1d99b",
              color: "#006d2c",
              backgroundColor: "#fff",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#e6f4ea";
              e.currentTarget.style.color = "#006d2c";
              e.currentTarget.style.borderColor = "#41ab5d";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#006d2c";
              e.currentTarget.style.borderColor = "#a1d99b";
            }}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Verification Status Alert */}
        {user?.status !== "accepted" && (
          <div className="mb-6">
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <AlertCircle
                    className="w-5 h-5 mr-2"
                    style={{ color: "#151269" }}
                  />
                  <div>
                    <p className="text-black font-medium">
                      Account Not Verified
                    </p>
                    <p className="text-gray-700 text-sm">
                      You must be verified to create or approve transfer
                      requests. Please complete your verification first.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border" style={{ borderColor: "#a1d99b" }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Send className="w-8 h-8" style={{ color: "#151269" }} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">As Seller</p>
                  <p className="text-2xl font-bold text-black">
                    {userTransfers.asSeller.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border" style={{ borderColor: "#a1d99b" }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8" style={{ color: "#0f1056" }} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">As Buyer</p>
                  <p className="text-2xl font-bold text-black">
                    {userTransfers.asBuyer.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border" style={{ borderColor: "#a1d99b" }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8" style={{ color: "#151269" }} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Action
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {
                      userTransfers.asBuyer.filter((t) => canApproveAsBuyer(t))
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border" style={{ borderColor: "#a1d99b" }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8" style={{ color: "#113065" }} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-black">
                    {
                      [
                        ...userTransfers.asBuyer,
                        ...userTransfers.asSeller,
                      ].filter((t) => t.completed).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="as-buyer" className="w-full">
          <TabsList
            className="grid w-full grid-cols-2 bg-white border"
            style={{ borderColor: "#aad6ec" }}
          >
            <TabsTrigger
              value="as-buyer"
              className="data-[state=active]:bg-green-300/20"
              style={{ color: "#006d2c" }}
            >
              As Buyer ({userTransfers.asBuyer.length})
            </TabsTrigger>
            <TabsTrigger
              value="as-seller"
              className="data-[state=active]:bg-green-300/20"
              style={{ color: "#006d2c" }}
            >
              As Seller ({userTransfers.asSeller.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="as-buyer" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "#151269" }}
                />
                <span className="ml-2 text-black">Loading transfers...</span>
              </div>
            ) : userTransfers.asBuyer.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    No Purchase Requests
                  </h3>
                  <p className="text-gray-600">
                    You haven't been involved in any property purchases yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {[...userTransfers.asBuyer]
                  .sort((a, b) => {
                    if (a.completed === b.completed) return 0;
                    return a.completed ? 1 : -1;
                  })
                  .map((transfer) => {
                    const property = getPropertyForTransfer(
                      transfer.propertyId
                    );
                    const status = getTransferStatus(transfer);
                    const needsApproval = canApproveAsBuyer(transfer);
                    return (
                      <Card
                        key={transfer.id}
                        className={
                          needsApproval ? "border-orange-200 bg-orange-50" : ""
                        }
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold">
                                  Purchase Request #{transfer.id}
                                </h4>
                                {needsApproval && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Action Required
                                  </Badge>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                  <p>
                                    <strong>Property:</strong>{" "}
                                    {property?.location ||
                                      `ID #${transfer.propertyId}`}
                                  </p>
                                  <p>
                                    <strong>Seller:</strong>{" "}
                                    {truncateAddress(transfer.seller)}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Price:</strong>{" "}
                                    {formatEther(transfer.agreedPrice)} BDT
                                  </p>
                                  <p>
                                    <strong>Area:</strong>{" "}
                                    {property?.area || "N/A"} sq ft
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2 text-xs">
                                <Badge
                                  className={
                                    transfer.buyerApproved
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  }
                                >
                                  Your Approval:{" "}
                                  {transfer.buyerApproved ? "✓" : "Pending"}
                                </Badge>
                                <Badge
                                  className={
                                    transfer.sellerApproved
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  }
                                >
                                  Seller:{" "}
                                  {transfer.sellerApproved ? "✓" : "Pending"}
                                </Badge>
                                <Badge
                                  className={
                                    transfer.registrarApproved
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  }
                                >
                                  Registrar:{" "}
                                  {transfer.registrarApproved ? "✓" : "Pending"}
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
                                  className="transition-colors"
                                  style={{
                                    borderColor: "#a1d99b",
                                    color: "#006d2c",
                                    backgroundColor: "#fff",
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#e6f4ea";
                                    e.currentTarget.style.color = "#006d2c";
                                    e.currentTarget.style.borderColor =
                                      "#41ab5d";
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                      "#fff";
                                    e.currentTarget.style.color = "#006d2c";
                                    e.currentTarget.style.borderColor =
                                      "#a1d99b";
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Details
                                </Button>
                                {needsApproval && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleApproveAsBuyer(transfer.id)
                                    }
                                    disabled={
                                      actionLoading ===
                                      `approve-buyer-${transfer.id}`
                                    }
                                    className="text-white hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: "#151269" }}
                                  >
                                    {actionLoading ===
                                    `approve-buyer-${transfer.id}` ? (
                                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Approve Purchase
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="as-seller" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2
                  className="w-8 h-8 animate-spin"
                  style={{ color: "#151269" }}
                />
                <span className="ml-2 text-black">Loading transfers...</span>
              </div>
            ) : userTransfers.asSeller.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-12 text-center">
                  <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    No Sale Requests
                  </h3>
                  <p className="text-gray-600">
                    You haven't created any property sale requests yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {[...userTransfers.asSeller]
                  .sort((a, b) => {
                    if (a.completed === b.completed) return 0;
                    return a.completed ? 1 : -1;
                  })
                  .map((transfer) => {
                    const property = getPropertyForTransfer(
                      transfer.propertyId
                    );
                    const status = getTransferStatus(transfer);
                    return (
                      <Card key={transfer.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <h4 className="font-semibold">
                                Sale Request #{transfer.id}
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                  <p>
                                    <strong>Property:</strong>{" "}
                                    {property?.location ||
                                      `ID #${transfer.propertyId}`}
                                  </p>
                                  <p>
                                    <strong>Buyer:</strong>{" "}
                                    {truncateAddress(transfer.buyer)}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Price:</strong>{" "}
                                    {formatEther(transfer.agreedPrice)} BDT
                                  </p>
                                  <p>
                                    <strong>Area:</strong>{" "}
                                    {property?.area || "N/A"} sq ft
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2 text-xs">
                                <Badge
                                  className={
                                    transfer.buyerApproved
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  }
                                >
                                  Buyer:{" "}
                                  {transfer.buyerApproved ? "✓" : "Pending"}
                                </Badge>
                                <Badge
                                  className={
                                    transfer.sellerApproved
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  }
                                >
                                  Your Approval:{" "}
                                  {transfer.sellerApproved ? "✓" : "Pending"}
                                </Badge>
                                <Badge
                                  className={
                                    transfer.registrarApproved
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                  }
                                >
                                  Registrar:{" "}
                                  {transfer.registrarApproved ? "✓" : "Pending"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <Badge className={getStatusColor(status)}>
                                {status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => showTransferDetails(transfer.id)}
                                className="transition-colors"
                                style={{
                                  borderColor: "#a1d99b",
                                  color: "#006d2c",
                                  backgroundColor: "#fff",
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#e6f4ea";
                                  e.currentTarget.style.color = "#006d2c";
                                  e.currentTarget.style.borderColor = "#41ab5d";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#fff";
                                  e.currentTarget.style.color = "#006d2c";
                                  e.currentTarget.style.borderColor = "#a1d99b";
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Transfer Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">
                Transfer Request Details
              </DialogTitle>
            </DialogHeader>
            {selectedTransfer && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-black">
                      Transfer Information
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <strong>Transfer ID:</strong> {selectedTransfer.id}
                      </p>
                      <p className="text-gray-700">
                        <strong>Property ID:</strong>{" "}
                        {selectedTransfer.propertyId}
                      </p>
                      <p className="text-gray-700">
                        <strong>Agreed Price:</strong>{" "}
                        {formatEther(selectedTransfer.agreedPrice)} BDT
                      </p>
                      <p className="text-gray-700">
                        <strong>Status:</strong>{" "}
                        {getTransferStatus(selectedTransfer)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-black">Parties</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <strong>Seller NID:</strong>{" "}
                        {nidData.seller || "Loading..."}
                      </p>
                      <p className="text-gray-700">
                        <strong>Buyer NID:</strong>{" "}
                        {nidData.buyer || "Loading..."}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-black">
                    Approval Status
                  </h4>
                  <div className="relative flex items-center justify-between w-full mb-6">
                    {/* Step 1 - Seller */}
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
          ${selectedTransfer.sellerApproved ? "" : "text-gray-600"}`}
                        style={{
                          backgroundColor: selectedTransfer.sellerApproved
                            ? "#113065"
                            : "#d1d5db",
                        }}
                      >
                        1
                      </div>
                      <span className="mt-2 text-sm text-black">Seller</span>
                    </div>

                    {/* Line between Seller -> Buyer */}
                    <div
                      className="flex-1 h-1 mx-2"
                      style={{
                        backgroundColor:
                          selectedTransfer.sellerApproved &&
                          selectedTransfer.buyerApproved
                            ? "#81b1ce"
                            : "#d1d5db",
                      }}
                    />

                    {/* Step 2 - Buyer */}
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
          ${selectedTransfer.buyerApproved ? "" : "text-gray-600"}`}
                        style={{
                          backgroundColor: selectedTransfer.buyerApproved
                            ? "#0f1056"
                            : "#d1d5db",
                        }}
                      >
                        2
                      </div>
                      <span className="mt-2 text-sm text-black">Buyer</span>
                    </div>

                    {/* Line between Buyer -> Registrar */}
                    <div
                      className="flex-1 h-1 mx-2"
                      style={{
                        backgroundColor:
                          selectedTransfer.buyerApproved &&
                          selectedTransfer.registrarApproved
                            ? "#151269"
                            : "#d1d5db",
                      }}
                    />

                    {/* Step 3 - Registrar */}
                    <div className="flex flex-col items-center z-10">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
          ${selectedTransfer.registrarApproved ? "" : "text-gray-600"}`}
                        style={{
                          backgroundColor: selectedTransfer.registrarApproved
                            ? "#151269"
                            : "#d1d5db",
                        }}
                      >
                        3
                      </div>
                      <span className="mt-2 text-sm text-black">Registrar</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div
                      className={`p-3 rounded border text-center ${
                        selectedTransfer.sellerApproved
                          ? "border-green-200"
                          : "border-yellow-200"
                      }`}
                      style={{
                        backgroundColor: selectedTransfer.sellerApproved
                          ? "#dcfce7"
                          : "#fffbeb",
                      }}
                    >
                      <div className="font-medium text-gray-800">Seller</div>
                      <div
                        style={{
                          color: selectedTransfer.sellerApproved
                            ? "#16a34a"
                            : "#d97706",
                        }}
                      >
                        {selectedTransfer.sellerApproved
                          ? "✓ Approved"
                          : "⏳ Pending"}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded border text-center ${
                        selectedTransfer.buyerApproved
                          ? "border-green-200"
                          : "border-yellow-200"
                      }`}
                      style={{
                        backgroundColor: selectedTransfer.buyerApproved
                          ? "#dcfce7"
                          : "#fffbeb",
                      }}
                    >
                      <div className="font-medium text-gray-800">Buyer</div>
                      <div
                        style={{
                          color: selectedTransfer.buyerApproved
                            ? "#16a34a"
                            : "#d97706",
                        }}
                      >
                        {selectedTransfer.buyerApproved
                          ? "✓ Approved"
                          : "⏳ Pending"}
                      </div>
                    </div>
                    <div
                      className={`p-3 rounded border text-center ${
                        selectedTransfer.registrarApproved
                          ? "border-green-200"
                          : "border-yellow-200"
                      }`}
                      style={{
                        backgroundColor: selectedTransfer.registrarApproved
                          ? "#dcfce7"
                          : "#fffbeb",
                      }}
                    >
                      <div className="font-medium text-gray-800">Registrar</div>
                      <div
                        style={{
                          color: selectedTransfer.registrarApproved
                            ? "#16a34a"
                            : "#d97706",
                        }}
                      >
                        {selectedTransfer.registrarApproved
                          ? "✓ Approved"
                          : "⏳ Pending"}
                      </div>
                    </div>
                  </div>
                </div>

                {getPropertyForTransfer(selectedTransfer.propertyId) && (
                  <div>
                    <h4 className="font-semibold mb-2 text-black">
                      Property Details
                    </h4>
                    <div
                      className="p-4 rounded"
                      style={{
                        backgroundColor: "#aad6ec20",
                        borderColor: "#81b1ce",
                        border: "1px solid",
                      }}
                    >
                      {(() => {
                        const property = getPropertyForTransfer(
                          selectedTransfer.propertyId
                        );
                        return property ? (
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-700">
                                <strong>Location:</strong> {property.location}
                              </p>
                              <p className="text-gray-700">
                                <strong>Area:</strong> {property.area} sq ft
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-700">
                                <strong>Market Value:</strong>{" "}
                                {formatEther(property.marketValue)} BDT
                              </p>
                              <p className="text-gray-700">
                                <strong>For Sale:</strong>{" "}
                                {property.isForSale ? "Yes" : "No"}
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

export default TransferManagement;
