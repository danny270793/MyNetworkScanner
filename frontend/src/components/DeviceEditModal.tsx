import { useState, useEffect, type FormEvent } from 'react';
import { type Device } from '../lib/devices';

interface DeviceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deviceId: string, name: string, brand: string) => Promise<void>;
  device: Device | null;
}

export default function DeviceEditModal({ isOpen, onClose, onSubmit, device }: DeviceEditModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (device) {
      setName(device.name || '');
      setBrand(device.brand || '');
    }
    setError('');
  }, [device, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!device) return;

    setError('');
    setLoading(true);

    try {
      await onSubmit(device.id, name, brand);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !device) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white/95 backdrop-blur-lg p-6 shadow-2xl transition-all border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                <span className="text-2xl">💻</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Edit Device</h3>
                <p className="text-sm text-gray-600 font-mono">{device.ip}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-xl">⚠️</span>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Device Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John's iPhone, Living Room TV"
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="brand" className="block text-sm font-semibold text-gray-700">
                Brand/Manufacturer
              </label>
              <input
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., Apple, Samsung, Dell"
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Device Info Display */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-600">IP Address:</span>
                <span className="font-mono text-gray-700">{device.ip}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-600">MAC Address:</span>
                <span className="font-mono text-gray-700">{device.mac}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
