import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWalletContext } from "@/contexts/WalletContext";
import { UserRole } from "../../types";
import { isRole, mapEnumToBackendRole } from "@/lib/roleUtils";
import { setRole } from "@/services/blockchainService";
import { API_BASE_URL } from "@/config/constants";
import {
  Users,
  Shield,
  Search,
  Wallet,
  UserCheck,
  Loader2,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  walletAddress: string;
  fullName: string;
  email?: string;
  userRole: string;
  status: string;
  createdAt: string;
}

const AdminSetUserRole = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, user, web3State } = useWalletContext();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Check admin access
  useEffect(() => {
    if (!isConnected || !user || !isRole(user.userRole || "", UserRole.ADMIN)) {
      navigate("/dashboard");
      return;
    }
  }, [isConnected, user, navigate]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const allUsers = data.data || [];
          // Filter out pending users, only show accepted/verified users
          const verifiedUsers = allUsers.filter(
            (user: any) => user.status !== "pending"
          );
          setUsers(verifiedUsers);
          setFilteredUsers(verifiedUsers);
        } else {
          throw new Error(data.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && isRole(user.userRole || "", UserRole.ADMIN)) {
      fetchUsers();
    }
  }, [user, toast]);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSetRole = async () => {
    if (!selectedUser || !selectedRole || !web3State.contract) {
      toast({
        title: "Error",
        description:
          "Please select a user and role, and ensure blockchain is connected.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingUser(selectedUser._id);

      // Step 1: Set role on blockchain
      await setRole(
        web3State.contract,
        selectedUser.walletAddress,
        selectedRole
      );

      // Step 2: Update role in database
      const response = await fetch(
        `${API_BASE_URL}/users/${selectedUser._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userRole: mapEnumToBackendRole(selectedRole),
          }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(
          `Server returned non-JSON response: ${response.status} ${response.statusText}`
        );
      }

      if (response.ok && data.success) {
        // Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u._id === selectedUser._id
              ? { ...u, userRole: mapEnumToBackendRole(selectedRole) }
              : u
          )
        );

        // Clear selection
        setSelectedUser(null);
        setSelectedRole("");

        toast({
          title: "Role Updated",
          description: `${selectedUser.fullName}'s role has been set to ${selectedRole} on blockchain and database.`,
        });
      } else {
        throw new Error(
          data.message || "Failed to update user role in database"
        );
      }
    } catch (error) {
      console.error("Error setting user role:", error);
      toast({
        title: "Role Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "REGISTRAR":
        return "text-blue-800";
      case "COURT":
        return "bg-purple-100 text-purple-800";
      case "TAX_AUTHORITY":
        return "bg-green-100 text-green-800";
      case "CITIZEN":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toUpperCase()) {
      case "REGISTRAR":
        return { backgroundColor: "#aad6ec" };
      default:
        return {};
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user || !isRole(user.userRole || "", UserRole.ADMIN)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              background:
                "linear-gradient(135deg, #465465 0%, #465465 50%, #293842 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            User Role Management
          </h1>
          <p style={{ color: "#293842" }}>
            Assign and manage user roles with blockchain integration
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card
            className="bg-white shadow-sm border"
            style={{ borderColor: "#a1d99b" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8" style={{ color: "#293842" }} />
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#465465" }}
                  >
                    Total Users
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#293842" }}
                  >
                    {users.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white shadow-sm border"
            style={{ borderColor: "#a1d99b" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8" style={{ color: "#293842" }} />
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#465465" }}
                  >
                    Role System
                  </p>
                  <p className="text-lg font-bold" style={{ color: "#006d2c" }}>
                    Active
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="bg-white shadow-sm border"
            style={{ borderColor: "#a1d99b" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle
                  className="w-8 h-8"
                  style={{ color: "#293842" }}
                />
                <div className="ml-4">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "#465465" }}
                  >
                    Blockchain
                  </p>
                  <p className="text-lg font-bold" style={{ color: "#006d2c" }}>
                    Connected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Assignment Section */}
        <Card
          className="mb-8 bg-white shadow-sm border"
          style={{ borderColor: "#a1d99b" }}
        >
          <CardHeader className="border-b" style={{ borderColor: "#c7e9c0" }}>
            <CardTitle
              className="flex items-center"
              style={{ color: "#293842" }}
            >
              <Settings className="w-5 h-5 mr-2" style={{ color: "#006d2c" }} />
              Set User Role
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-select" style={{ color: "#293842" }}>
                  Select User
                </Label>
                <Select
                  value={selectedUser?._id || ""}
                  onValueChange={(value) => {
                    const user = users.find((u) => u._id === value);
                    setSelectedUser(user || null);
                  }}
                >
                  <SelectTrigger
                    className="border bg-white h-10 focus:ring-2"
                    style={{
                      borderColor: "#a1d99b",
                      color: "#293842",
                    }}
                  >
                    <SelectValue
                      placeholder="Choose a user"
                      style={{ color: "#465465" }}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border"
                    style={{ borderColor: "#a1d99b" }}
                  >
                    {filteredUsers.map((user) => (
                      <SelectItem
                        key={user._id}
                        value={user._id}
                        className="hover:bg-green-50 focus:bg-green-50"
                        style={{ color: "#293842" }}
                      >
                        {user.fullName} ({truncateAddress(user.walletAddress)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role-select" style={{ color: "#293842" }}>
                  Select Role
                </Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                >
                  <SelectTrigger
                    className="border bg-white h-10 focus:ring-2"
                    style={{
                      borderColor: "#a1d99b",
                      color: "#293842",
                    }}
                  >
                    <SelectValue
                      placeholder="Choose a role"
                      style={{ color: "#465465" }}
                    />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border"
                    style={{ borderColor: "#a1d99b" }}
                  >
                    <SelectItem
                      value={UserRole.ADMIN}
                      className="hover:bg-green-50 focus:bg-green-50"
                      style={{ color: "#293842" }}
                    >
                      Admin
                    </SelectItem>
                    <SelectItem
                      value={UserRole.REGISTRAR}
                      className="hover:bg-green-50 focus:bg-green-50"
                      style={{ color: "#293842" }}
                    >
                      Registrar
                    </SelectItem>
                    <SelectItem
                      value={UserRole.COURT}
                      className="hover:bg-green-50 focus:bg-green-50"
                      style={{ color: "#293842" }}
                    >
                      Court
                    </SelectItem>
                    <SelectItem
                      value={UserRole.TAX_AUTHORITY}
                      className="hover:bg-green-50 focus:bg-green-50"
                      style={{ color: "#293842" }}
                    >
                      Tax Authority
                    </SelectItem>
                    <SelectItem
                      value={UserRole.CITIZEN}
                      className="hover:bg-green-50 focus:bg-green-50"
                      style={{ color: "#293842" }}
                    >
                      Citizen
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-transparent">Button</Label>
                <Button
                  onClick={handleSetRole}
                  disabled={
                    !selectedUser || !selectedRole || processingUser !== null
                  }
                  className="w-full text-white h-10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: "#006d2c",
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "#005a24";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "#006d2c";
                    }
                  }}
                >
                  {processingUser ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Setting Role...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Set Role
                    </>
                  )}
                </Button>
              </div>
            </div>

            {selectedUser && (
              <div
                className="mt-4 p-4 rounded-lg"
                style={{
                  backgroundColor: "#f7fcf5",
                  border: "1px solid #c7e9c0",
                }}
              >
                <p className="text-sm">
                  <strong style={{ color: "#293842" }}>Selected User:</strong>{" "}
                  <span style={{ color: "#006d2c" }}>
                    {selectedUser.fullName}
                  </span>
                </p>
                <p className="text-sm">
                  <strong style={{ color: "#293842" }}>Current Role:</strong>{" "}
                  <span className="capitalize" style={{ color: "#41ab5d" }}>
                    {selectedUser.userRole}
                  </span>
                </p>
                <p className="text-sm">
                  <strong style={{ color: "#293842" }}>Wallet:</strong>{" "}
                  <span style={{ color: "#6b7280" }}>
                    {selectedUser.walletAddress}
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: "#465465" }}
            />
            <Input
              placeholder="Search users by name, email, or wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border bg-white"
              style={{ borderColor: "#a1d99b" }}
            />
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "#a1d99b" }}
            />
            <span className="ml-2" style={{ color: "#006d2c" }}>
              Loading users...
            </span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="bg-white border" style={{ borderColor: "#a1d99b" }}>
            <CardContent className="p-12 text-center">
              <Users
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: "#41ab5d" }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "#293842" }}
              >
                No Users Found
              </h3>
              <p style={{ color: "#465465" }}>
                {searchTerm
                  ? "No users match your search criteria."
                  : "No verified users available."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((userData) => (
              <Card
                key={userData._id}
                className="overflow-hidden bg-white shadow-sm border"
                style={{ borderColor: "#a1d99b" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#293842" }}
                      >
                        <span className="text-white font-semibold text-lg">
                          {userData.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h3
                          className="font-semibold text-lg"
                          style={{ color: "#293842" }}
                        >
                          {userData.fullName}
                        </h3>
                        <div
                          className="flex items-center space-x-4 text-sm"
                          style={{ color: "#6b7280" }}
                        >
                          <div className="flex items-center">
                            <Wallet className="w-4 h-4 mr-1" />
                            {truncateAddress(userData.walletAddress)}
                          </div>
                          {userData.email && <span>{userData.email}</span>}
                          <span>Joined: {formatDate(userData.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Badge
                        className={getRoleBadgeColor(userData.userRole)}
                        style={getRoleBadgeStyle(userData.userRole)}
                      >
                        {userData.userRole.replace("_", " ")}
                      </Badge>

                      <Badge className={getStatusBadgeColor(userData.status)}>
                        {userData.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSetUserRole;
