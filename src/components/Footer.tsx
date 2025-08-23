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
    <footer className="bg-background text-foreground border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">nijerJomi</h3>
            <p className="text-gray-600 leading-relaxed">
              Revolutionizing property ownership through secure blockchain
              technology. Transparent, immutable, and accessible land registry
              for everyone.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-3">
              <Link
                to="/properties"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                to="/register"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Register Property
              </Link>
              <Link
                to="/verify"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Verify Ownership
              </Link>
              <Link
                to="/transfer"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Transfer Property
              </Link>
              <Link
                to="/maps"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Property Maps
              </Link>
            </div>
          </div>

          {/* Government */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Government Portal</h4>
            <div className="space-y-3">
              <Link
                to="/government"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Registrar Portal
              </Link>
              <Link
                to="/admin"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/analytics"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                System Analytics
              </Link>
              <Link
                to="/documents"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Legal Documents
              </Link>
              <Link
                to="/support"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Support Center
              </Link>
            </div>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Stay Connected</h4>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@nijerjomi.gov.bd</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+880-1XXXX-XXXXX</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Get updates on new features and blockchain improvements
              </p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Your email"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © 2025 nijerJomi Bangladesh. All rights reserved. | Powered by
              Blockchain Technology
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/security"
                className="text-muted-foreground hover:text-foreground transition-colors"
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
