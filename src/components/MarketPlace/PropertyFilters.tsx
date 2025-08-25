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
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Search Section */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
            <Input
              placeholder="Search properties by ID, location, or owner..."
              value={filters.searchTerm}
              onChange={(e) => handleInputChange("searchTerm", e.target.value)}
              className="pl-12 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Sort Section */}
        <div className="min-w-[200px]">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleInputChange("sortBy", value)}
          >
            <SelectTrigger className="py-4 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-slate-100">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-600">
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
            className="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl px-6 py-4"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge className="bg-blue-600 dark:bg-blue-500 text-white ml-2 px-2 py-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Row */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            <MapPin className="w-4 h-4 inline mr-2 text-blue-600 dark:text-blue-400" />
            Location
          </label>
          <Input
            placeholder="Enter location..."
            value={filters.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            <DollarSign className="w-4 h-4 inline mr-2 text-green-600 dark:text-green-400" />
            Price Range (ETH)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              value={filters.priceRange.min}
              onChange={(e) =>
                handleRangeChange("priceRange", "min", e.target.value)
              }
              className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
            />
            <Input
              placeholder="Max"
              value={filters.priceRange.max}
              onChange={(e) =>
                handleRangeChange("priceRange", "max", e.target.value)
              }
              className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
            />
          </div>
        </div>

        {/* Area Range */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            <Maximize className="w-4 h-4 inline mr-2 text-purple-600 dark:text-purple-400" />
            Area Range (sq ft)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Min"
              value={filters.areaRange.min}
              onChange={(e) =>
                handleRangeChange("areaRange", "min", e.target.value)
              }
              className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
            />
            <Input
              placeholder="Max"
              value={filters.areaRange.max}
              onChange={(e) =>
                handleRangeChange("areaRange", "max", e.target.value)
              }
              className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            <Filter className="w-4 h-4 inline mr-2 text-indigo-600 dark:text-indigo-400" />
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
              <SelectTrigger className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-600 rounded-xl">
                <SelectValue placeholder="Sale Status" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-600">
                <SelectItem value="all">All Properties</SelectItem>
                <SelectItem value="true">For Sale</SelectItem>
                <SelectItem value="false">Not For Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {filteredProperties}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {totalProperties}
          </span>{" "}
          properties
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <Badge
                variant="secondary"
                className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
              >
                Search: {filters.searchTerm}
              </Badge>
            )}
            {filters.location && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
              >
                Location: {filters.location}
              </Badge>
            )}
            {(filters.priceRange.min || filters.priceRange.max) && (
              <Badge
                variant="secondary"
                className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
              >
                Price: {filters.priceRange.min || "0"} -{" "}
                {filters.priceRange.max || "∞"} ETH
              </Badge>
            )}
            {filters.isForSale !== null && (
              <Badge
                variant="secondary"
                className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700"
              >
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
