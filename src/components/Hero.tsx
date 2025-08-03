import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="src/assets/pexels-akos-szabo-145938-440731 (1).jpg"
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
                SECURE THE WAY
                <br />
                YOU <br />
                <span className="text-white">OWN LAND</span>
              </h1>
            </div>

            {/* Descriptive Text */}
            <div className="relative">
              <div className="absolute inset-0 backdrop-blur-sm rounded-lg -m-4"></div>
              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-lg relative z-10 p-4">
                Home or away, local or global — register your land freely
                between blockchain and smart contracts. Sign up for secure,
                transparent ownership.
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
                  <p className="text-white/80 text-lg mb-4">Personal</p>
                  <h2 className="text-white text-6xl font-bold">৳6,012</h2>
                </div>

                {/* Center Button */}
                <div className="flex justify-center mb-16">
                  <Button
                    size="lg"
                    className="bg-white text-black border-none rounded-full px-10 py-4 font-medium text-xl hover:bg-white/90"
                  >
                    Properties
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
                            Land Registry
                          </p>
                          <p className="text-lg text-muted-foreground">
                            Today, 11:28
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-success-foreground text-2xl">
                        +৳2,550
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
