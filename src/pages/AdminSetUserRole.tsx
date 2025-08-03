import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
        const response = await fetch("http://localhost:3000/api/users", {
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
        `http://localhost:3000/api/users/${selectedUser._id}`,
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
        return "bg-blue-100 text-blue-800";
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            User Role Management
          </h1>
          <p className="text-muted-foreground">
            Assign and manage user roles with blockchain integration
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Role System
                  </p>
                  <p className="text-lg font-bold text-green-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Blockchain
                  </p>
                  <p className="text-lg font-bold text-green-600">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Assignment Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Set User Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="user-select">Select User</Label>
                <Select
                  value={selectedUser?._id || ""}
                  onValueChange={(value) => {
                    const user = users.find((u) => u._id === value);
                    setSelectedUser(user || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredUsers.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.fullName} ({truncateAddress(user.walletAddress)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="role-select">Select Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.REGISTRAR}>
                      Registrar
                    </SelectItem>
                    <SelectItem value={UserRole.COURT}>Court</SelectItem>
                    <SelectItem value={UserRole.TAX_AUTHORITY}>
                      Tax Authority
                    </SelectItem>
                    <SelectItem value={UserRole.CITIZEN}>Citizen</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSetRole}
                  disabled={
                    !selectedUser || !selectedRole || processingUser !== null
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700"
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
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  <strong>Selected User:</strong> {selectedUser.fullName}
                </p>
                <p className="text-sm">
                  <strong>Current Role:</strong>{" "}
                  <span className="capitalize">{selectedUser.userRole}</span>
                </p>
                <p className="text-sm">
                  <strong>Wallet:</strong> {selectedUser.walletAddress}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users by name, email, or wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No users match your search criteria."
                  : "No verified users available."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((userData) => (
              <Card key={userData._id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {userData.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">
                          {userData.fullName}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                      <Badge className={getRoleBadgeColor(userData.userRole)}>
                        {userData.userRole.replace("_", " ")}
                      </Badge>

                      <Badge
                        variant={
                          userData.status === "accepted"
                            ? "default"
                            : "secondary"
                        }
                      >
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
