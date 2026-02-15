import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { CaptchaBox } from '../components/CaptchaBox';
import { Link2, Coins, ExternalLink, CheckCircle2, Clock, Shield, Zap, Globe } from 'lucide-react';

type ShortLink = {
  id: number;
  title: string;
  domain: string;
  reward: number;
  views: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
};

const initialLinks: ShortLink[] = [
  { id: 1, title: 'Visit CryptoNews Article', domain: 'cryptonews.link', reward: 40, views: 12453, difficulty: 'easy', completed: false },
  { id: 2, title: 'DeFi Tutorial Page', domain: 'defilearn.io', reward: 55, views: 8721, difficulty: 'easy', completed: false },
  { id: 3, title: 'Blockchain Explorer Guide', domain: 'chainview.co', reward: 70, views: 5432, difficulty: 'medium', completed: false },
  { id: 4, title: 'Smart Contract Basics', domain: 'solidityguide.dev', reward: 85, views: 3219, difficulty: 'medium', completed: false },
  { id: 5, title: 'Mining Pool Comparison', domain: 'poolstats.net', reward: 65, views: 7654, difficulty: 'easy', completed: false },
  { id: 6, title: 'Tokenomics Deep Dive', domain: 'tokendata.xyz', reward: 90, views: 2105, difficulty: 'hard', completed: false },
  { id: 7, title: 'Web3 Wallet Setup', domain: 'web3start.org', reward: 75, views: 4567, difficulty: 'medium', completed: false },
  { id: 8, title: 'Layer 2 Solutions Explained', domain: 'l2guide.tech', reward: 100, views: 1890, difficulty: 'hard', completed: false },
  { id: 9, title: 'DAO Governance Overview', domain: 'daoinfo.wiki', reward: 60, views: 6234, difficulty: 'easy', completed: false },
  { id: 10, title: 'Exclusive Research Report', domain: 'alpharesearch.io', reward: 120, views: 987, difficulty: 'hard', completed: false },
];

const diffStyles = {
  easy: 'bg-green-500/10 text-green-400 border-green-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function ShortLinks() {
  const { earnFromLink } = useApp();
  const [links, setLinks] = useState<ShortLink[]>(initialLinks);
  const [visitingId, setVisitingId] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Captcha state
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  const startVisiting = useCallback((link: ShortLink) => {
    if (visitingId !== null || link.completed || !captchaVerified) return;
    setVisitingId(link.id);
    setCountdown(link.difficulty === 'easy' ? 5 : link.difficulty === 'medium' ? 8 : 12);
  }, [visitingId, captchaVerified]);

  useEffect(() => {
    if (visitingId === null || countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [visitingId, countdown]);

  useEffect(() => {
    if (visitingId !== null && countdown === 0) {
      const link = links.find(l => l.id === visitingId);
      if (link) {
        earnFromLink(link.reward);
        setLinks(prev => prev.map(l => l.id === visitingId ? { ...l, completed: true } : l));
      }
      setVisitingId(null);
      // Reset captcha after earning
      setCaptchaResetKey(k => k + 1);
    }
  }, [visitingId, countdown, links, earnFromLink]);

  const filtered = filter === 'all' ? links : links.filter(l => l.difficulty === filter);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Link2 className="w-6 h-6 text-cyan-400" /> Short Links
        </h1>
        <p className="text-sm text-gray-400 mt-1">Visit short links and earn satoshi for each completion</p>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Available', value: links.filter(l => !l.completed).length, icon: <Globe className="w-4 h-4 text-cyan-400" /> },
          { label: 'Total Reward', value: `${links.filter(l => !l.completed).reduce((s, l) => s + l.reward, 0)} sat`, icon: <Coins className="w-4 h-4 text-amber-400" /> },
          { label: 'Anti-Bot', value: 'Active', icon: <Shield className="w-4 h-4 text-green-400" /> },
          { label: 'Bonus', value: '1.5x', icon: <Zap className="w-4 h-4 text-purple-400" /> },
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

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'easy', 'medium', 'hard'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-gray-800/50 text-gray-500 border border-gray-800 hover:text-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Links table */}
      <div className="rounded-xl bg-[#111633] border border-gray-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-4 py-3">Link</th>
                <th className="text-left text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-4 py-3 hidden sm:table-cell">Domain</th>
                <th className="text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-4 py-3">Difficulty</th>
                <th className="text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-4 py-3">Reward</th>
                <th className="text-center text-[10px] uppercase tracking-wider text-gray-500 font-semibold px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map(link => {
                const isVisiting = visitingId === link.id;
                const isDisabled = isVisiting || link.completed || visitingId !== null || !captchaVerified;
                return (
                  <tr key={link.id} className={`hover:bg-gray-800/20 transition-colors ${link.completed ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                        <span className="text-sm text-gray-200 font-medium">{link.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">{link.domain}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${diffStyles[link.difficulty]}`}>
                        {link.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-bold text-amber-400">{link.reward} <span className="text-[10px] text-amber-400/60">sat</span></span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => startVisiting(link)}
                        disabled={isDisabled}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          link.completed
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : isVisiting
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : (visitingId !== null || !captchaVerified)
                                ? 'bg-gray-800/50 text-gray-600 border border-gray-800'
                                : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/20'
                        }`}
                      >
                        {link.completed ? (
                          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Done</span>
                        ) : isVisiting ? (
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 animate-spin" /> {countdown}s</span>
                        ) : !captchaVerified ? '🔒 Verify' : 'Visit'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
