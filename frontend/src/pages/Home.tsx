import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getNetworks, createNetwork, updateNetwork, deleteNetwork, type Network } from '../lib/networks';
import NetworkModal from '../components/NetworkModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Home() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [networkToDelete, setNetworkToDelete] = useState<Network | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const loadNetworks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getNetworks();
      setNetworks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load networks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNetworks();
  }, []);

  const handleCreateClick = () => {
    setModalMode('create');
    setSelectedNetwork(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (network: Network) => {
    setModalMode('edit');
    setSelectedNetwork(network);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (network: Network) => {
    setNetworkToDelete(network);
    setIsDeleteModalOpen(true);
  };

  const handleModalSubmit = async (data: { name: string; description: string; ip_range: string }) => {
    if (modalMode === 'create') {
      await createNetwork(data);
    } else if (selectedNetwork) {
      await updateNetwork(selectedNetwork.id, data);
    }
    await loadNetworks();
  };

  const handleDeleteConfirm = async () => {
    if (!networkToDelete) return;
    
    try {
      setDeleting(true);
      await deleteNetwork(networkToDelete.id);
      await loadNetworks();
      setIsDeleteModalOpen(false);
      setNetworkToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete network');
    } finally {
      setDeleting(false);
    }
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
                     <LanguageSwitcher />
                     <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2">
                       <span className="text-gray-400">👤</span>
                       <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                     </div>
                     <button
                       onClick={handleSignOut}
                       className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium px-4 py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                     >
                       {t('auth.signOut')}
                     </button>
                   </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-4xl font-bold text-gray-900">{t('networks.title')} 🌐</h2>
                   <p className="text-gray-600 mt-2">{t('networks.subtitle')}</p>
                 </div>
          <button
            onClick={handleCreateClick}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
          >
            <span className="text-xl">➕</span>
            <span>{t('networks.createNetwork')}</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-red-500 text-xl">⚠️</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Networks List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 font-medium">Loading networks...</p>
            </div>
          </div>
        ) : networks.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4">
              <span className="text-4xl">🌐</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Networks Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Get started by creating your first network configuration to begin scanning
            </p>
            <button
              onClick={handleCreateClick}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Your First Network
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {networks.map((network) => (
              <div
                key={network.id}
                className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Clickable card content */}
                <div 
                  onClick={() => navigate(`/network/${network.id}`)}
                  className="cursor-pointer mb-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">🌐</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {network.name}
                        </h3>
                        {network.ip_range && (
                          <p className="text-sm text-indigo-600 font-mono">{network.ip_range}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {network.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{network.description}</p>
                  )}

                  <div className="text-xs text-gray-500">
                    Created: {new Date(network.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/network/${network.id}`);
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <span>👁️</span>
                    <span>View</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(network);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <span>✏️</span>
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(network);
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <span>🗑️</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <NetworkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        network={selectedNetwork}
        mode={modalMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Network"
        message={`Are you sure you want to delete "${networkToDelete?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

