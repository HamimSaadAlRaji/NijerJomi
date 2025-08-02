import React from "react";
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  setIsOpen,
}) => {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
    >
      {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
    </button>
  );
};

export default MobileMenuButton;
