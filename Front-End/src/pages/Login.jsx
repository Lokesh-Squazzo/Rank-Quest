import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Brain, ArrowRight, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
      setMounted(true);
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
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
      toast({
        title: 'Login failed',
        description: result.error,
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
    </div>
  );
};

export default Login;