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
      <Card className="bg-blue-600 text-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            <div>
              <div className="text-xl font-bold">{stats?.totalUsers || 0}</div>
              <div className="text-xs opacity-90">Total Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-amber-500" />
            <div>
              <div className="text-xl font-bold text-black">
                {stats?.pendingVerifications || 0}
              </div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            <div>
              <div className="text-xl font-bold text-black">
                {stats?.verifiedUsers || 0}
              </div>
              <div className="text-xs text-gray-600">Verified</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 mr-2 text-red-500" />
            <div>
              <div className="text-xl font-bold text-black">
                {stats?.rejectedUsers || 0}
              </div>
              <div className="text-xs text-gray-600">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#ff0000] text-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            <div>
              <div className="text-xl font-bold">{stats?.totalAdmins || 0}</div>
              <div className="text-xs opacity-90">Admins</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
            <div>
              <div className="text-xl font-bold text-black">
                {stats?.totalRegistrars || 0}
              </div>
              <div className="text-xs text-gray-600">Registrars</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementStats;
