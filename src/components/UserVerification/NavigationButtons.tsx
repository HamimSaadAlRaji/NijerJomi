import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrevStep,
  onNextStep,
  onSubmit,
}) => {
  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
      <Button
        onClick={onPrevStep}
        disabled={currentStep === 0}
        variant="outline"
        className="px-8 py-3 text-lg border-2 border-gray-300 hover:border-black transition-colors duration-300 disabled:opacity-50"
      >
        Previous
      </Button>

      {currentStep < totalSteps - 1 ? (
        <Button
          onClick={onNextStep}
          className="px-8 py-3 text-lg bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
        >
          Next
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 text-lg bg-black hover:bg-gray-800 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            "Submit Verification"
          )}
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;
