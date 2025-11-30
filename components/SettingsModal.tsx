import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { Settings, X, ShieldCheck, AlertTriangle, CheckCircle, RefreshCw, Save, Trash2, Key } from 'lucide-react';
import { validateApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [inputKey, setInputKey] = useState('');
  const [savedKey, setSavedKey] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Backend env key injected by Vite
  const hasEnvKey = !!process.env.API_KEY;

  useEffect(() => {
    if (isOpen) {
      const local = localStorage.getItem('gemini_api_key') || '';
      setSavedKey(local);
      setInputKey(local);
      setTestStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!inputKey.trim()) {
      handleClear();
      return;
    }
    localStorage.setItem('gemini_api_key', inputKey.trim());
    setSavedKey(inputKey.trim());
    setTestStatus('idle');
    // Optional: Auto-test on save
    handleTestConnection(inputKey.trim());
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setSavedKey('');
    setInputKey('');
    setTestStatus('idle');
  };

  const handleTestConnection = async (keyToTest?: string) => {
    setTestStatus('loading');
    setErrorMessage('');
    
    // Test the specific key passed, or the saved one, or fallback to env
    const key = keyToTest ?? savedKey ?? process.env.API_KEY;
    
    try {
      const isValid = await validateApiKey(key);
      if (isValid) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
        setErrorMessage('验证失败：API Key 无效或网络错误');
      }
    } catch (e: any) {
      setTestStatus('error');
      setErrorMessage(e.message || '连接失败');
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
            <h2 className="text-xl font-bold text-white">系统设置 (Settings)</h2>
            <p className="text-xs text-gray-400">API Key 配置与连接检查</p>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 1. Frontend Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-300 flex items-center justify-between">
              <span className="flex items-center"><Key className="w-4 h-4 mr-2 text-suno-primary" /> 自定义 API Key (前端)</span>
              {savedKey && <span className="text-[10px] bg-suno-primary/20 text-suno-primary px-2 py-0.5 rounded border border-suno-primary/30">当前使用中</span>}
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="输入 Google Gemini API Key (sk-...)"
                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-suno-neonBlue focus:ring-1 focus:ring-suno-neonBlue transition-all pr-20"
              />
              {savedKey && (
                <button 
                  onClick={handleClear}
                  className="absolute right-2 top-2 p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                  title="清除自定义 Key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex justify-end">
               <Button 
                 onClick={handleSave} 
                 variant="neon" 
                 size="sm"
                 className="text-xs h-8"
                 disabled={!inputKey || inputKey === savedKey}
               >
                 <Save className="w-3 h-3 mr-1" /> 保存配置
               </Button>
            </div>
            <p className="text-[10px] text-gray-500">
              * 设置后将优先使用此 Key。数据仅保存在您的浏览器本地 (LocalStorage)。
            </p>
          </div>

          <div className="h-px bg-white/10 my-2"></div>

          {/* 2. Backend Status */}
          <div className="p-3 bg-black/50 border border-white/10 rounded-lg flex items-center justify-between">
             <div className="flex flex-col">
                 <span className="text-sm font-semibold text-gray-300">默认环境配置 (后端)</span>
                 <span className="text-[10px] text-gray-500">Cloudflare / Vercel Env</span>
             </div>
             {hasEnvKey ? (
                 <div className="flex items-center text-green-400 text-xs font-bold bg-green-900/20 px-2 py-1 rounded border border-green-900/30">
                    <ShieldCheck className="w-3 h-3 mr-1" /> 已配置 (Ready)
                 </div>
             ) : (
                 <div className="flex items-center text-gray-500 text-xs font-bold bg-gray-800 px-2 py-1 rounded border border-gray-700">
                    <AlertTriangle className="w-3 h-3 mr-1" /> 未检测到
                 </div>
             )}
          </div>

          {/* 3. Connection Test */}
          <div className="pt-2">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-sm font-semibold text-gray-300">连接测试 (Connection)</span>
                 {testStatus === 'success' && <span className="text-green-400 text-xs flex items-center font-bold"><CheckCircle className="w-3 h-3 mr-1"/> 连接成功</span>}
                 {testStatus === 'error' && <span className="text-red-400 text-xs flex items-center font-bold"><AlertTriangle className="w-3 h-3 mr-1"/> 连接失败</span>}
             </div>
             
             <Button 
                onClick={() => handleTestConnection()} 
                disabled={testStatus === 'loading'}
                variant="outline"
                size="sm"
                className="w-full text-xs h-9 border-white/20 hover:bg-white/5"
             >
                {testStatus === 'loading' ? (
                    <span className="flex items-center justify-center"><RefreshCw className="w-3 h-3 mr-2 animate-spin"/> 正在测试...</span>
                ) : "测试 API 连接 (Test Ping)"}
             </Button>
             
             {testStatus === 'error' && (
                 <p className="text-[10px] text-red-400 mt-2 bg-red-900/10 p-2 rounded border border-red-900/30">
                     错误: {errorMessage}。请检查 API Key 是否有效或网络是否通畅。
                 </p>
             )}
          </div>

          <div className="flex justify-end pt-2">
             <Button variant="ghost" onClick={onClose} className="text-xs h-8 text-gray-400 hover:text-white">
                关闭
             </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
