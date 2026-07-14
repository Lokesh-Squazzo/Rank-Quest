import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, School, MapPin, UserPlus, BookOpen, Calendar, Hash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // New fields for student details
    rollNumber: '',
    college: '',
    branch: '',
    year: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.rollNumber) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields (Name, Email, Password, Roll No)',
        variant: 'destructive'
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Prepare data specifically for the Spring Boot backend
    // We map the form fields to the DTO expected by AuthController
    const userDataForBackend = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        rollNumber: formData.rollNumber,
        college: formData.college,
        branch: formData.branch,
        year: formData.year
    };
    
    try {
      const result = await register(userDataForBackend);
      
      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Account created. Please log in to continue.',
          variant: 'default'
        });
        navigate('/login');
      } else {
        toast({
          title: 'Registration Failed',
          description: result.error || 'Failed to create account',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
            <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-primary rounded-full flex items-center justify-center mb-4">
                    <UserPlus className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
                <p className="mt-2 text-muted-foreground">
                    Join RankQuest and start your coding journey
                </p>
            </div>
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="John Doe"
                                        className="pl-10"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="pl-10"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Academic Info Section - NEWLY ADDED */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Roll Number *</label>
                                <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="2021CS001"
                                        className="pl-10"
                                        value={formData.rollNumber}
                                        onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">College</label>
                                <div className="relative">
                                    <School className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="ABC Institute of Technology"
                                        className="pl-10"
                                        value={formData.college}
                                        onChange={(e) => handleInputChange('college', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Branch</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Computer Science"
                                        className="pl-10"
                                        value={formData.branch}
                                        onChange={(e) => handleInputChange('branch', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Year</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="3rd Year"
                                        className="pl-10"
                                        value={formData.year}
                                        onChange={(e) => handleInputChange('year', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        className="pl-10 pr-10"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password *</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        className="pl-10 pr-10"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default Register;