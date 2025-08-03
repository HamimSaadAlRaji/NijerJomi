import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
// Import the image
import heroImage from "@/assets/Hero_Image.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Blockchain Land Registry"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 h-full">
        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
          {/* Left Content - Text Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight tracking-tight">
                SECURE THE
                <br />
                WAY YOU <br />
                <span className="text-white">OWN LAND</span>
              </h1>
            </div>

            {/* Descriptive Text */}
            <div className="relative">
              <div className="absolute inset-0 "></div>
              <p className="text-xl lg:text-xl text-white leading-relaxed max-w-lg relative z-10 p-4">
                Experience the future of property ownership with our
                blockchain-powered land registry. Secure, transparent, and
                accessible from anywhere in the world.
              </p>
            </div>

            {/* Call to Action Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4 rounded-full font-medium"
              >
                Connect Wallet
              </Button>
            </div>
          </div>

          {/* Right Content - Card Mockup */}
          <div className="flex justify-start items-end h-full">
            <div className="relative">
              {/* Main Card Container */}
              <div className="backdrop-blur-sm border-l-[3px] border-r-[3px] border-t-[3px] border-white/30 rounded-t-3xl p-10 w-[500px] h-[70vh] relative flex flex-col justify-start bg-white/10">
                {/* Header Section */}
                <div className="text-center mb-12">
                  <p className="text-white/80 text-lg mb-4">Land Registry</p>
                  <h2 className="text-white text-6xl font-bold">150</h2>
                  <p className="text-white/60 text-sm">Properties Verified</p>
                </div>

                {/* Center Button */}
                <div className="flex justify-center mb-16">
                  <Button
                    size="lg"
                    className="bg-white text-black border-none rounded-full px-10 py-4 font-medium text-xl hover:bg-white/90"
                  >
                    View Properties
                  </Button>
                </div>

                {/* Bottom Transaction Card */}
                <div className="mt-auto">
                  <div className="bg-white rounded-2xl p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        {/* Icon Circle */}
                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                          <Shield className="w-7 h-7 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-xl">
                            Property Verified
                          </p>
                          <p className="text-lg text-muted-foreground">
                            Today, 11:28
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600 text-2xl">
                        Verified ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-8 w-10 h-10 bg-white/20 rounded-lg animate-float"></div>
              <div
                className="absolute top-20 -left-6 w-8 h-8 bg-white/15 rounded-lg animate-float"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
