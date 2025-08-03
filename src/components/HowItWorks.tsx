import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Shield, Zap, ArrowRight, CheckCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: FileText,
    title: "Register Property",
    description:
      "Submit property documents, GPS coordinates, and legal verification for blockchain registration.",
    details: [
      "Upload legal documents",
      "GPS boundary mapping",
      "Identity verification",
      "Document authentication",
    ],
    color: "text-primary",
  },
  {
    id: 2,
    icon: Shield,
    title: "Tokenize as NFT",
    description:
      "Property gets converted into a unique NFT with immutable blockchain records and smart contract integration.",
    details: [
      "NFT minting process",
      "Smart contract creation",
      "Metadata generation",
      "Blockchain confirmation",
    ],
    color: "text-accent",
  },
  {
    id: 3,
    icon: CheckCircle,
    title: "Government Verification",
    description:
      "Multi-party approval from registrar, tax authority, and legal officials ensures complete compliance.",
    details: [
      "Registrar approval",
      "Tax compliance check",
      "Legal verification",
      "Final authentication",
    ],
    color: "text-property-verified",
  },
  {
    id: 4,
    icon: Zap,
    title: "Secure Transfer",
    description:
      "Instant, transparent, and corruption-free property transfers through automated smart contracts.",
    details: [
      "Smart contract execution",
      "Automated escrow",
      "Multi-signature security",
      "Instant settlement",
    ],
    color: "text-property-pending",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            How It Works
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            4-Step Blockchain Property Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From traditional paper records to blockchain-secured NFT ownership.
            Experience the future of property registration with complete
            transparency and zero corruption.
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="flex justify-between items-center">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 flex items-center justify-center"
                >
                  <ArrowRight className="w-8 h-8 text-primary/30" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <Card
                key={step.id}
                className="relative bg-card border-border hover:shadow-elevated transition-all duration-500 animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.id}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-xl bg-gray-100 flex items-center justify-center shadow-property`}
                  >
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-2">
                    {step.details.map((detail, i) => (
                      <div
                        key={i}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${step.color.replace(
                            "text-",
                            "bg-"
                          )} mr-3`}
                        ></div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Blockchain Network Visualization */}
        <div className="mt-20 relative">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Blockchain Network Confirmation
            </h3>
            <p className="text-muted-foreground">
              Every transaction is recorded on the blockchain with multiple
              confirmations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:shadow-property transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-property-verified/10 rounded-lg flex items-center justify-center mx-auto mb-4 animate-blockchain-pulse">
                  <CheckCircle className="w-6 h-6 text-property-verified" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  6+ Confirmations
                </h4>
                <p className="text-muted-foreground text-sm">
                  Multiple blockchain confirmations ensure transaction
                  immutability
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-property transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div
                  className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4 animate-blockchain-pulse"
                  style={{ animationDelay: "0.5s" }}
                >
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  Smart Contract Security
                </h4>
                <p className="text-muted-foreground text-sm">
                  Automated execution with multi-party verification requirements
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-property transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div
                  className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 animate-blockchain-pulse"
                  style={{ animationDelay: "1s" }}
                >
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">
                  Instant Settlement
                </h4>
                <p className="text-muted-foreground text-sm">
                  Real-time property transfers with immediate ownership update
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
