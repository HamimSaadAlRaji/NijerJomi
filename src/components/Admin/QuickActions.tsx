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
      style={{ borderColor: "#aad6ec" }}
    >
      <CardHeader className="text-white" style={{ backgroundColor: "#151269" }}>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          System Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Button
            className="w-full justify-start text-white hover:opacity-90"
            style={{ backgroundColor: "#113065" }}
            onClick={() => navigate("/admin/property-management")}
          >
            <Building className="w-4 h-4 mr-2" />
            Property Management
          </Button>

          <Button
            className="w-full justify-start bg-white border hover:bg-gray-50"
            style={{
              borderColor: "#81b1ce",
              color: "#151269",
            }}
            onClick={() => navigate("/admin/user-management")}
          >
            <Users className="w-4 h-4 mr-2" />
            User Management
          </Button>

          <Button
            className="w-full justify-start bg-white border hover:bg-gray-50"
            style={{
              borderColor: "#aad6ec",
              color: "#0f1056",
            }}
            onClick={() => navigate("/admin/set-role")}
          >
            <Shield className="w-4 h-4 mr-2" />
            Role Management
          </Button>

          <Button
            className="w-full justify-start bg-white border hover:bg-gray-50"
            style={{
              borderColor: "#113065",
              color: "#151269",
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
