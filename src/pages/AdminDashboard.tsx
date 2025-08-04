import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { Property, UserRole } from "../../types";
import { isRole } from "@/lib/roleUtils";
import { getAllProperties } from "@/services/blockchainService";
import Navbar from "@/components/Navbar";
import {
  DashboardHeader,
  StatsOverview,
  UserManagementStats,
  PropertiesOverview,
  QuickActions,
  SystemStatus,
} from "@/components/Admin";

interface DashboardStats {
  totalUsers: number;
  pendingVerifications: number;
  verifiedUsers: number;
  rejectedUsers: number;
  totalAdmins: number;
  totalRegistrars: number;
  totalProperties: number;
  propertiesForSale: number;
  propertiesWithDisputes: number;
  totalMarketValue: string;
}

interface PropertyFilter {
  search: string;
  status: "all" | "for-sale" | "dispute" | "normal";
}

const AdminDashboard: React.FC = () => {
  const { user, isConnected, web3State } = useWalletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [filter, setFilter] = useState<PropertyFilter>({
    search: "",
    status: "all",
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isConnected || !user || !isRole(user.userRole || "", UserRole.ADMIN)) {
      navigate("/dashboard");
      return;
    }
  }, [isConnected, user, navigate]);

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      if (!web3State.contract) return;

      try {
        setPropertiesLoading(true);
        const allProperties = await getAllProperties(web3State.contract);
        setProperties(allProperties);
        setFilteredProperties(allProperties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setPropertiesLoading(false);
      }
    };

    if (web3State.contract && isRole(user?.userRole || "", UserRole.ADMIN)) {
      fetchProperties();
    }
  }, [web3State.contract, user]);

  // Filter properties
  useEffect(() => {
    let filtered = properties;

    // Search filter
    if (filter.search) {
      filtered = filtered.filter(
        (property) =>
          property.location
            .toLowerCase()
            .includes(filter.search.toLowerCase()) ||
          property.ownerAddress
            .toLowerCase()
            .includes(filter.search.toLowerCase()) ||
          property.id.toString().includes(filter.search)
      );
    }

    // Status filter
    switch (filter.status) {
      case "for-sale":
        filtered = filtered.filter((p) => p.isForSale);
        break;
      case "dispute":
        filtered = filtered.filter((p) => p.hasDispute);
        break;
      case "normal":
        filtered = filtered.filter((p) => !p.isForSale && !p.hasDispute);
        break;
    }

    setFilteredProperties(filtered);
  }, [properties, filter]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        // Calculate property statistics
        const totalProperties = properties.length;
        const propertiesForSale = properties.filter((p) => p.isForSale).length;
        const propertiesWithDisputes = properties.filter(
          (p) => p.hasDispute
        ).length;
        const totalMarketValue = properties.reduce((total, property) => {
          return total + Number(property.marketValue);
        }, 0);

        // Mock user data for now - in real app this would come from API
        const mockStats: DashboardStats = {
          totalUsers: 150,
          pendingVerifications: 12,
          verifiedUsers: 135,
          rejectedUsers: 3,
          totalAdmins: 2,
          totalRegistrars: 5,
          totalProperties,
          propertiesForSale,
          propertiesWithDisputes,
          totalMarketValue: (totalMarketValue / 1e18).toFixed(2) + " ETH",
        };

        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isRole(user?.userRole || "", UserRole.ADMIN) && !propertiesLoading) {
      fetchDashboardStats();
    }
  }, [user, properties, propertiesLoading]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatMarketValue = (value: bigint) => {
    return `${(Number(value) / 1e18).toFixed(4)} ETH`;
  };

  if (!user || !isRole(user.userRole || "", UserRole.ADMIN)) {
    return null;
  }

  if (loading || propertiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-8 mt-20">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Overview */}
        <StatsOverview stats={stats} />

        {/* User Management Stats */}
        <UserManagementStats stats={stats} />

        {/* Properties Overview Section */}
        <PropertiesOverview
          filteredProperties={filteredProperties}
          filter={filter}
          setFilter={setFilter}
          formatAddress={formatAddress}
          formatMarketValue={formatMarketValue}
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QuickActions />
          <SystemStatus stats={stats} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
