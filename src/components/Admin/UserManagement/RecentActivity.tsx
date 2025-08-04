import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  UserPlus,
  UserCheck,
  UserX,
  Building,
  ArrowRightLeft,
  AlertTriangle,
} from "lucide-react";

interface ActivityData {
  id: string;
  type:
    | "user_registered"
    | "user_verified"
    | "user_rejected"
    | "property_registered"
    | "property_transferred"
    | "dispute_reported";
  userAddress: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface RecentActivityProps {
  activities: ActivityData[];
  formatAddress: (address: string) => string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  formatAddress,
}) => {
  const getActivityIcon = (type: ActivityData["type"]) => {
    switch (type) {
      case "user_registered":
        return <UserPlus className="w-5 h-5 text-blue-600" />;
      case "user_verified":
        return <UserCheck className="w-5 h-5 text-green-600" />;
      case "user_rejected":
        return <UserX className="w-5 h-5 text-red-600" />;
      case "property_registered":
        return <Building className="w-5 h-5 text-purple-600" />;
      case "property_transferred":
        return <ArrowRightLeft className="w-5 h-5 text-orange-600" />;
      case "dispute_reported":
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityBadgeColor = (type: ActivityData["type"]) => {
    switch (type) {
      case "user_registered":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "user_verified":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "user_rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "property_registered":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "property_transferred":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case "dispute_reported":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const formatActivityType = (type: ActivityData["type"]) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-900 text-white">
        <CardTitle className="flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="mr-3 mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <Badge className={getActivityBadgeColor(activity.type)}>
                    {formatActivityType(activity.type)}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {activity.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-900 mb-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-600">
                  User: {formatAddress(activity.userAddress)}
                </p>
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
