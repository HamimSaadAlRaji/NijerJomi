import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, BookOpen, Video, Mail } from "lucide-react";

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20">
        <section className="py-20 bg-gradient-property">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
                Support Center
              </Badge>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                How Can We Help You?
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get assistance with blockchain property registration and platform usage
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <MessageCircle className="w-8 h-8 text-primary mb-2" />
                  <CardTitle>Live Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Get instant help from our support team</p>
                  <Button variant="outline" className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <BookOpen className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Browse comprehensive guides and FAQs</p>
                  <Button variant="outline" className="w-full">View Docs</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Video className="w-8 h-8 text-property-verified mb-2" />
                  <CardTitle>Video Tutorials</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Watch step-by-step video guides</p>
                  <Button variant="outline" className="w-full">Watch Videos</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-elevated transition-all duration-300">
                <CardHeader>
                  <Mail className="w-8 h-8 text-property-pending mb-2" />
                  <CardTitle>Email Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">Send detailed questions via email</p>
                  <Button variant="outline" className="w-full">Send Email</Button>
                </CardContent>
              </Card>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="shadow-elevated">
                <CardHeader>
                  <CardTitle className="text-center">Contact Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Name</label>
                      <Input placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Email</label>
                      <Input placeholder="your.email@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Subject</label>
                    <Input placeholder="Brief description of your issue" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Message</label>
                    <Textarea placeholder="Describe your issue in detail..." rows={5} />
                  </div>
                  <Button className="w-full bg-gradient-hero hover:opacity-90">
                    Send Message
                  </Button>
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

export default Support;