import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, MapPin, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import heroHighway from '@/assets/hero-highway.jpg';

const Home: React.FC = () => {
  const features = [
    {
      icon: MapPin,
      title: 'Distance-Based Tolling',
      description: 'Pay only for the distance you actually travel on Tamil Nadu highways',
    },
    {
      icon: Shield,
      title: 'Transparent & Fair',
      description: 'No more overpaying for short trips through toll booths',
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Real-time GPS tracking with automatic toll calculation',
    },
  ];

  const benefits = [
    'Save up to 40% on highway tolls',
    'No waiting at toll booths',
    'Accurate distance-based billing',
    'Real-time trip tracking',
    'Secure digital payments',
    'Government-approved system',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroHighway})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Pay Only for the
            <span className="block bg-clip-text ">
              Distance You Drive
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
            Revolutionary distance-based tolling system that saves money and eliminates unfair charges on Tamil Nadu highways
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose FairDrive?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of highway tolling with our advanced distance-based system
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-smooth">
                <CardContent className="p-8 text-center">
                  <div className="gradient-primary p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Start Saving Money Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of drivers across Tamil Nadu who are already saving money with our fair, distance-based tolling system.
              </p>
              
              <div className="grid gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button variant="accent" size="lg" asChild>
                <Link to="/register">
                  Create Your Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-center mb-6">Comparison</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-destructive/10 rounded-lg">
                      <span className="font-medium">Traditional Toll</span>
                      <span className="text-xl font-bold text-destructive">₹150</span>
                    </div>
                    <div className="text-center py-2">
                      <span className="text-muted-foreground">vs</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-success/10 rounded-lg">
                      <span className="font-medium">FairDrive (12 km)</span>
                      <span className="text-xl font-bold text-success">₹90</span>
                    </div>
                    <div className="text-center pt-4">
                      <span className="text-lg font-semibold text-success">Save ₹60 per trip!</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Highway Travel?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join FairDrive today and start experiencing fair, distance-based tolling on Tamil Nadu highways.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/register">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;