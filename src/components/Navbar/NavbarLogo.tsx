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
          NijerJomi
        </h1>
        <p
          className={`text-xs tracking-widest font-semibold uppercase drop-shadow-sm letter-motto mt-0 ${
            isDarkTheme
              ? "bg-gradient-to-r from-[#006d2c] via-[#186733] to-[#74c476] bg-clip-text text-transparent"
              : "text-white"
          }`}
          style={{
            letterSpacing: "0.05em",
            fontFamily: "Roboto, sans-serif",
            marginTop: 0,
          }}
        >
          LAND REGISTRY
        </p>
      </div>
    </Link>
  );
};

export default NavbarLogo;
