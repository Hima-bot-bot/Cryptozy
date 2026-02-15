import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { WatchAds } from './pages/WatchAds';
import { ShortLinks } from './pages/ShortLinks';
import { OfferWall } from './pages/OfferWall';
import { Mining } from './pages/Mining';
import { Withdraw } from './pages/Withdraw';
import { Referral } from './pages/Referral';

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

export function App() {
  return (
    <AppProvider>
      <PageRouter />
    </AppProvider>
  );
}
