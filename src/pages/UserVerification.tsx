import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, CheckCircle } from "lucide-react";
import { useWalletContext } from "@/contexts/WalletContext";
import { walletAPI } from "@/services/walletAPI";
import { mapEnumToBackendRole } from "@/lib/roleUtils";

// User Verification Components
import BackgroundImage from "@/components/UserVerification/BackgroundImage";
import HeaderSection from "@/components/UserVerification/HeaderSection";
import ProgressBar from "@/components/UserVerification/ProgressBar";
import PersonalInfoStep from "@/components/UserVerification/PersonalInfoStep";
import AddressInfoStep from "@/components/UserVerification/AddressInfoStep";
import ReviewStep from "@/components/UserVerification/ReviewStep";
import NavigationButtons from "@/components/UserVerification/NavigationButtons";
import SuccessModal from "@/components/UserVerification/SuccessModal";

const UserVerification = () => {
  const { walletAddress, isConnected, web3State } = useWalletContext();

  // Redirect or show error if wallet is not connected
  if (!isConnected || !walletAddress) {
    return (
      <BackgroundImage>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="bg-white border-2 border-gray-100 shadow-2xl max-w-md mx-4">
            <CardHeader className="bg-red-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl text-center">
                Wallet Not Connected
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Please connect your wallet to access the user verification
                process.
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Go to Home
              </button>
            </CardContent>
          </Card>
        </div>
      </BackgroundImage>
    );
  }

  const [formData, setFormData] = useState({
    image: null,
    fullName: "",
    nidNumber: "",
    phoneNumber: "",
    // Present Address
    presentHouse: "",
    presentRoad: "",
    presentPostCode: "",
    presentAddress: "",
    presentCity: "",
    presentDivision: "",
    // Permanent Address
    permanentHouse: "",
    permanentRoad: "",
    permanentPostCode: "",
    permanentAddress: "",
    permanentCity: "",
    permanentDivision: "",
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sameAsPresent, setSameAsPresent] = useState(false);

  const steps = [
    { title: "Personal Info", icon: User },
    { title: "Address Info", icon: MapPin },
    { title: "Review & Submit", icon: CheckCircle },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clear previous errors
      setErrors((prev) => ({ ...prev, image: "" }));

      // Check file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/heic",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image format (JPEG, JPG, PNG, or HEIC)",
        }));
        return;
      }

      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 2MB",
        }));
        return;
      }

      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBulkInputChange = (updates: Record<string, string>) => {
    setFormData((prevData) => ({ ...prevData, ...updates }));
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      // Validate Personal Info step
      if (!formData.image) {
        newErrors.image = "Please upload a profile image";
      }
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      }
      if (!formData.nidNumber.trim()) {
        newErrors.nidNumber = "National ID number is required";
      }
    } else if (currentStep === 1) {
      // Validate Address Info step
      if (!formData.presentHouse.trim()) {
        newErrors.presentHouse = "Present house is required";
      }
      if (!formData.presentRoad.trim()) {
        newErrors.presentRoad = "Present road is required";
      }
      if (!formData.presentPostCode.trim()) {
        newErrors.presentPostCode = "Present post code is required";
      }
      if (!formData.presentAddress.trim()) {
        newErrors.presentAddress = "Present address is required";
      }
      if (!formData.presentCity.trim()) {
        newErrors.presentCity = "Present city is required";
      }
      if (!formData.presentDivision.trim()) {
        newErrors.presentDivision = "Present division is required";
      }

      // Validate permanent address only if not same as present
      if (!sameAsPresent) {
        if (!formData.permanentHouse.trim()) {
          newErrors.permanentHouse = "Permanent house is required";
        }
        if (!formData.permanentRoad.trim()) {
          newErrors.permanentRoad = "Permanent road is required";
        }
        if (!formData.permanentPostCode.trim()) {
          newErrors.permanentPostCode = "Permanent post code is required";
        }
        if (!formData.permanentAddress.trim()) {
          newErrors.permanentAddress = "Permanent address is required";
        }
        if (!formData.permanentCity.trim()) {
          newErrors.permanentCity = "Permanent city is required";
        }
        if (!formData.permanentDivision.trim()) {
          newErrors.permanentDivision = "Permanent division is required";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    // Check if wallet is connected
    if (!isConnected || !walletAddress) {
      alert("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert image to base64 if exists
      let profilePictureBase64 = null;
      if (formData.image) {
        profilePictureBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(formData.image);
        });
      }

      // Prepare JSON data for submission (not FormData) - using actual wallet address
      const submitData = {
        walletAddress: walletAddress,
        fullName: formData.fullName,
        nidNumber: formData.nidNumber,
        phoneNumber: formData.phoneNumber,
        presentAddress: `${formData.presentHouse}, ${formData.presentRoad}, ${formData.presentAddress}, ${formData.presentCity}, ${formData.presentPostCode}, ${formData.presentDivision}`,
        permanentAddress: sameAsPresent
          ? `${formData.presentHouse}, ${formData.presentRoad}, ${formData.presentAddress}, ${formData.presentCity}, ${formData.presentPostCode}, ${formData.presentDivision}`
          : `${formData.permanentHouse}, ${formData.permanentRoad}, ${formData.permanentAddress}, ${formData.permanentCity}, ${formData.permanentPostCode}, ${formData.permanentDivision}`,
        profilePicture: profilePictureBase64,
        userRole: mapEnumToBackendRole(web3State.role), // Include role from blockchain as string
      };

      console.log("Submitting registration data:", submitData);

      // Submit to backend using walletAPI
      const result = await walletAPI.register(submitData);

      if (result.success) {
        setShowSuccessModal(true);
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Registration failed: ${error.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BackgroundImage>
      {/* Header Section */}
      <HeaderSection
        title="User Verification"
        subtitle={`Complete your profile to access secure land registry services\nWallet: ${walletAddress?.slice(
          0,
          6
        )}...${walletAddress?.slice(-4)}`}
      />

      {/* Progress Bar */}
      <ProgressBar steps={steps} currentStep={currentStep} />

      {/* Main Form Card */}
      <Card className="bg-white border-2 border-gray-100 shadow-2xl">
        `
        <CardHeader className="bg-black text-white rounded-t-lg">
          <CardTitle className="text-2xl text-center">
            Step {currentStep + 1}: {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="min-h-[400px]">
            {/* Step 0: Personal Info */}
            {currentStep === 0 && (
              <PersonalInfoStep
                formData={formData}
                imagePreview={imagePreview}
                errors={errors}
                onInputChange={handleInputChange}
                onImageUpload={handleImageUpload}
              />
            )}

            {/* Step 1: Address Information */}
            {currentStep === 1 && (
              <AddressInfoStep
                formData={formData}
                errors={errors}
                sameAsPresent={sameAsPresent}
                onInputChange={handleInputChange}
                onBulkInputChange={handleBulkInputChange}
                onSameAsPresentChange={setSameAsPresent}
              />
            )}

            {/* Step 2: Review & Submit */}
            {currentStep === 2 && (
              <ReviewStep formData={formData} imagePreview={imagePreview} />
            )}
          </div>

          {/* Navigation Buttons */}
          <NavigationButtons
            currentStep={currentStep}
            totalSteps={steps.length}
            isSubmitting={isSubmitting}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        walletAddress={walletAddress}
        onDashboardClick={() => {
          // Navigate to dashboard - you can replace this with your routing logic
          window.location.href = "/dashboard";
        }}
      />
    </BackgroundImage>
  );
};

export default UserVerification;
