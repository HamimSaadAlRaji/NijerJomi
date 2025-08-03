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
            isDarkTheme ? "text-black" : "text-white"
          }`}
        >
          terraTrust
        </h1>
      </div>
    </Link>
  );
};

export default NavbarLogo;
