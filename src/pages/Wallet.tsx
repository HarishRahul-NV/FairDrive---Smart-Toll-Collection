import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  CreditCard, 
  Smartphone, 
  Plus, 
  ArrowUpDown, 
  Settings,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Wallet: React.FC = () => {
  const { toast } = useToast();
  const [walletBalance, setWalletBalance] = useState(850);
  const [autoTopup, setAutoTopup] = useState(true);
  const [isAddingMoney, setIsAddingMoney] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const quickAmounts = ['100', '500', '1000', '2000', '5000'];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay using UPI apps' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Secure card payment' },
  ];

  const transactions = [
    {
      id: 1,
      type: 'toll',
      amount: -120,
      description: 'Chennai to Salem - NH-44',
      timestamp: '2024-01-15 16:45:00',
      status: 'completed',
      route: 'Chennai to Salem',
    },
    {
      id: 2,
      type: 'topup',
      amount: 1000,
      description: 'Wallet Top-up - UPI',
      timestamp: '2024-01-15 14:30:00',
      status: 'completed',
      transactionId: 'TXN202401151430',
    },
    {
      id: 3,
      type: 'toll',
      amount: -85,
      description: 'Madurai to Trichy - NH-38',
      timestamp: '2024-01-12 18:20:00',
      status: 'completed',
      route: 'Madurai to Trichy',
    },
    {
      id: 4,
      type: 'toll',
      amount: -140,
      description: 'Coimbatore to Chennai - NH-44',
      timestamp: '2024-01-10 12:15:00',
      status: 'completed',
      route: 'Coimbatore to Chennai',
    },
    {
      id: 5,
      type: 'topup',
      amount: 500,
      description: 'Auto Top-up - Card',
      timestamp: '2024-01-08 10:00:00',
      status: 'completed',
      transactionId: 'TXN202401081000',
    },
  ];

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount('');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'toll':
        return <ArrowUpDown className="h-4 w-4 text-destructive" />;
      case 'topup':
        return <Plus className="h-4 w-4 text-success" />;
      default:
        return <WalletIcon className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-success"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleAddMoney = () => {
    const amount = selectedAmount || customAmount;
    const numericAmount = parseFloat(amount);

    if (!amount || numericAmount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount greater than 0.',
        variant: 'destructive',
      });
      return;
    }

    if (numericAmount < 10) {
      toast({
        title: 'Minimum Amount',
        description: 'Minimum top-up amount is ₹10.',
        variant: 'destructive',
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: 'Payment Method Required',
        description: 'Please select a payment method.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      setWalletBalance(prev => prev + numericAmount);
      setIsAddingMoney(false);
      setSelectedAmount('');
      setCustomAmount('');
      setPaymentMethod('');
      
      toast({
        title: 'Money Added Successfully!',
        description: `₹${numericAmount} has been added to your wallet.`,
      });
    }, 2000);

    toast({
      title: 'Processing Payment',
      description: 'Please wait while we process your payment...',
    });
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Wallet & Payments</h1>
          <p className="text-muted-foreground">
            Manage your FairDrive wallet and payment methods
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Wallet Balance */}
            <Card className="shadow-lg gradient-primary text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Total Wallet Balance</p>
                    <p className="text-4xl font-bold">₹{walletBalance.toLocaleString()}</p>
                    <p className="text-white/60 text-sm mt-2">Available for toll payments</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-full">
                    <WalletIcon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setIsAddingMoney(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Money
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add Money Section */}
            {isAddingMoney && (
              <Card className="shadow-lg border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-accent" />
                    Add Money to Wallet
                  </CardTitle>
                  <CardDescription>
                    Choose an amount and payment method to top up your wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Quick Amount Selection */}
                  <div className="space-y-3">
                    <Label>Select Amount</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {quickAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          onClick={() => handleAmountSelect(amount)}
                        >
                          ₹{amount}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="customAmount">Or Enter Custom Amount</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder="Enter amount (minimum ₹10)"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <Label>Payment Method</Label>
                    <div className="grid gap-3">
                      {paymentMethods.map((method) => (
                        <Card 
                          key={method.id}
                          className={`cursor-pointer transition-colors ${
                            paymentMethod === method.id 
                              ? 'bg-primary/5 border-primary' 
                              : 'hover:bg-muted/30'
                          }`}
                          onClick={() => setPaymentMethod(method.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <method.icon className="h-6 w-6 text-primary" />
                              <div className="flex-1">
                                <p className="font-medium">{method.name}</p>
                                <p className="text-sm text-muted-foreground">{method.description}</p>
                              </div>
                              <div className={`w-4 h-4 rounded-full border-2 ${
                                paymentMethod === method.id 
                                  ? 'bg-primary border-primary' 
                                  : 'border-muted-foreground'
                              }`}>
                                {paymentMethod === method.id && (
                                  <CheckCircle className="h-4 w-4 text-white -m-px" />
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <Button 
                      variant="accent" 
                      onClick={handleAddMoney}
                      className="flex-1"
                    >
                      Add Money
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingMoney(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction History */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent wallet transactions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Download Statement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{new Date(transaction.timestamp).toLocaleString()}</span>
                            {transaction.transactionId && (
                              <span>ID: {transaction.transactionId}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.amount > 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Auto Top-up Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Auto Top-up
                </CardTitle>
                <CardDescription>
                  Automatically add money when balance is low
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Auto Top-up</p>
                    <p className="text-sm text-muted-foreground">
                      When balance ≤ ₹100
                    </p>
                  </div>
                  <Switch 
                    checked={autoTopup} 
                    onCheckedChange={setAutoTopup}
                  />
                </div>
                
                {autoTopup && (
                  <div className="space-y-3 pt-3 border-t border-border">
                    <div className="space-y-2">
                      <Label>Top-up Amount</Label>
                      <Select defaultValue="500">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500">₹500</SelectItem>
                          <SelectItem value="1000">₹1000</SelectItem>
                          <SelectItem value="2000">₹2000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select defaultValue="upi">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Money Added</span>
                  <span className="font-medium text-success">+₹1,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Toll Payments</span>
                  <span className="font-medium text-destructive">-₹345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transactions</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-sm font-medium">Net Balance Change</span>
                  <span className="font-bold text-success">+₹1,155</span>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Payment Issues
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Refund Requests
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;