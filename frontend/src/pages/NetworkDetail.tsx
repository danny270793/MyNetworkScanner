import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDevicesByNetwork, type Device } from '../lib/devices';
import { getNetworks, type Network } from '../lib/networks';

export default function NetworkDetail() {
  const { networkId } = useParams<{ networkId: string }>();
  const navigate = useNavigate();
  
  const [network, setNetwork] = useState<Network | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNetworkAndDevices();
  }, [networkId]);

  const loadNetworkAndDevices = async () => {
    if (!networkId) return;
    
    try {
      setLoading(true);
      setError('');

      // Load network info
      const networks = await getNetworks();
      const currentNetwork = networks.find(n => `${n.id}` === `${networkId}`);
      
      if (!currentNetwork) {
        setError('Network not found');
        return;
      }
      
      setNetwork(currentNetwork);
      
      // Load devices
      const devicesData = await getDevicesByNetwork(networkId);
      setDevices(devicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading network details...</p>
        </div>
      </div>
    );
  }

  if (error || !network) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Network not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
                <span className="text-2xl">🌐</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{network.name}</h1>
                {network.ip_range && (
                  <p className="text-sm text-indigo-600 font-mono">{network.ip_range}</p>
                )}
              </div>
            </div>
            <div className="w-32"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Network Info Card */}
        {network.description && (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Description</h3>
            <p className="text-gray-600">{network.description}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <span className="text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-700">Total Devices</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{devices.length}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <h3 className="font-semibold text-gray-700">Identified</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {devices.filter(d => d.name).length}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
                <span className="text-xl">❓</span>
              </div>
              <h3 className="font-semibold text-gray-700">Unknown</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {devices.filter(d => !d.name).length}
            </p>
          </div>
        </div>

        {/* Devices Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>📱</span>
                <span>Devices</span>
                <span className="text-lg font-normal text-gray-500">({devices.length})</span>
              </h2>
              <p className="text-gray-600 text-sm mt-1">All devices connected to this network</p>
            </div>
          </div>

          {devices.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
                <span className="text-4xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Devices Found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No devices have been scanned on this network yet. Start a network scan to discover devices.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">IP Address</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">MAC Address</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Device Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Brand</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Discovered</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device, index) => (
                    <tr
                      key={device.id}
                      className={`border-b border-gray-100 hover:bg-indigo-50/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/50'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">💻</span>
                          <span className="font-mono font-medium text-gray-900">{device.ip}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-gray-700">{device.mac}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-900 font-medium">
                          {device.name || <span className="text-gray-400 italic">Unknown</span>}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-700">
                          {device.brand || <span className="text-gray-400 italic">Unknown</span>}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-500">
                          {new Date(device.created_at).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

