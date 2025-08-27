import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MyPropertyCard } from "@/components/Properties";
import { useWalletContext } from "@/contexts/WalletContext";
import { UserRole } from "../../types";
import { isRole } from "@/lib/roleUtils";
import {
  getPropertiesByOwner,
  setForSale,
  requestTransfer,
  reportDispute,
  getAllTransferRequests,
} from "@/services/blockchainService";
import {
  Home,
  DollarSign,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Eye,
  Edit,
  Send,
  Loader2,
  Plus,
  RefreshCw,
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

const MyProperties = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, user, web3State } = useWalletContext();
  const [properties, setProperties] = useState<Property[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [userVerificationStatus, setUserVerificationStatus] = useState<
    boolean | null
  >(null);

  // Dialog states
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [saleDialogOpen, setSaleDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [disputeDialogOpen, setDisputeDialogOpen] = useState(false);

  // Form states
  const [salePrice, setSalePrice] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [agreedPrice, setAgreedPrice] = useState("");

  // Check user access
  useEffect(() => {
    if (!isConnected || !user) {
      navigate("/connect-wallet");
      return;
    }
  }, [isConnected, user, navigate]);

  // Fetch user properties and transfer requests
  const fetchData = async () => {
    if (!web3State.contract || !web3State.account) return;

    try {
      setLoading(true);

      // Fetch user properties and set verification status from user data
      const [userProperties, allTransfers] = await Promise.all([
        getPropertiesByOwner(web3State.contract, web3State.account),
        getAllTransferRequests(web3State.contract),
      ]);

      setProperties(userProperties);
      setUserVerificationStatus(user?.status === "accepted" || false);

      // Fetch all transfer requests to find relevant ones
      const userTransfers = allTransfers.filter(
        (transfer) =>
          transfer.seller.toLowerCase() === web3State.account.toLowerCase() ||
          transfer.buyer.toLowerCase() === web3State.account.toLowerCase()
      );
      setTransferRequests(userTransfers);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load your properties. Please try again.",
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

  const handleSetForSale = async (forSale: boolean) => {
    if (!selectedProperty || !web3State.contract || !web3State.account) return;

    // Check verification status from user data
    if (user?.status !== "accepted") {
      toast({
        title: "Account Not Verified",
        description: "You must be verified before listing properties for sale.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(`sale-${selectedProperty.id}`);

      await setForSale(web3State.contract, selectedProperty.id, forSale);

      // Update local state
      setProperties((prev) =>
        prev.map((p) =>
          p.id === selectedProperty.id ? { ...p, isForSale: forSale } : p
        )
      );

      toast({
        title: forSale
          ? "Property Listed for Sale"
          : "Property Removed from Sale",
        description: `${selectedProperty.location} has been ${
          forSale ? "listed for sale" : "removed from sale"
        }.`,
      });

      setSaleDialogOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error("Error updating sale status:", error);
      toast({
        title: "Error",
        description: "Failed to update property sale status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestTransfer = async () => {
    if (
      !selectedProperty ||
      !web3State.contract ||
      !web3State.account ||
      !buyerAddress ||
      !agreedPrice
    ) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(`transfer-${selectedProperty.id}`);

      // Check if seller (current user) is verified
      if (user?.status !== "accepted") {
        toast({
          title: "Seller Not Verified",
          description:
            "You must be verified before creating transfer requests. Please complete your verification first.",
          variant: "destructive",
        });
        return;
      }

      // For buyer verification, we'll let the contract handle it since we don't have buyer's user data
      // The contract will throw an error if buyer is not verified

      const priceInWei = ethers.parseEther(agreedPrice);

      await requestTransfer(
        web3State.contract,
        selectedProperty.id,
        buyerAddress,
        priceInWei
      );

      toast({
        title: "Transfer Request Created",
        description: `Transfer request for ${selectedProperty.location} has been created.`,
      });

      setTransferDialogOpen(false);
      setSelectedProperty(null);
      setBuyerAddress("");
      setAgreedPrice("");

      // Refresh data to show new transfer request
      await refreshData();
    } catch (error) {
      console.error("Error creating transfer request:", error);
      toast({
        title: "Error",
        description: "Failed to create transfer request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReportDispute = async () => {
    if (!selectedProperty || !web3State.contract) return;

    try {
      setActionLoading(`dispute-${selectedProperty.id}`);

      await reportDispute(web3State.contract, selectedProperty.id);

      // Update local state
      setProperties((prev) =>
        prev.map((p) =>
          p.id === selectedProperty.id ? { ...p, hasDispute: true } : p
        )
      );

      toast({
        title: "Dispute Reported",
        description: `Dispute has been reported for property ${selectedProperty.location}.`,
      });

      setDisputeDialogOpen(false);
      setSelectedProperty(null);
    } catch (error) {
      console.error("Error reporting dispute:", error);
      toast({
        title: "Error",
        description: "Failed to report dispute. Please try again.",
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatMarketValue = (value: bigint) => {
    return `${parseFloat(ethers.formatEther(value)).toFixed(4)} ETH`;
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setSaleDialogOpen(true);
  };

  const handleTransferProperty = (property: Property) => {
    setSelectedProperty(property);
    setTransferDialogOpen(true);
  };

  const getTransferStatus = (transfer: TransferRequest) => {
    if (transfer.completed) return "Completed";
    if (
      transfer.buyerApproved &&
      transfer.sellerApproved &&
      transfer.registrarApproved
    )
      return "Ready to Execute";
    if (transfer.registrarApproved) return "Waiting for Final Approval";
    if (transfer.buyerApproved && transfer.sellerApproved)
      return "Waiting for Registrar";
    if (transfer.buyerApproved) return "Waiting for Seller";
    return "Waiting for Buyer";
  };

  const getTransferStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Ready to Execute":
        return "bg-blue-100 text-blue-800";
      case "Waiting for Final Approval":
        return "bg-purple-100 text-purple-800";
      case "Waiting for Registrar":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!user) {
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
              My Properties
            </h1>
            <p className="text-gray-600">
              Manage your property portfolio on the blockchain
            </p>
          </div>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            variant="outline"
            className="flex items-center hover:bg-blue-50 transition-colors"
            style={{ borderColor: "#81b1ce", color: "#151269" }}
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
                  <AlertTriangle
                    className="w-5 h-5 mr-2"
                    style={{ color: "#151269" }}
                  />
                  <div>
                    <p className="text-black font-medium">
                      Account Not Verified
                    </p>
                    <p className="text-gray-700 text-sm">
                      You must be verified to create transfer requests or put
                      properties for sale. Please complete your verification
                      first.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border" style={{ borderColor: "#aad6ec" }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Home className="w-8 h-8" style={{ color: "#151269" }} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Properties
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {properties.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border" style={{ borderColor: "#81b1ce" }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8" style={{ color: "#0f1056" }} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">For Sale</p>
                  <p className="text-2xl font-bold text-black">
                    {properties.filter((p) => p.isForSale).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border" style={{ borderColor: "#113065" }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Send className="w-8 h-8" style={{ color: "#151269" }} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Active Transfers
                  </p>
                  <p className="text-2xl font-bold text-black">
                    {transferRequests.filter((t) => !t.completed).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border" style={{ borderColor: "#aad6ec" }}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Disputes</p>
                  <p className="text-2xl font-bold text-black">
                    {properties.filter((p) => p.hasDispute).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Properties Section */}
        <div className="mb-12">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: "#151269" }}
              />
              <span className="ml-2 text-black">
                Loading your properties...
              </span>
            </div>
          ) : properties.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-12 text-center">
                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-black">
                  No Properties Found
                </h3>
                <p className="text-gray-600 mb-4">
                  You don't own any properties yet.
                </p>
                <Button
                  onClick={() => navigate("/register")}
                  className="text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#151269" }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register Your First Property
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {properties.map((property) => (
                <MyPropertyCard
                  key={property.id}
                  property={property}
                  formatAddress={formatAddress}
                  formatMarketValue={formatMarketValue}
                  onEditClick={handleEditProperty}
                  onTransferClick={handleTransferProperty}
                  userVerified={user?.status === "accepted"}
                />
              ))}
            </div>
          )}
        </div>

        {/* All Transfers Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">All Transfers</h2>
          </div>
          {transferRequests.length === 0 ? (
            <Card className="bg-white">
              <CardContent className="p-12 text-center">
                <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-black">
                  No Transfer Requests
                </h3>
                <p className="text-gray-600">
                  No transfer requests found for your properties.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...transferRequests]
                .sort((a, b) => {
                  if (a.completed === b.completed) return 0;
                  return a.completed ? 1 : -1;
                })
                .map((transfer) => {
                  const property = properties.find(
                    (p) => p.id === transfer.propertyId
                  );
                  const status = getTransferStatus(transfer);
                  const isUserSeller =
                    transfer.seller.toLowerCase() ===
                    web3State.account?.toLowerCase();

                  return (
                    <Card
                      key={transfer.id}
                      className="bg-white border"
                      style={{ borderColor: "#aad6ec" }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-black">
                              {property?.location ||
                                `Property #${transfer.propertyId}`}
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Transfer ID: {transfer.id}</p>
                              <p>
                                Price: {formatEther(transfer.agreedPrice)} ETH
                              </p>
                              <p>
                                {isUserSeller ? "Buyer" : "Seller"}: {" "}
                                {truncateAddress(
                                  isUserSeller ? transfer.buyer : transfer.seller
                                )}
                              </p>
                            </div>
                          </div>
                          <Badge className={getTransferStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>

        {/* Dialogs */}
        {/* Set For Sale Dialog */}
        <Dialog open={saleDialogOpen} onOpenChange={setSaleDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">
                Manage Property Sale Status
              </DialogTitle>
            </DialogHeader>
            {selectedProperty && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Property: {selectedProperty.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Status:{" "}
                    {selectedProperty.isForSale ? "For Sale" : "Not For Sale"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleSetForSale(!selectedProperty.isForSale)
                    }
                    disabled={actionLoading === `sale-${selectedProperty.id}`}
                    className="text-white hover:opacity-90"
                    style={{
                      backgroundColor: selectedProperty.isForSale
                        ? "#dc2626"
                        : "#16a34a",
                    }}
                  >
                    {actionLoading === `sale-${selectedProperty.id}` && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {selectedProperty.isForSale
                      ? "Remove from Sale"
                      : "Put for Sale"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedProperty(null);
                      setDisputeDialogOpen(true);
                    }}
                    disabled={selectedProperty.hasDispute}
                    className="hover:bg-blue-50 transition-colors"
                    style={{ borderColor: "#81b1ce", color: "#151269" }}
                  >
                    Report Dispute
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Report Dispute Dialog */}
        <Dialog open={disputeDialogOpen} onOpenChange={setDisputeDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-black">
                Report Property Dispute
              </DialogTitle>
            </DialogHeader>
            {selectedProperty && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Property: {selectedProperty.location}
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    Warning: Reporting a dispute will mark this property as
                    disputed and may affect its sale status.
                  </p>
                </div>
                <Button
                  onClick={handleReportDispute}
                  disabled={actionLoading === `dispute-${selectedProperty.id}`}
                  className="text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  {actionLoading === `dispute-${selectedProperty.id}` && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Report Dispute
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyProperties;
