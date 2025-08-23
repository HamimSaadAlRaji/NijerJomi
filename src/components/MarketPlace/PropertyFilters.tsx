import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Maximize,
  X,
  SlidersHorizontal,
} from "lucide-react";

export interface FilterOptions {
  searchTerm: string;
  sortBy:
    | "price-asc"
    | "price-desc"
    | "area-asc"
    | "area-desc"
    | "newest"
    | "oldest";
  priceRange: {
    min: string;
    max: string;
  };
  areaRange: {
    min: string;
    max: string;
  };
  location: string;
  isForSale: boolean | null;
  hasDispute: boolean | null;
}

interface PropertyFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  totalProperties: number;
  filteredProperties: number;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  totalProperties,
  filteredProperties,
}) => {
  const handleInputChange = (field: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleRangeChange = (
    rangeType: "priceRange" | "areaRange",
    field: "min" | "max",
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [rangeType]: {
        ...filters[rangeType],
        [field]: value,
      },
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.location) count++;
    if (filters.priceRange.min || filters.priceRange.max) count++;
    if (filters.areaRange.min || filters.areaRange.max) count++;
    if (filters.isForSale !== null) count++;
    if (filters.hasDispute !== null) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Section */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-4 h-4" />
            <Input
              placeholder="Search properties by ID, location, or owner..."
              value={filters.searchTerm}
              onChange={(e) => handleInputChange("searchTerm", e.target.value)}
              className="pl-10 py-3 bg-white/50 dark:bg-black/20 border-black/20 dark:border-white/20 focus:ring-2 focus:ring-black/30"
            />
          </div>
        </div>

        {/* Sort Section */}
        <div className="min-w-[200px]">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleInputChange("sortBy", value)}
          >
            <SelectTrigger className="bg-white/50 dark:bg-black/20 border-black/20 dark:border-white/20">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="area-asc">Area: Small to Large</SelectItem>
              <SelectItem value="area-desc">Area: Large to Small</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white/50 dark:bg-black/20 border-black/20 dark:border-white/20"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="bg-black text-white ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Row */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          <Input
            placeholder="Enter location..."
            value={filters.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="bg-white/50 dark:bg-black/20 border-black/20 dark:border-white/20"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Price Range (ETH)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) =>
                handleRangeChange("priceRange", "min", e.target.value)
              }
              className="bg-white/50 dark:bg-black/20 border-black/20 dark:border-white/20"
            />
            <Input
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) =>
                handleRangeChange("priceRange", "max", e.target.value)
              }
              className="bg-white/50 dark:bg-black/20 border-black/20 dark:border-white/20"
            />
          </div>
        </div>

        {/* Area Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Maximize className="w-4 h-4 inline mr-1" />
            Area Range (sq ft)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              value={filters.areaRange.min}
              onChange={(e) =>
                handleRangeChange("areaRange", "min", e.target.value)
              }
              className="bg-white/50 dark:bg-black/20 border-black/20 dark:border-white/20"
            />
            <Input
              placeholder="Max"
              value={filters.areaRange.max}
              onChange={(e) =>
                handleRangeChange("areaRange", "max", e.target.value)
              }
              className="bg-white/50 dark:bg-black/20 border-black/20 dark:border-white/20"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Filter className="w-4 h-4 inline mr-1" />
            Status
          </label>
          <div className="space-y-2">
            <Select
              value={
                filters.isForSale === null
                  ? "all"
                  : filters.isForSale.toString()
              }
              onValueChange={(value) =>
                handleInputChange(
                  "isForSale",
                  value === "all" ? null : value === "true"
                )
              }
            >
              <SelectTrigger className="bg-white/50 dark:bg-black/20 border-black/20 dark:border-white/20">
                <SelectValue placeholder="Sale Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="true">For Sale</SelectItem>
                <SelectItem value="false">Not For Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <div>
          Showing{" "}
          <span className="font-medium text-black">{filteredProperties}</span>{" "}
          of <span className="font-medium">{totalProperties}</span> properties
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-1">
            {filters.searchTerm && (
              <Badge variant="secondary" className="text-xs">
                Search: {filters.searchTerm}
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="text-xs">
                Location: {filters.location}
              </Badge>
            )}
            {(filters.priceRange.min || filters.priceRange.max) && (
              <Badge variant="secondary" className="text-xs">
                Price: {filters.priceRange.min || "0"} -{" "}
                {filters.priceRange.max || "∞"} ETH
              </Badge>
            )}
            {filters.isForSale !== null && (
              <Badge variant="secondary" className="text-xs">
                {filters.isForSale ? "For Sale" : "Not For Sale"}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFilters;
