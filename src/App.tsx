import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { WatchAds } from './pages/WatchAds';
import { ShortLinks } from './pages/ShortLinks';
import { OfferWall } from './pages/OfferWall';
import { Mining } from './pages/Mining';
import { Withdraw } from './pages/Withdraw';
import { Referral } from './pages/Referral';
import { Loader2 } from 'lucide-react';
import { Logo } from './components/Logo';

function PageRouter() {
  const { currentPage } = useApp();

  const pages: Record<string, React.ReactNode> = {
    dashboard: <Dashboard />,
    ads: <WatchAds />,
    shortlinks: <ShortLinks />,
    offers: <OfferWall />,
    mining: <Mining />,
    withdraw: <Withdraw />,
    referral: <Referral />,
  };

  return <Layout>{pages[currentPage] || <Dashboard />}</Layout>;
}

function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center gap-6">
        <Logo size={64} showText={false} />
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading Cryptozy...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <AppProvider>
      <PageRouter />
    </AppProvider>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
