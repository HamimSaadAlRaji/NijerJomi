import React from "react";
import { User, MapPin, CheckCircle } from "lucide-react";

interface ReviewStepProps {
  formData: {
    fullName: string;
    phoneNumber: string;
    nidNumber: string;
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
  imagePreview: string | null;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, imagePreview }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <CheckCircle
          className="w-20 h-20 mx-auto mb-6"
          style={{ color: "#41ab5d" }}
        />
        <h3 className="text-3xl font-bold mb-2" style={{ color: "#293842" }}>
          Review Your Information
        </h3>
        <p className="text-lg" style={{ color: "#465465" }}>
          Please verify all details before submitting
        </p>
      </div>

      {/* Profile Image Review */}
      {imagePreview && (
        <div className="text-center mb-8">
          {imagePreview && (
            <div className="flex justify-center mb-4">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover border-4 shadow-lg"
                style={{ borderColor: "#41ab5d" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Information Cards */}
      <div className="space-y-6">
        {/* Personal Information Card */}
        <div
          className="p-6 rounded-xl border-l-4 shadow-lg"
          style={{ backgroundColor: "#f7fcf5", borderColor: "#41ab5d" }}
        >
          <div className="flex items-center mb-4">
            <User className="w-6 h-6 mr-3" style={{ color: "#41ab5d" }} />
            <h4 className="text-xl font-bold" style={{ color: "#293842" }}>
              Personal Information
            </h4>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Full Name
              </p>
              <p className="text-lg font-semibold text-black mt-1">
                {formData.fullName || "Not provided"}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Phone Number
              </p>
              <p className="text-lg font-semibold text-black mt-1">
                {formData.phoneNumber || "Not provided"}
              </p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg mt-4">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              National ID Number
            </p>
            <p className="text-lg font-semibold text-black mt-1">
              {formData.nidNumber || "Not provided"}
            </p>
          </div>
        </div>

        {/* Address Information Card */}
        <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-500 shadow-lg">
          <div className="flex items-center mb-4">
            <MapPin className="w-6 h-6 text-green-500 mr-3" />
            <h4 className="text-xl font-bold text-black">
              Address Information
            </h4>
          </div>

          {/* Present Address */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-green-600 mb-3">
              Present Address
            </h5>
            <div className="bg-white p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    House/Flat
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.presentHouse || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Road/Street
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.presentRoad || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Post Code
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.presentPostCode || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    City
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.presentCity || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Detailed Address
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.presentAddress || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Division
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.presentDivision || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Permanent Address */}
          <div>
            <h5 className="text-lg font-semibold text-green-600 mb-3">
              Permanent Address
            </h5>
            <div className="bg-white p-4 rounded-lg">
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    House/Flat
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.permanentHouse || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Road/Street
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.permanentRoad || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Post Code
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.permanentPostCode || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    City
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.permanentCity || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Detailed Address
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.permanentAddress || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Division
                  </p>
                  <p className="text-sm text-black mt-1">
                    {formData.permanentDivision || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Notice */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-yellow-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                Please ensure all information is accurate as it will be used for
                verification purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
