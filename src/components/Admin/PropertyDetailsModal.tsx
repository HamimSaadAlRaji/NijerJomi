import React from "react";
import { useNavigate } from "react-router-dom";
import { Property } from "../../../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  Maximize,
  DollarSign,
  User,
  Calendar,
  Hash,
  FileText,
  AlertTriangle,
  ShoppingCart,
  Copy,
  ExternalLink,
} from "lucide-react";

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  formatAddress: (address: string) => string;
  formatMarketValue: (value: bigint) => string;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  isOpen,
  onClose,
  property,
  formatAddress,
  formatMarketValue,
}) => {
  const navigate = useNavigate();

  if (!property) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-bold">
            <Hash className="w-6 h-6 mr-2 text-blue-600" />
            Property #{property.id}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Image */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={property.imageUrl}
                    alt={`Property ${property.id}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/800x400?text=No+Image+Available";
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Property ID
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-mono">{property.id}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(property.id.toString())}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Location
                </label>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{property.location}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Area
                </label>
                <div className="flex items-center mt-1">
                  <Maximize className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">
                    {property.area.toLocaleString()} sq ft
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Market Value
                </label>
                <div className="flex items-center mt-1">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-lg font-semibold text-green-600">
                    {formatMarketValue(property.marketValue)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Owner & Status Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Owner & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Owner Address
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {formatAddress(property.ownerAddress)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(property.ownerAddress)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      navigate(`/admin/user/${property.ownerAddress}`)
                    }
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Token URI
                </label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900 text-xs break-all">
                    {property.tokenURI}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="flex space-x-2 mt-1">
                  {property.isForSale && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      For Sale
                    </Badge>
                  )}
                  {property.hasDispute && (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Has Dispute
                    </Badge>
                  )}
                  {!property.isForSale && !property.hasDispute && (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                      Normal
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hash className="w-5 h-5 mr-2 text-blue-600" />
                Blockchain Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Property ID (Blockchain)
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {property.id}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(property.id.toString())}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Market Value (Wei)
                  </label>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-900">
                      {property.marketValue.toString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Owner Wallet Address
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded break-all">
                    {property.ownerAddress}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(property.ownerAddress)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;
