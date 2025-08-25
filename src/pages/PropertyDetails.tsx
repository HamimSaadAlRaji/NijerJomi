import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { Property, Bid, TransferRequest } from "../../types";
import {motion,AnimatePresence} from "framer-motion";
import {
  getPropertyData,
  setForSale,
  requestTransfer,
  getAllTransferRequests,
  approveTransferAsBuyer,
} from "@/services/blockchainService";
import * as userServices from "@/services/userServices";
import { getBidsByPropertyId, createBid } from "@/services/biddingServices";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MapPin,
  Maximize,
  DollarSign,
  User,
  Calendar,
  Hash,
  ArrowLeft,
  Heart,
  Share2,
  ShoppingCart,
  AlertTriangle,
  Copy,
  ExternalLink,
  FileText,
  Shield,
  Gavel,
  TrendingUp,
  CheckCircle,
  Loader2,
  XCircle,
  Clock,
  Handshake,
} from "lucide-react";

const PropertyDetails: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { web3State } = useWalletContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [marketValue, setMarketValue] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  // Bidding state
  const [bids, setBids] = useState<Bid[]>([]);
  const [loadingBids, setLoadingBids] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [isTogglingForSale, setIsTogglingForSale] = useState(false);
  const [isAcceptingBid, setIsAcceptingBid] = useState(false);
  const [showBidDialog, setShowBidDialog] = useState(false);

  // Transfer request state
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(
    []
  );
  const [isApprovingTransfer, setIsApprovingTransfer] = useState(false);

  useEffect(() => {
    if (propertyId && web3State.contract) {
      fetchPropertyDetails();
      fetchBids();
      fetchTransferRequests();
    }
  }, [propertyId, web3State.contract]);

  const fetchPropertyDetails = async () => {
    if (!propertyId || !web3State.contract) return;

    try {
      setLoading(true);
      setError(null);
      const propertyData = await getPropertyData(
        web3State.contract,
        parseInt(propertyId)
      );
      setProperty(propertyData);
      setMarketValue(propertyData.marketValue);
    } catch (err) {
      console.error("Error fetching property details:", err);
      setError("Failed to load property details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    if (!propertyId) return;

    try {
      setLoadingBids(true);
      const response = await getBidsByPropertyId(parseInt(propertyId));
      if (response.success) {
        setBids(response.data);
      }
    } catch (err) {
      console.error("Error fetching bids:", err);
    } finally {
      setLoadingBids(false);
    }
  };

  const fetchTransferRequests = async () => {
    if (!web3State.contract) return;

    try {
      const requests = await getAllTransferRequests(web3State.contract);
      setTransferRequests(requests);
    } catch (err) {
      console.error("Error fetching transfer requests:", err);
    }
  };

  const isOwner =
    property && web3State.account
      ? property.ownerAddress.toLowerCase() === web3State.account.toLowerCase()
      : false;

  // Get active transfer request for this property
  const activeTransferRequest = transferRequests.find(
    (request) => request.propertyId === property?.id && !request.completed
  );

  const isInTransfer = !!activeTransferRequest;

  // Check if current user is the buyer in the transfer
  const isBuyerInTransfer =
    activeTransferRequest &&
    web3State.account &&
    activeTransferRequest.buyer.toLowerCase() ===
    web3State.account.toLowerCase();

  // Get highest bid amount for validation
  const highestBid = bids.length > 0 ? bids[0] : null;
  const minimumBidAmount = highestBid ? Math.ceil(highestBid.bidAmount * 1.05) : Number(marketValue) / 1e18; // 5% more than highest bid

  console.log("Market Value:", marketValue);
  console.log("Minimum bid amount:", minimumBidAmount);
  // Check if current bid amount meets minimum requirement
  const currentBidAmount = parseFloat(bidAmount) || 0;
  const isBidAmountValid = currentBidAmount >= minimumBidAmount;

  const handlePlaceBid = async () => {
    if (!propertyId || !web3State.account || !bidAmount || !property) return;

    const bidValue = parseFloat(bidAmount);

    // Double-check validation (safety measure)
    if (bidValue < minimumBidAmount) {
      return;
    }

    try {
      setIsPlacingBid(true);
      const response = await createBid({
        propertyId: parseInt(propertyId),
        bidder: web3State.account,
        bidAmount: bidValue,
      });

      if (response.success) {
        await fetchBids(); // Refresh bids
        setBidAmount("");
        setShowBidDialog(false);
      } else {
        console.error("Error placing bid:", response.message);
      }
    } catch (err) {
      console.error("Error placing bid:", err);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleToggleForSale = async () => {
    if (!property || !web3State.contract) return;

    try {
      setIsTogglingForSale(true);
      await setForSale(web3State.contract, property.id, !property.isForSale);

      // Refresh property data
      await fetchPropertyDetails();
    } catch (err) {
      console.error("Error toggling for sale status:", err);
    } finally {
      setIsTogglingForSale(false);
    }
  };

  const handleAcceptBid = async (bid: Bid) => {
    if (!property || !web3State.contract) return;

    try {
      setIsAcceptingBid(true);

      // Convert bid amount from ETH to Wei (assuming bid amount is in ETH)
      const bidAmountInWei = BigInt(Math.floor(bid.bidAmount * 1e18));

      // Create transfer request to the bidder
      await requestTransfer(
        web3State.contract,
        property.id,
        bid.bidder,
        bidAmountInWei
      );

      // Note: Property will now be hidden from marketplace due to active transfer request
      console.log(
        "Transfer request created successfully. Property will be hidden from marketplace until transaction completes."
      );

      // Refresh transfer requests to get the new one
      await fetchTransferRequests();
    } catch (err) {
      console.error("Error accepting bid:", err);
    } finally {
      setIsAcceptingBid(false);
    }
  };

  const handleApproveBuyerTransfer = async () => {
    if (!activeTransferRequest || !web3State.contract) return;

    try {
      setIsApprovingTransfer(true);
      await approveTransferAsBuyer(
        web3State.contract,
        activeTransferRequest.id
      );

      // Refresh transfer requests to get updated status
      await fetchTransferRequests();
      console.log("Transfer approved successfully as buyer");
    } catch (err) {
      console.error("Error approving transfer as buyer:", err);
    } finally {
      setIsApprovingTransfer(false);
    }
  };

  const formatBidAmount = (amount: number) => {
    return `${amount.toFixed(4)} ETH`;
  };

  const formatMarketValue = (value: bigint) => {
    const ethValue = Number(value) / 1e18;
    return `${ethValue.toFixed(4)} ETH`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };


  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You can add toast notification here
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // You can add toast notification here
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // You can add favorites logic here
  };

  const handleBackToMarketplace = () => {
    navigate("/marketplace");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Property Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The requested property could not be found."}
            </p>
            <Button onClick={handleBackToMarketplace}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={handleBackToMarketplace}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>

          {/* Property Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Property #{property.id.toString()}
              </h1>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mt-2">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">{property.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badges */}
              {property.isForSale && (
                <Badge className="bg-black/80 hover:bg-black/90 text-white">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  For Sale
                </Badge>
              )}
              {property.hasDispute && (
                <Badge className="bg-black/60 hover:bg-black/70 text-white">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Dispute
                </Badge>
              )}

              {/* Action Buttons */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleFavorite}
                className={isFavorited ? "text-black border-black" : ""}
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""
                    }`}
                />
                {isFavorited ? "Favorited" : "Favorite"}
              </Button>

              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Property Image */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={property.imageUrl}
                    alt={`Property ${property.id}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/800x400?text=Property+Image";
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <FileText className="w-6 h-6 mr-3 text-black/80" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Property ID
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xl font-mono font-bold">
                          #{property.id.toString()}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopyToClipboard(property.id.toString())
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Location
                      </label>
                      <div className="flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-lg font-medium">
                          {property.location}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Area
                      </label>
                      <div className="flex items-center mt-1">
                        <Maximize className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-lg font-medium">
                          {property.area.toLocaleString()} sq ft
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Market Value
                      </label>
                      <div className="flex items-center mt-1">
                        <DollarSign className="w-5 h-5 mr-2 text-black/80" />
                        <span className="text-2xl font-bold text-black">
                          {formatMarketValue(property.marketValue)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Owner
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {formatAddress(property.ownerAddress)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Token URI
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400 break-all">
                          {property.tokenURI.length > 50
                            ? `${property.tokenURI.slice(0, 50)}...`
                            : property.tokenURI}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopyToClipboard(property.tokenURI)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center text-black dark:text-white">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Price Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">
                    {formatMarketValue(property.marketValue)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Market Value
                  </div>

                  {/* Owner controls */}
                  {isOwner && (
                    <div className="mt-4 space-y-2">
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={handleToggleForSale}
                        disabled={isTogglingForSale}
                      >
                        {isTogglingForSale
                          ? "Updating..."
                          : property.isForSale
                            ? "Remove from Sale"
                            : "Put on Sale"}
                      </Button>
                    </div>
                  )}

                  {/* Non-owner controls */}
                  {!isOwner && web3State.account && (
                    <div className="mt-4">
                      {/* If property is in transfer and user is the buyer */}
                      {isInTransfer && isBuyerInTransfer && (
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center text-green-700 dark:text-green-400 mb-2">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <span className="font-medium">
                                Offer Accepted!
                              </span>
                            </div>
                            <p className="text-sm text-green-600 dark:text-green-300">
                              The property owner has accepted your bid. Please
                              verify the transaction to complete the purchase.
                            </p>
                          </div>
                          <Button
                            onClick={handleApproveBuyerTransfer}
                            disabled={isApprovingTransfer}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Handshake className="w-4 h-4 mr-2" />
                            {isApprovingTransfer
                              ? "Approving..."
                              : "Approve Transfer"}
                          </Button>
                        </div>
                      )}

                      {/* If property is in transfer but user is not the buyer */}
                      {isInTransfer && !isBuyerInTransfer && (
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center text-orange-700 dark:text-orange-400 mb-2">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">
                              Transaction in Progress
                            </span>
                          </div>
                          <p className="text-sm text-orange-600 dark:text-orange-300">
                            This property is currently in a transfer process.
                            New bids cannot be placed at this time.
                          </p>
                        </div>
                      )}

                      {/* If property is for sale and not in transfer */}
                      {property.isForSale && !isInTransfer && (
                        <Dialog
                          open={showBidDialog}
                          onOpenChange={(open) => {
                            setShowBidDialog(open);
                            if (open) {
                              setBidAmount(minimumBidAmount ? minimumBidAmount.toString() : "");
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button className="w-full bg-black hover:bg-black/90 text-white">
                              <Gavel className="w-4 h-4 mr-2" />
                              Place Bid
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Place Bid for Property #{property.id}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium">
                                  Bid Amount (ETH)
                                </label>
                                {/* {minimumBidAmount && (
                                  <p className="text-xs text-red-600 dark:text-red-400 mb-1 font-medium">
                                    Minimum bid: {minimumBidAmount.toString()} ETH (5% more than current highest)
                                  </p>
                                )} */}
                                <Input
                                  type="number"
                                  step="0.0001"
                                  placeholder={
                                    highestBid
                                      ? minimumBidAmount.toString()
                                      : "0.0000"
                                  }
                                  value={bidAmount}
                                  onChange={(e) => setBidAmount(e.target.value)}
                                  className={
                                    bidAmount && !isBidAmountValid
                                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                      : ""
                                  }
                                />
                                {bidAmount && !isBidAmountValid && (
                                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    Bid amount must be at least{" "}
                                    {minimumBidAmount.toString()} ETH
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={handlePlaceBid}
                                  disabled={
                                    isPlacingBid ||
                                    !bidAmount ||
                                    !isBidAmountValid
                                  }
                                  className="flex-1"
                                >
                                  {isPlacingBid
                                    ? "Placing Bid..."
                                    : "Place Bid"}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setShowBidDialog(false)}
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {/* If property is not for sale */}
                      {!property.isForSale && !isInTransfer && (
                        <div className="text-sm text-gray-500">
                          Property is not for sale
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bidding Section */}
            {property.isForSale && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-black/80" />
                    Current Bids {bids.length > 0 && `(${bids.length})`}
                  </CardTitle>
                </CardHeader>
                <CardContent>

                  {loadingBids ? (
                    <div className="text-sm text-gray-500">Loading bids...</div>
                  ) : bids.length > 0 ? (
                    <div className="space-y-3">
                      {/* Show top 3 bids for both owners and non-owners */}
                      {bids.slice(0, 3).map((bid, index) => (
                        <div
                          key={bid._id}
                          className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div>
                            <div className="font-semibold text-sm">
                              {formatBidAmount(bid.bidAmount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatAddress(bid.bidder)}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDate(bid.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Highest
                              </Badge>
                            )}
                            {/* Only owners see Accept button on highest bid and not in transfer */}
                            {isOwner && !isInTransfer && index === 0 && (
                              <AnimatePresence mode="wait" initial={false}>
                                {isAcceptingBid ? (
                                  // While loading
                                  <motion.button
                                    key="loading"
                                    disabled
                                    className="flex items-center px-3 py-1 text-sm rounded bg-green-600 text-white cursor-not-allowed"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Processing...
                                  </motion.button>
                                ) : isAcceptingBid ? (
                                  // Success animation
                                  <motion.button
                                    key="success"
                                    disabled
                                    className="flex items-center px-3 py-1 text-sm rounded bg-green-600 text-white"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                    </motion.div>
                                    Accepted
                                  </motion.button>
                                ) : (
                                  // Default button
                                  <motion.button
                                    key="default"
                                    onClick={() => handleAcceptBid(bid)}
                                    disabled={isAcceptingBid}
                                    className="flex items-center px-3 py-1 text-sm rounded bg-green-600 hover:bg-green-700 text-white"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Accept
                                  </motion.button>
                                )}
                              </AnimatePresence>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Show transfer status if property is in transfer */}
                      {isInTransfer && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="flex items-center text-blue-700 dark:text-blue-400 mb-1">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">
                              Transfer in Progress
                            </span>
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-300">
                            A bid has been accepted and the transfer is being
                            processed.
                          </p>
                        </div>
                      )}

                      {!isOwner && bids.length > 3 && (
                        <div className="text-xs text-gray-500 text-center pt-2">
                          +{bids.length - 3} more bids
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No bids placed yet
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-black/80" />
                  Property Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Sale Status:
                  </span>
                  <Badge
                    className={
                      property.isForSale
                        ? "bg-black/80 text-white hover:bg-black/80"
                        : "bg-black/40 text-white hover:bg-black/40"
                    }
                  >
                    {property.isForSale ? "For Sale" : "Not For Sale"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Disputes:
                  </span>
                  <Badge
                    className={
                      property.hasDispute
                        ? "bg-black/60 text-white hover:bg-black/60"
                        : "bg-black/80 text-white hover:bg-black/80"
                    }
                  >
                    {property.hasDispute ? "Has Dispute" : "No Disputes"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-black/80" />
                  Blockchain Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Token ID
                  </label>
                  <div className="font-mono text-sm mt-1">
                    {property.id.toString()}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Owner Address
                  </label>
                  <div className="font-mono text-sm mt-1 break-all">
                    {formatAddress(property.ownerAddress)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
