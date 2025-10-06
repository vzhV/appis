'use client';

interface ToastProps {
  toast: { message: string; type: 'success' | 'error' } | null;
  onClose?: () => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  if (!toast) return null;

  return (
    <div className="fixed top-4 left-4 z-50 animate-in slide-in-from-left-4 duration-200">
      <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 bg-white/90 backdrop-blur-sm border ${
        toast.type === 'success' 
          ? 'border-green-200 text-green-800' 
          : 'border-red-200 text-red-800'
      }`}>
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {toast.type === 'success' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          )}
        </svg>
        <span className="font-medium text-sm">{toast.message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
