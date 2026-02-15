import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  LayoutDashboard, Tv, Link2, Gift, Cpu, Wallet, Users,
  Menu, X, Zap, ChevronRight
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ads', label: 'Watch Ads', icon: Tv },
  { id: 'shortlinks', label: 'Short Links', icon: Link2 },
  { id: 'offers', label: 'Offer Wall', icon: Gift },
  { id: 'mining', label: 'CPU Mining', icon: Cpu },
  { id: 'withdraw', label: 'Withdraw', icon: Wallet },
  { id: 'referral', label: 'Referral', icon: Users },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentPage, setPage, balanceSatoshi, satoshiToUsd, level, xp, xpToNext, miningActive } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0f1429] border-r border-gray-800/50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-4 flex items-center gap-0 border-b border-gray-800/50">
          <Logo size={42} showText={true} />
          <button className="ml-auto lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance card */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <p className="text-[10px] uppercase tracking-wider text-amber-400/70">Balance</p>
          <p className="text-xl font-bold text-amber-400">{balanceSatoshi.toLocaleString()} <span className="text-xs font-normal text-amber-400/60">sat</span></p>
          <p className="text-[11px] text-gray-500">≈ ${satoshiToUsd(balanceSatoshi)} USD</p>
        </div>

        {/* Level */}
        <div className="mx-4 mt-3 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-300">Level {level}</span>
            </div>
            <span className="text-[10px] text-gray-500">{xp}/{xpToNext} XP</span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{ width: `${(xp / xpToNext) * 100}%` }} />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${isActive
                    ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent'
                  }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                {item.label}
                {item.id === 'mining' && miningActive && (
                  <span className="ml-auto flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
                {!miningActive && isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-amber-400/50" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
              CU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">CryptoUser</p>
              <p className="text-[10px] text-gray-500">Member since 2024</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 bg-[#0a0e1a]/80 backdrop-blur-xl border-b border-gray-800/50 flex items-center px-4 lg:px-6 gap-4">
          <button className="lg:hidden text-gray-400 hover:text-gray-200" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold capitalize">{currentPage === 'ads' ? 'Watch Ads' : currentPage === 'shortlinks' ? 'Short Links' : currentPage === 'offers' ? 'Offer Wall' : currentPage}</h2>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <svg width="14" height="14" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="headerIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                </defs>
                <polygon points="60,8 107,32 107,88 60,112 13,88 13,32" fill="none" stroke="url(#headerIconGrad)" strokeWidth="5" />
                <path d="M 44 35 L 76 35 L 52 58 L 72 58 L 42 90 L 52 62 L 38 62 Z" fill="url(#headerIconGrad)" />
              </svg>
              <span className="text-sm font-semibold text-amber-400">{balanceSatoshi.toLocaleString()}</span>
              <span className="text-[10px] text-amber-400/50">SAT</span>
            </div>
            {miningActive && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-green-400 font-medium">Mining</span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
