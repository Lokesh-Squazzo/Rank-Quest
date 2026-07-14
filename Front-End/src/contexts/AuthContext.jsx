import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, signupUser, getUserProfile, updateUserProfile as updateUserProfileApi } from '../services/apiService';

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('rankquest_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(false); // Start false because we already loaded user above

  useEffect(() => {
    const validateSession = async () => {
      const token = localStorage.getItem('rankquest_token');
      if (token && user) {
        try {
           // Silently refresh user data in background
           const response = await getUserProfile();
           if (response && response.success) {
             const freshUser = response.data.user;
             // Only update if data actually changed to prevent re-renders
             if (JSON.stringify(freshUser) !== JSON.stringify(user)) {
                 setUser(freshUser);
                 localStorage.setItem('rankquest_user', JSON.stringify(freshUser));
             }
           }
        } catch (error) {
           console.warn("Background session check failed. User might need to relogin soon.");
           // Optional: logout() if 401
        }
      }
    };
    validateSession();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await loginUser(credentials);
      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem('rankquest_token', token);
        localStorage.setItem('rankquest_user', JSON.stringify(user));
        setUser(user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.error?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await signupUser(userData);
      return response.success ? { success: true } : { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: error.response?.data?.error?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    localStorage.removeItem('rankquest_token');
    localStorage.removeItem('rankquest_user');
    setUser(null);
  }

  const updateProfile = async (updates) => {
    try {
      const response = await updateUserProfileApi(updates);
      if (response.success) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem('rankquest_user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
      return { success: false, error: response.message };
    } catch (error) {
      return { success: false, error: 'Update failed' };
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children} 
    </AuthContext.Provider>
  )
}