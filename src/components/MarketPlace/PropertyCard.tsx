import React from "react";
import { useNavigate } from "react-router-dom";
import { Property, Bid } from "../../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import {
  MapPin,
  Maximize,
  DollarSign,
  User,
  AlertTriangle,
  Gavel,
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
  formatAddress: (address: string) => string;
  formatMarketValue: (value: bigint) => string;
  highestBid?: Bid | null;
  viewMode?: "grid" | "list";
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  formatAddress,
  formatMarketValue,
  highestBid,
  viewMode = "list",
}) => {
  const navigate = useNavigate();
  const { web3State } = useWalletContext();

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const handlePlaceBid = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to bidding page or open bidding modal
    navigate(`/property/${property.id}`);
  };

  const formatBidAmount = (amount: number) => {
    return `${(amount / 1e18).toFixed(4)} ETH`;
  };

  // List view layout (horizontal)
  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-0 shadow-md bg-white dark:bg-gray-900"
      onClick={handleViewDetails}
    >
      <div className="flex">
        {/* Property Image - Much wider */}
        <div className="relative w-[450px] h-full rounded-lg overflow-hidden flex-shrink-0 p-6 ">
          <img
            src={property.imageUrl}
            alt={`Property ${property.id}`}
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105 rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/450x200?text=Property+Image";
            }}
          />

          {/* Property Status Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.hasDispute && (
              <Badge className="bg-red-500/90 hover:bg-red-600 text-white shadow-lg">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Dispute
              </Badge>
            )}
            <Badge className="bg-blue-500/90 hover:bg-blue-600 text-white shadow-lg">
              Recently added
            </Badge>
            {highestBid && (
              <Badge className="bg-green-500/90 hover:bg-green-600 text-white shadow-lg">
                <Gavel className="w-4 h-4 mr-1" />
                {formatBidAmount(highestBid.bidAmount)}
              </Badge>
            )}
          </div>

          {/* Heart icon */}
          <div className="absolute top-3 right-3">
            <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Property Details - Much more compact */}
        <CardContent className="flex-1 p-3">
          <div className="h-full flex flex-col justify-between">
            <div>
              {/* Price and basic info */}
              <div className="mb-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {formatMarketValue(property.marketValue)}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  Property #{property.id.toString()}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span className="text-2xl font-medium">
                    {property.location}
                  </span>
                </div>
              </div>

              {/* Highest Bid Display - Compact */}
              {highestBid && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-2 rounded-md mb-2 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Gavel className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      Highest Bid
                    </span>
                  </div>
                  <div className="text-lg font-bold text-green-800 dark:text-green-200">
                    {formatBidAmount(highestBid.bidAmount)}
                  </div>
                </div>
              )}

              {/* Property Features - Inline */}
              <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                <span>2 bed</span>
                <span>2 bath</span>
                <span>{property.area.toLocaleString()} sq ft</span>
              </div>
            </div>

            {/* Bottom section - Compact */}
            <div className="flex items-center justify-end">
              <div className="flex flex-col justify-center m-5">
                {/* User's wallet address in blue */}
                {web3State.account && (
                  <div className="text-2xl text-blue-600 font-medium mb-1 flex justify-between items-center">
                    <User className="w-7 h-7 mr-1" />
                    <span> {formatAddress(web3State.account)}</span>
                  </div>
                )}
                <Button
                  onClick={handlePlaceBid}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-3xl text-xl font-medium transition-colors flex items-center gap-1"
                >
                  <Gavel className="w-5 h-5" />
                  Place Bid
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default PropertyCard;
