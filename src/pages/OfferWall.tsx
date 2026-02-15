import { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Gift, Coins, Star, Clock, CheckCircle2, Search, TrendingUp, Users, Trophy } from 'lucide-react';

type Offer = {
  id: number;
  title: string;
  description: string;
  provider: string;
  reward: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  popularity: number;
  completed: boolean;
  completing: boolean;
};

const initialOffers: Offer[] = [
  { id: 1, title: 'Complete Quick Survey', description: 'Answer 5 questions about your crypto habits', provider: 'SurveyPro', reward: 2000, category: 'Survey', difficulty: 'easy', estimatedTime: '2 min', popularity: 95, completed: false, completing: false },
  { id: 2, title: 'Sign Up for Exchange', description: 'Create a free account on partner exchange', provider: 'CoinTrader', reward: 15000, category: 'Sign Up', difficulty: 'easy', estimatedTime: '3 min', popularity: 88, completed: false, completing: false },
  { id: 3, title: 'Install Crypto Tracker App', description: 'Download and open the portfolio tracking app', provider: 'TrackFolio', reward: 8000, category: 'App Install', difficulty: 'easy', estimatedTime: '2 min', popularity: 92, completed: false, completing: false },
  { id: 4, title: 'Complete KYC Verification', description: 'Verify your identity on partner platform', provider: 'VerifyChain', reward: 25000, category: 'Verification', difficulty: 'medium', estimatedTime: '10 min', popularity: 72, completed: false, completing: false },
  { id: 5, title: 'Trading Tutorial Completion', description: 'Complete the beginner trading course', provider: 'LearnCrypto', reward: 12000, category: 'Education', difficulty: 'medium', estimatedTime: '15 min', popularity: 81, completed: false, completing: false },
  { id: 6, title: 'Market Research Study', description: 'In-depth survey about blockchain technology adoption', provider: 'ResearchDAO', reward: 35000, category: 'Survey', difficulty: 'hard', estimatedTime: '25 min', popularity: 65, completed: false, completing: false },
  { id: 7, title: 'Play Crypto Game Level 5', description: 'Reach level 5 in the partner blockchain game', provider: 'CryptoQuest', reward: 20000, category: 'Gaming', difficulty: 'medium', estimatedTime: '20 min', popularity: 78, completed: false, completing: false },
  { id: 8, title: 'Subscribe to Newsletter', description: 'Subscribe and confirm email for crypto newsletter', provider: 'CryptoDigest', reward: 3000, category: 'Sign Up', difficulty: 'easy', estimatedTime: '1 min', popularity: 97, completed: false, completing: false },
  { id: 9, title: 'First Deposit Bonus', description: 'Make a minimum deposit on partner exchange', provider: 'ProExchange', reward: 50000, category: 'Deposit', difficulty: 'hard', estimatedTime: '5 min', popularity: 55, completed: false, completing: false },
];

const catColors: Record<string, string> = {
  'Survey': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Sign Up': 'bg-green-500/10 text-green-400 border-green-500/20',
  'App Install': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Verification': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Education': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Gaming': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Deposit': 'bg-red-500/10 text-red-400 border-red-500/20',
};

export function OfferWall() {
  const { earnFromOffer } = useApp();
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'reward' | 'popularity'>('popularity');

  const categories = ['All', ...Array.from(new Set(initialOffers.map(o => o.category)))];

  const startOffer = useCallback((id: number) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, completing: true } : o));
    const offer = offers.find(o => o.id === id);
    if (!offer) return;

    setTimeout(() => {
      earnFromOffer(offer.reward);
      setOffers(prev => prev.map(o => o.id === id ? { ...o, completed: true, completing: false } : o));
    }, 2000);
  }, [offers, earnFromOffer]);

  let filtered = offers
    .filter(o => catFilter === 'All' || o.category === catFilter)
    .filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase()));

  if (sortBy === 'reward') filtered = [...filtered].sort((a, b) => b.reward - a.reward);
  else filtered = [...filtered].sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gift className="w-6 h-6 text-green-400" /> Offer Wall
        </h1>
        <p className="text-sm text-gray-400 mt-1">Complete offers and earn large rewards instantly</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Available', value: offers.filter(o => !o.completed).length, icon: <Gift className="w-4 h-4 text-green-400" /> },
          { label: 'Total Rewards', value: `${(offers.filter(o => !o.completed).reduce((s, o) => s + o.reward, 0) / 1000).toFixed(0)}K sat`, icon: <Coins className="w-4 h-4 text-amber-400" /> },
          { label: 'Top Reward', value: `${Math.max(...offers.map(o => o.reward)).toLocaleString()} sat`, icon: <Trophy className="w-4 h-4 text-purple-400" /> },
          { label: 'Active Users', value: '2.4K', icon: <Users className="w-4 h-4 text-cyan-400" /> },
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

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search offers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111633] border border-gray-800/50 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-green-500/30"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy(sortBy === 'reward' ? 'popularity' : 'reward')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#111633] border border-gray-800/50 text-xs font-medium text-gray-400 hover:text-gray-200"
          >
            <TrendingUp className="w-3.5 h-3.5" /> Sort: {sortBy === 'reward' ? 'Reward' : 'Popular'}
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCatFilter(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              catFilter === cat
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-gray-800/50 text-gray-500 border border-gray-800 hover:text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Offers grid */}
      <div className="space-y-3">
        {filtered.map(offer => (
          <div key={offer.id} className={`rounded-xl bg-[#111633] border border-gray-800/50 p-4 transition-all ${offer.completed ? 'opacity-50' : 'hover:border-gray-700'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${catColors[offer.category] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                    {offer.category}
                  </span>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${
                    offer.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    offer.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {offer.difficulty}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-200">{offer.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{offer.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-gray-500">by {offer.provider}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-500"><Clock className="w-3 h-3" /> {offer.estimatedTime}</span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-500"><Star className="w-3 h-3 text-amber-500" /> {offer.popularity}%</span>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-xl font-bold text-amber-400">{offer.reward.toLocaleString()}</span>
                  <span className="text-xs text-amber-400/60">sat</span>
                </div>
                <button
                  onClick={() => startOffer(offer.id)}
                  disabled={offer.completed || offer.completing}
                  className={`px-6 py-2 rounded-lg text-xs font-semibold transition-all min-w-[100px] ${
                    offer.completed
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : offer.completing
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30 animate-pulse'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/20'
                  }`}
                >
                  {offer.completed ? (
                    <span className="flex items-center gap-1 justify-center"><CheckCircle2 className="w-3.5 h-3.5" /> Done</span>
                  ) : offer.completing ? 'Completing...' : 'Start Offer'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
