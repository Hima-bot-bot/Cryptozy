import { useState } from 'react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Loader2, Shield, Zap, Globe } from 'lucide-react';

export function Auth() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'register') {
      if (username.length < 3) {
        setError('Username must be at least 3 characters');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      const result = await signUp(email, password, username);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Account created successfully! Check your email to confirm your account, then sign in.');
      }
    } else {
      const result = await signIn(email, password);
      if (result.error) {
        setError(result.error);
      }
    }
    setLoading(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size={56} showText={true} />
        </div>

        {/* Tagline */}
        <p className="text-center text-sm text-gray-400 mb-6">
          Earn free cryptocurrency by watching ads, visiting links, completing offers & mining.
        </p>

        {/* Card */}
        <div className="rounded-2xl bg-[#111633]/80 backdrop-blur-xl border border-gray-800/50 p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-gray-900/50 mb-6">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-green-300">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username (register only) */}
            {mode === 'register' && (
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                    minLength={3}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0a0e1a] border border-gray-800/50 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/30 transition-colors text-sm"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0a0e1a] border border-gray-800/50 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/30 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min 6 characters' : 'Enter your password'}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-[#0a0e1a] border border-gray-800/50 text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/30 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch mode link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={switchMode}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
              >
                {mode === 'login' ? 'Create one for free' : 'Sign in instead'}
              </button>
            </p>
          </div>
        </div>

        {/* Features cards */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: <Shield className="w-4 h-4 text-green-400" />, label: 'Secure Auth', sub: 'End-to-end encrypted' },
            { icon: <Zap className="w-4 h-4 text-amber-400" />, label: 'Instant Payouts', sub: 'Via FaucetPay' },
            { icon: <Globe className="w-4 h-4 text-cyan-400" />, label: 'Global Access', sub: 'Worldwide earning' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#111633]/50 border border-gray-800/30">
              {f.icon}
              <span className="text-[10px] font-semibold text-gray-300">{f.label}</span>
              <span className="text-[9px] text-gray-600">{f.sub}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-600 mt-6">
          © 2025 Cryptozy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
