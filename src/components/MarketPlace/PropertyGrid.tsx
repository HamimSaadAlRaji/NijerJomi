import React from "react";
import { Property, Bid } from "../../../types";
import PropertyCard from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { Grid3X3, ArrowUpDown } from "lucide-react";

interface PropertyGridProps {
  properties: Property[];
  loading: boolean;
  formatAddress: (address: string) => string;
  formatMarketValue: (value: bigint) => string;
  getHighestBid?: (propertyId: number) => Bid | null;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  loading,
  formatAddress,
  formatMarketValue,
  getHighestBid,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden animate-pulse flex"
          >
            <div className="w-[450px] h-32 bg-gray-200 dark:bg-gray-700"></div>
            <div className="flex-1 p-3 space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <Grid3X3 className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Properties Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          No properties match your current search criteria. Try adjusting your
          filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {properties.length}{" "}
          {properties.length === 1 ? "property" : "properties"} found
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id.toString()}
            property={property}
            formatAddress={formatAddress}
            formatMarketValue={formatMarketValue}
            highestBid={getHighestBid ? getHighestBid(property.id) : null}
            viewMode="list"
          />
        ))}
      </div>

      {/* Load More Button (if needed for pagination) */}
      {properties.length > 0 && properties.length % 12 === 0 && (
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            Load More Properties
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
