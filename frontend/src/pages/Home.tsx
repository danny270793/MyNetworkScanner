import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
                <span className="text-2xl">🌐</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Network Scanner
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
                <span className="text-gray-400">👤</span>
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section with Animation */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 animate-fade-in">
            Welcome Back! 👋
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You are now logged in and ready to scan your network for connected devices
          </p>
        </div>

        {/* Account Info Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Your Account</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Email</p>
              <p className="text-lg font-bold text-gray-900 break-all">{user?.email}</p>
            </div>
            <div className="space-y-2 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">User ID</p>
              <p className="text-sm font-mono font-bold text-gray-900 break-all">{user?.id}</p>
            </div>
            <div className="space-y-2 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Member Since</p>
              <p className="text-lg font-bold text-gray-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">🔍 Powerful Features</h3>
            <p className="text-gray-600">Coming soon to revolutionize your network management</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature Card 1 */}
            <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">📡</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Network Scanning</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Scan your local network for connected devices in real-time
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Device History</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                View historical data and track device connections over time
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">🔔</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Smart Alerts</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get instant notifications when new devices join your network
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <span className="text-3xl">⚙️</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Customization</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Personalize your scanning preferences and dashboard settings
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-center shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-3">Ready to Get Started?</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Start scanning your network and discover all connected devices with our powerful tool
          </p>
          <button className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200">
            Start Scanning Now 🚀
          </button>
        </div>
      </main>
    </div>
  );
}

