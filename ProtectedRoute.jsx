import { Navigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { C } from '../../tokens';
import { Spinner } from '../ui/index';

/** Redirects unauthenticated users to /login */
export function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  if (requiredRole && userProfile?.role !== requiredRole) {
    const fallback = userProfile?.role === 'seeker' ? '/candidate/dashboard' : '/employer/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
}

/** Standard dashboard layout: TopNav + Sidebar + Content area */
export function DashboardShell({ children, role }) {
  const { isMobile } = useBreakpoint();
  const [sideOpen, setSideOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: C.slate, display: 'flex', flexDirection: 'column' }}>
      <TopNav onSidebarToggle={() => setSideOpen(true)} showSidebarToggle={isMobile} />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar role={role} open={!isMobile || sideOpen} onClose={() => setSideOpen(false)} />
        <main style={{ flex: 1, minWidth: 0, padding: isMobile ? '16px 14px' : '24px 28px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

/** Full-width page layout (no sidebar) */
export function PageShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: C.slate, display: 'flex', flexDirection: 'column' }}>
      <TopNav />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
