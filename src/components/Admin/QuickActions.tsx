import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Building, UserCheck, Shield, Activity } from "lucide-react";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader className="bg-black text-white">
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          System Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Button
            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate("/admin/property-management")}
          >
            <Building className="w-4 h-4 mr-2" />
            Property Management
          </Button>

          <Button
            className="w-full justify-start bg-white border border-gray-200 text-black hover:bg-gray-50"
            onClick={() => navigate("/admin/verify-user")}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            User Verification
          </Button>

          <Button
            className="w-full justify-start bg-white border border-gray-200 text-black hover:bg-gray-50"
            onClick={() => navigate("/admin/set-role")}
          >
            <Shield className="w-4 h-4 mr-2" />
            Role Management
          </Button>

          <Button
            className="w-full justify-start bg-white border border-gray-200 text-black hover:bg-gray-50"
            onClick={() => navigate("/analytics")}
          >
            <Activity className="w-4 h-4 mr-2" />
            Analytics Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
