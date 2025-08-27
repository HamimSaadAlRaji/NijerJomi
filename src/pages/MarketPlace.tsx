import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { Property, TransferRequest } from "../../types";
import {
  PropertyFilters,
  PropertyGrid,
  FilterOptions,
} from "@/components/MarketPlace";
import {
  getAllProperties,
  getAllTransferRequests,
} from "@/services/blockchainService";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, AlertCircle } from "lucide-react";

const MarketPlace: React.FC = () => {
  const { web3State } = useWalletContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize filters from URL params or defaults
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: searchParams.get("search") || "",
    sortBy: (searchParams.get("sort") as FilterOptions["sortBy"]) || "newest",
    priceRange: {
      min: searchParams.get("minPrice") || "",
      max: searchParams.get("maxPrice") || "",
    },
    areaRange: {
      min: searchParams.get("minArea") || "",
      max: searchParams.get("maxArea") || "",
    },
    location: searchParams.get("location") || "",
    isForSale: searchParams.get("forSale")
      ? searchParams.get("forSale") === "true"
      : null,
    hasDispute: searchParams.get("hasDispute")
      ? searchParams.get("hasDispute") === "true"
      : null,
  });

  // Fetch properties on component mount
  useEffect(() => {
    if (web3State.contract) {
      fetchProperties();
    }
  }, [web3State.contract]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.set("search", filters.searchTerm);
    if (filters.sortBy !== "newest") params.set("sort", filters.sortBy);
    if (filters.priceRange.min) params.set("minPrice", filters.priceRange.min);
    if (filters.priceRange.max) params.set("maxPrice", filters.priceRange.max);
    if (filters.areaRange.min) params.set("minArea", filters.areaRange.min);
    if (filters.areaRange.max) params.set("maxArea", filters.areaRange.max);
    if (filters.location) params.set("location", filters.location);
    if (filters.isForSale !== null)
      params.set("forSale", filters.isForSale.toString());
    if (filters.hasDispute !== null)
      params.set("hasDispute", filters.hasDispute.toString());

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const fetchProperties = async () => {
    if (!web3State.contract) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch properties and transfer requests in parallel
      const [fetchedProperties, fetchedTransferRequests] = await Promise.all([
        getAllProperties(web3State.contract),
        getAllTransferRequests(web3State.contract),
      ]);

      setProperties(fetchedProperties);
      setTransferRequests(fetchedTransferRequests);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = [...properties];

    // Only show properties that are for sale
    filtered = filtered.filter((property) => property.isForSale);

    // Filter out properties that have active (non-completed) transfer requests
    const activeTransferPropertyIds = transferRequests
      .filter((request) => !request.completed)
      .map((request) => request.propertyId);

    filtered = filtered.filter(
      (property) => !activeTransferPropertyIds.includes(property.id)
    );

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.id.toString().includes(searchTerm) ||
          property.location.toLowerCase().includes(searchTerm) ||
          property.ownerAddress.toLowerCase().includes(searchTerm)
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply price range filter
    if (filters.priceRange.min || filters.priceRange.max) {
      filtered = filtered.filter((property) => {
        const priceInEth = Number(property.marketValue) / 1e18;
        const minPrice = filters.priceRange.min
          ? parseFloat(filters.priceRange.min)
          : 0;
        const maxPrice = filters.priceRange.max
          ? parseFloat(filters.priceRange.max)
          : Infinity;
        return priceInEth >= minPrice && priceInEth <= maxPrice;
      });
    }

    // Apply area range filter
    if (filters.areaRange.min || filters.areaRange.max) {
      filtered = filtered.filter((property) => {
        const minArea = filters.areaRange.min
          ? parseInt(filters.areaRange.min)
          : 0;
        const maxArea = filters.areaRange.max
          ? parseInt(filters.areaRange.max)
          : Infinity;
        return property.area >= minArea && property.area <= maxArea;
      });
    }

    // Apply sale status filter
    if (filters.isForSale !== null) {
      filtered = filtered.filter(
        (property) => property.isForSale === filters.isForSale
      );
    }

    // Apply dispute status filter
    if (filters.hasDispute !== null) {
      filtered = filtered.filter(
        (property) => property.hasDispute === filters.hasDispute
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-asc":
          return Number(a.marketValue) - Number(b.marketValue);
        case "price-desc":
          return Number(b.marketValue) - Number(a.marketValue);
        case "area-asc":
          return a.area - b.area;
        case "area-desc":
          return b.area - a.area;
        case "oldest":
          return Number(a.id) - Number(b.id);
        case "newest":
        default:
          return Number(b.id) - Number(a.id);
      }
    });

    return filtered;
  }, [properties, transferRequests, filters]);

  // Utility functions
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatMarketValue = (value: bigint) => {
    const ethValue = Number(value) / 1e18;
    return `${ethValue.toFixed(4)} ETH`;
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      sortBy: "newest",
      priceRange: { min: "", max: "" },
      areaRange: { min: "", max: "" },
      location: "",
      isForSale: null,
      hasDispute: null,
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
              style={{ border: "1px solid #aad6ec" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: "#aad6ec20" }}
              >
                <AlertCircle className="w-8 h-8" style={{ color: "#151269" }} />
              </div>
              <h2 className="text-2xl font-bold text-black mb-3">
                Unable to Load Properties
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
              <Button
                onClick={fetchProperties}
                className="text-white px-6 py-3 rounded-xl transition-colors duration-200 flex items-center gap-3 mx-auto hover:opacity-90"
                style={{ backgroundColor: "#151269" }}
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#aad6ec10" }}
        ></div>
        <div className="relative container mx-auto px-4 py-16 mt-5">
          <div className="text-center max-w-4xl mx-auto">
            <h1
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{
                background: `linear-gradient(to right, #151269, #0f1056, #113065)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Property Marketplace
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover verified properties backed by blockchain technology.
              Secure, transparent, and trustworthy real estate transactions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="space-y-8">
          {/* Filters Section */}
          <PropertyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            totalProperties={properties.length}
            filteredProperties={filteredAndSortedProperties.length}
          />

          {/* Properties Grid */}
          <PropertyGrid
            properties={filteredAndSortedProperties}
            loading={loading}
            formatAddress={formatAddress}
            formatMarketValue={formatMarketValue}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketPlace;
