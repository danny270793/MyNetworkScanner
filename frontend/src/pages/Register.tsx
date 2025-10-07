import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Wait 2 seconds before redirecting to login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        {/* Glass-morphism card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20">
          {/* Header with animation */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl shadow-lg mb-2 transform hover:scale-110 transition-transform duration-300">
              <span className="text-3xl">📝</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm">Join Network Scanner today</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 animate-shake">
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-xl">⚠️</span>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-2">
                <span className="text-green-500 text-xl">✅</span>
                <p className="text-green-700 text-sm font-medium">
                  Account created successfully! Check your email to verify your account. Redirecting...
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400">📧</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  disabled={loading || success}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔒</span>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  disabled={loading || success}
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔐</span>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  disabled={loading || success}
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span>Creating account...</span>
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-violet-600 hover:text-fuchsia-600 transition-colors duration-200"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

