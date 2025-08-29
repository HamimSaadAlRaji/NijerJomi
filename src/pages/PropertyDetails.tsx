import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { Property, Bid, TransferRequest } from "../../types";
import { motion, AnimatePresence } from "framer-motion";
import backgroundimg from "../assets/vecteezy_abstract-white-background-with-wavy-shapes-flowing-and_36340712.jpg";
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
  const minimumBidAmount = highestBid
    ? Math.ceil(highestBid.bidAmount * 1.05)
    : Number(marketValue) / 1e18; // 5% more than highest bid

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
    return `${amount.toFixed(4)} BDT`;
  };

  const formatMarketValue = (value: bigint) => {
    const bdtValue = Number(value) / 1e18;
    return `${bdtValue.toFixed(4)} BDT`;
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 relative">
        {/* Background Image with Opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://static.vecteezy.com/system/resources/previews/021/016/908/original/abstract-geometric-background-with-polygonal-plexus-texture-for-banner-design-template-or-website-header-vector.jpg')",
          }}
        ></div>

        {/* Content with relative positioning to appear above background */}
        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 py-16">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl shadow-lg"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl shadow-lg"></div>
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 relative">
        {/* Background Image with Opacity */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://static.vecteezy.com/system/resources/previews/021/016/908/original/abstract-geometric-background-with-polygonal-plexus-texture-for-banner-design-template-or-website-header-vector.jpg')",
          }}
        ></div>

        {/* Content with relative positioning to appear above background */}
        <div className="relative z-10">
          <Navbar />
          <div className="container mx-auto px-4 py-16 mt-16">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Property Not Found
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {error || "The requested property could not be found."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div>
        <Navbar />

        <div className="container mx-auto px-4 py-8 mt-16">
          {/* Navigation */}
          <div className="mb-6">
            {/* Property Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent dark:from-slate-100 dark:to-blue-200">
                  Property #{property.id.toString()}
                </h1>
                <div className="flex items-center text-slate-600 dark:text-slate-400 mt-2">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                  <span className="text-lg font-medium">
                    {property.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Badges */}
                {property.isForSale && (
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    For Sale
                  </Badge>
                )}

                {/* Action Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFavorite}
                  className={`border-rose-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400 dark:border-rose-400 dark:text-rose-400 dark:hover:bg-rose-900/20 ${
                    isFavorited
                      ? "bg-rose-50 border-rose-400 dark:bg-rose-900/20"
                      : ""
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${
                      isFavorited
                        ? "fill-current text-rose-600 dark:text-rose-400"
                        : ""
                    }`}
                  />
                  {isFavorited ? "Favorited" : "Favorite"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
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
              <Card className="overflow-hidden border-slate-200 dark:border-slate-700 shadow-lg">
                <CardContent className="p-0">
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800">
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
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl text-slate-800 dark:text-slate-200">
                    <FileText className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Property ID
                        </label>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xl font-mono font-bold text-slate-800 dark:text-slate-200">
                            #{property.id.toString()}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleCopyToClipboard(property.id.toString())
                            }
                            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Location
                        </label>
                        <div className="flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                          <span className="text-lg font-medium text-slate-800 dark:text-slate-200">
                            {property.location}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Area
                        </label>
                        <div className="flex items-center mt-1">
                          <Maximize className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />
                          <span className="text-lg font-medium text-slate-800 dark:text-slate-200">
                            {property.area.toLocaleString()} sq ft
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Market Value
                        </label>
                        <div className="flex items-center mt-1">
                          <DollarSign className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                            {formatMarketValue(property.marketValue)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Owner
                        </label>
                        <div className="flex items-center space-x-2 mt-1">
                          <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-700 dark:text-slate-300">
                            {formatAddress(property.ownerAddress)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Token URI
                        </label>
                        <div className="flex items-center space-x-2 mt-1">
                          <ExternalLink className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-xs text-slate-600 dark:text-slate-400 break-all">
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
                            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
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
              <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-emerald-200 dark:border-emerald-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800 dark:text-slate-200">
                    <DollarSign className="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                    Price Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                      {formatMarketValue(property.marketValue)}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      Market Value
                    </div>

                    {/* Owner controls */}
                    {isOwner && (
                      <div className="mt-4 space-y-2">
                        <Button
                          className="w-full bg-slate-700 hover:bg-slate-800 text-white border-slate-600"
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
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                              <div className="flex items-center text-emerald-700 dark:text-emerald-400 mb-2">
                                <CheckCircle className="w-5 h-5 mr-2" />
                                <span className="font-semibold">
                                  Offer Accepted!
                                </span>
                              </div>
                              <p className="text-sm text-emerald-600 dark:text-emerald-300">
                                The property owner has accepted your bid. Please
                                verify the transaction to complete the purchase.
                              </p>
                            </div>
                            <Button
                              onClick={handleApproveBuyerTransfer}
                              disabled={isApprovingTransfer}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
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
                          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center text-amber-700 dark:text-amber-400 mb-2">
                              <Clock className="w-5 h-5 mr-2" />
                              <span className="font-semibold">
                                Transaction in Progress
                              </span>
                            </div>
                            <p className="text-sm text-amber-600 dark:text-amber-300">
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
                                setBidAmount(
                                  minimumBidAmount
                                    ? minimumBidAmount.toString()
                                    : ""
                                );
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                                <Gavel className="w-4 h-4 mr-2" />
                                Place Bid
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="border-slate-200 dark:border-slate-700">
                              <DialogHeader>
                                <DialogTitle className="text-slate-800 dark:text-slate-200">
                                  Place Bid for Property #{property.id}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Bid Amount (BDT)
                                  </label>
                                  <Input
                                    type="number"
                                    step="0.0001"
                                    placeholder={
                                      highestBid
                                        ? minimumBidAmount.toString()
                                        : "0.0000"
                                    }
                                    value={bidAmount}
                                    onChange={(e) =>
                                      setBidAmount(e.target.value)
                                    }
                                    className={`border-slate-300 dark:border-slate-600 ${
                                      bidAmount && !isBidAmountValid
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                        : "focus:border-blue-500 focus:ring-blue-500"
                                    }`}
                                  />
                                  {bidAmount && !isBidAmountValid && (
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                                      Bid amount must be at least{" "}
                                      {minimumBidAmount.toString()} BDT
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
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    {isPlacingBid
                                      ? "Placing Bid..."
                                      : "Place Bid"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowBidDialog(false)}
                                    className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
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
                          <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-2">
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
                <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-slate-800 dark:text-slate-200">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Current Bids {bids.length > 0 && `(${bids.length})`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingBids ? (
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Loading bids...
                      </div>
                    ) : bids.length > 0 ? (
                      <div className="space-y-3">
                        {/* Show top 3 bids for both owners and non-owners */}
                        {bids.slice(0, 3).map((bid, index) => (
                          <div
                            key={bid._id}
                            className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <div>
                              <div className="font-bold text-lg text-slate-800 dark:text-slate-200">
                                {formatBidAmount(bid.bidAmount)}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                {formatAddress(bid.bidder)}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-500">
                                {formatDate(bid.createdAt)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {index === 0 && (
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm">
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
                                      className="flex items-center px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white cursor-not-allowed shadow-md"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Processing...
                                    </motion.button>
                                  ) : (
                                    // Default button
                                    <motion.button
                                      key="default"
                                      onClick={() => handleAcceptBid(bid)}
                                      disabled={isAcceptingBid}
                                      className="flex items-center px-4 py-2 text-sm rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
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
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center text-blue-700 dark:text-blue-400 mb-1">
                              <Clock className="w-4 h-4 mr-2" />
                              <span className="font-semibold">
                                Transfer in Progress
                              </span>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                              A bid has been accepted and the transfer is being
                              processed.
                            </p>
                          </div>
                        )}

                        {!isOwner && bids.length > 3 && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2">
                            +{bids.length - 3} more bids
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                        No bids placed yet
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Status Card */}
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800 dark:text-slate-200">
                    <Shield className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Property Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Sale Status:
                    </span>
                    <Badge
                      className={
                        property.isForSale
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
                      }
                      variant="outline"
                    >
                      {property.isForSale ? "For Sale" : "Not For Sale"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Disputes:
                    </span>
                    <Badge
                      className={
                        property.hasDispute
                          ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700"
                          : "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700"
                      }
                      variant="outline"
                    >
                      {property.hasDispute ? "Has Dispute" : "No Disputes"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain Info Card */}
              <Card className="border-slate-200 dark:border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-800 dark:text-slate-200">
                    <Hash className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Blockchain Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Token ID
                    </label>
                    <div className="font-mono text-lg font-bold mt-1 text-slate-800 dark:text-slate-200">
                      {property.id.toString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Owner Address
                    </label>
                    <div className="font-mono text-sm mt-2 break-all bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-slate-700 dark:text-slate-300">
                      {formatAddress(property.ownerAddress)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
