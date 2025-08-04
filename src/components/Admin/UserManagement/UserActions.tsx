import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  UserPlus,
  UserCheck,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";

interface UserActionsProps {
  onAddUser: () => void;
  onBulkVerify: () => void;
  onExportUsers: () => void;
  onRefreshData: () => void;
  isLoading?: boolean;
}

const UserActions: React.FC<UserActionsProps> = ({
  onAddUser,
  onBulkVerify,
  onExportUsers,
  onRefreshData,
  isLoading = false,
}) => {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="bg-black text-white">
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          User Management Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Button
            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onAddUser}
            disabled={isLoading}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add New User
          </Button>

          <Button
            className="w-full justify-start bg-white border border-gray-200 text-black hover:bg-gray-50"
            onClick={onBulkVerify}
            disabled={isLoading}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Bulk User Actions
          </Button>

          <Button
            className="w-full justify-start bg-white border border-gray-200 text-black hover:bg-gray-50"
            onClick={onExportUsers}
            disabled={isLoading}
          >
            <Download className="w-4 h-4 mr-2" />
            Export User Data
          </Button>

          <Button
            className="w-full justify-start bg-white border border-gray-200 text-black hover:bg-gray-50"
            onClick={onRefreshData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActions;
