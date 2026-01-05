import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RootState } from '../redux/store';

export const useAuth = (requireAuth = false) => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        router.push('/login');
      } else if (!requireAuth && isAuthenticated) {
        router.push('/');
      }
    }
  }, [isAuthenticated, loading, requireAuth, router]);

  return {
    user,
    isAuthenticated,
    loading,
  };
};