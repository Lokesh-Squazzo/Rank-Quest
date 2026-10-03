import { createContext, useContext, useState, useEffect } from 'react'
import { 
  loginUser, 
  signupUser, 
  getUserProfile, 
  updateUserProfile as updateUserProfileApi,
  changeUserPassword,
  resetPassword as resetPasswordApi,
  uploadUserAvatar
} from '../services/apiService';

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
      return { success: false, error: error.message || error.response?.data?.error?.message || 'Login failed' };
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
      return { success: false, error: error.message || error.response?.data?.error?.message || 'Registration failed' };
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
      return { success: false, error: error.message || 'Update failed' };
    }
  }

  const changePassword = async (passwordData) => {
    try {
      const response = await changeUserPassword(passwordData);
      return { success: true, message: response.message || 'Password changed successfully' };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to change password' };
    }
  };

  const resetPassword = async (resetData) => {
    try {
      const response = await resetPasswordApi(resetData);
      return { success: true, message: response.message || 'Password reset successfully' };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to reset password' };
    }
  };

  const uploadAvatar = async (file) => {
    try {
      const response = await uploadUserAvatar(file);
      if (response && response.success) {
        const updatedUser = response.data.user || { ...user, avatarUrl: response.data.avatarUrl };
        setUser(updatedUser);
        localStorage.setItem('rankquest_user', JSON.stringify(updatedUser));
        return { success: true, avatarUrl: response.data.avatarUrl, user: updatedUser };
      }
      return { success: false, error: response?.message || 'Avatar upload failed' };
    } catch (error) {
      return { success: false, error: error.message || 'Avatar upload failed' };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getUserProfile();
      if (response && response.success) {
        const freshUser = response.data.user;
        setUser(freshUser);
        localStorage.setItem('rankquest_user', JSON.stringify(freshUser));
        return freshUser;
      }
    } catch (error) {
      console.warn('Failed to refresh user profile:', error);
    }
    return null;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    resetPassword,
    uploadAvatar,
    refreshUser,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children} 
    </AuthContext.Provider>
  )
}
export default AuthContext;