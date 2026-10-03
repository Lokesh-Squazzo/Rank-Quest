import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Brain, ArrowRight, Loader2, Mail, Lock, AlertCircle, Eye, EyeOff, X, CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetFormData, setResetFormData] = useState({
    email: '',
    rollNumber: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  useEffect(() => {
      setMounted(true);
  }, []);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOpenForgotPassword = () => {
    const currentEmail = watch('email') || '';
    setResetFormData(prev => ({
      ...prev,
      email: currentEmail,
      rollNumber: '',
      newPassword: '',
      confirmPassword: '',
    }));
    setResetError(null);
    setShowForgotPassword(true);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetError(null);

    if (!resetFormData.email.trim()) {
      setResetError('Email address is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetFormData.email.trim())) {
      setResetError('Please enter a valid email address.');
      return;
    }
    if (!resetFormData.newPassword || resetFormData.newPassword.length < 6) {
      setResetError('New password must be at least 6 characters.');
      return;
    }
    if (resetFormData.newPassword !== resetFormData.confirmPassword) {
      setResetError('Passwords do not match.');
      return;
    }

    setResetLoading(true);
    const res = await resetPassword({
      email: resetFormData.email.trim(),
      rollNumber: resetFormData.rollNumber.trim() || undefined,
      newPassword: resetFormData.newPassword,
    });
    setResetLoading(false);

    if (res.success) {
      toast({
        title: 'Password Reset Successful!',
        description: 'Your password has been updated. You can now log in.',
        variant: 'success',
      });
      setValue('email', resetFormData.email.trim());
      setShowForgotPassword(false);
      setResetFormData({ email: '', rollNumber: '', newPassword: '', confirmPassword: '' });
    } else {
      setResetError(res.error || 'Failed to reset password. Please check your details.');
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError(null);
    const result = await login(data);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
        variant: 'success',
      });
      // Redirect to the page they tried to visit, or home
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } else {
      const errorMsg = result.error || 'Invalid email or password';
      setServerError(errorMsg);
      toast({
        title: 'Login failed',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden relative py-12 sm:px-6 lg:px-8">
        {/* Aurora Background Effects (Matching Landing Page) */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] opacity-50 animate-pulse pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] opacity-50 animate-pulse delay-1000 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className={`sm:mx-auto sm:w-full sm:max-w-md relative z-10 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
        <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center space-x-3 group transition-transform hover:scale-105">
                <div className="p-3 bg-gradient-to-r from-primary to-purple-600 rounded-2xl shadow-lg shadow-primary/20">
                    <Brain className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                    RankQuest
                </span>
            </Link>
        </div>
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-400">
          Sign in to continue your coding journey
        </p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 ${mounted ? 'animate-slide-up delay-100' : 'opacity-0'}`}>
        <Card className="border-0 shadow-2xl bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
          <CardContent className="p-8 sm:p-10relative z-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {serverError && (
                <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                  <span>{serverError}</span>
                </div>
              )}
              <div>
                <Label htmlFor="email" className="text-gray-300 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4" /> Email address
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/20 h-12 rounded-xl ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    placeholder="you@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span> {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="password" className="text-gray-300 flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Password
                    </Label>
                    <button
                        type="button"
                        onClick={handleOpenForgotPassword}
                        className="text-xs text-primary hover:text-primary/80 transition-colors font-medium hover:underline cursor-pointer"
                    >
                        Forgot password?
                    </button>
                </div>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 focus:ring-primary/20 h-12 rounded-xl ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                       <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span> {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-transparent text-gray-400 backdrop-blur-xl bg-black/30 rounded-full">
                    New to RankQuest?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
                >
                  Create an account now
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => !resetLoading && setShowForgotPassword(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0e0e17] border border-white/15 shadow-2xl p-6 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Top gradient glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-600" />
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Reset Password</h3>
                  <p className="text-xs text-gray-400">Recover and update your account password</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => !resetLoading && setShowForgotPassword(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-4">
              {resetError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{resetError}</span>
                </div>
              )}

              <div>
                <Label className="text-xs text-gray-300 mb-1.5 block">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    required
                    placeholder="registered-email@example.com"
                    value={resetFormData.email}
                    onChange={(e) => setResetFormData({ ...resetFormData, email: e.target.value })}
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 text-sm h-10 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-300 mb-1.5 block">
                  Roll Number <span className="text-gray-500 font-normal">(Optional security check)</span>
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. 21BCSE01"
                  value={resetFormData.rollNumber}
                  onChange={(e) => setResetFormData({ ...resetFormData, rollNumber: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 text-sm h-10 rounded-xl"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-300 mb-1.5 block">New Password * (min 6 characters)</Label>
                <div className="relative">
                  <Input
                    type={showResetPassword ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={resetFormData.newPassword}
                    onChange={(e) => setResetFormData({ ...resetFormData, newPassword: e.target.value })}
                    className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 text-sm h-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-300 mb-1.5 block">Confirm New Password *</Label>
                <div className="relative">
                  <Input
                    type={showResetConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm new password"
                    value={resetFormData.confirmPassword}
                    onChange={(e) => setResetFormData({ ...resetFormData, confirmPassword: e.target.value })}
                    className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 text-sm h-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showResetConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={resetLoading}
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 border-white/10 hover:bg-white/5 text-gray-300 rounded-xl h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white rounded-xl h-10 font-medium shadow-md shadow-primary/20"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Reset Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;