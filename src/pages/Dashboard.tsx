import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  MapPin, 
  Wallet, 
  TrendingUp, 
  Bell, 
  Navigation, 
  Clock, 
  IndianRupee,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const stats = {
    totalSaved: 2450,
    thisMonth: 380,
    tripsCount: 15,
    walletBalance: 850,
  };

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Trip Completed',
      message: 'Chennai to Salem - ₹120 charged (Saved ₹45)',
      time: '2 minutes ago',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Low Wallet Balance',
      message: 'Your wallet balance is below ₹100',
      time: '1 hour ago',
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'New toll rates updated for NH-44',
      time: '3 hours ago',
    },
  ];

  const currentTrip = {
    isActive: true,
    route: 'Chennai to Coimbatore',
    distance: 78.5,
    estimatedToll: 95,
    entryTime: '14:30',
    currentLocation: 'Near Krishnagiri',
  };

  const recentTrips = [
    {
      id: 1,
      date: '2024-01-15',
      route: 'Chennai to Salem',
      distance: 65.2,
      tollCharged: 120,
      savedAmount: 45,
      duration: '1h 45m',
    },
    {
      id: 2,
      date: '2024-01-12',
      route: 'Madurai to Trichy',
      distance: 42.8,
      tollCharged: 85,
      savedAmount: 30,
      duration: '1h 15m',
    },
    {
      id: 3,
      date: '2024-01-10',
      route: 'Coimbatore to Chennai',
      distance: 89.3,
      tollCharged: 140,
      savedAmount: 55,
      duration: '2h 30m',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-accent" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-muted-foreground">
            Here's your FairDrive dashboard with all your travel insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Saved</p>
                  <p className="text-2xl font-bold text-success">₹{stats.totalSaved}</p>
                </div>
                <div className="gradient-primary p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">₹{stats.thisMonth}</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-full">
                  <IndianRupee className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Trips</p>
                  <p className="text-2xl font-bold text-foreground">{stats.tripsCount}</p>
                </div>
                <div className="bg-muted p-3 rounded-full">
                  <Car className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                  <p className="text-2xl font-bold text-primary">₹{stats.walletBalance}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Trip */}
            {currentTrip.isActive && (
              <Card className="shadow-lg border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Navigation className="h-5 w-5 text-accent" />
                        Current Trip
                      </CardTitle>
                      <CardDescription>{currentTrip.route}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-accent/10 text-accent">
                      In Progress
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Distance Covered</span>
                        <span className="font-medium">{currentTrip.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Toll</span>
                        <span className="font-medium text-primary">₹{currentTrip.estimatedToll}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Entry Time</span>
                        <span className="font-medium">{currentTrip.entryTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Location</span>
                        <span className="font-medium">{currentTrip.currentLocation}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/tracking">
                        <MapPin className="h-4 w-4 mr-2" />
                        View Live Tracking
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Trips */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Trips</CardTitle>
                    <CardDescription>Your latest highway journeys</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/trips">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{trip.route}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {trip.duration}
                          </span>
                          <span>{trip.distance} km</span>
                          <span>{trip.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{trip.tollCharged}</p>
                        <p className="text-sm text-success">Saved ₹{trip.savedAmount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View All Notifications
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="default" size="sm" className="w-full justify-start" asChild>
                  <Link to="/vehicles">
                    <Car className="h-4 w-4 mr-2" />
                    Manage Vehicles
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                  <Link to="/wallet">
                    <Wallet className="h-4 w-4 mr-2" />
                    Add Money to Wallet
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to="/tracking">
                    <MapPin className="h-4 w-4 mr-2" />
                    GPS Tracking
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;