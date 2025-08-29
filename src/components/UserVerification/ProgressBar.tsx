import React from "react";

interface ProgressBarProps {
  steps: Array<{
    title: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  index <= currentStep
                    ? "text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
                style={
                  index <= currentStep ? { backgroundColor: "#006d2c" } : {}
                }
              >
                <Icon className="w-6 h-6" />
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  index <= currentStep ? "" : "text-gray-400"
                }`}
                style={index <= currentStep ? { color: "#006d2c" } : {}}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full"
          style={{
            backgroundColor: "#006d2c",
            width: `${((currentStep + 1) / steps.length) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
