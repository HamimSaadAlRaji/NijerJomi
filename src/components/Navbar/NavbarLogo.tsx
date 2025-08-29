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
      <div>
        <h1
          className={`text-4xl font-roboto ${
            isDarkTheme
              ? "bg-gradient-to-r from-[#006d2c] via-[#186733] to-[#74c476] bg-clip-text text-transparent"
              : "text-white"
          }`}
        >
          nijerJomi
        </h1>
      </div>
    </Link>
  );
};

export default NavbarLogo;
