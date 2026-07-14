import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  User, Bell, Palette, Shield, Save, CheckCircle, 
  Moon, Sun, Trash2, Mail
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../hooks/useToast';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
  const [loading, setLoading] = useState(false);
  
  // Update tab if navigation state changes
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Profile Form State
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    college: user?.college || '',
    bio: user?.bio || '',
    rollNumber: user?.rollNumber || '',
    branch: user?.branch || '',
    year: user?.year || ''
  });

  // Update form data when user loads
  useEffect(() => {
    if (user) {
        setFormData({
            username: user.username || '',
            email: user.email || '',
            college: user.college || '',
            bio: user.bio || '',
            rollNumber: user.rollNumber || '',
            branch: user.branch || '',
            year: user.year || ''
        });
    }
  }, [user]);

  // --- THE FIX: REAL BACKEND UPDATE ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
        // 1. Call the real update function from AuthContext
        const result = await updateProfile(formData);

        if (result.success) {
            toast({ 
                title: "Profile Updated", 
                description: "Your changes have been saved successfully.", 
                variant: "success" 
            });
        } else {
            toast({ 
                title: "Update Failed", 
                description: result.error || "Could not save changes.", 
                variant: "destructive" 
            });
        }
    } catch (error) {
        toast({ 
            title: "Error", 
            description: "Something went wrong. Please try again.", 
            variant: "destructive" 
        });
    } finally {
        setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and customize your experience.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <Card className="glass-dark border-0 h-fit lg:w-64 shrink-0 overflow-hidden sticky top-24">
            <div className="p-2 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-primary/10 text-primary shadow-sm' 
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* PROFILE SETTINGS */}
            {activeTab === 'profile' && (
              <Card className="glass-dark border-0">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your public profile information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      {/* You can add an Avatar upload button here later if backend supports file upload */}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input 
                          value={formData.username} 
                          onChange={(e) => setFormData({...formData, username: e.target.value})} 
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>College</Label>
                        <Input 
                          value={formData.college} 
                          onChange={(e) => setFormData({...formData, college: e.target.value})}
                          placeholder="e.g. IIT Bombay"
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Branch</Label>
                        <Input 
                          value={formData.branch} 
                          onChange={(e) => setFormData({...formData, branch: e.target.value})}
                          placeholder="e.g. Computer Science"
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input 
                          value={formData.year} 
                          onChange={(e) => setFormData({...formData, year: e.target.value})}
                          placeholder="e.g. 3rd Year"
                          className="bg-white/5 border-white/10"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label>Email</Label>
                        <div className="relative">
                           <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                           <Input 
                             value={formData.email} 
                             disabled 
                             className="pl-9 bg-white/5 border-white/10 opacity-60 cursor-not-allowed" 
                           />
                        </div>
                        <p className="text-xs text-muted-foreground">Email cannot be changed directly.</p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Bio</Label>
                        <textarea 
                          className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Tell us a little about yourself"
                          value={formData.bio}
                          onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                        {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* APPEARANCE SETTINGS */}
            {activeTab === 'appearance' && (
              <Card className="glass-dark border-0">
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the interface theme.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Light Mode Option */}
                    <div 
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-white/5 ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-transparent bg-white/5'}`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="mb-3 rounded-lg bg-[#f0f0f0] p-2 aspect-video flex items-center justify-center">
                        <Sun className="h-8 w-8 text-orange-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Light</span>
                        {theme === 'light' && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                    </div>

                    {/* Dark Mode Option */}
                    <div 
                      className={`cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-white/5 ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-transparent bg-white/5'}`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="mb-3 rounded-lg bg-[#1a1a1a] p-2 aspect-video flex items-center justify-center">
                        <Moon className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Dark</span>
                        {theme === 'dark' && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* NOTIFICATIONS - Visual Only for now */}
            {activeTab === 'notifications' && (
              <Card className="glass-dark border-0">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Manage your email preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {[
                    { title: "Weekly Progress Report", desc: "Get a summary of your coding activity every Monday." },
                    { title: "New Feature Announcements", desc: "Be the first to know about new platform features." },
                    { title: "Security Alerts", desc: "Get notified about important security updates." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <div className="flex items-center h-6">
                         <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary/20 transition-colors duration-200 ease-in-out hover:bg-primary/30">
                            <span className="pointer-events-none translate-x-5 inline-block h-5 w-5 transform rounded-full bg-primary shadow ring-0 transition duration-200 ease-in-out" />
                         </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* ACCOUNT SETTINGS - Danger Zone */}
            {activeTab === 'account' && (
              <Card className="glass-dark border-0 border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="text-red-500">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div>
                      <h4 className="font-medium text-red-200">Delete Account</h4>
                      <p className="text-sm text-red-300/70">Permanently remove your account and all data.</p>
                    </div>
                    <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;