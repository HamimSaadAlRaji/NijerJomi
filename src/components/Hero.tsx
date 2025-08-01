import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Zap, Globe, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen  bg-gradient-property overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRBJeBmjJfiJHtmMbCa75N-h8Ot3RnqmhqHw&s"
          alt="Blockchain Land Registry"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 relative z-20 h-full">
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

            {/* Descriptive Text - Similar to Revolut's subtitle */}
            <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-lg">
              Home or away, local or global — register your land freely between
              blockchain and smart contracts. Sign up for secure, transparent
              ownership.
            </p>

            {/* Call to Action Button - Similar to "Download the app" */}
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-black hover:bg-black/90 text-white text-lg px-8 py-4 rounded-full font-medium"
              >
                Start Registration
              </Button>
            </div>
          </div>

          {/* Right Content - Phone/Card Mockup */}
          <div className="flex justify-start items-end h-full">
            <div className="relative">
              {/* Main Card Container - Made wider and taller with customization comments */}
              <div className="backdrop-blur-sm  border-l-[3px] border-r-[3px] border-t-[3px]  border-gray-300/90 rounded-t-3xl p-10 w-[500px] h-[70vh] relative flex flex-col justify-start">
                {/* 
                CARD SIZE CUSTOMIZATION:
                - Width: w-96 (384px) → w-[450px] (450px) → w-[500px] for even wider
                - Height: h-[60vh] (60% viewport) → h-[70vh] (70% viewport) → h-[80vh] for taller
                - Padding: p-10 (40px) → p-12 (48px) for more internal spacing
                
                OTHER WIDTH OPTIONS:
                - w-80 = 320px (smaller)
                - w-96 = 384px (default)
                - w-[450px] = 450px (current)
                - w-[500px] = 500px (wider)
                - w-[550px] = 550px (very wide)
                
                OTHER HEIGHT OPTIONS:
                - h-[60vh] = 60% of viewport height
                - h-[70vh] = 70% of viewport height (current)
                - h-[80vh] = 80% of viewport height
                - h-[500px] = fixed 500px height
                - h-[600px] = fixed 600px height
                */}

                {/* Header Section - Spacing adjusted for larger card */}
                <div className="text-center mb-12">
                  {/* 
                  HEADER SPACING CUSTOMIZATION:
                  - mb-10 → mb-12 for more space below header
                  - Change to mb-14 or mb-16 for even more space
                  */}
                  <p className="text-white/80 text-lg mb-4">Personal</p>
                  {/* 
                  TEXT SIZE CUSTOMIZATION:
                  - text-base → text-lg for subtitle
                  - mb-3 → mb-4 for more space below subtitle
                  */}
                  <h2 className="text-white text-6xl font-bold">৳6,012</h2>
                  {/* 
                  AMOUNT SIZE CUSTOMIZATION:
                  - text-5xl → text-6xl for bigger amount
                  - Change to text-7xl for even larger
                  */}
                </div>

                {/* Center Button - Adjusted for larger card */}
                <div className="flex justify-center mb-16">
                  {/* 
                  BUTTON SPACING CUSTOMIZATION:
                  - mb-12 → mb-16 for more space below button
                  - Change to mb-20 for even more space
                  */}
                  <Button
                    variant="outline"
                    className="bg-white text-black border-none rounded-full px-10 py-4 font-medium text-xl"
                  >
                    {/* 
                    BUTTON SIZE CUSTOMIZATION:
                    - px-8 py-3 → px-10 py-4 for bigger button
                    - text-lg → text-xl for larger button text
                    - Change to px-12 py-5 and text-2xl for even bigger
                    */}
                    Properties
                  </Button>
                </div>

                {/* Bottom Transaction Card - Adjusted for larger card */}
                <div className="mt-auto">
                  <div className="bg-white rounded-2xl p-8">
                    {/* 
                    TRANSACTION CARD CUSTOMIZATION:
                    - p-6 → p-8 for more padding inside transaction card
                    - Change to p-10 for even more padding
                    - rounded-2xl for current roundness, change to rounded-3xl for more round
                    */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-5">
                        {/* 
                        ICON SPACING CUSTOMIZATION:
                        - space-x-4 → space-x-5 for more space between icon and text
                        */}
                        {/* Icon Circle - Made bigger for larger card */}
                        <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                          {/* 
                          ICON SIZE CUSTOMIZATION:
                          - w-12 h-12 → w-14 h-14 for bigger icon circle
                          - w-6 h-6 → w-7 h-7 for bigger icon inside
                          */}
                          <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-xl">
                            {/* 
                            TEXT SIZE CUSTOMIZATION:
                            - text-lg → text-xl for bigger transaction title
                            */}
                            Land Registry
                          </p>
                          <p className="text-lg text-gray-500">
                            {/* 
                            SUBTITLE SIZE CUSTOMIZATION:
                            - text-base → text-lg for bigger time subtitle
                            */}
                            Today, 11:28
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600 text-2xl">
                        {/* 
                        AMOUNT SIZE CUSTOMIZATION:
                        - text-xl → text-2xl for bigger transaction amount
                        */}
                        +৳2,550
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements - Adjusted for card position */}
              {/* <div className="absolute -top-6 -right-8 w-10 h-10 bg-white/20 rounded-lg animate-float"></div>
              <div
                className="absolute top-20 -left-6 w-8 h-8 bg-white/15 rounded-lg animate-float"
                style={{ animationDelay: "1s" }}
              ></div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
