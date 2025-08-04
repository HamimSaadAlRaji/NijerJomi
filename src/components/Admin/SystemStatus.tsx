import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, CheckCircle, Database, Users } from "lucide-react";

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

interface SystemStatusProps {
  stats: DashboardStats | null;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ stats }) => {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-900 text-white">
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <span className="text-sm font-medium text-green-900">
                Blockchain Connection
              </span>
            </div>
            <Badge className="bg-green-100 text-green-800">Online</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Database className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-sm font-medium text-blue-900">
                Smart Contract
              </span>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Active</Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <Users className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-sm font-medium text-gray-900">
                User Sessions
              </span>
            </div>
            <Badge className="bg-gray-100 text-gray-800">
              {stats?.totalUsers || 0} Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
