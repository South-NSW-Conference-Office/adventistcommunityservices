import { useState, FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../services/auth';
import acsLogo from '@/assets/68ee6e4764f54c4a5a0a4c46b17e9e2662a774ac.png';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await AuthService.resetPassword(token, password);

    setLoading(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message || 'Failed to reset password');
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
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <img
            src={acsLogo}
            alt="Adventist Community Services"
            className="h-16 mx-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          {success ? (
            // Success State
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <h2 className="text-white text-2xl font-bold mb-2">Password Reset!</h2>
              <p className="text-white/70 mb-8">
                Your password has been successfully reset. You can now log in with your new password.
              </p>

              <button
                onClick={() => navigate('/')}
                className="w-full bg-white text-[#F44314] py-3 px-6 rounded-xl font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Go to Login
              </button>
            </div>
          ) : !token ? (
            // No Token State
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-red-400" />
                </div>
              </div>

              <h2 className="text-white text-2xl font-bold mb-2">Invalid Link</h2>
              <p className="text-white/70 mb-8">
                This password reset link is invalid or has expired. Please request a new one.
              </p>

              <div className="space-y-3">
                <Link
                  to="/forgot-password"
                  className="w-full bg-white text-[#F44314] py-3 px-6 rounded-xl font-bold hover:bg-white/90 transition-all flex items-center justify-center"
                >
                  Request New Reset Link
                </Link>
                <Link
                  to="/"
                  className="w-full bg-white/10 text-white py-3 px-6 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            // Form State
            <>
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-white text-2xl font-bold text-center mb-2">
                Reset Password
              </h2>
              <p className="text-white/70 text-center mb-8">
                Enter your new password below
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="password" className="block text-white font-semibold text-sm mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                      placeholder="Enter new password"
                      required
                      disabled={loading}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-white font-semibold text-sm mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                      placeholder="Confirm new password"
                      required
                      disabled={loading}
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
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
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10">
                <Link
                  to="/"
                  className="flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            &copy; 2024 Australia's Adventist Community Service. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
