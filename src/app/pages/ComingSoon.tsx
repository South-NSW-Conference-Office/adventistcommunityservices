import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import acsLogo from '@/assets/68ee6e4764f54c4a5a0a4c46b17e9e2662a774ac.png';

export function ComingSoon() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password, rememberMe);

    if (!result.success) {
      setError(result.message || 'Invalid email or password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344] flex items-center justify-center px-6 py-12">
      {/* Gradient Background with decorative circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-white/30"></div>
        <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-white/20"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 rounded-full bg-white/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Coming Soon Info */}
          <div className="text-center lg:text-left">
            {/* Logo */}
            <div className="mb-8">
              <img
                src={acsLogo}
                alt="Adventist Community Services"
                className="h-20 lg:h-24 mx-auto lg:mx-0 rounded-lg shadow-lg"
              />
            </div>

            {/* Main Heading */}
            <h1 className="text-white text-6xl md:text-7xl font-bold mb-6 leading-tight">
              Something
              <br />
              <span className="text-white/80">Special</span>
              <br />
              Is Coming
            </h1>

            <p className="text-white/90 text-xl mb-8 leading-relaxed">
              We're building a new way to connect communities with essential services across Australia.
            </p>

            {/* Tagline */}
            <p className="text-white/60 italic">
              "Building stronger communities together"
            </p>
          </div>

          {/* Right Column - Login Form */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 lg:p-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-white text-2xl font-bold text-center mb-2">
              Admin Preview Access
            </h2>
            <p className="text-white/70 text-center mb-8">
              Enter your credentials to preview the platform
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-white font-semibold text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white font-semibold text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all pr-12"
                    placeholder="Enter password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#F44314] focus:ring-[#F44314] focus:ring-offset-0"
                    disabled={loading}
                  />
                  <span className="text-white/70 text-sm">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-white/70 text-sm hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 animate-shake">
                  <p className="text-red-100 text-sm text-center font-semibold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-[#F44314] py-4 px-6 rounded-xl font-bold hover:bg-white/90 transition-all transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Access Preview'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm text-center">
                Secure admin access only
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/50 text-sm">
            &copy; 2024 Australia's Adventist Community Service. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
