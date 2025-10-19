import { useAuth } from '@/context/authContext';

/**
 * Custom hook for accessing authenticated user data
 * Simpler alternative to useAuth when you only need user info
 */
export const useAuthUser = () => {
  const { user, loading } = useAuth();
  
  return {
    user,
    loading,
    isAuthenticated: !!user,
    userId: user?.id,
    userEmail: user?.email,
  };
};

