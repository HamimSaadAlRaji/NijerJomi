import { useState } from "react";
import { useWalletContext } from "@/contexts/WalletContext";
import NavbarLogo from "./Navbar/NavbarLogo";
import DesktopNavigation from "./Navbar/DesktopNavigation";
import NavbarActions from "./Navbar/NavbarActions";
import MobileMenuButton from "./Navbar/MobileMenuButton";
import MobileNavbar from "./Navbar/MobileNavbar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, user } = useWalletContext();

  // User is considered logged in if wallet is connected and user data exists
  const isLoggedIn = Boolean(isConnected && user);

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent mt-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavbarLogo />

          {/* Desktop Navigation */}
          <DesktopNavigation isLoggedIn={isLoggedIn} user={user} />

          {/* Action Buttons */}
          <NavbarActions isLoggedIn={isLoggedIn} user={user} />

          {/* Mobile menu button */}
          <MobileMenuButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        {/* Mobile Navigation */}
        <MobileNavbar
          isOpen={isOpen}
          isLoggedIn={isLoggedIn}
          user={user}
          setIsOpen={setIsOpen}
        />
      </div>
    </nav>
  );
};

export default Navbar;
