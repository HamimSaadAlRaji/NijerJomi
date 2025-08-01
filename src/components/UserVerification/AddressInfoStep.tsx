import React, { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin } from "lucide-react";

interface AddressInfoStepProps {
  formData: {
    // Present Address
    presentHouse: string;
    presentRoad: string;
    presentPostCode: string;
    presentAddress: string;
    presentCity: string;
    presentDivision: string;
    // Permanent Address
    permanentHouse: string;
    permanentRoad: string;
    permanentPostCode: string;
    permanentAddress: string;
    permanentCity: string;
    permanentDivision: string;
  };
  errors: Record<string, string>;
  sameAsPresent: boolean;
  onInputChange: (field: string, value: string) => void;
  onBulkInputChange: (updates: Record<string, string>) => void;
  onSameAsPresentChange: (checked: boolean) => void;
}

const AddressInfoStep: React.FC<AddressInfoStepProps> = ({
  formData,
  errors,
  sameAsPresent,
  onInputChange,
  onBulkInputChange,
  onSameAsPresentChange,
}) => {
  // Effect to handle same as present address functionality
  useEffect(() => {
    if (sameAsPresent) {
      // Copy all present address fields to permanent address fields using bulk update
      onBulkInputChange({
        permanentHouse: formData.presentHouse,
        permanentRoad: formData.presentRoad,
        permanentPostCode: formData.presentPostCode,
        permanentAddress: formData.presentAddress,
        permanentCity: formData.presentCity,
        permanentDivision: formData.presentDivision,
      });
    } else {
      // Clear permanent address fields when checkbox is unchecked
      onBulkInputChange({
        permanentHouse: "",
        permanentRoad: "",
        permanentPostCode: "",
        permanentAddress: "",
        permanentCity: "",
        permanentDivision: "",
      });
    }
  }, [
    sameAsPresent,
    formData.presentHouse,
    formData.presentRoad,
    formData.presentPostCode,
    formData.presentAddress,
    formData.presentCity,
    formData.presentDivision,
    onBulkInputChange,
  ]);

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <MapPin className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-black">Address Information</h3>
      </div>

      {/* Present Address Form */}
      <div className="">
        <h4 className="text-xl font-semibold text-black mb-4 flex items-center">
          <MapPin className="w-5 h-5 text-green-500 mr-2" />
          Present Address
        </h4>

        <div className="grid md:grid-cols-2 gap-4">
          {/* House */}
          <div>
            <Label
              htmlFor="presentHouse"
              className="text-sm font-medium text-black"
            >
              House/Flat No.
            </Label>
            <Input
              id="presentHouse"
              type="text"
              value={formData.presentHouse}
              onChange={(e) => onInputChange("presentHouse", e.target.value)}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                errors.presentHouse
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="House/Flat number"
            />
            {errors.presentHouse && (
              <p className="text-red-500 text-sm mt-1">{errors.presentHouse}</p>
            )}
          </div>

          {/* Road */}
          <div>
            <Label
              htmlFor="presentRoad"
              className="text-sm font-medium text-black"
            >
              Road/Street
            </Label>
            <Input
              id="presentRoad"
              type="text"
              value={formData.presentRoad}
              onChange={(e) => onInputChange("presentRoad", e.target.value)}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                errors.presentRoad
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="Road/Street name"
            />
            {errors.presentRoad && (
              <p className="text-red-500 text-sm mt-1">{errors.presentRoad}</p>
            )}
          </div>

          {/* Post Code */}
          <div>
            <Label
              htmlFor="presentPostCode"
              className="text-sm font-medium text-black"
            >
              Post Code
            </Label>
            <Input
              id="presentPostCode"
              type="text"
              value={formData.presentPostCode}
              onChange={(e) => onInputChange("presentPostCode", e.target.value)}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                errors.presentPostCode
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="Post code"
            />
            {errors.presentPostCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.presentPostCode}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <Label
              htmlFor="presentCity"
              className="text-sm font-medium text-black"
            >
              City
            </Label>
            <Input
              id="presentCity"
              type="text"
              value={formData.presentCity}
              onChange={(e) => onInputChange("presentCity", e.target.value)}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                errors.presentCity
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="City"
            />
            {errors.presentCity && (
              <p className="text-red-500 text-sm mt-1">{errors.presentCity}</p>
            )}
          </div>
        </div>

        {/* Address and Division - Full Width */}
        <div className="mt-4 space-y-4">
          <div>
            <Label
              htmlFor="presentAddress"
              className="text-sm font-medium text-black"
            >
              Detailed Address
            </Label>
            <Input
              id="presentAddress"
              type="text"
              value={formData.presentAddress}
              onChange={(e) => onInputChange("presentAddress", e.target.value)}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                errors.presentAddress
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="Detailed address (Area, Landmark, etc.)"
            />
            {errors.presentAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.presentAddress}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="presentDivision"
              className="text-sm font-medium text-black"
            >
              Division
            </Label>
            <Input
              id="presentDivision"
              type="text"
              value={formData.presentDivision}
              onChange={(e) => onInputChange("presentDivision", e.target.value)}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                errors.presentDivision
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="Division"
            />
            {errors.presentDivision && (
              <p className="text-red-500 text-sm mt-1">
                {errors.presentDivision}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Permanent Address Form */}
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-black flex items-center">
            <MapPin className="w-5 h-5 text-blue-500 mr-2" />
            Permanent Address
          </h4>

          {/* Same as Present Address Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsPresent"
              checked={sameAsPresent}
              onCheckedChange={onSameAsPresentChange}
              className="border-2 border-gray-300"
            />
            <Label
              htmlFor="sameAsPresent"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Same as present address
            </Label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* House */}
          <div>
            <Label
              htmlFor="permanentHouse"
              className="text-sm font-medium text-black"
            >
              House/Flat No.
            </Label>
            <Input
              id="permanentHouse"
              type="text"
              value={formData.permanentHouse}
              onChange={(e) => onInputChange("permanentHouse", e.target.value)}
              disabled={sameAsPresent}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                sameAsPresent
                  ? "bg-gray-100 cursor-not-allowed"
                  : errors.permanentHouse
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="House/Flat number"
            />
            {errors.permanentHouse && !sameAsPresent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.permanentHouse}
              </p>
            )}
          </div>

          {/* Road */}
          <div>
            <Label
              htmlFor="permanentRoad"
              className="text-sm font-medium text-black"
            >
              Road/Street
            </Label>
            <Input
              id="permanentRoad"
              type="text"
              value={formData.permanentRoad}
              onChange={(e) => onInputChange("permanentRoad", e.target.value)}
              disabled={sameAsPresent}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                sameAsPresent
                  ? "bg-gray-100 cursor-not-allowed"
                  : errors.permanentRoad
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="Road/Street name"
            />
            {errors.permanentRoad && !sameAsPresent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.permanentRoad}
              </p>
            )}
          </div>

          {/* Post Code */}
          <div>
            <Label
              htmlFor="permanentPostCode"
              className="text-sm font-medium text-black"
            >
              Post Code
            </Label>
            <Input
              id="permanentPostCode"
              type="text"
              value={formData.permanentPostCode}
              onChange={(e) =>
                onInputChange("permanentPostCode", e.target.value)
              }
              disabled={sameAsPresent}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                sameAsPresent
                  ? "bg-gray-100 cursor-not-allowed"
                  : errors.permanentPostCode
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="Post code"
            />
            {errors.permanentPostCode && !sameAsPresent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.permanentPostCode}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <Label
              htmlFor="permanentCity"
              className="text-sm font-medium text-black"
            >
              City
            </Label>
            <Input
              id="permanentCity"
              type="text"
              value={formData.permanentCity}
              onChange={(e) => onInputChange("permanentCity", e.target.value)}
              disabled={sameAsPresent}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                sameAsPresent
                  ? "bg-gray-100 cursor-not-allowed"
                  : errors.permanentCity
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="City"
            />
            {errors.permanentCity && !sameAsPresent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.permanentCity}
              </p>
            )}
          </div>
        </div>

        {/* Address and Division - Full Width */}
        <div className="mt-4 space-y-4">
          <div>
            <Label
              htmlFor="permanentAddress"
              className="text-sm font-medium text-black"
            >
              Detailed Address
            </Label>
            <Input
              id="permanentAddress"
              type="text"
              value={formData.permanentAddress}
              onChange={(e) =>
                onInputChange("permanentAddress", e.target.value)
              }
              disabled={sameAsPresent}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                sameAsPresent
                  ? "bg-gray-100 cursor-not-allowed"
                  : errors.permanentAddress
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="Detailed address (Area, Landmark, etc.)"
            />
            {errors.permanentAddress && !sameAsPresent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.permanentAddress}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="permanentDivision"
              className="text-sm font-medium text-black"
            >
              Division
            </Label>
            <Input
              id="permanentDivision"
              type="text"
              value={formData.permanentDivision}
              onChange={(e) =>
                onInputChange("permanentDivision", e.target.value)
              }
              disabled={sameAsPresent}
              className={`mt-1 h-10 border-2 transition-colors duration-300 ${
                sameAsPresent
                  ? "bg-gray-100 cursor-not-allowed"
                  : errors.permanentDivision
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-200 focus:border-green-500"
              }`}
              placeholder="Division"
            />
            {errors.permanentDivision && !sameAsPresent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.permanentDivision}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressInfoStep;
