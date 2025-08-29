import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Building, Users, Shield, Activity } from "lucide-react";

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card
      className="bg-white border shadow-sm"
      style={{ borderColor: "#a1d99b" }}
    >
      <CardHeader className="text-white" style={{ backgroundColor: "#006d2c" }}>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          System Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Button
            className="w-full justify-start text-white hover:opacity-90"
            style={{ backgroundColor: "#41ab5d" }}
            onClick={() => navigate("/admin/property-management")}
          >
            <Building className="w-4 h-4 mr-2" />
            Property Management
          </Button>

          <Button
            className="w-full justify-start bg-white border hover:bg-gray-50"
            style={{
              borderColor: "#a1d99b",
              color: "#006d2c",
            }}
            onClick={() => navigate("/admin/user-management")}
          >
            <Users className="w-4 h-4 mr-2" />
            User Management
          </Button>

          <Button
            className="w-full justify-start bg-white border hover:bg-gray-50"
            style={{
              borderColor: "#a1d99b",
              color: "#293842",
            }}
            onClick={() => navigate("/admin/set-role")}
          >
            <Shield className="w-4 h-4 mr-2" />
            Role Management
          </Button>

          <Button
            className="w-full justify-start bg-white border hover:bg-gray-50"
            style={{
              borderColor: "#41ab5d",
              color: "#006d2c",
            }}
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
