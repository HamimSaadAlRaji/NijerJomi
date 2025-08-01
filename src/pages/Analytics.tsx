import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart, PieChart, Activity } from "lucide-react";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <section className="py-20 bg-gradient-property">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Market Analytics
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Real Estate Market Insights
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive analytics powered by blockchain transparency
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Market Value</CardTitle>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">৳2,847 Cr</div>
                  <p className="text-xs text-muted-foreground">+18.5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Properties Registered</CardTitle>
                  <BarChart className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15,847</div>
                  <p className="text-xs text-muted-foreground">+241 this week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-property-pending" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,341</div>
                  <p className="text-xs text-muted-foreground">Real-time blockchain data</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Property Value</CardTitle>
                  <PieChart className="h-4 w-4 text-property-verified" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">৳1.8 Cr</div>
                  <p className="text-xs text-muted-foreground">National average</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Price Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Price trend chart visualization</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-card rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Regional map visualization</p>
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

export default Analytics;