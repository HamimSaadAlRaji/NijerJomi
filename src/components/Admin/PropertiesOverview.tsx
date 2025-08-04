import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "../../../types";
import { Database, Search, MapPin, Maximize, Eye } from "lucide-react";

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
  return (
    <Card className="bg-white border border-gray-200 shadow-sm mb-8">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-bold text-black">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Properties Overview
          </CardTitle>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter.search}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            {/* Filter */}
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 mr-3">
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
                        <div className="text-sm font-medium text-black">
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
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
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
    </Card>
  );
};

export default PropertiesOverview;
