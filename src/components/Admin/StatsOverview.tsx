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
      <Card
        className="shadow-sm hover:shadow-md transition-shadow"
        style={{
          border: "1px solid #a1d99b",
          background: "linear-gradient(135deg, #f7fcf5 0%, #ffffff 100%)",
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="flex items-center text-sm font-medium"
            style={{ color: "#293842" }}
          >
            <Building className="w-4 h-4 mr-2" style={{ color: "#293842" }} />
            Total Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" style={{ color: "#293842" }}>
            {stats?.totalProperties || 0}
          </div>
          <p className="text-sm" style={{ color: "#465465" }}>
            Registered in system
          </p>
        </CardContent>
      </Card>

      {/* Properties for Sale */}
      <Card
        className="shadow-sm hover:shadow-md transition-shadow"
        style={{
          border: "1px solid #a1d99b",
          background: "linear-gradient(135deg, #f7fcf5 0%, #ffffff 100%)",
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="flex items-center text-sm font-medium"
            style={{ color: "#293842" }}
          >
            <DollarSign className="w-4 h-4 mr-2" style={{ color: "#006d2c" }} />
            For Sale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" style={{ color: "#006d2c" }}>
            {stats?.propertiesForSale || 0}
          </div>
          <p className="text-sm" style={{ color: "#465465" }}>
            Available for purchase
          </p>
        </CardContent>
      </Card>

      {/* Properties with Disputes */}
      <Card
        className="shadow-sm hover:shadow-md transition-shadow"
        style={{
          border: "1px solid #a1d99b",
          background: "linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)",
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="flex items-center text-sm font-medium"
            style={{ color: "#293842" }}
          >
            <AlertTriangle
              className="w-4 h-4 mr-2"
              style={{ color: "#dc2626" }}
            />
            Disputes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold" style={{ color: "#dc2626" }}>
            {stats?.propertiesWithDisputes || 0}
          </div>
          <p className="text-sm" style={{ color: "#465465" }}>
            Require attention
          </p>
        </CardContent>
      </Card>

      {/* Total Market Value */}
      <Card
        className="shadow-sm hover:shadow-md transition-shadow"
        style={{
          border: "1px solid #a1d99b",
          background: "linear-gradient(135deg, #f7fcf5 0%, #ffffff 100%)",
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className="flex items-center text-sm font-medium"
            style={{ color: "#293842" }}
          >
            <TrendingUp className="w-4 h-4 mr-2" style={{ color: "#41ab5d" }} />
            Market Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" style={{ color: "#41ab5d" }}>
            {stats?.totalMarketValue || "0 BDT"}
          </div>
          <p className="text-sm" style={{ color: "#465465" }}>
            Total registry value
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
