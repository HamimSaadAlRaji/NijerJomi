import React from "react";
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDarkTheme?: boolean;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  setIsOpen,
  isDarkTheme = false,
}) => {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={`md:hidden p-2 transition-colors ${
        isDarkTheme
          ? "text-black hover:text-gray-600"
          : "text-white hover:text-gray-300"
      }`}
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
};

export default MobileMenuButton;
