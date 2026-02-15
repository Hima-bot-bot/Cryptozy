import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Cpu, Power, Activity, Zap, Thermometer, Clock, Coins, BarChart3, AlertTriangle } from 'lucide-react';

export function Mining() {
  const { miningActive, toggleMining, hashRate, miningEarned, balanceSatoshi } = useApp();
  const [cpuUsage, setCpuUsage] = useState(0);
  const [temperature, setTemperature] = useState(42);
  const [uptime, setUptime] = useState(0);
  const [threads, setThreads] = useState(2);
  const [hashHistory, setHashHistory] = useState<number[]>(Array(20).fill(0));

  useEffect(() => {
    if (!miningActive) {
      setCpuUsage(0);
      setTemperature(42);
      return;
    }
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(Math.random() * 20) + threads * 12);
      setTemperature(Math.floor(Math.random() * 8) + 55 + threads * 5);
      setHashHistory(prev => [...prev.slice(1), hashRate]);
    }, 2000);
    return () => clearInterval(interval);
  }, [miningActive, threads, hashRate]);

  useEffect(() => {
    if (!miningActive) return;
    const interval = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(interval);
  }, [miningActive]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const maxHash = Math.max(...hashHistory, 1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-purple-400" /> CPU Mining
        </h1>
        <p className="text-sm text-gray-400 mt-1">Mine cryptocurrency directly in your browser using your CPU</p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-300">Important Notice</p>
          <p className="text-xs text-amber-400/70 mt-0.5">Browser mining uses your CPU. Higher thread counts increase earnings but also CPU usage. Adjust settings based on your device capabilities.</p>
        </div>
      </div>

      {/* Main mining control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Power button + Status */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center p-8 rounded-xl bg-[#111633] border border-gray-800/50">
          <button
            onClick={toggleMining}
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
              miningActive
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.15)]'
                : 'bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]'
            }`}
          >
            {miningActive && (
              <div className="absolute inset-0 rounded-full border-2 border-green-500/20 animate-ping" />
            )}
            <Power className={`w-12 h-12 ${miningActive ? 'text-green-400' : 'text-gray-500'}`} />
          </button>
          <p className={`mt-4 text-lg font-bold ${miningActive ? 'text-green-400' : 'text-gray-500'}`}>
            {miningActive ? 'MINING ACTIVE' : 'MINING STOPPED'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Click the button to {miningActive ? 'stop' : 'start'} mining</p>

          {/* Thread selector */}
          <div className="mt-6 w-full">
            <label className="text-xs text-gray-400 font-medium">CPU Threads: {threads}</label>
            <input
              type="range"
              min="1"
              max="4"
              value={threads}
              onChange={(e) => setThreads(Number(e.target.value))}
              className="w-full mt-2 accent-purple-500"
              disabled={miningActive}
            />
            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Max</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {/* Hashrate */}
          <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400 font-medium">Hash Rate</span>
            </div>
            <p className="text-3xl font-bold text-white">{miningActive ? hashRate.toFixed(1) : '0.0'}</p>
            <p className="text-xs text-gray-500">H/s (hashes per second)</p>
          </div>

          {/* CPU Usage */}
          <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-gray-400 font-medium">CPU Usage</span>
            </div>
            <p className="text-3xl font-bold text-white">{cpuUsage}%</p>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mt-2">
              <div className={`h-full rounded-full transition-all duration-1000 ${cpuUsage > 70 ? 'bg-red-500' : cpuUsage > 40 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${cpuUsage}%` }} />
            </div>
          </div>

          {/* Temperature */}
          <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400 font-medium">Temperature</span>
            </div>
            <p className="text-3xl font-bold text-white">{temperature}°C</p>
            <p className="text-xs text-gray-500">{temperature > 75 ? 'High - Consider reducing threads' : temperature > 60 ? 'Normal' : 'Cool'}</p>
          </div>

          {/* Uptime */}
          <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400 font-medium">Session Uptime</span>
            </div>
            <p className="text-3xl font-bold text-white font-mono">{formatTime(uptime)}</p>
            <p className="text-xs text-gray-500">Current session</p>
          </div>

          {/* Mined this session */}
          <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-gray-400 font-medium">Mining Earned</span>
            </div>
            <p className="text-3xl font-bold text-amber-400">{miningEarned}</p>
            <p className="text-xs text-gray-500">satoshi total mined</p>
          </div>

          {/* Balance */}
          <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400 font-medium">Total Balance</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{balanceSatoshi.toLocaleString()}</p>
            <p className="text-xs text-gray-500">satoshi</p>
          </div>
        </div>
      </div>

      {/* Hashrate chart */}
      <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-gray-300">Hashrate History</span>
          </div>
          <span className="text-xs text-gray-500">Last 20 updates</span>
        </div>
        <div className="flex items-end gap-1 h-32">
          {hashHistory.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className={`w-full rounded-t transition-all duration-500 ${
                  h > 0 ? 'bg-gradient-to-t from-purple-500/80 to-purple-400/40' : 'bg-gray-800/40'
                }`}
                style={{ height: `${Math.max((h / maxHash) * 100, 2)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-600">
          <span>Oldest</span>
          <span>Latest</span>
        </div>
      </div>
    </div>
  );
}
