'use client';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  type: 'development' | 'production';
  usage: number;
  monthly_limit?: number | null;
  created_at: string;
  last_used?: string | null;
  is_active: boolean;
}

interface DeleteConfirmationModalProps {
  deleteConfirmKey: ApiKey | null;
  deleteConfirmName: string;
  setDeleteConfirmName: (name: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  deleteConfirmKey,
  deleteConfirmName,
  setDeleteConfirmName,
  onClose,
  onConfirm
}: DeleteConfirmationModalProps) {
  if (!deleteConfirmKey) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-red-50/50 to-white/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Delete API Key</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="text-sm font-semibold text-gray-900 mb-1">Key Details</div>
            <div className="text-sm text-gray-600 mb-2">Name: {deleteConfirmKey.name}</div>
            <div className="text-sm text-gray-600">Key: {deleteConfirmKey.key.substring(0, 8)}-************************</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type the key name to confirm deletion
            </label>
            <input
              type="text"
              value={deleteConfirmName}
              onChange={(e) => setDeleteConfirmName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
              placeholder={deleteConfirmKey.name}
            />
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 flex space-x-4">
          <button
            onClick={onConfirm}
            disabled={deleteConfirmName !== deleteConfirmKey.name}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
              deleteConfirmName === deleteConfirmKey.name
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Delete Key
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
