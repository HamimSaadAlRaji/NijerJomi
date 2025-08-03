import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Filter, Grid, List, MapPin, Eye, Shield } from "lucide-react";

const Properties = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Header */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Blockchain Property Listings
              </h1>
              <p className="text-xl text-muted-foreground">
                Browse verified properties tokenized as NFTs on the blockchain
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex bg-card rounded-xl border border-border shadow-property p-2">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-muted-foreground mr-3" />
                  <Input
                    placeholder="Search by location, property type, or ID..."
                    className="border-0 bg-transparent focus-visible:ring-0"
                  />
                </div>
                <Button className="bg-black hover:bg-gray-800 text-white">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Badge variant="secondary">Residential</Badge>
                <Badge variant="secondary">Commercial</Badge>
                <Badge variant="secondary">Agricultural</Badge>
                <Badge className="bg-property-verified/10 text-property-verified border-property-verified/20">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified Only
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing 1,247 verified properties
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <Card
                  key={i}
                  className="hover:shadow-elevated transition-all duration-300"
                >
                  <CardHeader className="p-0">
                    <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                      <div className="absolute inset-0 bg-black/5"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-property-verified/10 text-property-verified border-property-verified/20">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-black/60 text-white border-0">
                          NFT #{4520 + i}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-black/60 text-white px-2 py-1 rounded text-sm">
                        <Eye className="w-3 h-3" />
                        <span>{Math.floor(Math.random() * 500) + 100}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <Badge variant="secondary" className="mb-3">
                      Residential
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Modern Apartment in Gulshan
                    </h3>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">Gulshan, Dhaka</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xl font-bold text-primary">
                          ৳1,80,00,000
                        </div>
                        <div className="text-sm text-muted-foreground">
                          1,800 sq ft
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Properties
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
