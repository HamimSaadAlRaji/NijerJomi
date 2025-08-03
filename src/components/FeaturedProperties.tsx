import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  MapPin,
  Eye,
  Shield,
  Zap,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import propertyNft from "@/assets/property-nft.png";

const properties = [
  {
    id: "0x1a2b3c4d",
    title: "Modern Villa in Dhanmondi",
    location: "Dhanmondi, Dhaka",
    price: "৳2,50,00,000",
    size: "2,400 sq ft",
    status: "verified",
    nftId: "#4521",
    views: 234,
    image: propertyNft,
    type: "Residential",
  },
  {
    id: "0x2b3c4d5e",
    title: "Agricultural Land in Sylhet",
    location: "Sylhet Division",
    price: "৳75,00,000",
    size: "5.2 acres",
    status: "pending",
    nftId: "#4522",
    views: 156,
    image: propertyNft,
    type: "Agricultural",
  },
  {
    id: "0x3c4d5e6f",
    title: "Commercial Plot in Chittagong",
    location: "Chittagong Port Area",
    price: "৳4,20,00,000",
    size: "8,000 sq ft",
    status: "verified",
    nftId: "#4523",
    views: 389,
    image: propertyNft,
    type: "Commercial",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-property-verified text-property-verified-foreground border-property-verified/20">
          <Shield className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-property-pending text-property-pending-foreground border-property-pending/20">
          <Zap className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-property-approved text-property-approved-foreground border-property-approved/20">
          <Shield className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "disputed":
      return (
        <Badge className="bg-property-disputed text-property-disputed-foreground border-property-disputed/20">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Disputed
        </Badge>
      );
    default:
      return null;
  }
};

const FeaturedProperties = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Featured Properties
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Recently Tokenized Properties
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore blockchain-verified properties with complete transparency
            and secure ownership through NFT tokenization.
          </p>
        </div>

        {/* Property Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.map((property, index) => (
            <Card
              key={property.id}
              className="group hover:shadow-elevated transition-all duration-500 border-border bg-card animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(property.status)}
                  </div>

                  {/* NFT ID */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-black/60 text-white border-0 animate-nft-glow">
                      NFT {property.nftId}
                    </Badge>
                  </div>

                  {/* Views */}
                  <div className="absolute bottom-4 right-4 flex items-center space-x-1 bg-black/60 text-white px-2 py-1 rounded text-sm">
                    <Eye className="w-3 h-3" />
                    <span>{property.views}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Property Type */}
                  <Badge variant="secondary" className="text-xs">
                    {property.type}
                  </Badge>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  {/* Details */}
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {property.price}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {property.size}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Contract ID
                      </div>
                      <div className="text-sm font-mono text-foreground">
                        {property.id}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <div className="flex space-x-3 w-full">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                    View NFT
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Action Section */}
        <div className="text-center">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-property transition-all duration-300">
              <div className="w-12 h-12 bg-property-verified/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-property-verified" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Recently Tokenized
              </h3>
              <p className="text-muted-foreground text-sm">
                Latest properties converted to NFTs on the blockchain
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-property transition-all duration-300">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Available for Transfer
              </h3>
              <p className="text-muted-foreground text-sm">
                Properties ready for immediate blockchain transfer
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border hover:shadow-property transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Verified Properties
              </h3>
              <p className="text-muted-foreground text-sm">
                Government-verified with complete legal compliance
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8"
          >
            View All Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
