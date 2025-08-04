import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock, Shield, Building } from "lucide-react";

interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  pendingVerifications: number;
  totalAdmins: number;
  totalUsersWithProperties: number;
}

interface UserStatsOverviewProps {
  stats: UserStats | null;
}

const UserStatsOverview: React.FC<UserStatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Users */}
      <Card className="bg-blue-600 text-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium">
            <Users className="w-5 h-5 mr-2" />
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
          <p className="text-xs opacity-90">Registered on platform</p>
        </CardContent>
      </Card>

      {/* Verified Users */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-gray-600">
            <UserCheck className="w-5 h-5 mr-2 text-green-600" />
            Verified Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">
            {stats?.verifiedUsers || 0}
          </div>
          <p className="text-sm text-gray-500">Identity confirmed</p>
        </CardContent>
      </Card>

      {/* Unverified Users */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-gray-600">
            <UserX className="w-5 h-5 mr-2 text-red-600" />
            Unverified Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">
            {stats?.unverifiedUsers || 0}
          </div>
          <p className="text-sm text-gray-500">Pending verification</p>
        </CardContent>
      </Card>

      {/* Pending Verifications */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-gray-600">
            <Clock className="w-5 h-5 mr-2 text-amber-600" />
            Pending Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">
            {stats?.pendingVerifications || 0}
          </div>
          <p className="text-sm text-gray-500">Awaiting admin action</p>
        </CardContent>
      </Card>

      {/* Admin Users */}
      <Card className="bg-black text-white shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium">
            <Shield className="w-5 h-5 mr-2" />
            Administrators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats?.totalAdmins || 0}</div>
          <p className="text-xs opacity-90">System administrators</p>
        </CardContent>
      </Card>

      {/* Users with Properties */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-gray-600">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Property Owners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">
            {stats?.totalUsersWithProperties || 0}
          </div>
          <p className="text-sm text-gray-500">Own at least 1 property</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsOverview;
