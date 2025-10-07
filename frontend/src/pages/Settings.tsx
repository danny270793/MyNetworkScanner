import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemePicker from '../components/ThemePicker';

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  console.log('⚙️ Settings page loaded');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile-First Navigation Bar */}
      <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-manipulation"
                title={t('common.back')}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                <span className="text-lg sm:text-2xl">⚙️</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent truncate">
                {t('settings.title')}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Mobile First */}
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Settings Sections */}
        <div className="space-y-4 sm:space-y-6">
          {/* Language Settings - Mobile Optimized */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 relative z-11">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-1.5 sm:p-2 rounded-lg">
                <span className="text-lg sm:text-xl">🌍</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.language.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{t('settings.language.description')}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">{t('settings.language.currentLanguage')}</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t('settings.language.changeLanguage')}</p>
              </div>
              <div className="relative z-[60] flex-shrink-0">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* Theme Settings - Mobile Optimized */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700 relative z-10">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-1.5 sm:p-2 rounded-lg">
                <span className="text-lg sm:text-xl">🎨</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Theme</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Choose your preferred theme appearance</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">Appearance</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Select how the interface should look</p>
              </div>
              <div className="relative z-[60] flex-shrink-0">
                <ThemePicker />
              </div>
            </div>
          </div>

          {/* Account Information - Mobile Optimized */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-1.5 sm:p-2 rounded-lg">
                <span className="text-lg sm:text-xl">👤</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.account.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{t('settings.account.description')}</p>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 space-y-1 sm:space-y-0">
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">{t('settings.account.email')}</span>
                <span className="text-gray-600 dark:text-gray-400 font-mono text-xs sm:text-sm break-all">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* App Information - Mobile Optimized */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-1.5 sm:p-2 rounded-lg">
                <span className="text-lg sm:text-xl">ℹ️</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{t('settings.app.title')}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{t('settings.app.description')}</p>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 space-y-1 sm:space-y-0">
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">{t('settings.app.name')}</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Network Scanner</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 space-y-1 sm:space-y-0">
                <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">{t('settings.app.version')}</span>
                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">1.0.0</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-4 sm:pt-8">
          <button
            onClick={handleSignOut}
            className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-4 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 touch-manipulation"
          >
            <span className="text-lg sm:text-xl">🚪</span>
            <span className="text-sm sm:text-base">{t('auth.signOut')}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
