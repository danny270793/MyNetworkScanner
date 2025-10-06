import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={t('common.back')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
                <span className="text-2xl">⚙️</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {t('settings.title')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
                <span className="text-gray-400">👤</span>
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Language Settings */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100 relative z-10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <span className="text-xl">🌍</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('settings.language.title')}</h2>
                <p className="text-gray-600 text-sm">{t('settings.language.description')}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">{t('settings.language.currentLanguage')}</p>
                <p className="text-sm text-gray-500">{t('settings.language.changeLanguage')}</p>
              </div>
              <div className="relative z-50">
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('settings.account.title')}</h2>
                <p className="text-gray-600 text-sm">{t('settings.account.description')}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="font-medium text-gray-700">{t('settings.account.email')}</span>
                <span className="text-gray-600 font-mono text-sm">{user?.email}</span>
              </div>
            </div>
          </div>

          {/* App Information */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-lg">
                <span className="text-xl">ℹ️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('settings.app.title')}</h2>
                <p className="text-gray-600 text-sm">{t('settings.app.description')}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="font-medium text-gray-700">{t('settings.app.name')}</span>
                <span className="text-gray-600">Network Scanner</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-medium text-gray-700">{t('settings.app.version')}</span>
                <span className="text-gray-600">1.0.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center pt-8">
          <button
            onClick={handleSignOut}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
          >
            <span className="text-xl">🚪</span>
            <span>{t('auth.signOut')}</span>
          </button>
        </div>
      </main>
    </div>
  );
}
