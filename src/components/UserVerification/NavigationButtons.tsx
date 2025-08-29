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
    <div
      className="flex justify-between mt-8 pt-6 border-t"
      style={{ borderColor: "#c7e9c0" }}
    >
      <Button
        onClick={onPrevStep}
        disabled={currentStep === 0}
        variant="outline"
        className="px-8 py-3 text-lg border-2 hover:bg-green-50 transition-colors duration-300 disabled:opacity-50"
        style={{
          borderColor: "#a1d99b",
          color: "#293842",
        }}
        onMouseEnter={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.borderColor = "#41ab5d";
          }
        }}
        onMouseLeave={(e) => {
          if (!e.currentTarget.disabled) {
            e.currentTarget.style.borderColor = "#a1d99b";
          }
        }}
      >
        Previous
      </Button>

      {currentStep < totalSteps - 1 ? (
        <Button
          onClick={onNextStep}
          className="px-8 py-3 text-lg text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg"
          style={{ backgroundColor: "#006d2c" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#005a24";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#006d2c";
          }}
        >
          Next
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 text-lg text-white transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50"
          style={{ backgroundColor: "#293842" }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = "#1f2937";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.backgroundColor = "#293842";
            }
          }}
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
