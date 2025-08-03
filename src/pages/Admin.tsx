import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Users,
  Activity,
  Database,
  BarChart,
  Shield,
} from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Admin Panel
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                System Administration
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Manage the blockchain land registry platform and monitor system
                health
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,547</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Transactions
                  </CardTitle>
                  <Activity className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,341</div>
                  <p className="text-xs text-muted-foreground">
                    Real-time processing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    System Health
                  </CardTitle>
                  <Database className="h-4 w-4 text-property-verified" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.9%</div>
                  <p className="text-xs text-muted-foreground">
                    Uptime this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                  <BarChart className="h-4 w-4 text-property-pending" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">৳15.2 Cr</div>
                  <p className="text-xs text-muted-foreground">This quarter</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Manage user accounts and permissions
                  </p>
                  <Button variant="outline" className="w-full">
                    Manage Users
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Settings className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>System Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Configure blockchain and platform settings
                  </p>
                  <Button variant="outline" className="w-full">
                    Configure
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Shield className="w-8 h-8 text-property-verified mb-2" />
                  <CardTitle>Security Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Monitor security and audit logs
                  </p>
                  <Button variant="outline" className="w-full">
                    Security
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Activity className="w-8 h-8 text-property-pending mb-2" />
                  <CardTitle>Transaction Monitor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Monitor blockchain transactions
                  </p>
                  <Button variant="outline" className="w-full">
                    Monitor
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <BarChart className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    View detailed system analytics
                  </p>
                  <Button variant="outline" className="w-full">
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Database className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Database Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Manage database and backups
                  </p>
                  <Button variant="outline" className="w-full">
                    Database
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Property Registration Approved",
                      time: "2 minutes ago",
                      status: "success",
                    },
                    {
                      action: "New User Registration",
                      time: "5 minutes ago",
                      status: "info",
                    },
                    {
                      action: "Smart Contract Deployment",
                      time: "10 minutes ago",
                      status: "success",
                    },
                    {
                      action: "System Backup Completed",
                      time: "1 hour ago",
                      status: "success",
                    },
                  ].map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{activity.action}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                      <Badge
                        className={
                          activity.status === "success"
                            ? "bg-property-verified/10 text-property-verified border-property-verified/20"
                            : "bg-primary/10 text-primary border-primary/20"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
