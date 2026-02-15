import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  fetchProfile,
  updateProfile,
  addTransaction,
  fetchTransactions,
} from '../lib/database';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { Logo } from '../components/Logo';

// ============================================================
// Types
// ============================================================

export type ActivityItem = {
  id: string;
  type: 'ad' | 'shortlink' | 'offer' | 'mining' | 'referral' | 'withdraw' | 'bonus';
  description: string;
  amount: number;
  currency: string;
  timestamp: Date;
};

export type AppState = {
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

type WithdrawResult = {
  success: boolean;
  error?: string;
  txHash?: string;
  newBalance?: number;
};

type AppContextType = AppState & {
  setPage: (page: string) => void;
  earnFromAd: (amount: number) => void;
  earnFromLink: (amount: number) => void;
  earnFromOffer: (amount: number) => void;
  toggleMining: () => void;
  withdraw: (amount: number, methodId: string, address: string, fee: number, captchaToken?: string) => Promise<WithdrawResult>;
  refreshProfile: () => Promise<void>;
  satoshiToUsd: (sat: number) => string;
};

// ============================================================
// Helpers
// ============================================================

const defaultState: AppState = {
  balanceSatoshi: 0,
  totalEarned: 0,
  todayEarned: 0,
  adsWatched: 0,
  linksVisited: 0,
  offersCompleted: 0,
  miningActive: false,
  hashRate: 0,
  miningEarned: 0,
  referralCode: '',
  referralCount: 0,
  referralEarnings: 0,
  level: 1,
  xp: 0,
  xpToNext: 1000,
  activities: [],
  currentPage: 'dashboard',
};

function calcXp(
  currentXp: number,
  currentLevel: number,
  currentXpToNext: number,
  xpGain: number
) {
  let xp = currentXp + xpGain;
  let level = currentLevel;
  let xpToNext = currentXpToNext;
  if (xp >= xpToNext) {
    xp = xp - xpToNext;
    level += 1;
    xpToNext = Math.floor(xpToNext * 1.3);
  }
  return { xp, level, xpToNext };
}

// ============================================================
// Context
// ============================================================

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

// ============================================================
// Provider
// ============================================================

export function AppProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [state, setState] = useState<AppState>(defaultState);

  // Refs for async access to latest values
  const stateRef = useRef(state);
  stateRef.current = state;
  const miningAccumRef = useRef(0);

  // ----------------------------------------------------------
  // Load profile + recent transactions from Supabase
  // ----------------------------------------------------------
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function loadData() {
      try {
        const [profile, transactions] = await Promise.all([
          fetchProfile(user!.id),
          fetchTransactions(user!.id, 50),
        ]);

        if (cancelled) return;

        if (profile) {
          // Reset today_earned if it's a new day
          const profileDay = new Date(profile.updated_at).toDateString();
          const today = new Date().toDateString();
          const todayEarned = profileDay === today ? profile.today_earned : 0;

          if (profileDay !== today) {
            updateProfile(user!.id, { today_earned: 0 });
          }

          setState((s) => ({
            ...s,
            balanceSatoshi: profile.balance_satoshi,
            totalEarned: profile.total_earned,
            todayEarned,
            adsWatched: profile.ads_watched,
            linksVisited: profile.links_visited,
            offersCompleted: profile.offers_completed,
            miningEarned: profile.mining_earned,
            referralCode: profile.referral_code || '',
            referralCount: profile.referral_count,
            referralEarnings: profile.referral_earnings,
            level: profile.level,
            xp: profile.xp,
            xpToNext: profile.xp_to_next,
            activities: transactions.map((t) => ({
              id: t.id,
              type: t.type as ActivityItem['type'],
              description: t.description || '',
              amount: Math.abs(t.amount),
              currency: 'sat',
              timestamp: new Date(t.created_at),
            })),
          }));
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // ----------------------------------------------------------
  // DB helpers (fire-and-forget for non-critical writes)
  // ----------------------------------------------------------
  const persistProfile = useCallback(
    (updates: Record<string, number | string>) => {
      if (!user) return;
      updateProfile(user.id, updates);
    },
    [user]
  );

  const recordTx = useCallback(
    (type: string, description: string, amount: number) => {
      if (!user) return;
      addTransaction(user.id, type, description, amount);
    },
    [user]
  );

  // ----------------------------------------------------------
  // Navigation
  // ----------------------------------------------------------
  const setPage = useCallback((page: string) => {
    setState((s) => ({ ...s, currentPage: page }));
  }, []);

  // ----------------------------------------------------------
  // Earn from Ad
  // ----------------------------------------------------------
  const earnFromAd = useCallback(
    (amount: number) => {
      const s = stateRef.current;
      const { xp, level, xpToNext } = calcXp(s.xp, s.level, s.xpToNext, 10);
      const newBalance = s.balanceSatoshi + amount;
      const newTotal = s.totalEarned + amount;
      const newToday = s.todayEarned + amount;
      const newAds = s.adsWatched + 1;

      const activity: ActivityItem = {
        id: Date.now().toString(),
        type: 'ad',
        description: `Watched ad (+${amount} sat)`,
        amount,
        currency: 'sat',
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        balanceSatoshi: newBalance,
        totalEarned: newTotal,
        todayEarned: newToday,
        adsWatched: newAds,
        xp,
        level,
        xpToNext,
        activities: [activity, ...prev.activities].slice(0, 50),
      }));

      persistProfile({
        balance_satoshi: newBalance,
        total_earned: newTotal,
        today_earned: newToday,
        ads_watched: newAds,
        level,
        xp,
        xp_to_next: xpToNext,
      });
      recordTx('ad', `Watched ad (+${amount} sat)`, amount);
    },
    [persistProfile, recordTx]
  );

  // ----------------------------------------------------------
  // Earn from Short Link
  // ----------------------------------------------------------
  const earnFromLink = useCallback(
    (amount: number) => {
      const s = stateRef.current;
      const { xp, level, xpToNext } = calcXp(s.xp, s.level, s.xpToNext, 8);
      const newBalance = s.balanceSatoshi + amount;
      const newTotal = s.totalEarned + amount;
      const newToday = s.todayEarned + amount;
      const newLinks = s.linksVisited + 1;

      const activity: ActivityItem = {
        id: Date.now().toString(),
        type: 'shortlink',
        description: `Completed short link (+${amount} sat)`,
        amount,
        currency: 'sat',
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        balanceSatoshi: newBalance,
        totalEarned: newTotal,
        todayEarned: newToday,
        linksVisited: newLinks,
        xp,
        level,
        xpToNext,
        activities: [activity, ...prev.activities].slice(0, 50),
      }));

      persistProfile({
        balance_satoshi: newBalance,
        total_earned: newTotal,
        today_earned: newToday,
        links_visited: newLinks,
        level,
        xp,
        xp_to_next: xpToNext,
      });
      recordTx('shortlink', `Completed short link (+${amount} sat)`, amount);
    },
    [persistProfile, recordTx]
  );

  // ----------------------------------------------------------
  // Earn from Offer
  // ----------------------------------------------------------
  const earnFromOffer = useCallback(
    (amount: number) => {
      const s = stateRef.current;
      const { xp, level, xpToNext } = calcXp(s.xp, s.level, s.xpToNext, 25);
      const newBalance = s.balanceSatoshi + amount;
      const newTotal = s.totalEarned + amount;
      const newToday = s.todayEarned + amount;
      const newOffers = s.offersCompleted + 1;

      const activity: ActivityItem = {
        id: Date.now().toString(),
        type: 'offer',
        description: `Completed offer (+${amount.toLocaleString()} sat)`,
        amount,
        currency: 'sat',
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        balanceSatoshi: newBalance,
        totalEarned: newTotal,
        todayEarned: newToday,
        offersCompleted: newOffers,
        xp,
        level,
        xpToNext,
        activities: [activity, ...prev.activities].slice(0, 50),
      }));

      persistProfile({
        balance_satoshi: newBalance,
        total_earned: newTotal,
        today_earned: newToday,
        offers_completed: newOffers,
        level,
        xp,
        xp_to_next: xpToNext,
      });
      recordTx('offer', `Completed offer (+${amount.toLocaleString()} sat)`, amount);
    },
    [persistProfile, recordTx]
  );

  // ----------------------------------------------------------
  // Mining: local tick every 3 s
  // ----------------------------------------------------------
  useEffect(() => {
    if (!state.miningActive) return;
    const interval = setInterval(() => {
      const reward = Math.floor(Math.random() * 3) + 1;
      miningAccumRef.current += reward;
      setState((s) => ({
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

  // Mining: persist to DB every 15 s
  useEffect(() => {
    if (!state.miningActive || !user) return;
    const interval = setInterval(() => {
      const accum = miningAccumRef.current;
      if (accum > 0) {
        miningAccumRef.current = 0;
        const s = stateRef.current;
        persistProfile({
          balance_satoshi: s.balanceSatoshi,
          total_earned: s.totalEarned,
          today_earned: s.todayEarned,
          mining_earned: s.miningEarned,
        });
        recordTx('mining', `Mining reward: ${accum} sat`, accum);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [state.miningActive, user, persistProfile, recordTx]);

  // Toggle mining on / off
  const toggleMining = useCallback(() => {
    const wasActive = stateRef.current.miningActive;

    // Persist remaining earnings when stopping
    if (wasActive) {
      const accum = miningAccumRef.current;
      if (accum > 0) {
        miningAccumRef.current = 0;
        const s = stateRef.current;
        persistProfile({
          balance_satoshi: s.balanceSatoshi,
          total_earned: s.totalEarned,
          today_earned: s.todayEarned,
          mining_earned: s.miningEarned,
        });
        recordTx('mining', `Mining session: ${accum} sat earned`, accum);
      }
    }

    setState((s) => ({
      ...s,
      miningActive: !s.miningActive,
      hashRate: !s.miningActive ? Math.floor(Math.random() * 30) + 15 : 0,
    }));
  }, [persistProfile, recordTx]);

  // ----------------------------------------------------------
  // Refresh profile from DB
  // ----------------------------------------------------------
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    const profile = await fetchProfile(user.id);
    if (profile) {
      setState((s) => ({
        ...s,
        balanceSatoshi: profile.balance_satoshi,
        totalEarned: profile.total_earned,
        todayEarned: profile.today_earned,
      }));
    }
  }, [user]);

  // ----------------------------------------------------------
  // Withdraw — calls Vercel serverless API → FaucetPay
  // ----------------------------------------------------------
  const withdraw = useCallback(
    async (
      amount: number,
      methodId: string,
      address: string,
      _fee: number,
      captchaToken?: string,
    ): Promise<WithdrawResult> => {
      const s = stateRef.current;
      if (s.balanceSatoshi < amount) {
        return { success: false, error: 'Insufficient balance' };
      }

      if (!user) {
        return { success: false, error: 'Not authenticated' };
      }

      try {
        // Get the user's current session token
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData?.session?.access_token;

        if (!accessToken) {
          return { success: false, error: 'Session expired. Please log in again.' };
        }

        // Call the serverless API
        const response = await fetch('/api/withdraw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount,
            address,
            methodId,
            captchaToken,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          return {
            success: false,
            error: data.error || 'Withdrawal failed. Please try again.',
          };
        }

        // Success! Update local state
        const newBalance = data.new_balance ?? s.balanceSatoshi - amount;

        const activity: ActivityItem = {
          id: Date.now().toString(),
          type: 'withdraw',
          description: `Withdrawal: ${amount.toLocaleString()} sat via ${data.currency || methodId.toUpperCase()}`,
          amount,
          currency: 'sat',
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          balanceSatoshi: newBalance,
          activities: [activity, ...prev.activities].slice(0, 50),
        }));

        return {
          success: true,
          txHash: data.tx_hash,
          newBalance,
        };
      } catch (err: unknown) {
        console.error('Withdrawal error:', err);
        return {
          success: false,
          error: 'Network error. Please check your connection and try again.',
        };
      }
    },
    [user]
  );

  // ----------------------------------------------------------
  // Util
  // ----------------------------------------------------------
  const satoshiToUsd = useCallback((sat: number) => {
    const btcPrice = 67000;
    return ((sat / 100000000) * btcPrice).toFixed(4);
  }, []);

  // ----------------------------------------------------------
  // Loading screen while profile loads
  // ----------------------------------------------------------
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex flex-col items-center justify-center gap-6">
        <Logo size={64} showText={false} />
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <AppContext.Provider
      value={{
        ...state,
        setPage,
        earnFromAd,
        earnFromLink,
        earnFromOffer,
        toggleMining,
        withdraw,
        refreshProfile,
        satoshiToUsd,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
