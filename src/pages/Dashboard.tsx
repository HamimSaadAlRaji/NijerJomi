import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, Shield, Activity } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Property Portfolio Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your blockchain-verified properties and track
                transactions
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Properties
                  </CardTitle>
                  <Shield className="h-4 w-4 text-property-verified" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Portfolio Value
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">৳8.2 Cr</div>
                  <p className="text-xs text-muted-foreground">
                    +15.2% increase
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Transactions
                  </CardTitle>
                  <Activity className="h-4 w-4 text-property-pending" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    2 pending approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Wallet Balance
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.45 ETH</div>
                  <p className="text-xs text-muted-foreground">
                    Available for transactions
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-4 p-4 border rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                        <div className="flex-1">
                          <h4 className="font-medium">Property #{4520 + i}</h4>
                          <p className="text-sm text-muted-foreground">
                            Dhaka, Bangladesh
                          </p>
                        </div>
                        <Badge className="bg-property-verified/10 text-property-verified border-property-verified/20">
                          Verified
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">Property Transfer</h4>
                          <p className="text-sm text-muted-foreground">
                            2 hours ago
                          </p>
                        </div>
                        <Badge variant="outline">Confirmed</Badge>
                      </div>
                    ))}
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

export default Dashboard;
