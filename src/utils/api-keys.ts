export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    
    // Use the new notification system
    if (typeof window !== 'undefined' && (window as any).addNotification) {
      (window as any).addNotification({
        type: 'api_alerts',
        title: 'Copied to Clipboard',
        message: 'API key copied to clipboard successfully',
        duration: 3000,
      });
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    
    // Use the new notification system for errors too
    if (typeof window !== 'undefined' && (window as any).addNotification) {
      (window as any).addNotification({
        type: 'api_alerts',
        title: 'Copy Failed',
        message: 'Failed to copy to clipboard',
        duration: 3000,
      });
    }
  }
};
