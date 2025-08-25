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
}

const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  loading,
  formatAddress,
  formatMarketValue,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden animate-pulse flex border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="w-[450px] h-36 bg-slate-200/80 dark:bg-slate-700/80"></div>
            <div className="flex-1 p-6 space-y-3">
              <div className="h-6 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg w-2/3"></div>
              <div className="h-4 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg w-1/2"></div>
              <div className="h-4 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg w-3/4"></div>
              <div className="h-10 bg-slate-200/80 dark:bg-slate-700/80 rounded-xl w-1/2"></div>
              <div className="h-5 bg-slate-200/80 dark:bg-slate-700/80 rounded-lg w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
          <Grid3X3 className="w-16 h-16 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          No Properties Available
        </h3>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
          No properties match your current search criteria. Try adjusting your
          filters or search terms to discover more properties.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
          <span className="text-slate-900 dark:text-slate-100 font-semibold">
            {properties.length}
          </span>{" "}
          {properties.length === 1 ? "property" : "properties"} available
        </div>
      </div>

      {/* Properties List */}
      <div className="space-y-6">
        {properties.map((property) => (
          <PropertyCard
            key={property.id.toString()}
            property={property}
            formatAddress={formatAddress}
            formatMarketValue={formatMarketValue}
            viewMode="list"
          />
        ))}
      </div>

      {/* Load More Button (if needed for pagination) */}
      {properties.length > 0 && properties.length % 12 === 0 && (
        <div className="flex justify-center pt-12">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/70 rounded-xl px-8 py-4 transition-colors duration-200"
          >
            <ArrowUpDown className="w-5 h-5" />
            Load More Properties
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyGrid;
