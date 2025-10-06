import { useState } from 'react';
import { ApiKey } from '@/types/api-keys';
import { copyToClipboard } from '@/utils/api-keys';

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onCreateKey: () => void;
  onEditKey: (key: ApiKey) => void;
  onDeleteKey: (id: string) => void;
  onCopyKey?: (text: string) => void;
}

export default function ApiKeysTable({ 
  apiKeys, 
  onCreateKey, 
  onEditKey, 
  onDeleteKey,
  onCopyKey
}: ApiKeysTableProps) {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleCopyToClipboard = async (text: string) => {
    if (onCopyKey) {
      await onCopyKey(text);
    } else {
      await copyToClipboard(text, () => {}); // Fallback if no handler provided
    }
  };

  if (apiKeys.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">API Keys</h2>
              <p className="text-sm text-gray-600 mt-2">
                Manage your API keys for accessing the <span className="text-blue-600 font-semibold">Research API</span> and 
                <a href="#" className="text-blue-600 hover:underline ml-1 font-medium">documentation page</a>
              </p>
            </div>
            <button
              onClick={onCreateKey}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Key</span>
            </button>
          </div>
        </div>
        
        <div className="px-8 py-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No API keys yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Get started by creating your first API key to access our powerful Research API.</p>
          <button
            onClick={onCreateKey}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Create Your First Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">API Keys</h2>
            <p className="text-sm text-gray-600 mt-2">
              Manage your API keys for accessing the <span className="text-blue-600 font-semibold">Research API</span> and 
              <a href="#" className="text-blue-600 hover:underline ml-1 font-medium">documentation page</a>
            </p>
          </div>
          <button
            onClick={onCreateKey}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Key</span>
          </button>
        </div>
      </div>
    
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NAME</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TYPE</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">USAGE</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">KEY</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">OPTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200/50">
            {apiKeys.map((key, index) => (
              <tr key={key.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 group animate-in slide-in-from-left-4" style={{ animationDelay: `${index * 100}ms` }}>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-semibold text-gray-900">{key.name}</div>
                    <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      key.is_active 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {key.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    key.type === 'production' 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {key.type === 'production' ? 'Production' : 'Development'}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">{key.usage}</span>
                    <span className="text-xs text-gray-500">requests</span>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <code className="text-sm bg-gray-100 px-3 py-2 rounded-xl font-mono text-gray-800 border border-gray-200">
                      {visibleKeys.has(key.id) ? key.key : `${key.key.substring(0, 8)}-************************`}
                    </code>
                    <button
                      onClick={() => handleCopyToClipboard(key.key)}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
                      title="Copy to clipboard"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => toggleKeyVisibility(key.id)}
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 p-3 rounded-xl"
                      title="Toggle key visibility"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleCopyToClipboard(key.key)}
                      className="text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200 p-3 rounded-xl"
                      title="Copy key"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEditKey(key)}
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 p-3 rounded-xl"
                      title="Edit key"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteKey(key.id)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 p-3 rounded-xl"
                      title="Delete key"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
