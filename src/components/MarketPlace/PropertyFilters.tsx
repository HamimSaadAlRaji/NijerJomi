import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

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
  const handleInputChange = (
    key: keyof FilterOptions,
    value: FilterOptions[keyof FilterOptions]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div
      className="bg-white p-6 rounded-2xl shadow-lg"
      style={{ border: "1px solid #a1d99b" }}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Section */}
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: "#41ab5d" }}
            />
            <Input
              placeholder="Search properties by ID, location, or owner..."
              value={filters.searchTerm}
              onChange={(e) => handleInputChange("searchTerm", e.target.value)}
              className="pl-12 py-3 rounded-xl text-black placeholder:text-gray-500"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #41ab5d",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#006d2c";
                e.target.style.boxShadow = "0 0 0 2px #a1d99b";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#41ab5d";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Sort Section */}
        <div className="min-w-[200px]">
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleInputChange("sortBy", value)}
          >
            <SelectTrigger
              className="py-3 rounded-xl text-black"
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #41ab5d",
              }}
            >
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent
              className="bg-white border"
              style={{ borderColor: "#a1d99b" }}
            >
              <SelectItem
                value="newest"
                className="hover:bg-[#e6f4ea] focus:bg-[#e6f4ea]"
                style={{ color: "#465465" }}
              >
                Newest First
              </SelectItem>
              <SelectItem
                value="oldest"
                className="hover:bg-[#e6f4ea] focus:bg-[#e6f4ea]"
                style={{ color: "#465465" }}
              >
                Oldest First
              </SelectItem>
              <SelectItem
                value="price-asc"
                className="hover:bg-[#e6f4ea] focus:bg-[#e6f4ea]"
                style={{ color: "#465465" }}
              >
                Price: Low to High
              </SelectItem>
              <SelectItem
                value="price-desc"
                className="hover:bg-[#e6f4ea] focus:bg-[#e6f4ea]"
                style={{ color: "#465465" }}
              >
                Price: High to Low
              </SelectItem>
              <SelectItem
                value="area-asc"
                className="hover:bg-[#e6f4ea] focus:bg-[#e6f4ea]"
                style={{ color: "#465465" }}
              >
                Area: Small to Large
              </SelectItem>
              <SelectItem
                value="area-desc"
                className="hover:bg-[#e6f4ea] focus:bg-[#e6f4ea]"
                style={{ color: "#465465" }}
              >
                Area: Large to Small
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
