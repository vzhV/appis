import { useState, useCallback } from 'react';
import type { ApiKey } from '@/types/api-keys';
import { copyToClipboard } from '@/utils/api-keys';

interface ApiKeysTableProps {
  readonly apiKeys: readonly ApiKey[];
  readonly onCreateKey: () => void;
  readonly onEditKey: (key: ApiKey) => void;
  readonly onDeleteKey: (id: string) => void;
  readonly onCopyKey?: (text: string) => void;
}

export default function ApiKeysTable({ 
  apiKeys, 
  onCreateKey, 
  onEditKey, 
  onDeleteKey,
  onCopyKey
}: ApiKeysTableProps): React.JSX.Element {
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = useCallback((keyId: string): void => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  }, []);

  const handleCopyToClipboard = useCallback(async (text: string): Promise<void> => {
    if (onCopyKey) {
      await onCopyKey(text);
    } else {
      await copyToClipboard(text); // Fallback if no handler provided
    }
  }, [onCopyKey]);

  if (apiKeys.length === 0) {
    return (
      <div className="bg-card/80 backdrop-blur-xl shadow-lg rounded-2xl border border-border/40 overflow-hidden">
        <div className="px-8 py-6 border-b border-border/40 bg-gradient-to-r from-secondary/20 to-card/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">API Keys</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Manage your API keys for accessing the <span className="text-primary font-semibold">Research API</span> and 
                <a href="#" className="text-primary hover:underline ml-1 font-medium">documentation page</a>
              </p>
            </div>
            <button
              onClick={onCreateKey}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Key</span>
            </button>
          </div>
        </div>
        
        <div className="px-8 py-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-chart-2/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No API keys yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">Get started by creating your first API key to access our powerful Research API.</p>
          <button
            onClick={onCreateKey}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Create Your First Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/80 backdrop-blur-xl shadow-lg rounded-2xl border border-border/40 overflow-hidden">
      <div className="px-8 py-6 border-b border-border/40 bg-gradient-to-r from-secondary/20 to-card/20">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">API Keys</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Manage your API keys for accessing the <span className="text-primary font-semibold">Research API</span> and 
              <a href="#" className="text-primary hover:underline ml-1 font-medium">documentation page</a>
            </p>
          </div>
          <button
            onClick={onCreateKey}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
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
          <thead className="bg-gradient-to-r from-secondary/20 to-card/20">
            <tr>
              <th className="px-8 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">NAME</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">TYPE</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">USAGE</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">KEY</th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">OPTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border/40">
            {apiKeys.map((key, index) => (
              <tr key={key.id} className="hover:bg-gradient-to-r hover:from-primary/5 hover:to-chart-2/5 transition-all duration-300 group animate-in slide-in-from-left-4" style={{ animationDelay: `${index * 100}ms` }}>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-semibold text-foreground">{key.name}</div>
                    <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      key.is_active 
                        ? 'bg-chart-2/20 text-chart-2 border border-chart-2/30' 
                        : 'bg-destructive/20 text-destructive border border-destructive/30'
                    }`}>
                      {key.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    key.type === 'production' 
                      ? 'bg-chart-3/20 text-chart-3 border border-chart-3/30' 
                      : 'bg-primary/20 text-primary border border-primary/30'
                  }`}>
                    {key.type === 'production' ? 'Production' : 'Development'}
                  </span>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-foreground">{key.usage}</span>
                    <span className="text-xs text-muted-foreground">requests</span>
                  </div>
                </td>
                <td className="px-8 py-6 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <code className="text-sm bg-secondary/50 px-3 py-2 rounded-xl font-mono text-foreground border border-border">
                      {visibleKeys.has(key.id) ? key.key : `${key.key.substring(0, 8)}-************************`}
                    </code>
                    <button
                      onClick={() => handleCopyToClipboard(key.key)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-secondary/50 rounded-xl"
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
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 p-3 rounded-xl"
                      title="Toggle key visibility"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleCopyToClipboard(key.key)}
                      className="text-muted-foreground hover:text-chart-2 hover:bg-chart-2/10 transition-all duration-200 p-3 rounded-xl"
                      title="Copy key"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onEditKey(key)}
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 p-3 rounded-xl"
                      title="Edit key"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteKey(key.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 p-3 rounded-xl"
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
