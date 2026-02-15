import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type ActivityItem = {
  id: string;
  type: 'ad' | 'shortlink' | 'offer' | 'mining' | 'referral' | 'withdraw';
  description: string;
  amount: number;
  currency: string;
  timestamp: Date;
};

export type AppState = {
  username: string;
  balanceSatoshi: number;
  totalEarned: number;
  todayEarned: number;
  adsWatched: number;
  linksVisited: number;
  offersCompleted: number;
  miningActive: boolean;
  hashRate: number;
  miningEarned: number;
  referralCode: string;
  referralCount: number;
  referralEarnings: number;
  level: number;
  xp: number;
  xpToNext: number;
  activities: ActivityItem[];
  currentPage: string;
};

type AppContextType = AppState & {
  setPage: (page: string) => void;
  earnFromAd: (amount: number) => void;
  earnFromLink: (amount: number) => void;
  earnFromOffer: (amount: number) => void;
  toggleMining: () => void;
  withdraw: (amount: number) => void;
  satoshiToUsd: (sat: number) => string;
};

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    username: 'CryptoUser',
    balanceSatoshi: 48750,
    totalEarned: 1250000,
    todayEarned: 4820,
    adsWatched: 342,
    linksVisited: 189,
    offersCompleted: 27,
    miningActive: false,
    hashRate: 0,
    miningEarned: 0,
    referralCode: 'CRYPTOZY-X7K9',
    referralCount: 14,
    referralEarnings: 85000,
    level: 7,
    xp: 680,
    xpToNext: 1000,
    activities: [
      { id: '1', type: 'ad', description: 'Watched premium ad', amount: 150, currency: 'sat', timestamp: new Date(Date.now() - 300000) },
      { id: '2', type: 'shortlink', description: 'Completed short link', amount: 80, currency: 'sat', timestamp: new Date(Date.now() - 900000) },
      { id: '3', type: 'offer', description: 'Survey completed', amount: 5000, currency: 'sat', timestamp: new Date(Date.now() - 1800000) },
      { id: '4', type: 'mining', description: 'Mining reward', amount: 25, currency: 'sat', timestamp: new Date(Date.now() - 3600000) },
      { id: '5', type: 'referral', description: 'Referral commission', amount: 500, currency: 'sat', timestamp: new Date(Date.now() - 7200000) },
    ],
    currentPage: 'dashboard',
  });

  const setPage = useCallback((page: string) => {
    setState(s => ({ ...s, currentPage: page }));
  }, []);

  const addActivity = useCallback((type: ActivityItem['type'], description: string, amount: number) => {
    const activity: ActivityItem = {
      id: Date.now().toString(),
      type,
      description,
      amount,
      currency: 'sat',
      timestamp: new Date(),
    };
    setState(s => ({
      ...s,
      activities: [activity, ...s.activities].slice(0, 50),
    }));
  }, []);

  const addXp = useCallback((amount: number) => {
    setState(s => {
      let newXp = s.xp + amount;
      let newLevel = s.level;
      let newXpToNext = s.xpToNext;
      if (newXp >= newXpToNext) {
        newXp = newXp - newXpToNext;
        newLevel += 1;
        newXpToNext = Math.floor(newXpToNext * 1.3);
      }
      return { ...s, xp: newXp, level: newLevel, xpToNext: newXpToNext };
    });
  }, []);

  const earnFromAd = useCallback((amount: number) => {
    setState(s => ({
      ...s,
      balanceSatoshi: s.balanceSatoshi + amount,
      totalEarned: s.totalEarned + amount,
      todayEarned: s.todayEarned + amount,
      adsWatched: s.adsWatched + 1,
    }));
    addActivity('ad', 'Watched ad', amount);
    addXp(10);
  }, [addActivity, addXp]);

  const earnFromLink = useCallback((amount: number) => {
    setState(s => ({
      ...s,
      balanceSatoshi: s.balanceSatoshi + amount,
      totalEarned: s.totalEarned + amount,
      todayEarned: s.todayEarned + amount,
      linksVisited: s.linksVisited + 1,
    }));
    addActivity('shortlink', 'Completed short link', amount);
    addXp(8);
  }, [addActivity, addXp]);

  const earnFromOffer = useCallback((amount: number) => {
    setState(s => ({
      ...s,
      balanceSatoshi: s.balanceSatoshi + amount,
      totalEarned: s.totalEarned + amount,
      todayEarned: s.todayEarned + amount,
      offersCompleted: s.offersCompleted + 1,
    }));
    addActivity('offer', 'Completed offer', amount);
    addXp(25);
  }, [addActivity, addXp]);

  const toggleMining = useCallback(() => {
    setState(s => ({
      ...s,
      miningActive: !s.miningActive,
      hashRate: !s.miningActive ? Math.floor(Math.random() * 30) + 15 : 0,
    }));
  }, []);

  // Mining interval
  useEffect(() => {
    if (!state.miningActive) return;
    const interval = setInterval(() => {
      const reward = Math.floor(Math.random() * 3) + 1;
      setState(s => ({
        ...s,
        balanceSatoshi: s.balanceSatoshi + reward,
        totalEarned: s.totalEarned + reward,
        todayEarned: s.todayEarned + reward,
        miningEarned: s.miningEarned + reward,
        hashRate: Math.floor(Math.random() * 30) + 15,
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [state.miningActive]);

  const withdraw = useCallback((amount: number) => {
    setState(s => {
      if (s.balanceSatoshi < amount) return s;
      return { ...s, balanceSatoshi: s.balanceSatoshi - amount };
    });
    addActivity('withdraw', `Withdrawal of ${amount} sat`, amount);
  }, [addActivity]);

  const satoshiToUsd = useCallback((sat: number) => {
    const btcPrice = 67000;
    return ((sat / 100000000) * btcPrice).toFixed(4);
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      setPage,
      earnFromAd,
      earnFromLink,
      earnFromOffer,
      toggleMining,
      withdraw,
      satoshiToUsd,
    }}>
      {children}
    </AppContext.Provider>
  );
}
