import { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { fetchWithdrawals, type DbWithdrawal } from '../lib/database';
import { CaptchaBox } from '../components/CaptchaBox';
import {
  Wallet, Bitcoin, ArrowRight, Shield, Clock,
  CheckCircle2, AlertCircle, Zap, Copy, Check, Loader2,
} from 'lucide-react';

type WithdrawMethod = {
  id: string;
  name: string;
  icon: string;
  minAmount: number;
  fee: number;
  processingTime: string;
  network: string;
};

const methods: WithdrawMethod[] = [
  { id: 'btc', name: 'Bitcoin (BTC)', icon: '₿', minAmount: 50000, fee: 1000, processingTime: '1-3 hours', network: 'Bitcoin Network' },
  { id: 'ltc', name: 'Litecoin (LTC)', icon: 'Ł', minAmount: 20000, fee: 200, processingTime: '30 minutes', network: 'Litecoin Network' },
  { id: 'doge', name: 'Dogecoin (DOGE)', icon: 'Ð', minAmount: 10000, fee: 100, processingTime: '15 minutes', network: 'Dogecoin Network' },
  { id: 'usdt', name: 'Tether (USDT)', icon: '₮', minAmount: 30000, fee: 500, processingTime: '10 minutes', network: 'TRC-20' },
  { id: 'trx', name: 'TRON (TRX)', icon: 'T', minAmount: 15000, fee: 50, processingTime: '5 minutes', network: 'TRON Network' },
  { id: 'faucetpay', name: 'FaucetPay', icon: 'F', minAmount: 5000, fee: 0, processingTime: 'Instant', network: 'FaucetPay' },
];

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function Withdraw() {
  const { balanceSatoshi, satoshiToUsd, withdraw } = useApp();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string>('faucetpay');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Captcha state
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  // Real withdrawals from DB
  const [withdrawals, setWithdrawals] = useState<DbWithdrawal[]>([]);
  const [withdrawalsLoading, setWithdrawalsLoading] = useState(true);

  const loadWithdrawals = useCallback(async () => {
    if (!user) return;
    const data = await fetchWithdrawals(user.id, 10);
    setWithdrawals(data);
    setWithdrawalsLoading(false);
  }, [user]);

  useEffect(() => {
    loadWithdrawals();
  }, [loadWithdrawals]);

  const method = methods.find((m) => m.id === selectedMethod)!;
  const numAmount = Number(amount) || 0;
  const canWithdraw =
    numAmount >= method.minAmount &&
    numAmount <= balanceSatoshi &&
    address.length > 10 &&
    !processing &&
    captchaVerified;
  const netAmount = Math.max(0, numAmount - method.fee);

  const handleWithdraw = async () => {
    if (!canWithdraw) return;
    setProcessing(true);

    const ok = await withdraw(numAmount, method.name, address, method.fee);

    setProcessing(false);
    if (ok) {
      setSuccess(true);
      setAmount('');
      setAddress('');
      loadWithdrawals();
      // Reset captcha after withdrawal
      setCaptchaResetKey(k => k + 1);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-amber-400" /> Withdraw
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Withdraw your earned cryptocurrency to your wallet
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-sm font-semibold text-green-300">
              Withdrawal Submitted Successfully!
            </p>
            <p className="text-xs text-green-400/70">
              Your withdrawal is being processed. Check status below.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Balance card */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Available Balance
                </p>
                <p className="text-3xl font-bold text-amber-400 mt-1">
                  {balanceSatoshi.toLocaleString()}{' '}
                  <span className="text-sm font-normal text-amber-400/60">
                    sat
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  ≈ ${satoshiToUsd(balanceSatoshi)} USD
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Bitcoin className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Method selection */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-3 block">
              Select Withdrawal Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    selectedMethod === m.id
                      ? 'bg-amber-500/10 border-2 border-amber-500/30'
                      : 'bg-[#111633] border-2 border-transparent hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-amber-400">
                      {m.icon}
                    </span>
                    <span className="text-xs font-semibold text-gray-200">
                      {m.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">
                    Min: {m.minAmount.toLocaleString()} sat
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">
              Amount (satoshi)
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: ${method.minAmount.toLocaleString()} sat`}
                className="w-full px-4 py-3 rounded-xl bg-[#111633] border border-gray-800/50 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/30 text-lg"
              />
              <button
                onClick={() => setAmount(balanceSatoshi.toString())}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
              >
                MAX
              </button>
            </div>
            {numAmount > 0 && numAmount < method.minAmount && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Minimum withdrawal:{' '}
                {method.minAmount.toLocaleString()} sat
              </p>
            )}
          </div>

          {/* Address input */}
          <div>
            <label className="text-sm font-semibold text-gray-300 mb-2 block">
              {method.name} Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={`Enter your ${method.name} address`}
              className="w-full px-4 py-3 rounded-xl bg-[#111633] border border-gray-800/50 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/30"
            />
          </div>

          {/* Summary */}
          {numAmount > 0 && (
            <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Amount</span>
                <span className="text-gray-200 font-medium">
                  {numAmount.toLocaleString()} sat
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Network Fee</span>
                <span className="text-red-400 font-medium">
                  -{method.fee.toLocaleString()} sat
                </span>
              </div>
              <div className="border-t border-gray-800/50 pt-2 flex justify-between text-sm">
                <span className="text-gray-300 font-semibold">You Receive</span>
                <span className="text-green-400 font-bold text-lg">
                  {netAmount.toLocaleString()} sat
                </span>
              </div>
            </div>
          )}

          {/* hCaptcha verification */}
          <CaptchaBox
            onStatusChange={setCaptchaVerified}
            resetTrigger={captchaResetKey}
          />

          {/* Withdraw button */}
          <button
            onClick={handleWithdraw}
            disabled={!canWithdraw}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              canWithdraw
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-500/20'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : !captchaVerified ? (
              <>
                <Shield className="w-4 h-4" />
                Complete Captcha First
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Withdraw Now
              </>
            )}
          </button>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Method info */}
          <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50 space-y-3">
            <h3 className="text-sm font-semibold text-gray-300">
              Method Details
            </h3>
            {[
              {
                label: 'Network',
                value: method.network,
                icon: <Zap className="w-3.5 h-3.5 text-purple-400" />,
              },
              {
                label: 'Processing',
                value: method.processingTime,
                icon: <Clock className="w-3.5 h-3.5 text-cyan-400" />,
              },
              {
                label: 'Fee',
                value: `${method.fee} sat`,
                icon: <Bitcoin className="w-3.5 h-3.5 text-amber-400" />,
              },
              {
                label: 'Security',
                value: 'hCaptcha + 2FA',
                icon: <Shield className="w-3.5 h-3.5 text-green-400" />,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-xs text-gray-400">{item.label}</span>
                </div>
                <span className="text-xs font-medium text-gray-200">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Recent withdrawals — from DB */}
          <div className="p-4 rounded-xl bg-[#111633] border border-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Recent Withdrawals
            </h3>

            {withdrawalsLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="text-center py-6">
                <Wallet className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                <p className="text-xs text-gray-500">No withdrawals yet</p>
                <p className="text-[10px] text-gray-600 mt-1">
                  Your withdrawal history will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((w) => (
                  <div
                    key={w.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-800/30"
                  >
                    <div>
                      <p className="text-xs font-medium text-gray-200">
                        {w.method}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-500">
                          {timeAgo(w.created_at)}
                        </span>
                        {w.tx_hash && (
                          <button
                            onClick={() => handleCopy(w.tx_hash!, w.id)}
                            className="flex items-center gap-0.5 text-[10px] text-gray-600 hover:text-gray-400"
                          >
                            {copiedId === w.id ? (
                              <Check className="w-2.5 h-2.5" />
                            ) : (
                              <Copy className="w-2.5 h-2.5" />
                            )}
                            {w.tx_hash.slice(0, 8)}...
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-amber-400">
                        {w.amount.toLocaleString()} sat
                      </p>
                      <span
                        className={`text-[10px] ${
                          w.status === 'completed'
                            ? 'text-green-400'
                            : w.status === 'failed'
                            ? 'text-red-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {w.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
