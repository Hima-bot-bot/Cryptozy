import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { CaptchaBox } from '../components/CaptchaBox';
import { Tv, Clock, Coins, Star, Eye, CheckCircle2, Timer, Sparkles } from 'lucide-react';

type Ad = {
  id: number;
  title: string;
  advertiser: string;
  reward: number;
  duration: number;
  type: 'standard' | 'premium' | 'exclusive';
  available: boolean;
  watched: boolean;
};

const initialAds: Ad[] = [
  { id: 1, title: 'Discover DeFi Trading Platform', advertiser: 'DexTrade', reward: 50, duration: 10, type: 'standard', available: true, watched: false },
  { id: 2, title: 'New Crypto Wallet Launch', advertiser: 'SafeVault', reward: 80, duration: 15, type: 'standard', available: true, watched: false },
  { id: 3, title: 'NFT Marketplace Overview', advertiser: 'ArtChain', reward: 100, duration: 20, type: 'premium', available: true, watched: false },
  { id: 4, title: 'Blockchain Gaming Revolution', advertiser: 'GameFi Pro', reward: 120, duration: 25, type: 'premium', available: true, watched: false },
  { id: 5, title: 'Staking Platform Introduction', advertiser: 'StakeMax', reward: 150, duration: 30, type: 'exclusive', available: true, watched: false },
  { id: 6, title: 'Crypto Payment Solutions', advertiser: 'PayCrypto', reward: 60, duration: 10, type: 'standard', available: true, watched: false },
  { id: 7, title: 'Layer 2 Scaling Solution', advertiser: 'FastChain', reward: 90, duration: 15, type: 'premium', available: true, watched: false },
  { id: 8, title: 'Privacy Coin Explained', advertiser: 'ShieldCoin', reward: 110, duration: 20, type: 'premium', available: true, watched: false },
  { id: 9, title: 'Exclusive Exchange Promotion', advertiser: 'ProExchange', reward: 200, duration: 30, type: 'exclusive', available: true, watched: false },
];

const typeStyles = {
  standard: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', glow: 'shadow-blue-500/5' },
  premium: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', glow: 'shadow-amber-500/5' },
  exclusive: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', glow: 'shadow-purple-500/5' },
};

export function WatchAds() {
  const { earnFromAd } = useApp();
  const [ads, setAds] = useState<Ad[]>(initialAds);
  const [watchingId, setWatchingId] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [earnedPopup, setEarnedPopup] = useState<{ amount: number; show: boolean }>({ amount: 0, show: false });

  // Captcha state
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  const startWatching = useCallback((ad: Ad) => {
    if (watchingId !== null || ad.watched || !captchaVerified) return;
    setWatchingId(ad.id);
    setCountdown(ad.duration);
  }, [watchingId, captchaVerified]);

  useEffect(() => {
    if (watchingId === null || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [watchingId, countdown]);

  useEffect(() => {
    if (watchingId !== null && countdown === 0) {
      const ad = ads.find(a => a.id === watchingId);
      if (ad) {
        earnFromAd(ad.reward);
        setAds(prev => prev.map(a => a.id === watchingId ? { ...a, watched: true } : a));
        setEarnedPopup({ amount: ad.reward, show: true });
        setTimeout(() => setEarnedPopup({ amount: 0, show: false }), 2500);
      }
      setWatchingId(null);
      // Reset captcha after earning
      setCaptchaResetKey(k => k + 1);
    }
  }, [watchingId, countdown, ads, earnFromAd]);

  const totalAvailable = ads.filter(a => !a.watched).length;
  const totalRewards = ads.filter(a => !a.watched).reduce((s, a) => s + a.reward, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Earned popup */}
      {earnedPopup.show && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/20 border border-green-500/30 backdrop-blur-xl">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-sm font-semibold text-green-300">+{earnedPopup.amount} satoshi earned!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Tv className="w-6 h-6 text-blue-400" /> Watch Ads
          </h1>
          <p className="text-sm text-gray-400 mt-1">Watch advertisements and earn satoshi for each view</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Available Ads', value: totalAvailable, icon: <Eye className="w-4 h-4 text-blue-400" /> },
          { label: 'Potential Reward', value: `${totalRewards} sat`, icon: <Coins className="w-4 h-4 text-amber-400" /> },
          { label: 'Avg. Duration', value: '18s', icon: <Timer className="w-4 h-4 text-green-400" /> },
          { label: 'Bonus Active', value: '2x', icon: <Sparkles className="w-4 h-4 text-purple-400" /> },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#111633] border border-gray-800/50">
            <div className="w-8 h-8 rounded-lg bg-gray-800/80 flex items-center justify-center">{s.icon}</div>
            <div>
              <p className="text-base font-bold text-white">{s.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* hCaptcha verification */}
      <CaptchaBox
        onStatusChange={setCaptchaVerified}
        resetTrigger={captchaResetKey}
      />

      {/* Ads list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map(ad => {
          const isWatching = watchingId === ad.id;
          const style = typeStyles[ad.type];
          const progress = isWatching ? ((ad.duration - countdown) / ad.duration) * 100 : 0;
          const isDisabled = isWatching || ad.watched || watchingId !== null || !captchaVerified;

          return (
            <div key={ad.id} className={`relative rounded-xl bg-[#111633] border border-gray-800/50 overflow-hidden transition-all duration-300 ${ad.watched ? 'opacity-50' : 'hover:border-gray-700'} ${style.glow}`}>
              {/* Type badge */}
              <div className="p-4 pb-3">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] uppercase font-semibold tracking-wider border ${style.badge}`}>
                    {ad.type === 'exclusive' && <Star className="w-2.5 h-2.5" />}
                    {ad.type}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" /> {ad.duration}s
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-200 mb-1">{ad.title}</h3>
                <p className="text-xs text-gray-500">by {ad.advertiser}</p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-400" />
                    <span className="text-lg font-bold text-amber-400">{ad.reward}</span>
                    <span className="text-xs text-amber-400/60">sat</span>
                  </div>
                </div>
              </div>

              {/* Progress bar for watching */}
              {isWatching && (
                <div className="px-4 pb-2">
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-gray-400 mt-1.5">Watching... {countdown}s remaining</p>
                </div>
              )}

              {/* Action button */}
              <div className="p-4 pt-2">
                <button
                  onClick={() => startWatching(ad)}
                  disabled={isDisabled}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    ad.watched
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default'
                      : isWatching
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 cursor-wait'
                        : (watchingId !== null || !captchaVerified)
                          ? 'bg-gray-800/50 text-gray-600 border border-gray-800 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/20 cursor-pointer'
                  }`}
                >
                  {ad.watched ? '✓ Watched' : isWatching ? `Watching (${countdown}s)` : !captchaVerified ? '🔒 Verify First' : 'Watch Ad'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
