import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { fetchReferrals, type DbReferral } from '../lib/database';
import {
  Users, Copy, Check, Share2, Gift, Coins,
  TrendingUp, Crown, Award, UserPlus, ExternalLink, Loader2,
} from 'lucide-react';

const referralTiers = [
  { level: 1, referrals: 0, commission: 5, label: 'Bronze', color: 'from-amber-700 to-amber-800' },
  { level: 2, referrals: 10, commission: 8, label: 'Silver', color: 'from-gray-400 to-gray-500' },
  { level: 3, referrals: 25, commission: 10, label: 'Gold', color: 'from-amber-400 to-amber-500' },
  { level: 4, referrals: 50, commission: 12, label: 'Platinum', color: 'from-cyan-400 to-blue-500' },
  { level: 5, referrals: 100, commission: 15, label: 'Diamond', color: 'from-purple-400 to-pink-500' },
];

const topReferrers = [
  { rank: 1, name: 'CryptoKing_42', referrals: 234, earnings: 450000 },
  { rank: 2, name: 'MiningPro', referrals: 189, earnings: 380000 },
  { rank: 3, name: 'BitEarner', referrals: 156, earnings: 310000 },
  { rank: 4, name: 'SatoshiFan', referrals: 98, earnings: 195000 },
  { rank: 5, name: 'CryptoHunter', referrals: 87, earnings: 172000 },
];

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function Referral() {
  const { referralCode, referralCount, referralEarnings } = useApp();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const referralLink = `https://cryptozy.vercel.app/ref/${referralCode}`;

  // Real referrals from DB
  const [referrals, setReferrals] = useState<DbReferral[]>([]);
  const [referralsLoading, setReferralsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchReferrals(user.id).then((data) => {
      setReferrals(data);
      setReferralsLoading(false);
    });
  }, [user]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTier = referralTiers.reduce(
    (best, tier) => (referralCount >= tier.referrals ? tier : best),
    referralTiers[0]
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-amber-400" /> Referral Program
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Invite friends and earn commission on their earnings — forever!
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Referrals', value: referralCount, icon: <UserPlus className="w-4 h-4 text-blue-400" /> },
          { label: 'Commission Earned', value: `${referralEarnings.toLocaleString()} sat`, icon: <Coins className="w-4 h-4 text-amber-400" /> },
          { label: 'Current Tier', value: currentTier.label, icon: <Crown className="w-4 h-4 text-purple-400" /> },
          { label: 'Commission Rate', value: `${currentTier.commission}%`, icon: <TrendingUp className="w-4 h-4 text-green-400" /> },
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

      {/* Referral link */}
      <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-amber-300">Your Referral Link</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center px-4 py-2.5 rounded-lg bg-[#0a0e1a] border border-gray-800/50">
            <span className="text-sm text-gray-300 truncate flex-1 font-mono">
              {referralLink}
            </span>
          </div>
          <button
            onClick={() => handleCopy(referralLink)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-gray-500">Referral Code:</span>
          <span className="text-xs font-mono font-bold text-amber-400">
            {referralCode}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* How it works */}
        <div className="p-5 rounded-xl bg-[#111633] border border-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Gift className="w-4 h-4 text-green-400" /> How It Works
          </h3>
          <div className="space-y-4">
            {[
              { step: 1, title: 'Share Your Link', desc: 'Share your unique referral link with friends or on social media' },
              { step: 2, title: 'Friend Joins', desc: 'When someone signs up using your link, they become your referral' },
              { step: 3, title: 'Earn Commission', desc: `You earn ${currentTier.commission}% commission on all their earnings — forever!` },
              { step: 4, title: 'Level Up', desc: 'Get more referrals to unlock higher commission tiers' },
            ].map((item) => (
              <div key={item.step} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-200">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission tiers */}
        <div className="p-5 rounded-xl bg-[#111633] border border-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" /> Commission Tiers
          </h3>
          <div className="space-y-2">
            {referralTiers.map((tier) => {
              const isActive = tier.level === currentTier.level;
              const isUnlocked = referralCount >= tier.referrals;
              return (
                <div
                  key={tier.level}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/20'
                      : isUnlocked
                      ? 'bg-gray-800/20 border-gray-800/30'
                      : 'bg-gray-900/30 border-gray-800/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center`}
                    >
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-200">{tier.label}</p>
                      <p className="text-[10px] text-gray-500">{tier.referrals}+ referrals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-amber-400">{tier.commission}%</p>
                    {isActive && (
                      <span className="text-[10px] text-green-400">Current</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboard + Recent referrals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <div className="p-5 rounded-xl bg-[#111633] border border-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            🏆 Top Referrers
          </h3>
          <div className="space-y-2">
            {topReferrers.map((r) => (
              <div
                key={r.rank}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800/30 transition-colors"
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    r.rank === 1
                      ? 'bg-amber-500/20 text-amber-400'
                      : r.rank === 2
                      ? 'bg-gray-400/20 text-gray-300'
                      : r.rank === 3
                      ? 'bg-amber-700/20 text-amber-600'
                      : 'bg-gray-800/50 text-gray-500'
                  }`}
                >
                  {r.rank}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-200">{r.name}</p>
                  <p className="text-[10px] text-gray-500">
                    {r.referrals} referrals
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-400">
                  {r.earnings.toLocaleString()} sat
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Your recent referrals — from DB */}
        <div className="p-5 rounded-xl bg-[#111633] border border-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">
            Your Recent Referrals
          </h3>

          {referralsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
            </div>
          ) : referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-medium">No referrals yet</p>
              <p className="text-xs text-gray-600 mt-1">
                Share your referral link to start earning commissions!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {referrals.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                    U
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">
                      User_{r.referred_id.slice(0, 6)}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Joined {timeAgo(r.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-green-400">
                      +{r.commission_earned.toLocaleString()} sat
                    </p>
                    <p className="text-[10px] text-gray-500">earned</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {referrals.length > 0 && (
            <button className="w-full mt-3 py-2 rounded-lg bg-gray-800/50 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors flex items-center justify-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
