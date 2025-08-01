import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface PersonalInfoStepProps {
  formData: {
    fullName: string;
    phoneNumber: string;
    nidNumber: string;
    image: File | null;
  };
  imagePreview: string | null;
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  imagePreview,
  errors,
  onInputChange,
  onImageUpload,
}) => {
  return (
    <div className="space-y-6">
      `{/* Image Upload */}
      <div className="text-center">
        <Label className="text-lg font-semibold text-black mb-4 block">
          Profile Image
        </Label>
        <div className="relative inline-block">
          <div
            className={`w-32 h-32 border-4 border-dashed border-green-500 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:border-green-600 ${
              imagePreview ? "border-solid" : ""
            }`}
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Upload className="w-8 h-8 text-green-500" />
            )}
          </div>
          <input
            id="image-upload"
            type="file"
            accept=".jpeg,.jpg,.png,.heic,image/jpeg,image/jpg,image/png,image/heic"
            onChange={onImageUpload}
            className="hidden"
          />
        </div>
        {errors.image && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {errors.image}
          </p>
        )}
        <p className="text-gray-500 text-sm mt-2 text-center">
          Supported formats: JPEG, JPG, PNG, HEIC (Max 2MB)
        </p>
      </div>
      {/* Personal Information Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="">
          <Label
            htmlFor="fullName"
            className="text-lg font-semibold text-black"
          >
            Full Name
          </Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => onInputChange("fullName", e.target.value)}
            className={`mt-2 h-12 text-lg border-2 transition-colors duration-300 ${
              errors.fullName
                ? "border-red-500 focus:border-red-500"
                : "border-gray-200 focus:border-green-500"
            }`}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="">
          <Label
            htmlFor="phoneNumber"
            className="text-lg font-semibold text-black"
          >
            Phone Number
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => onInputChange("phoneNumber", e.target.value)}
            className={`mt-2 h-12 text-lg border-2 transition-colors duration-300 ${
              errors.phoneNumber
                ? "border-red-500 focus:border-red-500"
                : "border-gray-200 focus:border-green-500"
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </div>
      {/* NID Number - Full Width */}
      <div className="">
        <Label htmlFor="nidNumber" className="text-lg font-semibold text-black">
          National ID Number
        </Label>
        <Input
          id="nidNumber"
          type="text"
          value={formData.nidNumber}
          onChange={(e) => onInputChange("nidNumber", e.target.value)}
          className={`mt-2 h-12 text-lg border-2 transition-colors duration-300 ${
            errors.nidNumber
              ? "border-red-500 focus:border-red-500"
              : "border-gray-200 focus:border-green-500"
          }`}
          placeholder="Enter your NID number"
        />
        {errors.nidNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.nidNumber}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoStep;
