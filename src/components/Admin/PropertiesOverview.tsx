import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "../../../types";
import { Database, Search, MapPin, Maximize, Eye } from "lucide-react";
import PropertyDetailsModal from "./PropertyDetailsModal";

interface PropertyFilter {
  search: string;
  status: "all" | "for-sale" | "dispute" | "normal";
}

interface PropertiesOverviewProps {
  filteredProperties: Property[];
  filter: PropertyFilter;
  setFilter: React.Dispatch<React.SetStateAction<PropertyFilter>>;
  formatAddress: (address: string) => string;
  formatMarketValue: (value: bigint) => string;
}

const PropertiesOverview: React.FC<PropertiesOverviewProps> = ({
  filteredProperties,
  filter,
  setFilter,
  formatAddress,
  formatMarketValue,
}) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };
  return (
    <Card
      className="bg-white border shadow-sm mb-8"
      style={{ borderColor: "#a1d99b" }}
    >
      <CardHeader className="border-b" style={{ borderColor: "#a1d99b" }}>
        <div className="flex items-center justify-between">
          <CardTitle
            className="flex items-center text-xl font-bold"
            style={{ color: "#006d2c" }}
          >
            <Database className="w-5 h-5 mr-2" style={{ color: "#41ab5d" }} />
            Properties Overview
          </CardTitle>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: "#465465" }}
              />
              <input
                type="text"
                placeholder="Search properties..."
                className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: "#a1d99b",
                }}
                value={filter.search}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            {/* Filter */}
            <select
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "#a1d99b",
                color: "#006d2c",
              }}
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  status: e.target.value as any,
                }))
              }
            >
              <option value="all">All Properties</option>
              <option value="for-sale">For Sale</option>
              <option value="dispute">With Disputes</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              className="bg-white border-b"
              style={{ borderColor: "#a1d99b" }}
            >
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#41ab5d" }}
                >
                  Property
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#41ab5d" }}
                >
                  Owner
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#41ab5d" }}
                >
                  Location
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#41ab5d" }}
                >
                  Area
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#41ab5d" }}
                >
                  Market Value
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#41ab5d" }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#41ab5d" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className="bg-white divide-y"
              style={{ borderColor: "#a1d99b" }}
            >
              {filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="h-12 w-12 rounded-lg overflow-hidden mr-3"
                        style={{ backgroundColor: "#a1d99b" }}
                      >
                        <img
                          src={property.imageUrl}
                          alt={`Property ${property.id}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/48x48?text=No+Image";
                          }}
                        />
                      </div>
                      <div>
                        <div
                          className="text-sm font-medium"
                          style={{ color: "#006d2c" }}
                        >
                          Property #{property.id}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {property.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black font-medium">
                      {formatAddress(property.ownerAddress)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {property.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Maximize className="w-4 h-4 mr-1 text-gray-400" />
                      {property.area.toLocaleString()} sq ft
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">
                      {formatMarketValue(property.marketValue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {property.isForSale && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          For Sale
                        </Badge>
                      )}
                      {property.hasDispute && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                          Dispute
                        </Badge>
                      )}
                      {!property.isForSale && !property.hasDispute && (
                        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                          Normal
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-300"
                      onClick={() => handleViewProperty(property)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredProperties.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {filter.search || filter.status !== "all"
                        ? "No properties found matching your criteria"
                        : "No properties registered yet"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      <PropertyDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
        formatAddress={formatAddress}
        formatMarketValue={formatMarketValue}
      />
    </Card>
  );
};

export default PropertiesOverview;
