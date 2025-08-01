import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Map, Layers, Navigation } from "lucide-react";

const Maps = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <section className="py-20 bg-gradient-property">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Property Maps
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Interactive Property Maps
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore properties with GPS boundaries and satellite imagery
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-elevated p-8 mb-8">
              <div className="h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Map className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive Map Loading...</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Map className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Satellite View</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">High-resolution satellite imagery with property boundaries</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Layers className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Property Layers</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Toggle ownership, zoning, and dispute information</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Navigation className="w-8 h-8 text-property-verified mb-2" />
                  <CardTitle>GPS Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Precise GPS coordinates and boundary mapping</p>
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

export default Maps;