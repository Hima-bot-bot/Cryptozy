import { useApp } from '../context/AppContext';
import {
  TrendingUp, Tv, Link2, Gift, Cpu, ArrowUpRight, ArrowDownRight,
  Clock, Bitcoin, DollarSign, Users, Flame
} from 'lucide-react';

const typeColors: Record<string, string> = {
  ad: 'text-blue-400 bg-blue-500/10',
  shortlink: 'text-cyan-400 bg-cyan-500/10',
  offer: 'text-green-400 bg-green-500/10',
  mining: 'text-purple-400 bg-purple-500/10',
  referral: 'text-amber-400 bg-amber-500/10',
  withdraw: 'text-red-400 bg-red-500/10',
};

const typeIcons: Record<string, React.ReactNode> = {
  ad: <Tv className="w-3.5 h-3.5" />,
  shortlink: <Link2 className="w-3.5 h-3.5" />,
  offer: <Gift className="w-3.5 h-3.5" />,
  mining: <Cpu className="w-3.5 h-3.5" />,
  referral: <Users className="w-3.5 h-3.5" />,
  withdraw: <ArrowDownRight className="w-3.5 h-3.5" />,
};

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function Dashboard() {
  const app = useApp();

  const stats = [
    {
      label: 'Total Earned',
      value: `${app.totalEarned.toLocaleString()}`,
      sub: `≈ $${app.satoshiToUsd(app.totalEarned)}`,
      icon: <Bitcoin className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-500/10 to-orange-500/10',
      borderColor: 'border-amber-500/20',
      change: '+12.5%',
      up: true,
    },
    {
      label: 'Today Earned',
      value: `${app.todayEarned.toLocaleString()}`,
      sub: `≈ $${app.satoshiToUsd(app.todayEarned)}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20',
      change: '+8.3%',
      up: true,
    },
    {
      label: 'Referral Earnings',
      value: `${app.referralEarnings.toLocaleString()}`,
      sub: `${app.referralCount} referrals`,
      icon: <Users className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20',
      change: '+5.2%',
      up: true,
    },
    {
      label: 'USD Value',
      value: `$${app.satoshiToUsd(app.balanceSatoshi)}`,
      sub: `${app.balanceSatoshi.toLocaleString()} sat`,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-500/10 to-blue-500/10',
      borderColor: 'border-cyan-500/20',
      change: '+2.1%',
      up: true,
    },
  ];

  const quickStats = [
    { label: 'Ads Watched', value: app.adsWatched, icon: <Tv className="w-4 h-4 text-blue-400" /> },
    { label: 'Links Visited', value: app.linksVisited, icon: <Link2 className="w-4 h-4 text-cyan-400" /> },
    { label: 'Offers Done', value: app.offersCompleted, icon: <Gift className="w-4 h-4 text-green-400" /> },
    { label: 'Mining Earned', value: `${app.miningEarned} sat`, icon: <Cpu className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {app.username}! 👋</h1>
          <p className="text-sm text-gray-400 mt-1">Here's your earning overview for today</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-medium text-orange-300">7 day streak!</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} p-4`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {stat.up ? <ArrowUpRight className="w-3 h-3 text-green-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
              <span className={`text-xs font-medium ${stat.up ? 'text-green-400' : 'text-red-400'}`}>{stat.change}</span>
              <span className="text-xs text-gray-500">vs yesterday</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((qs, i) => (
          <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-[#111633] border border-gray-800/50">
            <div className="w-9 h-9 rounded-lg bg-gray-800/80 flex items-center justify-center">
              {qs.icon}
            </div>
            <div>
              <p className="text-lg font-bold text-white">{qs.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{qs.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Earning Methods + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Earning methods quick access */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-sm font-semibold text-gray-300">Quick Earn</h3>
          {[
            { page: 'ads', label: 'Watch Ads', desc: 'Up to 150 sat/ad', icon: <Tv className="w-5 h-5" />, color: 'from-blue-500 to-indigo-500' },
            { page: 'shortlinks', label: 'Short Links', desc: 'Up to 100 sat/link', icon: <Link2 className="w-5 h-5" />, color: 'from-cyan-500 to-teal-500' },
            { page: 'offers', label: 'Offer Wall', desc: 'Up to 50,000 sat', icon: <Gift className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
            { page: 'mining', label: 'CPU Mining', desc: 'Passive earning', icon: <Cpu className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
          ].map(item => (
            <button
              key={item.page}
              onClick={() => app.setPage(item.page)}
              className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-[#111633] border border-gray-800/50 hover:border-gray-700 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                {item.icon}
              </div>
              <div className="text-left flex-1">
                <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{item.label}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-colors" />
            </button>
          ))}
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Recent Activity</h3>
          <div className="rounded-xl bg-[#111633] border border-gray-800/50 overflow-hidden">
            <div className="divide-y divide-gray-800/50">
              {app.activities.slice(0, 8).map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3.5 hover:bg-gray-800/20 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[activity.type]}`}>
                    {typeIcons[activity.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{activity.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-600" />
                      <span className="text-[11px] text-gray-500">{timeAgo(activity.timestamp)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${activity.type === 'withdraw' ? 'text-red-400' : 'text-green-400'}`}>
                      {activity.type === 'withdraw' ? '-' : '+'}{activity.amount} sat
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
