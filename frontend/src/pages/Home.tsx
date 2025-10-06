import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>🌐 Network Scanner</h1>
          <div className="navbar-actions">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleSignOut} className="sign-out-button">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="welcome-section">
          <h2>Welcome to Network Scanner! 👋</h2>
          <p className="welcome-text">
            You are now logged in and can access the network scanning features.
          </p>
        </div>

        <div className="info-card">
          <h3>📊 Your Account</h3>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">User ID:</span>
            <span className="info-value">{user?.id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Account Created:</span>
            <span className="info-value">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="features-section">
          <h3>🔍 Coming Soon</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📡</div>
              <h4>Network Scanning</h4>
              <p>Scan your local network for connected devices</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h4>Device History</h4>
              <p>View historical data of scanned devices</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h4>Notifications</h4>
              <p>Get alerts when new devices join your network</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚙️</div>
              <h4>Settings</h4>
              <p>Customize your scanning preferences</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

