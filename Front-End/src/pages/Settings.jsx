import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  User, Bell, Palette, Shield, Save, CheckCircle, 
  Moon, Sun, Trash2, Mail, Camera, Upload, Lock, Key, Eye, EyeOff, Loader2, Sparkles, AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../hooks/useToast';
import { getFullAvatarUrl } from '../services/apiService';

const PRESET_AVATARS = [
  { id: 'bot-1', label: 'Cyber Bot', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=rankquest_cyber' },
  { id: 'bot-2', label: 'Matrix', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=coder_matrix' },
  { id: 'bot-3', label: 'Quantum', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=quantum_dev' },
  { id: 'adv-1', label: 'Hero', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=dev_hero' },
  { id: 'adv-2', label: 'Architect', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=tech_lead' },
  { id: 'lor-1', label: 'Master', url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=algo_coder' },
];

const Settings = () => {
  const { user, updateProfile, uploadAvatar, changePassword } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const location = useLocation();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
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
    year: user?.year || '',
    avatarUrl: user?.avatarUrl || ''
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
            year: user.year || '',
            avatarUrl: user.avatarUrl || ''
        });
    }
  }, [user]);

  // Handle avatar image file upload
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ 
        title: "Invalid File Type", 
        description: "Please select an image file (PNG, JPG, WEBP, GIF).", 
        variant: "destructive" 
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: "File Too Large", 
        description: "Image size must be less than 5MB.", 
        variant: "destructive" 
      });
      return;
    }

    setUploadingAvatar(true);
    try {
      const result = await uploadAvatar(file);
      if (result.success) {
        setFormData(prev => ({ ...prev, avatarUrl: result.avatarUrl }));
        toast({ 
          title: "Profile Picture Updated", 
          description: "Your new avatar has been uploaded and applied.", 
          variant: "success" 
        });
      } else {
        toast({ 
          title: "Upload Failed", 
          description: result.error || "Could not upload image.", 
          variant: "destructive" 
        });
      }
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Failed to upload image. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle choosing preset avatar
  const handleSelectPresetAvatar = async (presetUrl) => {
    setUploadingAvatar(true);
    try {
      const result = await updateProfile({ ...formData, avatarUrl: presetUrl });
      if (result.success) {
        setFormData(prev => ({ ...prev, avatarUrl: presetUrl }));
        toast({ 
          title: "Avatar Updated", 
          description: "Developer avatar selected successfully.", 
          variant: "success" 
        });
      } else {
        toast({ 
          title: "Update Failed", 
          description: result.error || "Could not update avatar.", 
          variant: "destructive" 
        });
      }
    } catch (err) {
      toast({ 
        title: "Error", 
        description: "Something went wrong.", 
        variant: "destructive" 
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Remove avatar (reset to initial)
  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    try {
      const result = await updateProfile({ ...formData, avatarUrl: '' });
      if (result.success) {
        setFormData(prev => ({ ...prev, avatarUrl: '' }));
        toast({ 
          title: "Avatar Removed", 
          description: "Reverted to default letter avatar.", 
          variant: "success" 
        });
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Password Change Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);

    if (!passwordData.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordData.newPassword === passwordData.currentPassword) {
      setPasswordError('New password cannot be the same as your current password.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been changed successfully.",
          variant: "success",
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordError(result.error || "Failed to change password.");
        toast({
          title: "Update Failed",
          description: result.error || "Failed to change password.",
          variant: "destructive",
        });
      }
    } catch (err) {
      setPasswordError("An unexpected error occurred. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Update Profile Info
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
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
    { id: 'account', label: 'Account & Security', icon: Shield },
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="relative group shrink-0">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[3px] shadow-xl">
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                            {(formData.avatarUrl || user?.avatarUrl) ? (
                              <img 
                                src={getFullAvatarUrl(formData.avatarUrl || user?.avatarUrl)} 
                                alt="User Avatar"
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="text-3xl font-bold text-white">
                                {user?.username?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingAvatar}
                          className="absolute bottom-0 right-0 p-2 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg border-2 border-background transition-transform hover:scale-110 disabled:opacity-50"
                          title="Upload picture"
                        >
                          {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="space-y-3 flex-1">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            Profile Avatar
                            {uploadingAvatar && <span className="text-xs text-primary animate-pulse">(Updating...)</span>}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Upload a photo from your computer or pick one of the developer avatars below.
                          </p>
                        </div>

                        {/* Hidden File Input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarFileChange}
                        />

                        <div className="flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={uploadingAvatar}
                            onClick={() => fileInputRef.current?.click()}
                            className="h-8 text-xs border-white/10 hover:bg-white/10"
                          >
                            <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Photo
                          </Button>

                          {(formData.avatarUrl || user?.avatarUrl) && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              disabled={uploadingAvatar}
                              onClick={handleRemoveAvatar}
                              className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                            </Button>
                          )}
                        </div>

                        {/* Preset Avatars Selector */}
                        <div className="pt-2 border-t border-white/5">
                          <div className="text-[11px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-primary" /> Or choose developer avatar:
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {PRESET_AVATARS.map((p) => {
                              const isSelected = (formData.avatarUrl || user?.avatarUrl) === p.url;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => handleSelectPresetAvatar(p.url)}
                                  disabled={uploadingAvatar}
                                  className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                                    isSelected 
                                      ? 'border-primary ring-2 ring-primary/40' 
                                      : 'border-white/10 hover:border-white/30'
                                  }`}
                                  title={p.label}
                                >
                                  <img src={p.url} alt={p.label} className="w-full h-full object-cover bg-black/40" />
                                  {isSelected && (
                                    <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-white drop-shadow" />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
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

            {/* ACCOUNT & SECURITY SETTINGS */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Change Password Card */}
                <Card className="glass-dark border-0">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password to keep your account safe and secure.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                      {passwordError && (
                        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                          <span>{passwordError}</span>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Current Password *</Label>
                        <div className="relative">
                          <Input
                            type={showCurrentPass ? "text" : "password"}
                            placeholder="Enter current password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="pr-10 bg-white/5 border-white/10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPass(!showCurrentPass)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>New Password * (min 6 characters)</Label>
                        <div className="relative">
                          <Input
                            type={showNewPass ? "text" : "password"}
                            placeholder="Enter new strong password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="pr-10 bg-white/5 border-white/10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPass(!showNewPass)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Confirm New Password *</Label>
                        <div className="relative">
                          <Input
                            type={showConfirmPass ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="pr-10 bg-white/5 border-white/10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          disabled={passwordLoading}
                          className="bg-primary hover:bg-primary/90 text-white font-medium"
                        >
                          {passwordLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating Password...
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 mr-2" /> Update Password
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Danger Zone */}
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
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;