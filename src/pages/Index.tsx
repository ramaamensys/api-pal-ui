import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Calendar, Users, Clock, ArrowRight, Heart, Shield, Star } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: "Easy Scheduling",
      description: "Book appointments with available doctors or request custom time slots"
    },
    {
      icon: Users,
      title: "Find Specialists", 
      description: "Search doctors by specialization, location, and availability"
    },
    {
      icon: Clock,
      title: "Flexible Booking",
      description: "Choose from available slots or request on-demand appointments"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your health information is protected and appointments are confirmed instantly"
    }
  ];

  const stats = [
    { icon: Stethoscope, value: "500+", label: "Qualified Doctors" },
    { icon: Calendar, value: "10K+", label: "Appointments Booked" },
    { icon: Star, value: "4.9/5", label: "Patient Rating" },
    { icon: Heart, value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-primary-foreground/10 rounded-full">
                  <Stethoscope className="h-10 w-10" />
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                  HealthCare
                  <span className="bg-primary-foreground/20 px-2 rounded-lg ml-2">Connect</span>
                </h1>
              </div>
              
              <p className="text-xl lg:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                Find qualified healthcare professionals and book appointments instantly. 
                Your health journey starts with a simple click.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                asChild
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg font-semibold px-8"
              >
                <Link to="/doctors" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Browse Doctors
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                asChild
                className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8"
              >
                <Link to="/doctor/login" className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Doctor Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose HealthCare Connect?
            </h2>
            <p className="text-lg text-muted-foreground">
              We make healthcare accessible with modern technology and a patient-first approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 shadow-soft border-0 bg-gradient-card hover:shadow-medical transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Join thousands of patients who trust HealthCare Connect for their medical needs
            </p>
            <Button 
              size="xl" 
              variant="secondary"
              onClick={() => navigate('/doctors')}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-elevated"
            >
              <Stethoscope className="h-5 w-5 mr-2" />
              Get Started Today
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}