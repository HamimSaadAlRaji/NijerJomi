import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserRole } from "../../../../types";
import {
  Database,
  Search,
  Shield,
  User,
  Building,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface UserData {
  address: string;
  role: UserRole;
  isVerified: boolean;
  verificationStatus: "approved" | "pending" | "rejected";
  propertyCount: number;
  totalTransactions: number;
  lastActivity: string;
  joinedDate: string;
}

interface UserFilter {
  search: string;
  role: "all" | UserRole;
  verificationStatus: "all" | "verified" | "unverified" | "pending";
}

interface UserListTableProps {
  users: UserData[];
  filter: UserFilter;
  setFilter: React.Dispatch<React.SetStateAction<UserFilter>>;
  onViewUser: (address: string) => void;
  onEditUser: (address: string) => void;
  formatAddress: (address: string) => string;
}

const UserListTable: React.FC<UserListTableProps> = ({
  users,
  filter,
  setFilter,
  onViewUser,
  onEditUser,
  formatAddress,
}) => {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-black text-white hover:bg-black";
      case UserRole.REGISTRAR:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case UserRole.COURT:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case UserRole.TAX_AUTHORITY:
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      case UserRole.CITIZEN:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getVerificationIcon = (status: "approved" | "pending" | "rejected") => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm mb-8">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-xl font-bold text-black">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            All Users ({users.length})
          </CardTitle>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter.search}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, search: e.target.value }))
                }
              />
            </div>
            {/* Role Filter */}
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter.role}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, role: e.target.value as any }))
              }
            >
              <option value="all">All Roles</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.REGISTRAR}>Registrar</option>
              <option value={UserRole.COURT}>Court</option>
              <option value={UserRole.TAX_AUTHORITY}>Tax Authority</option>
              <option value={UserRole.CITIZEN}>Citizen</option>
            </select>
            {/* Verification Filter */}
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter.verificationStatus}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  verificationStatus: e.target.value as any,
                }))
              }
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Properties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((user) => (
                <tr
                  key={user.address}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-black">
                          {formatAddress(user.address)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Joined: {user.joinedDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role === UserRole.TAX_AUTHORITY
                        ? "Tax Auth"
                        : user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getVerificationIcon(user.verificationStatus)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {user.verificationStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Building className="w-4 h-4 mr-1 text-gray-400" />
                      {user.propertyCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black">
                      {user.totalTransactions}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.lastActivity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        onClick={() => onViewUser(user.address)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-gray-600 border-gray-600 hover:bg-gray-50"
                        onClick={() => onEditUser(user.address)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {filter.search ||
                      filter.role !== "all" ||
                      filter.verificationStatus !== "all"
                        ? "No users found matching your criteria"
                        : "No users registered yet"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserListTable;
