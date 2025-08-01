import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, CheckCircle } from "lucide-react";

const Verify = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <section className="py-20 bg-gradient-property">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Property Verification
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Verify Property Authenticity
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Check ownership, legal status, and blockchain verification of any property
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
              <Card className="shadow-elevated">
                <CardHeader>
                  <CardTitle className="text-center">Property Verification Portal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Property ID or Address</label>
                      <Input placeholder="Enter property ID, address, or NFT token ID" />
                    </div>
                    <Button className="w-full bg-gradient-hero hover:opacity-90">
                      <Search className="w-4 h-4 mr-2" />
                      Verify Property
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Shield className="w-8 h-8 text-property-verified mb-2" />
                  <CardTitle>Ownership Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Verify current owner and ownership history</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <CheckCircle className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Legal Status Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Check legal compliance and dispute history</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Search className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Blockchain Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Verify blockchain records and NFT authenticity</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Verify;