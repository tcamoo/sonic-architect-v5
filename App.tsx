import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { SettingsModal } from './components/SettingsModal';
import { SongRequest, GeneratedSong, GenerationStatus } from './types';
import { generateSunoPrompt } from './services/geminiService';
import { Disc, Zap, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<GeneratedSong | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Default to true since InputForm defaults to Workstation Mode
  const [isWorkstationMode, setIsWorkstationMode] = useState(true);
  
  // Intro Animation State
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // 1. Play Intro Animation for 3 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async (request: SongRequest) => {
    setStatus(GenerationStatus.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await generateSunoPrompt(request);
      setResult(data);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "出错了。请检查网络或稍后重试。");
      setStatus(GenerationStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col font-sans selection:bg-suno-neonBlue/30 overflow-x-hidden relative">
      
      {/* Settings Modal (Diagnostic Tool) */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* INTRO OVERLAY - NEON PULSE */}
      {showIntro && (
        <div className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center animate-fade-in cursor-wait">
           {/* Pulse Container */}
           <div className="relative flex items-center justify-center mb-12">
              {/* Core Icon */}
              <div className="relative z-10 w-24 h-24 bg-black rounded-full border-2 border-suno-neonBlue flex items-center justify-center shadow-[0_0_40px_rgba(0,243,255,0.6)] animate-pulse">
                  <Disc className="w-12 h-12 text-white animate-spin-slow" />
              </div>
              {/* Ripples */}
              <div className="absolute inset-0 rounded-full border border-suno-neonBlue/40 animate-pulse-ring"></div>
              <div className="absolute inset-0 rounded-full border border-suno-neonPink/30 animate-pulse-ring delay-300"></div>
              <div className="absolute inset-0 rounded-full border border-suno-primary/20 animate-pulse-ring delay-700"></div>
           </div>

           <h1 className="text-5xl font-black tracking-tighter text-white italic mb-6 animate-pulse">
              SONIC<span className="text-suno-neonBlue text-shadow-neon">ARCHITECT</span>
              <span className="text-sm bg-suno-neonPink text-black px-2 py-1 rounded ml-3 not-italic align-middle">V5</span>
           </h1>
           
           <div className="flex flex-col items-center space-y-3">
              <div className="w-48 h-1 bg-gray-900 rounded-full overflow-hidden">
                 <div className="h-full bg-gradient-to-r from-suno-neonBlue via-suno-neonPink to-suno-primary animate-[shimmer_1s_infinite_linear]" style={{ width: '100%' }}></div>
              </div>
              <p className="text-suno-neonBlue/70 font-mono text-[10px] tracking-[0.4em]">SYSTEM INITIALIZING</p>
           </div>
        </div>
      )}

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-suno-neonBlue/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-suno-neonPink/5 blur-[150px]" />
        
        {/* Floating Notes */}
        <div className="music-note animate-float left-[10%] bottom-[-100px] text-suno-neonBlue/20">♪</div>
        <div className="music-note animate-float-fast left-[20%] bottom-[-150px] text-3xl text-suno-neonPink/20">♫</div>
        <div className="music-note animate-float left-[85%] bottom-[-120px] text-5xl text-suno-primary/20">♩</div>
      </div>

      {/* COMPACT ELEGANT HEADER */}
      <header className="relative z-10 w-full glass-header shadow-md h-16 shrink-0">
        <div className="max-w-[1920px] mx-auto px-6 h-full flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-4 group cursor-pointer hover:opacity-90 transition-opacity">
            <div className="relative">
                <div className="absolute inset-0 bg-suno-neonBlue rounded-full blur-md opacity-50 animate-pulse"></div>
                <Disc className="w-10 h-10 text-white relative z-10 animate-[spin_8s_linear_infinite]" />
            </div>
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-black tracking-tighter text-white italic leading-none">
                   SONIC<span className="text-suno-neonBlue">ARCHITECT</span> 
                </h1>
                <div className="flex items-center mt-0.5">
                    <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Suno V5 Workstation</span>
                </div>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              title="系统设置 (Diagnostics)"
            >
              <Settings className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow max-w-[1920px] mx-auto w-full px-4 sm:px-6 py-4 flex flex-col lg:flex-row gap-4 h-[calc(100vh-4rem)] overflow-hidden">
        
        {/* Left Column (Workstation) */}
        <div className={`h-full flex flex-col ${isWorkstationMode ? 'lg:w-[80%]' : 'lg:w-[480px] lg:flex-shrink-0'} transition-all duration-500 ease-in-out`}>
            
            {/* Elegant Slogan Bar */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center space-x-2">
                   <div className="w-1.5 h-1.5 bg-suno-neonBlue rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-mono text-suno-neonBlue/70 tracking-[0.2em] uppercase">Make It Real // AI Audio Synthesis</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <InputForm 
                  onSubmit={handleGenerate} 
                  isLoading={status === GenerationStatus.LOADING} 
                  onWorkstationChange={setIsWorkstationMode}
                />
                
                {status === GenerationStatus.ERROR && (
                    <div className="mt-4 p-3 bg-red-950/50 border border-red-500/50 rounded-lg text-red-200 text-xs flex items-center animate-fade-in">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                        {error}
                    </div>
                )}
            </div>
        </div>

        {/* Right Column (Result & Visualization) */}
        <div className={`${isWorkstationMode ? 'lg:w-[20%] min-w-[300px]' : 'flex-1'} lg:pl-4 lg:border-l border-white/5 h-full flex flex-col transition-all duration-500 ease-in-out overflow-hidden`}>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                {/* Idle State */}
                {status === GenerationStatus.IDLE && (
                    <div className="h-full flex flex-col items-center justify-center relative opacity-80 hover:opacity-100 transition-opacity duration-500">
                        {/* Holographic Circle */}
                        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                            <div className="absolute inset-0 border-2 border-suno-neonBlue/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                            <div className="absolute inset-4 border border-dashed border-suno-neonBlue/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                            <div className="absolute inset-0 border-4 border-t-suno-neonBlue/10 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            
                            {/* Scanning Line */}
                            <div className="absolute inset-0 w-full h-1 bg-suno-neonBlue/20 shadow-[0_0_15px_rgba(0,243,255,0.5)] animate-[scan_3s_ease-in-out_infinite] top-1/2"></div>
                            
                            {/* Center Icon */}
                            <div className="relative z-10 bg-black/80 p-4 rounded-full border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,243,255,0.2)]">
                                <Zap className="w-8 h-8 text-suno-neonBlue animate-pulse" />
                            </div>
                        </div>
                        
                        <div className="text-center space-y-3">
                            <h3 className="text-xl font-black text-white tracking-[0.2em] italic">SYSTEM READY</h3>
                            <div className="flex flex-col items-center space-y-1">
                                <p className="text-[10px] font-mono text-suno-neonBlue">AWAITING INPUT STREAM</p>
                                <div className="w-12 h-0.5 bg-gray-800 rounded-full overflow-hidden">
                                     <div className="h-full w-full bg-suno-neonBlue/50 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {status === GenerationStatus.LOADING && (
                    <div className="h-full flex flex-col items-center justify-center">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-suno-neonBlue/30 blur-xl rounded-full animate-pulse"></div>
                            <div className="w-16 h-16 border-2 border-white/5 border-t-suno-neonBlue border-b-suno-neonPink rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-black text-white mb-1 tracking-tighter">PROCESSING</h3>
                        <p className="text-[9px] text-suno-neonBlue font-mono uppercase tracking-widest text-center">Optimizing Structure...</p>
                    </div>
                )}

                {(status === GenerationStatus.SUCCESS && result) && (
                    <ResultCard song={result} />
                )}
            </div>
        </div>

      </main>

      {/* Footer (Minimal) */}
      <footer className="relative z-10 py-2 text-center text-[9px] text-gray-600 border-t border-white/5 bg-black/90 uppercase tracking-widest shrink-0">
          Sonic Architect V6.1 // Suno V5 Optimized
      </footer>
    </div>
  );
};

export default App;
