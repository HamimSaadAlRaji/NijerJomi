import React from "react";
import { Users } from "lucide-react";

const UserManagementHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Users className="w-8 h-8 text-blue-600 mr-3" />
        <h1 className="text-4xl font-bold text-black">User Management</h1>
      </div>
      <p className="text-lg text-gray-600">
        Comprehensive overview and management of all platform users
      </p>
    </div>
  );
};

export default UserManagementHeader;
