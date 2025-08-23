import React from "react";
import { useNavigate } from "react-router-dom";
import { Property } from "../../../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Maximize,
  DollarSign,
  User,
  AlertTriangle,
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
  formatAddress: (address: string) => string;
  formatMarketValue: (value: bigint) => string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  formatAddress,
  formatMarketValue,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/property/${property.id}`);
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-900"
      onClick={handleViewDetails}
    >
      <div className="relative">
        {/* Property Image */}
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={property.imageUrl}
            alt={`Property ${property.id}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x250?text=Property+Image";
            }}
          />
        </div>

        {/* Property Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.hasDispute && (
            <Badge className="bg-black/60 hover:bg-black/70 text-white shadow-lg">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Dispute
            </Badge>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-black mr-1" />
              <span className="font-bold text-black">
                {formatMarketValue(property.marketValue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Property ID & Area */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Property #{property.id.toString()}
            </h3>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Maximize className="w-4 h-4 mr-1" />
              {property.area.toLocaleString()} sq ft
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <MapPin className="w-4 h-4 mr-2 text-black/70" />
          <span className="text-sm font-medium">{property.location}</span>
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-xs">
            <User className="w-3 h-3 mr-1" />
            <span>Owner: {formatAddress(property.ownerAddress)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
