
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { Settings, X, Check, AlertCircle, Key, ShieldCheck } from 'lucide-react';
import { validateApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');

  useEffect(() => {
    if (isOpen) {
      const storedKey = localStorage.getItem('gemini_api_key') || '';
      setApiKey(storedKey);
      setStatus('idle');
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
    onClose();
  };

  const handleTest = async () => {
    setStatus('testing');
    const isValid = await validateApiKey(apiKey.trim());
    setStatus(isValid ? 'valid' : 'invalid');
  };

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
            <h2 className="text-xl font-bold text-white">系统设置</h2>
            <p className="text-xs text-gray-400">配置您的 API 连接参数</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 flex items-center">
              <Key className="w-4 h-4 mr-2 text-suno-primary" />
              Gemini API Key
            </label>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setStatus('idle');
              }}
              placeholder="AIzaSy..."
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-suno-neonBlue focus:ring-1 focus:ring-suno-neonBlue outline-none font-mono text-sm"
            />
            <p className="text-[10px] text-gray-500">
              您的 Key 仅存储在本地浏览器中，绝不会上传到我们的服务器。
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
             <div className="flex items-center text-xs">
                {status === 'testing' && <span className="text-yellow-500 flex items-center animate-pulse"><ShieldCheck className="w-3 h-3 mr-1" /> 测试连接中...</span>}
                {status === 'valid' && <span className="text-green-500 flex items-center"><Check className="w-3 h-3 mr-1" /> 连接成功</span>}
                {status === 'invalid' && <span className="text-red-500 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> 连接失败，请检查 Key</span>}
             </div>
             
             <div className="flex space-x-2">
                <Button variant="ghost" onClick={handleTest} disabled={!apiKey} className="text-xs h-9">
                   测试连接
                </Button>
                <Button variant="neon" onClick={handleSave} className="text-xs h-9">
                   保存配置
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
