import { ToastMessage } from '@/types/api-keys';

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const copyToClipboard = async (
  text: string,
  setToast: (toast: ToastMessage | null) => void
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    setToast({ message: 'API key copied to clipboard!', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  } catch (error) {
    setToast({ message: 'Failed to copy API key', type: 'error' });
    setTimeout(() => setToast(null), 3000);
  }
};

export const showToast = (
  message: string,
  type: 'success' | 'error',
  setToast: (toast: ToastMessage | null) => void
): void => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};
