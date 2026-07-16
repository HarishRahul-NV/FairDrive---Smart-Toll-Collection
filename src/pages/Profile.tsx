import React, { useState } from 'react';
import { User, Mail, Phone, CreditCard, FileText, Edit3, Save, X, Shield, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.mobile) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    // Mobile validation
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast({
        title: 'Invalid Mobile',
        description: 'Mobile number must be exactly 10 digits.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been successfully updated.',
      });
    }, 1000);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: 'Weak Password',
        description: 'New password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirm password do not match.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast({
        title: 'Password Changed',
        description: 'Your password has been successfully updated.',
      });
    }, 1000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
    });
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Profile & Settings</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={handleEditProfile}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                        maxLength={10}
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <Button variant="default" onClick={handleSaveProfile}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{user?.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Username</p>
                        <p className="font-medium">{user?.username}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mobile Number</p>
                        <p className="font-medium">{user?.mobile}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Aadhaar ID</p>
                        <p className="font-medium">{user?.aadhaarId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">License ID</p>
                        <p className="font-medium">{user?.licenseId}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isChangingPassword ? (
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-muted-foreground">
                          Last changed 30 days ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsChangingPassword(true)}>
                      Change Password
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 border border-border rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button variant="default" onClick={handleChangePassword}>
                        Update Password
                      </Button>
                      <Button variant="outline" onClick={handleCancelPasswordChange}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Status</span>
                  <Badge variant="default" className="bg-success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verification</span>
                  <Badge variant="default" className="bg-success">Verified</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Member Since</span>
                  <span className="text-sm font-medium">Jan 2024</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Profile Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Preferences
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Update Contact Info
                </Button>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="destructive" size="sm" className="w-full" onClick={logout}>
                  Sign Out
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Deactivate Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;