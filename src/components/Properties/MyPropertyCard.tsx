import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import {
  MapPin,
  Maximize,
  User,
  AlertTriangle,
  DollarSign,
  Landmark,
  Edit,
  Send,
} from "lucide-react";

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

interface MyPropertyCardProps {
  property: Property;
  formatAddress: (address: string) => string;
  formatMarketValue: (value: bigint) => string;
  onEditClick: (property: Property) => void;
  onTransferClick: (property: Property) => void;
  userVerified: boolean;
}

const MyPropertyCard: React.FC<MyPropertyCardProps> = ({
  property,
  formatAddress,
  formatMarketValue,
  onEditClick,
  onTransferClick,
  userVerified,
}) => {
  const navigate = useNavigate();
  const { web3State } = useWalletContext();

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick(property);
  };

  const handleTransferClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTransferClick(property);
  };

  // Get property type based on area (for land properties)
  const getPropertyType = () => {
    const area = property.area || 0;
    if (area > 10000) return "Large Commercial Land";
    if (area > 5000) return "Commercial Land";
    if (area > 2000) return "Residential Plot";
    if (area > 1000) return "Building Plot";
    return "Land Plot";
  };

  const propertyType = getPropertyType();

  const getStatusBadge = () => {
    if (property.hasDispute) {
      return (
        <Badge className="bg-red-500/90 hover:bg-red-600 text-white shadow-lg">
          <AlertTriangle className="w-4 h-4 mr-1" />
          Dispute
        </Badge>
      );
    }
    if (property.isForSale) {
      return (
        <Badge className="bg-green-500/90 hover:bg-green-600 text-white shadow-lg">
          For Sale
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-500/90 hover:bg-gray-600 text-white shadow-lg">
        Not For Sale
      </Badge>
    );
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden border-0 shadow-md bg-white dark:bg-gray-900"
      onClick={handleViewDetails}
    >
      <div className="flex">
        {/* Property Image - Much wider */}
        <div className="relative w-[450px] h-full rounded-lg overflow-hidden flex-shrink-0 p-6">
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
            {getStatusBadge()}
            <Badge className="bg-blue-500/90 hover:bg-blue-600 text-white shadow-lg">
              Owned
            </Badge>
          </div>

          {/* Property ID badge */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/70 text-white shadow-lg">
              ID: {property.id}
            </Badge>
          </div>
        </div>

        {/* Property Details - Much more compact */}
        <CardContent className="flex-1 p-3">
          <div className="h-full flex flex-col justify-between">
            <div>
              {/* Price and basic info */}
              <div className="mb-2">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 flex items-center">
                  <DollarSign className="w-6 h-6 text-green-600 mr-1" />
                  {formatMarketValue(property.marketValue)}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  {propertyType} #{property.id.toString()}
                </h3>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
                  <MapPin className="w-5 h-5 mr-1" />
                  <span className="text-2xl font-medium">
                    {property.location}
                  </span>
                </div>
              </div>

              {/* Property Features - Land specific */}
              <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Maximize className="w-3 h-3" />
                  {property.area.toLocaleString()} sq ft
                </span>
                <span className="flex items-center gap-1">
                  <Landmark className="w-3 h-3" />
                  Land Plot
                </span>
              </div>

              {/* Owner info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-2 rounded-md mb-2 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-1 mb-0.5">
                  <User className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                    Owner
                  </span>
                </div>
                <div className="text-sm font-bold text-blue-800 dark:text-blue-200">
                  {formatAddress(property.ownerAddress)}
                </div>
              </div>
            </div>

            {/* Bottom section - Action buttons */}
            <div className="flex items-center justify-end gap-2">
              <Button
                onClick={handleEditClick}
                variant="outline"
                className="px-3 py-1 text-sm font-medium transition-colors flex items-center gap-1"
                disabled={!userVerified}
              >
                <Edit className="w-4 h-4" />
                Manage
              </Button>
              <Button
                onClick={handleTransferClick}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-sm font-medium transition-colors flex items-center gap-1"
                disabled={!userVerified}
              >
                <Send className="w-4 h-4" />
                Transfer
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default MyPropertyCard;
