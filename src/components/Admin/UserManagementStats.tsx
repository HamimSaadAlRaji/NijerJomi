import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  UserCheck,
} from "lucide-react";

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

interface UserManagementStatsProps {
  stats: DashboardStats | null;
}

const UserManagementStats: React.FC<UserManagementStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <Card
        className="bg-white border shadow-sm"
        style={{ borderColor: "#aad6ec" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" style={{ color: "#151269" }} />
            <div>
              <div className="text-xl font-bold" style={{ color: "#151269" }}>
                {stats?.totalUsers || 0}
              </div>
              <div className="text-xs" style={{ color: "#81b1ce" }}>
                Total Users
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="bg-white border shadow-sm"
        style={{ borderColor: "#81b1ce" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" style={{ color: "#0f1056" }} />
            <div>
              <div className="text-xl font-bold" style={{ color: "#151269" }}>
                {stats?.pendingVerifications || 0}
              </div>
              <div className="text-xs" style={{ color: "#81b1ce" }}>
                Pending
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="bg-white border shadow-sm"
        style={{ borderColor: "#113065" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            <div>
              <div className="text-xl font-bold" style={{ color: "#151269" }}>
                {stats?.verifiedUsers || 0}
              </div>
              <div className="text-xs" style={{ color: "#81b1ce" }}>
                Verified
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="bg-white border shadow-sm"
        style={{ borderColor: "#aad6ec" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-red-500" />
            <div>
              <div className="text-xl font-bold" style={{ color: "#151269" }}>
                {stats?.rejectedUsers || 0}
              </div>
              <div className="text-xs" style={{ color: "#81b1ce" }}>
                Rejected
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="bg-white border shadow-sm"
        style={{ borderColor: "#151269" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2" style={{ color: "#113065" }} />
            <div>
              <div className="text-xl font-bold" style={{ color: "#0f1056" }}>
                {stats?.totalAdmins || 0}
              </div>
              <div className="text-xs" style={{ color: "#81b1ce" }}>
                Admins
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className="bg-white border shadow-sm"
        style={{ borderColor: "#0f1056" }}
      >
        <CardContent className="p-4">
          <div className="flex items-center">
            <UserCheck className="w-5 h-5 mr-2" style={{ color: "#113065" }} />
            <div>
              <div className="text-xl font-bold" style={{ color: "#151269" }}>
                {stats?.totalRegistrars || 0}
              </div>
              <div className="text-xs" style={{ color: "#81b1ce" }}>
                Registrars
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementStats;
