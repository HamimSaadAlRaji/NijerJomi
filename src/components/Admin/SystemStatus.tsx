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
    <Card
      className="bg-white border shadow-sm"
      style={{ borderColor: "#aad6ec" }}
    >
      <CardHeader className="text-white" style={{ backgroundColor: "#113065" }}>
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: "#f0f9ff" }}
          >
            <div className="flex items-center">
              <CheckCircle
                className="w-5 h-5 mr-3"
                style={{ color: "#22c55e" }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: "#151269" }}
              >
                Blockchain Connection
              </span>
            </div>
            <Badge
              className="text-green-800"
              style={{ backgroundColor: "#dcfce7" }}
            >
              Online
            </Badge>
          </div>

          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: "#f8fafc" }}
          >
            <div className="flex items-center">
              <Database className="w-5 h-5 mr-3" style={{ color: "#0f1056" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#151269" }}
              >
                Smart Contract
              </span>
            </div>
            <Badge
              className="text-blue-800"
              style={{ backgroundColor: "#aad6ec" }}
            >
              Active
            </Badge>
          </div>

          <div
            className="flex items-center justify-between p-3 rounded-lg"
            style={{ backgroundColor: "#f9fafb" }}
          >
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3" style={{ color: "#81b1ce" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#151269" }}
              >
                User Sessions
              </span>
            </div>
            <Badge
              className="text-gray-800"
              style={{ backgroundColor: "#e5e7eb" }}
            >
              {stats?.totalUsers || 0} Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
