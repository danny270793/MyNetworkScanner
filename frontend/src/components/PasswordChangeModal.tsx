import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PasswordFormProps {
  currentPassword: string;
  setCurrentPassword: (value: string) => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  showCurrentPassword: boolean;
  setShowCurrentPassword: (value: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (value: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (value: boolean) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: FormEvent) => void;
  onClose: () => void;
}

const usePasswordChange = () => {
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
  };

  const validateForm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError(t('passwordChange.allFieldsRequired'));
      return false;
    }

    if (newPassword.length < 6) {
      setError(t('passwordChange.passwordTooShort'));
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError(t('passwordChange.passwordsDoNotMatch'));
      return false;
    }

    if (currentPassword === newPassword) {
      setError(t('passwordChange.passwordSameAsCurrent'));
      return false;
    }

    return true;
  };

  const verifyCurrentPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Provide more specific error messages based on the error type
      if (error.message.includes('Invalid login credentials')) {
        throw new Error(t('passwordChange.currentPasswordIncorrect'));
      } else if (error.message.includes('Email not confirmed')) {
        throw new Error(t('passwordChange.emailNotConfirmed'));
      } else {
        throw new Error(t('passwordChange.verifyPasswordFailed'));
      }
    }
  };

  const updatePassword = async (email: string) => {
    // First verify the current password by attempting to sign in
    // This ensures the user knows their current password before changing it
    await verifyCurrentPassword(email, currentPassword);

    // Then update to the new password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }
  };

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,
    resetForm,
    validateForm,
    updatePassword
  };
};

const PasswordForm = ({ 
  currentPassword, 
  setCurrentPassword, 
  newPassword, 
  setNewPassword, 
  confirmPassword, 
  setConfirmPassword,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  loading,
  error,
  onSubmit,
  onClose
}: PasswordFormProps) => {
  const { t } = useTranslation();
  
  return (
  <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
    {/* Current Password */}
    <div className="space-y-2">
      <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t('passwordChange.currentPassword')}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔒</span>
        </div>
        <input
          id="currentPassword"
          type={showCurrentPassword ? "text" : "password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          placeholder={t('passwordChange.currentPasswordPlaceholder')}
          disabled={loading}
          className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <button
          type="button"
          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          disabled={loading}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {showCurrentPassword ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>

    {/* New Password */}
    <div className="space-y-2">
      <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t('passwordChange.newPassword')}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔑</span>
        </div>
        <input
          id="newPassword"
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          placeholder={t('passwordChange.newPasswordPlaceholder')}
          disabled={loading}
          minLength={6}
          className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          disabled={loading}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {showNewPassword ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{t('passwordChange.minimumCharacters')}</p>
    </div>

    {/* Confirm New Password */}
    <div className="space-y-2">
      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t('passwordChange.confirmPassword')}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400">🔐</span>
        </div>
        <input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder={t('passwordChange.confirmPasswordPlaceholder')}
          disabled={loading}
          minLength={6}
          className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          disabled={loading}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {showConfirmPassword ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <span className="text-red-500">⚠️</span>
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
    )}

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <button
        type="button"
        onClick={() => onClose()}
        disabled={loading}
        className="flex-1 px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
{t('common.cancel')}
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{t('passwordChange.updating')}</span>
          </div>
        ) : (
          <span>{t('passwordChange.updatePassword')}</span>
        )}
      </button>
    </div>
  </form>
  );
};

export default function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    setLoading,
    error,
    setError,
    success,
    setSuccess,
    resetForm,
    validateForm,
    updatePassword
  } = usePasswordChange();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    if (!user?.email) {
      setError(t('passwordChange.userEmailNotFound'));
      return;
    }

    try {
      setLoading(true);
      await updatePassword(user.email);
      setSuccess(true);
      resetForm();
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : t('passwordChange.updatePasswordFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
              <span className="text-xl">🔐</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('passwordChange.title')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t('passwordChange.passwordUpdatedSuccessfully')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('passwordChange.passwordUpdatedDescription')}
              </p>
            </div>
          ) : (
            <PasswordForm
              currentPassword={currentPassword}
              setCurrentPassword={setCurrentPassword}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showCurrentPassword={showCurrentPassword}
              setShowCurrentPassword={setShowCurrentPassword}
              showNewPassword={showNewPassword}
              setShowNewPassword={setShowNewPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
