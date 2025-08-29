import React from "react";
import { Link } from "react-router-dom";

interface NavbarLogoProps {
  isDarkTheme?: boolean;
}

const NavbarLogo: React.FC<NavbarLogoProps> = ({ isDarkTheme = false }) => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
    >
      <div className="h-full w-auto flex items-center justify-center">
          <img
            src={"/NijerJomi_white.png"}
            alt="NijerJomi Logo"
          />
      </div>
    </Link>
  );
};

export default NavbarLogo;
