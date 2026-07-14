import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut, Code2, Trophy, BookOpen, Zap, Brain, Home, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext'; // Import Theme Hook
import { useToast } from '../../hooks/useToast';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'DSA Sheets', href: '/sheets', icon: BookOpen },
  { name: 'Rankings', href: '/rankings', icon: Trophy },
  { name: 'Resources', href: '/resources', icon: Zap },
  { name: 'Playground', href: '/playground', icon: Code2 }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Use Theme Hook
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged Out', description: 'See you next time!' });
    navigate('/');
    setShowUserMenu(false);
  };

  const isActive = (path) => location.pathname === path;
  const getDisplayName = () => user?.name || user?.username || 'User';
  const getInitial = () => getDisplayName().charAt(0).toUpperCase();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass-dark shadow-2xl border-b border-white/10' 
        : 'bg-background/80 backdrop-blur-md border-b border-border/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative p-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  RankQuest
                </span>
                <div className="text-xs text-muted-foreground font-medium hidden sm:block">DSA Mastery</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isActive(item.href) 
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg' 
                    : 'text-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-border/50 mx-2"></div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/10 hover:text-primary mr-2"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {isAuthenticated ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowUserMenu(!showUserMenu)} 
                  className="flex items-center rounded-full p-1 pr-3 hover:bg-white/10"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2 shadow-md">
                    {getInitial()}
                  </div>
                  <span className="font-medium">{getDisplayName()}</span>
                </Button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-64 border border-white/10 rounded-2xl shadow-2xl py-2 z-50 bg-[#0a0a0f] backdrop-blur-xl ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-3 border-b border-white/10">
                        <div className="font-semibold text-white">{getDisplayName()}</div>
                        <div className="text-sm text-gray-400">{user?.email}</div>
                    </div>
                    
                    <Link to="/profile" className="flex items-center px-4 py-3 text-sm text-gray-200 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <User className="w-4 h-4 mr-2" /> Profile
                    </Link>
                    
                    <Link to="/settings" className="flex items-center px-4 py-3 text-sm text-gray-200 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setShowUserMenu(false)}>
                      <Settings className="w-4 h-4 mr-2" /> Settings
                    </Link>
                    
                    <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <Link to="/login"><Button variant="ghost" className="font-medium hover:bg-primary/10 rounded-xl px-5">Login</Button></Link>
                <Link to="/register"><Button className="font-medium bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 rounded-xl px-5 shadow-lg">Sign Up</Button></Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
               {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.href) ? 'bg-primary/20 text-primary' : 'text-foreground hover:bg-white/5'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
            {isAuthenticated && (
               <div className="pt-4 mt-4 border-t border-white/10">
                  <div className="flex items-center px-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {getInitial()}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{getDisplayName()}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                  </div>
                  <Link to="/settings" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-foreground hover:bg-white/5 rounded-md">Settings</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:bg-white/5 rounded-md">Sign Out</button>
               </div>
            )}
             {!isAuthenticated && (
               <div className="pt-4 mt-4 border-t border-white/10 flex gap-2 px-3">
                 <Link to="/login" onClick={() => setIsOpen(false)} className="flex-1"><Button variant="ghost" className="w-full">Login</Button></Link>
                 <Link to="/register" onClick={() => setIsOpen(false)} className="flex-1"><Button className="w-full bg-gradient-to-r from-primary to-purple-600">Sign Up</Button></Link>
               </div>
             )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar;