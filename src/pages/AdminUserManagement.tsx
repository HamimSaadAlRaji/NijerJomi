import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWalletContext } from "@/contexts/WalletContext";
import { UserRole } from "../../types";
import { isRole } from "@/lib/roleUtils";
import { getAllProperties } from "@/services/blockchainService";
import Navbar from "@/components/Navbar";
import {
  UserManagementHeader,
  UserStatsOverview,
  UserListTable,
  RecentActivity,
  UserActions,
} from "@/components/Admin/UserManagement";

interface UserData {
  address: string;
  role: UserRole;
  isVerified: boolean;
  verificationStatus: "approved" | "pending" | "rejected";
  propertyCount: number;
  totalTransactions: number;
  lastActivity: string;
  joinedDate: string;
}

interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  pendingVerifications: number;
  totalAdmins: number;
  totalUsersWithProperties: number;
}

interface UserFilter {
  search: string;
  role: "all" | UserRole;
  verificationStatus: "all" | "verified" | "unverified" | "pending";
}

interface ActivityData {
  id: string;
  type:
    | "user_registered"
    | "user_verified"
    | "user_rejected"
    | "property_registered"
    | "property_transferred"
    | "dispute_reported";
  userAddress: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

const UserManagement: React.FC = () => {
  const { user, isConnected, web3State } = useWalletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<UserFilter>({
    search: "",
    role: "all",
    verificationStatus: "all",
  });

  // Redirect if not admin
  useEffect(() => {
    if (!isConnected || !user || !isRole(user.userRole || "", UserRole.ADMIN)) {
      navigate("/dashboard");
      return;
    }
  }, [isConnected, user, navigate]);

  // Mock data - In real app, this would come from your backend/blockchain
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Mock user data
        const mockUsers: UserData[] = [
          {
            address: "0x1234567890123456789012345678901234567890",
            role: UserRole.ADMIN,
            isVerified: true,
            verificationStatus: "approved",
            propertyCount: 3,
            totalTransactions: 15,
            lastActivity: "2 hours ago",
            joinedDate: "2024-01-15",
          },
          {
            address: "0x2345678901234567890123456789012345678901",
            role: UserRole.CITIZEN,
            isVerified: true,
            verificationStatus: "approved",
            propertyCount: 1,
            totalTransactions: 8,
            lastActivity: "1 day ago",
            joinedDate: "2024-02-20",
          },
          {
            address: "0x3456789012345678901234567890123456789012",
            role: UserRole.REGISTRAR,
            isVerified: true,
            verificationStatus: "approved",
            propertyCount: 0,
            totalTransactions: 25,
            lastActivity: "3 hours ago",
            joinedDate: "2024-01-10",
          },
          {
            address: "0x4567890123456789012345678901234567890123",
            role: UserRole.CITIZEN,
            isVerified: false,
            verificationStatus: "pending",
            propertyCount: 0,
            totalTransactions: 2,
            lastActivity: "5 days ago",
            joinedDate: "2024-03-01",
          },
          {
            address: "0x5678901234567890123456789012345678901234",
            role: UserRole.CITIZEN,
            isVerified: false,
            verificationStatus: "rejected",
            propertyCount: 0,
            totalTransactions: 1,
            lastActivity: "1 week ago",
            joinedDate: "2024-02-28",
          },
        ];

        // Mock activity data
        const mockActivities: ActivityData[] = [
          {
            id: "1",
            type: "user_registered",
            userAddress: "0x4567890123456789012345678901234567890123",
            description:
              "New user registered and submitted verification documents",
            timestamp: "2 hours ago",
          },
          {
            id: "2",
            type: "user_verified",
            userAddress: "0x2345678901234567890123456789012345678901",
            description: "User verification approved by admin",
            timestamp: "1 day ago",
          },
          {
            id: "3",
            type: "property_registered",
            userAddress: "0x2345678901234567890123456789012345678901",
            description: "New property registered in the system",
            timestamp: "2 days ago",
          },
          {
            id: "4",
            type: "user_rejected",
            userAddress: "0x5678901234567890123456789012345678901234",
            description:
              "User verification rejected due to incomplete documents",
            timestamp: "3 days ago",
          },
        ];

        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setActivities(mockActivities);

        // Calculate stats
        const verifiedUsers = mockUsers.filter((u) => u.isVerified).length;
        const unverifiedUsers = mockUsers.filter((u) => !u.isVerified).length;
        const pendingVerifications = mockUsers.filter(
          (u) => u.verificationStatus === "pending"
        ).length;
        const totalAdmins = mockUsers.filter(
          (u) => u.role === UserRole.ADMIN
        ).length;
        const totalUsersWithProperties = mockUsers.filter(
          (u) => u.propertyCount > 0
        ).length;

        setStats({
          totalUsers: mockUsers.length,
          verifiedUsers,
          unverifiedUsers,
          pendingVerifications,
          totalAdmins,
          totalUsersWithProperties,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isRole(user?.userRole || "", UserRole.ADMIN)) {
      fetchUserData();
    }
  }, [user]);

  // Filter users
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (filter.search) {
      filtered = filtered.filter(
        (userData) =>
          userData.address
            .toLowerCase()
            .includes(filter.search.toLowerCase()) ||
          userData.role.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    // Role filter
    if (filter.role !== "all") {
      filtered = filtered.filter((userData) => userData.role === filter.role);
    }

    // Verification status filter
    if (filter.verificationStatus !== "all") {
      switch (filter.verificationStatus) {
        case "verified":
          filtered = filtered.filter((userData) => userData.isVerified);
          break;
        case "unverified":
          filtered = filtered.filter((userData) => !userData.isVerified);
          break;
        case "pending":
          filtered = filtered.filter(
            (userData) => userData.verificationStatus === "pending"
          );
          break;
      }
    }

    setFilteredUsers(filtered);
  }, [users, filter]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleViewUser = (address: string) => {
    // Navigate to user details page
    navigate(`/admin/user-details/${address}`);
  };

  const handleEditUser = (address: string) => {
    // Navigate to user edit page
    navigate(`/admin/edit-user/${address}`);
  };

  const handleAddUser = () => {
    navigate("/admin/add-user");
  };

  const handleBulkVerify = () => {
    console.log("Bulk verify users");
  };

  const handleExportUsers = () => {
    console.log("Export user data");
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  if (!user || !isRole(user.userRole || "", UserRole.ADMIN)) {
    return null;
  }

  if (loading) {
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
        <UserManagementHeader />

        {/* User Statistics */}
        <UserStatsOverview stats={stats} />

        {/* User List Table */}
        <UserListTable
          users={filteredUsers}
          filter={filter}
          setFilter={setFilter}
          onViewUser={handleViewUser}
          onEditUser={handleEditUser}
          formatAddress={formatAddress}
        />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UserActions
            onAddUser={handleAddUser}
            onBulkVerify={handleBulkVerify}
            onExportUsers={handleExportUsers}
            onRefreshData={handleRefreshData}
            isLoading={loading}
          />
          <RecentActivity
            activities={activities}
            formatAddress={formatAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
