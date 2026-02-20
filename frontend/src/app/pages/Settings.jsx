import { useState, useEffect } from "react";
import { User, Bell, Lock, CreditCard, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useAuthStore } from "../../store/useAuthStore";

export function Settings() {
  const { user } = useAuthStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  
  // Split full name into first and last name
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  
  useEffect(() => {
    if (user) {
      // Split fullName into first and last name
      const nameParts = user.fullName?.split(' ') || [];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(' ') || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
    }
  }, [user]);
  
  // Get initials for avatar
  const getInitials = () => {
    if (!user?.fullName) return "U";
    const names = user.fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <div className="p-8" style={{ fontFamily: 'var(--font-family)' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="max-w-4xl">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="w-4 h-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Profile Information</h2>
            
            <div className="space-y-5">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-semibold">
                  {getInitials()}
                </div>
                <div>
                  <Button variant="outline" size="sm" className="mr-2">
                    Change Photo
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="bg-input-background border-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="bg-input-background border-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-input-background border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="bg-input-background border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  className="bg-input-background border-input"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-primary hover:bg-primary/90">Save Changes</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Notification Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <h3 className="font-medium text-foreground">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive email updates about your account</p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <h3 className="font-medium text-foreground">Weekly Resume Report</h3>
                  <p className="text-sm text-muted-foreground">Get weekly insights on your resume performance</p>
                </div>
                <Switch
                  checked={weeklyReport}
                  onCheckedChange={setWeeklyReport}
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <h3 className="font-medium text-foreground">Product Updates</h3>
                  <p className="text-sm text-muted-foreground">News about new features and improvements</p>
                </div>
                <Switch
                  checked={productUpdates}
                  onCheckedChange={setProductUpdates}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-medium text-foreground">Job Match Alerts</h3>
                  <p className="text-sm text-muted-foreground">Get notified when new job matches are found</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Security Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      className="bg-input-background border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-input-background border-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-input-background border-input"
                    />
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Update Password</Button>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-medium text-foreground mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account
                </p>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <div className="space-y-6">
            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Current Plan</h2>
              
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Professional Plan</h3>
                    <p className="text-muted-foreground">Unlimited resume analysis and templates</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-semibold text-foreground">$29</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">Manage Subscription</Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-foreground">Plan Features</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Unlimited resume analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Access to all templates
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    AI-powered cover letter generation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    Priority support
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Payment Method</h2>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-lg mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-primary/10 rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">•••• •••• •••• 4242</div>
                    <div className="text-sm text-muted-foreground">Expires 12/2025</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>

              <Button variant="outline">Add Payment Method</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
