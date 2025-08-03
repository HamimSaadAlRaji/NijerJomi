import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const getPropertyStatusBadge = (property: Property) => {
    if (property.hasDispute) {
      return <Badge variant="destructive">Dispute</Badge>;
    }
    if (property.isForSale) {
      return <Badge className="bg-green-100 text-green-800">For Sale</Badge>;
    }
    return <Badge variant="secondary">Not For Sale</Badge>;
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Properties
            </h1>
            <p className="text-muted-foreground">
              Manage your property portfolio on the blockchain
            </p>
          </div>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            variant="outline"
            className="flex items-center"
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
                  <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                  <div>
                    <p className="text-orange-800 font-medium">
                      Account Not Verified
                    </p>
                    <p className="text-orange-700 text-sm">
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Home className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Properties
                  </p>
                  <p className="text-2xl font-bold">{properties.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    For Sale
                  </p>
                  <p className="text-2xl font-bold">
                    {properties.filter((p) => p.isForSale).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Send className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Transfers
                  </p>
                  <p className="text-2xl font-bold">
                    {transferRequests.filter((t) => !t.completed).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Disputes
                  </p>
                  <p className="text-2xl font-bold">
                    {properties.filter((p) => p.hasDispute).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading your properties...</span>
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Properties Found
              </h3>
              <p className="text-muted-foreground mb-4">
                You don't own any properties yet.
              </p>
              <Button onClick={() => navigate("/register")}>
                <Plus className="w-4 h-4 mr-2" />
                Register Your First Property
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="md:flex">
                  {/* Property Image */}
                  <div className="md:w-1/3">
                    <img
                      src={property.imageUrl}
                      alt={property.location}
                      className="w-full h-64 md:h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://gateway.pinata.cloud/ipfs/bafkreierbmgzqa4h7hpcdsyxjvcjromsamqbffj4z2zwv2dyjk3ttaubcu";
                      }}
                    />
                  </div>

                  {/* Property Details */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {property.location}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            Property ID: {property.id}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Area: {property.area} sq ft
                        </div>
                      </div>
                      {getPropertyStatusBadge(property)}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                        <span className="font-semibold text-lg">
                          {formatEther(property.marketValue)} ETH
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Dialog
                        open={
                          saleDialogOpen && selectedProperty?.id === property.id
                        }
                        onOpenChange={setSaleDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant={
                              property.isForSale ? "destructive" : "default"
                            }
                            size="sm"
                            onClick={() => setSelectedProperty(property)}
                            disabled={
                              actionLoading === `sale-${property.id}` ||
                              property.hasDispute
                            }
                          >
                            {actionLoading === `sale-${property.id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : property.isForSale ? (
                              <TrendingDown className="w-4 h-4 mr-2" />
                            ) : (
                              <TrendingUp className="w-4 h-4 mr-2" />
                            )}
                            {property.isForSale
                              ? "Remove from Sale"
                              : "List for Sale"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {property.isForSale
                                ? "Remove from Sale"
                                : "List for Sale"}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p>
                              Are you sure you want to{" "}
                              {property.isForSale
                                ? "remove this property from sale"
                                : "list this property for sale"}
                              ?
                            </p>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setSaleDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() =>
                                  handleSetForSale(!property.isForSale)
                                }
                                disabled={
                                  actionLoading === `sale-${property.id}`
                                }
                              >
                                {actionLoading === `sale-${property.id}` && (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                )}
                                Confirm
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={
                          transferDialogOpen &&
                          selectedProperty?.id === property.id
                        }
                        onOpenChange={setTransferDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProperty(property)}
                            disabled={property.hasDispute}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Request Transfer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Property Transfer</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="buyer-address">
                                Buyer Address
                              </Label>
                              <Input
                                id="buyer-address"
                                placeholder="0x..."
                                value={buyerAddress}
                                onChange={(e) =>
                                  setBuyerAddress(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="agreed-price">
                                Agreed Price (ETH)
                              </Label>
                              <Input
                                id="agreed-price"
                                type="number"
                                step="0.001"
                                placeholder="0.0"
                                value={agreedPrice}
                                onChange={(e) => setAgreedPrice(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setTransferDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleRequestTransfer}
                                disabled={
                                  actionLoading === `transfer-${property.id}`
                                }
                              >
                                {actionLoading ===
                                  `transfer-${property.id}` && (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                )}
                                Create Request
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={
                          disputeDialogOpen &&
                          selectedProperty?.id === property.id
                        }
                        onOpenChange={setDisputeDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProperty(property)}
                            disabled={property.hasDispute}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Report Dispute
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Report Property Dispute</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                              This will mark the property as having a dispute
                              and prevent any transfers until resolved by court
                              authorities.
                            </p>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setDisputeDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleReportDispute}
                                disabled={
                                  actionLoading === `dispute-${property.id}`
                                }
                              >
                                {actionLoading === `dispute-${property.id}` && (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                )}
                                Report Dispute
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Transfer Requests Section */}
        {transferRequests.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Transfer Requests</h2>
            <div className="space-y-4">
              {transferRequests.map((transfer) => {
                const property = properties.find(
                  (p) => p.id === transfer.propertyId
                );
                const status = getTransferStatus(transfer);
                const isUserSeller =
                  transfer.seller.toLowerCase() ===
                  web3State.account?.toLowerCase();

                return (
                  <Card key={transfer.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {property?.location ||
                              `Property #${transfer.propertyId}`}
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Transfer ID: {transfer.id}</p>
                            <p>
                              Price: {formatEther(transfer.agreedPrice)} ETH
                            </p>
                            <p>
                              {isUserSeller ? "Buyer" : "Seller"}:{" "}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProperties;
