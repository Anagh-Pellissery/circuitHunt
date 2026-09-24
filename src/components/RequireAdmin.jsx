import { useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { useSingleSession } from '../hooks/useSingleSession';

export default function RequireAdmin({ children }) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

  const onKicked = useCallback(() => {
    sessionStorage.removeItem('isAdmin');
    alert('Admin session opened elsewhere.');
    window.location.href = '/admin/login';
  }, []);

  useSingleSession('adminSession', isAdmin, onKicked);

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
