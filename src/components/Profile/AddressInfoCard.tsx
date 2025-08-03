import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface UserData {
  presentAddress: string;
  permanentAddress: string;
}

interface AddressInfoCardProps {
  userData: UserData;
}

const AddressInfoCard: React.FC<AddressInfoCardProps> = ({ userData }) => {
  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="bg-black text-white rounded-t-lg">
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          Address Information 📍
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">
              🏠 Present Address
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-gray-800 leading-relaxed">
                {userData.presentAddress}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">
              🏡 Permanent Address
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
              <p className="text-gray-800 leading-relaxed">
                {userData.permanentAddress}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddressInfoCard;
