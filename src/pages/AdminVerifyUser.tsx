import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWalletContext } from "@/contexts/WalletContext";
import { UserRole } from "../../types";
import { isRole } from "@/lib/roleUtils";
import { verifyUser } from "@/services/blockchainService";
import {
  CheckCircle,
  XCircle,
  User,
  Wallet,
  Calendar,
  Phone,
  MapPin,
  CreditCard,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PendingUser {
  _id: string;
  walletAddress: string;
  fullName: string;
  nidNumber: string;
  phoneNumber: string;
  presentAddress: string;
  permanentAddress: string;
  profilePicture?: string;
  status: string; // Changed from "pending" to allow any status
  userRole: string;
  submittedAt: string;
  createdAt?: string;
}

const AdminVerifyUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isConnected, user, web3State } = useWalletContext();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUser, setProcessingUser] = useState<string | null>(null);

  // Check admin access
  useEffect(() => {
    if (!isConnected || !user || !isRole(user.userRole || "", UserRole.ADMIN)) {
      navigate("/dashboard");
      return;
    }
  }, [isConnected, user, navigate]);

  // Fetch all users and filter for pending ones
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Fetched users data:", data);
        console.log("Response status:", response.status, response.ok);

        if (response.ok && data.success) {
          // Filter users with pending status from all users
          const allUsers = data.data || [];
          console.log("All users:", allUsers);
          const pendingUsersOnly = allUsers
            .filter((user: any) => user.status === "pending")
            .map((user: any) => ({
              ...user,
              submittedAt:
                user.submittedAt || user.createdAt || new Date().toISOString(),
            }));
          console.log("Pending users:", pendingUsersOnly);
          setPendingUsers(pendingUsersOnly);
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
      fetchPendingUsers();
    }
  }, [user, toast]);

  const handleVerifyUser = async (userToVerify: PendingUser) => {
    if (!web3State.contract) {
      toast({
        title: "Error",
        description:
          "Blockchain contract not available. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessingUser(userToVerify._id);

      // Step 1: Verify user on blockchain
      await verifyUser(web3State.contract, userToVerify.walletAddress);

      // Step 2: Update status in database
      const response = await fetch(
        `http://localhost:3000/api/users/${userToVerify._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "accepted",
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
        // Remove user from pending list
        setPendingUsers((prev) =>
          prev.filter((u) => u._id !== userToVerify._id)
        );

        toast({
          title: "User Verified",
          description: `${userToVerify.fullName} has been successfully verified on blockchain and database.`,
        });
      } else {
        throw new Error(
          data.message || "Failed to update user status in database"
        );
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      toast({
        title: "Verification Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to verify user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const handleRejectUser = async (userToReject: PendingUser) => {
    try {
      setProcessingUser(userToReject._id);

      // Only update database status to rejected (no blockchain action)
      const response = await fetch(
        `http://localhost:3000/api/users/${userToReject._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "rejected",
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
        // Remove user from pending list
        setPendingUsers((prev) =>
          prev.filter((u) => u._id !== userToReject._id)
        );

        toast({
          title: "User Rejected",
          description: `${userToReject.fullName}'s verification has been rejected.`,
        });
      } else {
        throw new Error(data.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({
        title: "Rejection Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to reject user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingUser(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!user || !isRole(user.userRole || "", UserRole.ADMIN)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            User Verification Center
          </h1>
          <p className="text-muted-foreground">
            Review and verify pending user registrations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Users
                  </p>
                  <p className="text-2xl font-bold">{pendingUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Ready for Action
                  </p>
                  <p className="text-2xl font-bold">{pendingUsers.length}</p>
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
                    Blockchain Status
                  </p>
                  <p className="text-lg font-bold text-green-600">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Users List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading pending users...</span>
          </div>
        ) : pendingUsers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                No pending user verifications at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingUsers.map((pendingUser) => (
              <Card key={pendingUser._id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      {pendingUser.fullName}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Pending Verification
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg mb-3">
                        Personal Information
                      </h4>

                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">NID:</span>
                        <span className="ml-2 font-medium">
                          {pendingUser.nidNumber}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Phone:</span>
                        <span className="ml-2 font-medium">
                          {pendingUser.phoneNumber}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Present Address:
                          </p>
                          <p className="font-medium text-sm">
                            {pendingUser.presentAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">
                            Permanent Address:
                          </p>
                          <p className="font-medium text-sm">
                            {pendingUser.permanentAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Blockchain Info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg mb-3">
                        Blockchain Information
                      </h4>

                      <div className="flex items-center">
                        <Wallet className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Wallet:</span>
                        <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                          {truncateAddress(pendingUser.walletAddress)}
                        </code>
                      </div>

                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">Role:</span>
                        <span className="ml-2 font-medium">
                          {pendingUser.userRole}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">
                          Submitted:
                        </span>
                        <span className="ml-2 font-medium text-sm">
                          {formatDate(pendingUser.submittedAt)}
                        </span>
                      </div>

                      {/* Profile Picture */}
                      {pendingUser.profilePicture && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">
                            Profile Picture:
                          </p>
                          <img
                            src={pendingUser.profilePicture}
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectUser(pendingUser)}
                      disabled={processingUser === pendingUser._id}
                      className="min-w-[120px]"
                    >
                      {processingUser === pendingUser._id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => handleVerifyUser(pendingUser)}
                      disabled={processingUser === pendingUser._id}
                      className="min-w-[120px] bg-green-600 hover:bg-green-700"
                    >
                      {processingUser === pendingUser._id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify & Approve
                        </>
                      )}
                    </Button>
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

export default AdminVerifyUser;
