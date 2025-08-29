import { Link } from "react-router-dom";
import {
  Shield,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-[#e5f5e0] text-[#006d2c] border-t border-[#c7e9c0]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#006d2c]">nijerJomi</h3>
            <p className="text-[#238b45] leading-relaxed">
              Revolutionizing property ownership through secure blockchain
              technology. Transparent, immutable, and accessible land registry
              for everyone.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-[#41ab5d] hover:text-[#006d2c] cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-[#41ab5d] hover:text-[#006d2c] cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-[#41ab5d] hover:text-[#006d2c] cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-[#41ab5d] hover:text-[#006d2c] cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[#006d2c]">
              Quick Links
            </h4>
            <div className="space-y-3">
              <Link
                to="/properties"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                to="/register"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Register Property
              </Link>
              <Link
                to="/verify"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Verify Ownership
              </Link>
              <Link
                to="/transfer"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Transfer Property
              </Link>
              <Link
                to="/maps"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Property Maps
              </Link>
            </div>
          </div>

          {/* Government */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[#006d2c]">
              Government Portal
            </h4>
            <div className="space-y-3">
              <Link
                to="/government"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Registrar Portal
              </Link>
              <Link
                to="/admin"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/analytics"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                System Analytics
              </Link>
              <Link
                to="/documents"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Legal Documents
              </Link>
              <Link
                to="/support"
                className="block text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Support Center
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-[#006d2c]">
              Stay Connected
            </h4>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-[#238b45]">
                <Mail className="w-4 h-4" />
                <span>support@nijerjomi.gov.bd</span>
              </div>
              <div className="flex items-center space-x-3 text-[#238b45]">
                <Phone className="w-4 h-4" />
                <span>+880-1XXXX-XXXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-[#238b45]">
                <MapPin className="w-4 h-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-[#41ab5d]">
                Get updates on new features and blockchain improvements
              </p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Your email"
                  className="bg-[#f7fcf5] border-[#c7e9c0] text-[#006d2c] placeholder:text-[#41ab5d]"
                />
                <Button className="bg-[#238b45] hover:bg-[#006d2c] text-white">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#c7e9c0] mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-[#41ab5d] text-sm">
              © 2025 nijerJomi Bangladesh. All rights reserved. | Powered by
              Blockchain Technology
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/security"
                className="text-[#238b45] hover:text-[#006d2c] transition-colors"
              >
                Security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
