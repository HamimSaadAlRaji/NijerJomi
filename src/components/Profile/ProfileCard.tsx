import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Copy, Wallet } from "lucide-react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { UserRole } from "../../../types";
import { isRole, mapBackendRoleToEnum } from "@/lib/roleUtils";

interface UserData {
  _id: string;
  walletAddress: string;
  fullName: string;
  nidNumber: string;
  phoneNumber: string;
  presentAddress: string;
  permanentAddress: string;
  isVerified: boolean;
  status: "pending" | "accepted" | "rejected";
  userRole:
    | "ADMIN"
    | "REGISTRAR"
    | "CITIZEN"
    | "admin"
    | "register"
    | "citizen"; // Support both formats
  createdAt: string;
  updatedAt: string;
  profilePicture?: string;
}

interface ProfileCardProps {
  userData: UserData;
  onCopyAddress: (address: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  userData,
  onCopyAddress,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusConfig = (status: string, userRole: string) => {
    // Admin users don't need verification
    if (isRole(userRole, UserRole.ADMIN)) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        color: "bg-green-100 text-green-800 border-green-200",
        emoji: "✅",
        text: "Verified",
      };
    }

    switch (status) {
      case "accepted":
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: "bg-green-100 text-green-800 border-green-200",
          emoji: "✅",
          text: "Verified",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: "bg-red-100 text-red-800 border-red-200",
          emoji: "❌",
          text: "Rejected",
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          emoji: "⏳",
          text: "Pending Verification",
        };
    }
  };

  const getRoleConfig = (role: string) => {
    const mappedRole = mapBackendRoleToEnum(role);
    switch (mappedRole) {
      case UserRole.ADMIN:
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          emoji: "👑",
          text: "Administrator",
        };
      case UserRole.REGISTRAR:
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          emoji: "📋",
          text: "Registrar",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          emoji: "👤",
          text: "Citizen",
        };
    }
  };

  const statusConfig = getStatusConfig(userData.status, userData.userRole);
  const roleConfig = getRoleConfig(userData.userRole);

  return (
    <Card className="shadow-xl border-0">
      <CardContent className="p-8 text-center">
        {/* Profile Picture */}
        <div className="relative mb-6">
          {userData.profilePicture ? (
            <img
              src={userData.profilePicture}
              alt={userData.fullName}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {userData.fullName.charAt(0)}
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <Badge className={`${statusConfig.color} px-3 py-1`}>
              {statusConfig.icon}
              <span className="ml-1">{statusConfig.text}</span>
            </Badge>
          </div>
        </div>

        {/* Name */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {userData.fullName} 👤
        </h1>

        {/* Role Badge */}
        <div className="flex justify-center mb-4">
          <Badge className={`${roleConfig.color} px-3 py-1`}>
            <span className="mr-1">{roleConfig.emoji}</span>
            {roleConfig.text}
          </Badge>
        </div>

        {/* Wallet Address */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Wallet className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 font-mono">
            {formatAddress(userData.walletAddress)}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCopyAddress(userData.walletAddress)}
            className="p-1 h-6 w-6"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>

        {/* Status Message */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-2xl mb-2">{statusConfig.emoji}</div>
          <p className="text-sm text-gray-600">
            {isRole(userData.userRole, UserRole.ADMIN)
              ? "Administrator account with full system access."
              : userData.status === "accepted"
              ? "Your profile has been verified and approved!"
              : userData.status === "rejected"
              ? "Profile verification was declined. Please contact support."
              : "Your profile is under review. This may take 24-48 hours."}
          </p>
        </div>

        {/* Join Date */}
        <div className="flex items-center justify-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2" />
          Joined {formatDate(userData.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
