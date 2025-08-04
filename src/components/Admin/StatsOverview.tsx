import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

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

interface StatsOverviewProps {
  stats: DashboardStats | null;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Properties */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-gray-600">
            <Building className="w-4 h-4 mr-2 text-blue-600" />
            Total Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">
            {stats?.totalProperties || 0}
          </div>
          <p className="text-sm text-gray-500">Registered in system</p>
        </CardContent>
      </Card>

      {/* Properties for Sale */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
            For Sale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">
            {stats?.propertiesForSale || 0}
          </div>
          <p className="text-sm text-gray-500">Available for purchase</p>
        </CardContent>
      </Card>

      {/* Properties with Disputes */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-gray-600">
            <AlertTriangle className="w-4 h-4 mr-2 text-blue-600" />
            Disputes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">
            {stats?.propertiesWithDisputes || 0}
          </div>
          <p className="text-sm text-gray-500">Require attention</p>
        </CardContent>
      </Card>

      {/* Total Market Value */}
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium text-gray-600">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
            Market Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-black">
            {stats?.totalMarketValue || "0 ETH"}
          </div>
          <p className="text-sm text-gray-500">Total registry value</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
