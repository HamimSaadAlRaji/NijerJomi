import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/contexts/WalletContext";
import { UserRole } from "../../types";
import { isRole } from "@/lib/roleUtils";
import { walletAPI } from "@/services/walletAPI";
import Navbar from "@/components/Navbar";
import {
  Users,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  Settings,
  Database,
  Activity,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  pendingVerifications: number;
  verifiedUsers: number;
  rejectedUsers: number;
  totalAdmins: number;
  totalRegistrars: number;
}

const AdminDashboard: React.FC = () => {
  const { user, isConnected } = useWalletContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!isConnected || !user || !isRole(user.userRole || "", UserRole.ADMIN)) {
      navigate("/dashboard");
      return;
    }
  }, [isConnected, user, navigate]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to get dashboard statistics
        // const response = await walletAPI.getAdminStats();

        // Mock data for now
        const mockStats: DashboardStats = {
          totalUsers: 150,
          pendingVerifications: 12,
          verifiedUsers: 135,
          rejectedUsers: 3,
          totalAdmins: 2,
          totalRegistrars: 5,
        };

        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isRole(user?.userRole || "", UserRole.ADMIN)) {
      fetchDashboardStats();
    }
  }, [user]);

  if (!user || !isRole(user.userRole || "", UserRole.ADMIN)) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Shield className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Welcome back, Administrator! Here's your system overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Users className="w-5 h-5 mr-2" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-blue-100 text-sm">Registered citizens</p>
            </CardContent>
          </Card>

          {/* Pending Verifications */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2" />
                Pending Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.pendingVerifications || 0}
              </div>
              <p className="text-yellow-100 text-sm">Awaiting review</p>
            </CardContent>
          </Card>

          {/* Verified Users */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                Verified Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.verifiedUsers || 0}
              </div>
              <p className="text-green-100 text-sm">Approved accounts</p>
            </CardContent>
          </Card>

          {/* Rejected Users */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <XCircle className="w-5 h-5 mr-2" />
                Rejected Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.rejectedUsers || 0}
              </div>
              <p className="text-red-100 text-sm">Declined applications</p>
            </CardContent>
          </Card>

          {/* Total Admins */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Shield className="w-5 h-5 mr-2" />
                Administrators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.totalAdmins || 0}
              </div>
              <p className="text-purple-100 text-sm">System admins</p>
            </CardContent>
          </Card>

          {/* Total Registrars */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <UserCheck className="w-5 h-5 mr-2" />
                Registrars
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {stats?.totalRegistrars || 0}
              </div>
              <p className="text-indigo-100 text-sm">Verification staff</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Actions */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Button
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                  onClick={() => navigate("/admin/users")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>

                <Button
                  className="w-full justify-start bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => navigate("/admin/verifications")}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Review Verifications
                </Button>

                <Button
                  className="w-full justify-start bg-green-600 hover:bg-green-700"
                  onClick={() => navigate("/admin/analytics")}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>

                <Button
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                  onClick={() => navigate("/admin/settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium">User verified</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium">New user registered</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Verification pending</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
