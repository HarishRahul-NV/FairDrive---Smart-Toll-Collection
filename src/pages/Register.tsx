import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    aadhaarId: '',
    email: '',
    mobile: '',
    licenseId: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    // Full name validation
    if (formData.fullName.length < 2) {
      toast({
        title: 'Invalid Name',
        description: 'Full name must be at least 2 characters long.',
        variant: 'destructive',
      });
      return false;
    }

    // Username validation
    if (formData.username.length < 3) {
      toast({
        title: 'Invalid Username',
        description: 'Username must be at least 3 characters long.',
        variant: 'destructive',
      });
      return false;
    }

    // Aadhaar validation (12 digits)
    if (!/^\d{12}$/.test(formData.aadhaarId)) {
      toast({
        title: 'Invalid Aadhaar',
        description: 'Aadhaar ID must be exactly 12 digits.',
        variant: 'destructive',
      });
      return false;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return false;
    }

    // Mobile validation (10 digits)
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast({
        title: 'Invalid Mobile',
        description: 'Mobile number must be exactly 10 digits.',
        variant: 'destructive',
      });
      return false;
    }

    // License validation (TN format)
    if (!/^TN\d{2}\s\d{4}\d{7}$/.test(formData.licenseId)) {
      toast({
        title: 'Invalid License',
        description: 'License ID must be in format: TN45 2024XXXXXXX',
        variant: 'destructive',
      });
      return false;
    }

    // Password validation
    if (formData.password.length < 8) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return false;
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Password and confirm password do not match.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { confirmPassword, ...userData } = formData;
    const success = await register(userData);
    
    if (success) {
      toast({
        title: 'Account Created!',
        description: 'Your FairDrive account has been created successfully.',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Registration Failed',
        description: 'Username already exists. Please choose a different username.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="gradient-primary p-3 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Car className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Join FairDrive</h1>
          <p className="text-muted-foreground">Create your account and start saving</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in your details to register with FairDrive
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaarId">Aadhaar ID</Label>
                <Input
                  id="aadhaarId"
                  name="aadhaarId"
                  type="text"
                  placeholder="12-digit Aadhaar number"
                  value={formData.aadhaarId}
                  onChange={handleChange}
                  maxLength={12}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email ID</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="text"
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseId">License ID</Label>
                <Input
                  id="licenseId"
                  name="licenseId"
                  type="text"
                  placeholder="TN45 2024XXXXXXX"
                  value={formData.licenseId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={isLoading}
                variant="accent"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in here
                  </Link>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;