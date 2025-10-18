import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getNetworks, createNetwork, updateNetwork, deleteNetwork, type Network } from '../lib/networks';
import NetworkModal from '../components/NetworkModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function Home() {
  const { t } = useTranslation();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile-First Navigation Bar */}
      <div className="sticky top-0 z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg">
                <span className="text-lg sm:text-2xl">🌐</span>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent truncate">
                Network Scanner
              </h1>
            </div>
            
            {/* Mobile Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Settings Button */}
              <button
                onClick={() => navigate('/settings')}
                className="p-2 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200 touch-manipulation"
                title={t('settings.title')}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      </div>

      {/* Main Content - Mobile First */}
      <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header Section - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
              {t('networks.title')} 🌐
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
              {t('networks.subtitle')}
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-4 sm:px-6 py-3 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 touch-manipulation"
          >
            <span className="text-lg sm:text-xl">➕</span>
            <span className="text-sm sm:text-base">{t('networks.createNetwork')}</span>
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
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                   {networks.map((network) => (
                     <div
                       key={network.id}
                       className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 touch-manipulation"
                     >
                       {/* Clickable card content - Mobile Optimized */}
                       <div 
                         onClick={() => navigate(`/network/${network.id}`)}
                         className="cursor-pointer mb-3 sm:mb-4"
                       >
                         <div className="flex items-start justify-between mb-3 sm:mb-4">
                           <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                               <span className="text-lg sm:text-2xl">🌐</span>
                             </div>
                             <div className="min-w-0 flex-1">
                               <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                 {network.name}
                               </h3>
                               {network.ip_range && (
                                 <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-mono truncate">{network.ip_range}</p>
                               )}
                             </div>
                           </div>
                         </div>

                         {network.description && (
                           <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">{network.description}</p>
                         )}

                         <div className="text-xs text-gray-500 dark:text-gray-400">
                           {t('networks.created')}: {new Date(network.created_at).toLocaleDateString()}
                         </div>
                       </div>

                       {/* Action buttons - Mobile Optimized */}
                       <div className="flex space-x-1 sm:space-x-2 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             navigate(`/network/${network.id}`);
                           }}
                           className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 sm:py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-1 touch-manipulation"
                         >
                           <span className="text-sm sm:text-base">👁️</span>
                           <span className="text-xs sm:text-sm">{t('networks.view')}</span>
                         </button>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleEditClick(network);
                           }}
                           className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 sm:py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-1 touch-manipulation"
                         >
                           <span className="text-sm sm:text-base">✏️</span>
                           <span className="text-xs sm:text-sm">{t('networks.edit')}</span>
                         </button>
                         <button
                           onClick={(e) => {
                             e.stopPropagation();
                             handleDeleteClick(network);
                           }}
                           className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold py-2 sm:py-2 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-1 touch-manipulation"
                         >
                           <span className="text-sm sm:text-base">🗑️</span>
                           <span className="text-xs sm:text-sm">{t('networks.delete')}</span>
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

