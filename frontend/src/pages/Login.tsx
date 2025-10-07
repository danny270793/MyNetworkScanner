import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md">
        {/* Glass-morphism card - Mobile Optimized */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 sm:space-y-6 border border-white/20">
          {/* Header with animation - Mobile Optimized */}
          <div className="text-center space-y-1 sm:space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg mb-2 transform hover:scale-110 transition-transform duration-300">
              <span className="text-2xl sm:text-3xl">🔐</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t('auth.welcomeBack')}
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">{t('auth.signInSubtitle')}</p>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700">
                {t('auth.email')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm sm:text-base">📧</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('auth.emailPlaceholder')}
                  disabled={loading}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700">
                {t('auth.password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm sm:text-base">🔒</span>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t('auth.passwordPlaceholder')}
                  disabled={loading}
                  minLength={6}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none touch-manipulation"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  <span className="text-sm sm:text-base">{t('auth.signingIn')}</span>
                </span>
              ) : (
                <span className="text-sm sm:text-base">{t('auth.signIn')}</span>
              )}
            </button>
          </form>

          {/* Footer - Mobile Optimized */}
          <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-xs sm:text-sm">
              {t('auth.dontHaveAccount')}{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-purple-600 transition-colors duration-200"
              >
                {t('auth.registerHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

