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

interface CreateEditModalProps {
  showCreateForm: boolean;
  editingKey: ApiKey | null;
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  newKeyType: 'development' | 'production';
  setNewKeyType: (type: 'development' | 'production') => void;
  newKeyLimit: number;
  setNewKeyLimit: (limit: number) => void;
  hasLimit: boolean;
  setHasLimit: (hasLimit: boolean) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CreateEditModal({
  showCreateForm,
  editingKey,
  newKeyName,
  setNewKeyName,
  newKeyType,
  setNewKeyType,
  newKeyLimit,
  setNewKeyLimit,
  hasLimit,
  setHasLimit,
  onClose,
  onSubmit
}: CreateEditModalProps) {
  if (!showCreateForm && !editingKey) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {editingKey ? 'Edit API Key' : 'Create New API Key'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {editingKey ? 'Update your API key settings' : 'Generate a new API key for your application'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Key Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Key Name</label>
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 shadow-sm hover:border-gray-400 transition-all duration-200"
              placeholder="My API Key"
            />
          </div>

          {/* Key Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Key Type</label>
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setNewKeyType('development')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  newKeyType === 'development'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    newKeyType === 'development' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {newKeyType === 'development' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Development</div>
                    <div className="text-sm text-gray-500">For testing and development</div>
                  </div>
                </div>
              </div>
              <div
                onClick={() => setNewKeyType('production')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  newKeyType === 'production'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    newKeyType === 'production' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                  }`}>
                    {newKeyType === 'production' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Production</div>
                    <div className="text-sm text-gray-500">For live applications</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Usage Limit */}
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <input
                type="checkbox"
                id="hasLimit"
                checked={hasLimit}
                onChange={(e) => setHasLimit(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="hasLimit" className="text-sm font-semibold text-gray-700">
                Set monthly usage limit
              </label>
            </div>
            {hasLimit && (
              <div className="pl-7">
                <input
                  type="number"
                  value={newKeyLimit}
                  onChange={(e) => setNewKeyLimit(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 shadow-sm hover:border-gray-400 transition-all duration-200"
                  placeholder="1000"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-2">Set a monthly request limit for this API key</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 flex space-x-4">
          <button
            onClick={onSubmit}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {editingKey ? 'Update Key' : 'Create Key'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-semibold transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
