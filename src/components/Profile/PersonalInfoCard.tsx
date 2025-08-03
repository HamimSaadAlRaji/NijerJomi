import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone } from "lucide-react";

interface UserData {
  fullName: string;
  nidNumber: string;
  phoneNumber: string;
}

interface PersonalInfoCardProps {
  userData: UserData;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ userData }) => {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-black text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Personal Information 📋
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              🏷️ Full Name
            </label>
            <p className="text-lg font-semibold text-gray-800">
              {userData.fullName}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              🆔 National ID Number
            </label>
            <p className="text-lg font-semibold text-gray-800">
              {userData.nidNumber}
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500 mb-1 block">
              📱 Phone Number
            </label>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <p className="text-lg font-semibold text-gray-800">
                {userData.phoneNumber}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
