import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { Settings, X, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

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
            <h2 className="text-xl font-bold text-white">System Settings</h2>
            <p className="text-xs text-gray-400">Environment Configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-black/50 border border-white/10 rounded-lg">
             <div className="flex items-center text-green-400 text-sm mb-2">
                <ShieldCheck className="w-4 h-4 mr-2" />
                API Key Configured
             </div>
             <p className="text-xs text-gray-500">
                The API key is securely provided via environment variables. No manual configuration is required.
             </p>
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
