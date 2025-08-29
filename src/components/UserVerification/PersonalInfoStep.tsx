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
        <Label
          className="text-lg font-semibold mb-4 block"
          style={{ color: "#293842" }}
        >
          Profile Image
        </Label>
        <div className="relative inline-block">
          <div
            className={`w-32 h-32 border-4 border-dashed rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 ${
              imagePreview ? "border-solid" : ""
            }`}
            style={{
              borderColor: imagePreview ? "#006d2c" : "#41ab5d",
            }}
            onMouseEnter={(e) => {
              if (!imagePreview) {
                e.currentTarget.style.borderColor = "#006d2c";
              }
            }}
            onMouseLeave={(e) => {
              if (!imagePreview) {
                e.currentTarget.style.borderColor = "#41ab5d";
              }
            }}
            onClick={() => document.getElementById("image-upload")?.click()}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Upload className="w-8 h-8" style={{ color: "#41ab5d" }} />
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
        <p className="text-sm mt-2 text-center" style={{ color: "#465465" }}>
          Supported formats: JPEG, JPG, PNG, HEIC (Max 2MB)
        </p>
      </div>
      {/* Personal Information Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="">
          <Label
            htmlFor="fullName"
            className="text-lg font-semibold"
            style={{ color: "#293842" }}
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
                : "focus:border-green-600"
            }`}
            style={{
              borderColor: errors.fullName ? "#dc2626" : "#a1d99b",
            }}
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
            className="text-lg font-semibold"
            style={{ color: "#293842" }}
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
                : "focus:border-green-600"
            }`}
            style={{
              borderColor: errors.phoneNumber ? "#dc2626" : "#a1d99b",
            }}
            placeholder="Enter your phone number"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </div>
      {/* NID Number - Full Width */}
      <div className="">
        <Label
          htmlFor="nidNumber"
          className="text-lg font-semibold"
          style={{ color: "#293842" }}
        >
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
              : "focus:border-green-600"
          }`}
          style={{
            borderColor: errors.nidNumber ? "#dc2626" : "#a1d99b",
          }}
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
