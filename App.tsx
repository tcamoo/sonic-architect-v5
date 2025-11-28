import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { SettingsModal } from './components/SettingsModal';
import { SongRequest, GeneratedSong, GenerationStatus } from './types';
import { generateSunoPrompt, hasApiKey } from './services/geminiService';
import { Disc, Music4, Settings, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<GeneratedSong | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Default to true since InputForm defaults to Workstation Mode
  const [isWorkstationMode, setIsWorkstationMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  // Intro Animation State
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // 1. Play Intro Animation for 3 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 2. After Intro, check for API Key. If missing, prompt user.
    if (!showIntro) {
      if (!hasApiKey()) {
        setShowSettings(true);
      }
    }
  }, [showIntro]);

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
      setError(err.message || "出错了。请检查您的 API Key 或稍后重试。");
      setStatus(GenerationStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col font-sans selection:bg-suno-neonBlue/30 overflow-x-hidden relative">
      
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

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-suno-neonBlue/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-suno-neonPink/5 blur-[150px]" />
        
        {/* Floating Notes */}
        <div className="music-note animate-float left-[10%] bottom-[-100px] text-suno-neonBlue/20">♪</div>
        <div className="music-note animate-float-fast left-[20%] bottom-[-150px] text-3xl text-suno-neonPink/20">♫</div>
        <div className="music-note animate-float left-[85%] bottom-[-120px] text-5xl text-suno-primary/20">♩</div>
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl shadow-lg">
        <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Animated Logo Section */}
          <div className="flex items-center space-x-4 group cursor-pointer hover:opacity-90 transition-opacity">
            <div className="relative">
                {/* Spinning & Pulsing Glow */}
                <div className="absolute inset-0 bg-suno-neonBlue rounded-full blur-md opacity-40 animate-pulse group-hover:opacity-70 transition-opacity"></div>
                <div className="absolute -inset-1 border border-suno-neonBlue/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
                
                {/* Main Icon */}
                <Disc className="w-9 h-9 text-white relative z-10 animate-[spin_8s_linear_infinite] group-hover:animate-[spin_2s_linear_infinite]" />
                
                {/* Center Dot Pulse */}
                <div className="absolute inset-[38%] bg-suno-neonPink rounded-full animate-ping z-20 opacity-50"></div>
            </div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-black tracking-tighter text-white italic leading-none flex items-center">
                   <span className="mr-0.5">SONIC</span>
                   <span className="text-suno-neonBlue drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">ARCHITECT</span> 
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                   <span className="text-[9px] bg-gradient-to-r from-suno-neonPink to-purple-500 text-white px-1.5 py-0.5 rounded font-bold tracking-wider shadow-[0_0_10px_rgba(255,0,255,0.4)]">V5 ENGINE</span>
                   <span className="text-[9px] text-gray-500 tracking-[0.2em] uppercase hidden sm:inline-block">/ AI Music Workstation</span>
                </div>
            </div>
          </div>

          <nav className="flex items-center gap-4">
             <button 
              onClick={() => setShowSettings(true)}
              className="flex items-center text-xs font-bold text-gray-400 hover:text-white transition-all border border-white/10 px-4 py-2 rounded-full hover:bg-white/5 hover:border-suno-neonBlue/50 hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]"
            >
              <Settings className="w-3 h-3 ml-2 text-suno-primary" />
              <span className="ml-2">API 配置</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow max-w-[1800px] mx-auto w-full px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left Column */}
        <div className={`w-full ${isWorkstationMode ? 'flex-1' : 'lg:w-[480px] lg:flex-shrink-0'} transition-all duration-500 ease-in-out space-y-6`}>
            <div className="space-y-2 mb-6 pl-2 border-l-4 border-suno-neonBlue/50">
                <h2 className="text-4xl font-black text-white italic tracking-tighter neon-text">
                    MAKE IT <span className="text-transparent bg-clip-text bg-gradient-to-r from-suno-neonBlue to-suno-neonPink">REAL.</span>
                </h2>
                <p className="text-gray-400 text-sm font-medium">
                    专为 Suno V5 打造。集成大师级国风乐器、真实人声细节与首尾锚定逻辑。
                </p>
            </div>
            <InputForm 
              onSubmit={handleGenerate} 
              isLoading={status === GenerationStatus.LOADING} 
              onWorkstationChange={setIsWorkstationMode}
            />
            
            {status === GenerationStatus.ERROR && (
                <div className="p-4 bg-red-950/50 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center animate-fade-in">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                    {error}
                </div>
            )}
        </div>

        {/* Right Column */}
        <div className={`${isWorkstationMode ? 'w-full lg:w-[400px] lg:flex-shrink-0' : 'flex-1'} lg:pl-12 lg:border-l border-white/5 pt-8 lg:pt-0 min-h-[600px] flex flex-col transition-all duration-500 ease-in-out`}>
            
            {/* Idle State - Holographic Workstation Placeholder */}
            {status === GenerationStatus.IDLE && (
                <div className="h-full flex flex-col items-center justify-center relative opacity-80 hover:opacity-100 transition-opacity duration-500">
                    {/* Holographic Circle */}
                    <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                        <div className="absolute inset-0 border border-suno-neonBlue/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute inset-4 border border-dashed border-suno-neonBlue/30 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
                        <div className="absolute inset-12 border border-suno-neonPink/20 rounded-full animate-pulse"></div>
                        
                        {/* Center Icon */}
                        <div className="relative z-10 bg-black/50 p-6 rounded-full border border-white/10 backdrop-blur-sm shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                           <Activity className="w-12 h-12 text-suno-neonBlue animate-pulse" />
                        </div>
                        
                        {/* Scanning Line */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-suno-neonBlue/10 to-transparent w-full h-[2px] animate-[scan_3s_ease-in-out_infinite] opacity-30"></div>
                    </div>
                    
                    <div className="text-center space-y-3">
                        <h3 className="text-xl font-bold text-white tracking-[0.3em] uppercase">System Ready</h3>
                        <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-suno-neonBlue/70">
                            <span className="w-2 h-2 bg-suno-neonGreen rounded-full animate-pulse"></span>
                            <span>V5 ENGINE ONLINE</span>
                            <span className="mx-2">|</span>
                            <span>WAITING FOR INPUT</span>
                        </div>
                    </div>
                </div>
            )}

            {status === GenerationStatus.LOADING && (
                <div className="h-full flex flex-col items-center justify-center">
                    <div className="relative mb-12">
                        <div className="absolute inset-0 bg-suno-neonBlue/30 blur-2xl rounded-full animate-pulse"></div>
                        <div className="w-32 h-32 border-4 border-white/5 border-t-suno-neonBlue border-b-suno-neonPink rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-4xl">🎵</span>
                        </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">COMPOSING...</h3>
                    <div className="flex space-x-2 mt-4">
                        <div className="w-1 h-8 bg-suno-neonBlue rounded-full animate-[bounce_1s_infinite]"></div>
                        <div className="w-1 h-8 bg-suno-neonPink rounded-full animate-[bounce_1s_infinite_0.1s]"></div>
                        <div className="w-1 h-8 bg-suno-primary rounded-full animate-[bounce_1s_infinite_0.2s]"></div>
                    </div>
                    <p className="text-xs text-suno-neonBlue mt-6 font-mono uppercase tracking-widest">Applying V5 Tags</p>
                </div>
            )}

            {(status === GenerationStatus.SUCCESS && result) && (
                <ResultCard song={result} />
            )}
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-[10px] text-gray-700 border-t border-white/5 bg-black/80 backdrop-blur-md uppercase tracking-widest">
        <div className="max-w-[1800px] mx-auto px-6 flex justify-between items-center">
             <p>Sonic Architect V5.0 // Engineered for Audio</p>
             <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <p className="opacity-50">System Operational</p>
             </div>
        </div>
      </footer>
    </div>
  );
};

export default App;