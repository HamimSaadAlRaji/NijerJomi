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

      <div className="container mx-auto px-4 relative z-20 h-full pt-20">
        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
          {/* Left Content - Text Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight tracking-tight">
                SECURE THE WAY YOU
                <br />
                <span className="text-white ">OWN LAND</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg text-white/80 leading-relaxed max-w-lg">
              Protect what you own, your land, your future
            </p>

            {/* Blockchain Powered Badge */}
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 w-fit">
              <div className="w-5 h-5 bg-green-400 rounded-lg flex items-center justify-center">
                <Shield className="w-3 h-3 text-white" />
              </div>
              <span className="text-white text-sm font-medium">
                Blockchain Powered
              </span>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-2 max-w-lg">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-[16px] font-medium">
                  Immutable Records
                </span>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-[16px] font-medium">
                  Transparent Ownership
                </span>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-[16px] font-medium">
                  Global Access
                </span>
              </div>
              <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white text-[16px] font-medium">
                  Fraud Protection
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-left">
                <div className="text-xl font-bold text-white">99.9%</div>
                <div className="text-white text-xs">Uptime</div>
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white">150+</div>
                <div className="text-white text-xs">Properties</div>
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white">24/7</div>
                <div className="text-white text-xs">Support</div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                className="bg-green-900 hover:bg-green-600 text-white text-xl px-12 py-8 rounded-3xl font-medium"
              >
                Connect Wallet
              </Button>
              <Button
                size="sm"
                className="border border-white/30 bg-transparent hover:bg-white/10 text-white text-sm px-5 py-2 rounded-xl font-medium"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Content - Card Mockup */}
          <div className="flex justify-start items-end h-full -mt-48">
            <div className="relative">
              {/* Main Card Container */}
              <div className="backdrop-blur-sm border border-white/30 rounded-3xl p-10 w-[500px] h-[70vh] relative flex flex-col justify-center bg-white/10">
                {/* Header Section */}
                <div className="text-center mb-12">
                  <p className="font-extrabold text-white text-6xl mb-4">
                    Land Registry
                  </p>
                  <h2 className="text-white text-6xl font-bold">150</h2>
                  <p className="text-white/60 text-sm">Properties Verified</p>
                </div>

                {/* Bottom Transaction Card */}
                <div className="flex justify-center -mt-8">
                  <div className="bg-white rounded-2xl p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        {/* Icon Circle */}
                        <div className="w-14 h-14 bg-sky-400 rounded-full flex items-center justify-center">
                          <Shield className="w-7 h-7 text-white" />
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
                      <div className="flex items-center">
                        <span className="font-bold text-green-600 text-2xl">
                          Verified✓
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Button */}
                <div className="flex justify-center mt-16">
                  <Button
                    size="lg"
                    className="bg-white text-black border-none rounded-full px-10 py-4 font-medium text-xl hover:bg-white/90"
                  >
                    View Properties
                  </Button>
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
