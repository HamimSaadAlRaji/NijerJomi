import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Gavel, DollarSign } from "lucide-react";

const Government = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <section className="py-20 bg-gradient-property">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Government Portal
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Government Officials Dashboard
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Manage property registrations, approvals, and legal compliance
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Shield className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Registrar Portal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Approve property registrations and verifications</p>
                  <Button variant="outline" className="w-full">Access Portal</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <FileCheck className="w-8 h-8 text-property-verified mb-2" />
                  <CardTitle>Document Validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Validate legal documents and certificates</p>
                  <Button variant="outline" className="w-full">Validate Docs</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Gavel className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Court Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Manage disputes and legal proceedings</p>
                  <Button variant="outline" className="w-full">Court Portal</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <DollarSign className="w-8 h-8 text-property-pending mb-2" />
                  <CardTitle>Tax Authority</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Property tax calculation and collection</p>
                  <Button variant="outline" className="w-full">Tax Portal</Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Property Registration #{1000 + i}</h4>
                          <p className="text-sm text-muted-foreground">Submitted 2 days ago</p>
                        </div>
                        <Badge className="bg-property-pending/10 text-property-pending border-property-pending/20">
                          Pending
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <span className="font-medium">Total Registered Properties</span>
                      <span className="text-primary font-bold">15,847</span>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <span className="font-medium">Pending Approvals</span>
                      <span className="text-property-pending font-bold">234</span>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <span className="font-medium">Revenue Collected</span>
                      <span className="text-accent font-bold">৳12.4 Cr</span>
                    </div>
                  </div>
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

export default Government;