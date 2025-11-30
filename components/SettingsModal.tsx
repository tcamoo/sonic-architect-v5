import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { Settings, X, ShieldCheck, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { validateApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const isConfigured = !!process.env.API_KEY;

  const handleTestConnection = async () => {
    setTestStatus('loading');
    setErrorMessage('');
    try {
      const isValid = await validateApiKey();
      if (isValid) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
        setErrorMessage('Validation failed. Key might be invalid.');
      }
    } catch (e: any) {
      setTestStatus('error');
      setErrorMessage(e.message || 'Connection failed');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111] border border-suno-neonBlue/30 w-full max-w-md p-6 rounded-2xl shadow-[0_0_50px_rgba(0,243,255,0.2)] relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-suno-neonBlue/10 rounded-full">
            <Settings className="w-6 h-6 text-suno-neonBlue" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">System Diagnostics</h2>
            <p className="text-xs text-gray-400">Environment & Connection Check</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-black/50 border border-white/10 rounded-lg">
             <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-semibold text-gray-300">Environment Variable</span>
                 {isConfigured ? (
                     <span className="flex items-center text-green-400 text-xs font-bold">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Configured
                     </span>
                 ) : (
                     <span className="flex items-center text-red-400 text-xs font-bold">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Missing
                     </span>
                 )}
             </div>
             <p className="text-xs text-gray-500">
                {isConfigured 
                  ? "API Key detected in process.env. The system is ready to communicate with Gemini."
                  : "API Key NOT detected. Please configure 'API_KEY' in Cloudflare Pages settings and redeploy."}
             </p>
          </div>

          <div className="pt-2 border-t border-white/10">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-semibold text-gray-300">Connection Test</span>
                 {testStatus === 'success' && <span className="text-green-400 text-xs flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Valid</span>}
                 {testStatus === 'error' && <span className="text-red-400 text-xs flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Failed</span>}
             </div>
             
             <Button 
                onClick={handleTestConnection} 
                disabled={!isConfigured || testStatus === 'loading'}
                variant="outline"
                size="sm"
                className="w-full text-xs"
             >
                {testStatus === 'loading' ? (
                    <span className="flex items-center justify-center"><RefreshCw className="w-3 h-3 mr-2 animate-spin"/> Pinging API...</span>
                ) : "Test API Connection"}
             </Button>
             
             {testStatus === 'error' && (
                 <p className="text-[10px] text-red-400 mt-2 bg-red-900/10 p-2 rounded border border-red-900/30">
                     Error: {errorMessage}. Check your Cloudflare environment variables.
                 </p>
             )}
          </div>

          <div className="flex justify-end pt-2">
             <Button variant="ghost" onClick={onClose} className="text-xs h-9">
                Close
             </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
