import React from "react";
import { Shield } from "lucide-react";

const DashboardHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Shield className="w-8 h-8 text-blue-600 mr-3" />
        <h1 className="text-4xl font-bold text-black">Admin Dashboard</h1>
      </div>
      <p className="text-lg text-gray-600">
        Complete overview and management of the Land Registry system
      </p>
    </div>
  );
};

export default DashboardHeader;
