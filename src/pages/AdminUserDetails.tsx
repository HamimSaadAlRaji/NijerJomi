import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/config/constants";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Hash,
  ArrowLeft,
  Copy,
  Wallet,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
} from "lucide-react";

interface UserDetails {
  id: string;
  walletAddress: string;
  email: string;
  phone: string;
  address: string;
  role: "CITIZEN" | "GOVERNMENT" | "ADMIN";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  properties?: any[];
}

const AdminUserDetails: React.FC = () => {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      fetchUserDetails(walletAddress);
    }
  }, [walletAddress]);

  const fetchUserDetails = async (address: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/${address}`);

      if (!response.ok) {
        throw new Error("User not found");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "GOVERNMENT":
        return "bg-blue-100 text-blue-800";
      case "CITIZEN":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "REJECTED":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The requested user could not be found."}
          </p>
          <Button onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <User className="w-8 h-8 mr-3 text-blue-600" />
                User Details
              </h1>
              <p className="text-gray-600 mt-1">
                Complete information about the user
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Badge className={getRoleColor(user.role)}>
                <Shield className="w-3 h-3 mr-1" />
                {user.role}
              </Badge>
              {user.isVerified ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Unverified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    User ID
                  </label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-mono">{user.id}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(user.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Role
                  </label>
                  <div className="mt-1">
                    <Badge className={getRoleColor(user.role)}>
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <div className="flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <div className="flex items-center mt-1">
                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{user.phone}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Address
                </label>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{user.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Verification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="flex items-center mt-1">
                  {getVerificationIcon(user.verificationStatus)}
                  <span className="ml-2 font-medium">
                    {user.verificationStatus}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Verified
                </label>
                <div className="flex items-center mt-1">
                  {user.isVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span className="ml-2">{user.isVerified ? "Yes" : "No"}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created
                </label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">{formatDate(user.createdAt)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Updated
                </label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Information */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-blue-600" />
                Wallet Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Wallet Address
                </label>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm font-mono bg-gray-100 px-3 py-2 rounded-lg break-all">
                    {user.walletAddress}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(user.walletAddress)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Properties Overview */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Properties Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Property information will be displayed here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Integration with blockchain service coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
