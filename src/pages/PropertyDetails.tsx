import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { Property } from "../../types";
import { getPropertyData } from "@/services/blockchainService";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const PropertyDetails: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { web3State } = useWalletContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (propertyId && web3State.contract) {
      fetchPropertyDetails();
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
    } catch (err) {
      console.error("Error fetching property details:", err);
      setError("Failed to load property details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatMarketValue = (value: bigint) => {
    const ethValue = Number(value) / 1e18;
    return `${ethValue.toFixed(4)} ETH`;
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
                  className={`w-4 h-4 mr-2 ${
                    isFavorited ? "fill-current" : ""
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
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCopyToClipboard(property.ownerAddress)
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
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
                  {property.isForSale && (
                    <Button className="w-full mt-4 bg-black hover:bg-black/90 text-white">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Make Offer
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

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
                    {property.ownerAddress}
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
