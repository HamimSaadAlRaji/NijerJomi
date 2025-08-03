import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, Shield, Zap } from "lucide-react";

const Register = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Property Registration
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Register Your Property on Blockchain
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Convert your traditional property documents into secure,
                blockchain-verified NFTs
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Step 1: Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Upload property papers and legal documents
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <MapPin className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Step 2: Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    GPS mapping and boundary verification
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Shield className="w-8 h-8 text-property-verified mb-2" />
                  <CardTitle>Step 3: Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Government approval and validation
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Zap className="w-8 h-8 text-property-pending mb-2" />
                  <CardTitle>Step 4: Tokenization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    NFT minting and blockchain registration
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white"
              >
                Start Registration Process
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
