import React from "react";
import { Link } from "react-router-dom";

const NavbarLogo: React.FC = () => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
    >
      <div>
        <h1 className="text-4xl font-roboto text-white">terraTrust</h1>
      </div>
    </Link>
  );
};

export default NavbarLogo;
