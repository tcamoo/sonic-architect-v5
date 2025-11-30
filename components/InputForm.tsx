
import React, { useState, useEffect } from 'react';
import { SongRequest, StructureBlock } from '../types';
import { Button } from './Button';
import { StructureEditor } from './StructureEditor';
import { Wand2, Mic, Music, AlignLeft, Sparkles, FileAudio, Settings2, Zap, LayoutTemplate, Disc, Star } from 'lucide-react';

interface InputFormProps {
  onSubmit: (request: SongRequest) => void;
  isLoading: boolean;
  onWorkstationChange?: (isActive: boolean) => void;
}

const MOODS = ['充满活力 (Energetic)', '忧伤 (Melancholic)', '慵懒 (Chill)', '愤怒 (Aggressive)', '浪漫 (Romantic)', '空灵 (Ethereal)', '暗黑 (Dark)'];
const GENRES = ['流行 (Pop)', '古风 (Traditional Chinese)', '摇滚 (Rock)', '电子 (Electronic)', '爵士 (Jazz)', 'R&B', '嘻哈 (Hip Hop)', '金属 (Metal)'];

// Visual Cards for Inspiration Mode
const VISUAL_PRESETS = [
  { 
    id: 'faye',
    name: "王菲风格 (Faye)", 
    tag: "Dream Pop / Ethereal",
    colors: "from-purple-500 to-indigo-600",
    instruction: "Style of Faye Wong, Dream Pop, Ethereal, Whispery vocals, Avant-garde",
    genre: "流行 (Pop)",
    mood: "空灵 (Ethereal)"
  },
  { 
    id: 'wangfeng',
    name: "汪峰风格 (Wang Feng)", 
    tag: "Folk Rock / Philosophical",
    colors: "from-red-600 to-orange-700",
    instruction: "Style of Wang Feng, Mando-Rock, Raspy male vocals, Piano intro, Philosophical lyrics",
    genre: "摇滚 (Rock)",
    mood: "愤怒 (Aggressive)"
  },
  { 
    id: 'gem',
    name: "邓紫棋 (G.E.M.)", 
    tag: "Power Pop / R&B",
    colors: "from-pink-500 to-rose-600",
    instruction: "Style of G.E.M., Power Pop, Soul, R&B, Belting high notes, Emotional",
    genre: "流行 (Pop)",
    mood: "充满活力 (Energetic)"
  },
  { 
    id: 'cyber',
    name: "赛博朋克 (Cyberpunk)", 
    tag: "Dark Synth / Industrial",
    colors: "from-cyan-500 to-blue-700",
    instruction: "Cyberpunk, Dark Synthwave, Heavy Bass, Distorted vocals, Future Bass",
    genre: "电子 (Electronic)",
    mood: "暗黑 (Dark)"
  },
];

const DEFAULT_STRUCTURE: StructureBlock[] = [
  { id: '1', type: 'Intro', style: 'Atmospheric start', instruments: '', lyrics: '', duration: 15 },
  { id: '2', type: 'Verse', style: 'Soft vocals', instruments: 'Piano, Light Drums', lyrics: '', duration: 30 },
  { id: '3', type: 'Pre-Chorus', style: 'Building up', instruments: '', lyrics: '', duration: 15 },
  { id: '4', type: 'Chorus', style: 'Powerful, Emotional', instruments: 'Full Band, Strings', lyrics: '', duration: 25 },
  { id: '5', type: 'Outro', style: 'Fading out', instruments: '', lyrics: '', duration: 20 },
];

type Tab = 'inspiration' | 'arrangement';

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, onWorkstationChange }) => {
  // Default to Arrangement Mode & Visual Builder ON
  const [activeTab, setActiveTab] = useState<Tab>('arrangement');
  const [useStructureBuilder, setUseStructureBuilder] = useState(true);
  
  // Inspiration State
  const [topic, setTopic] = useState('');
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('');
  const [instrumental, setInstrumental] = useState(false);

  // Arrangement State
  const [lyrics, setLyrics] = useState('');
  const [structureBlocks, setStructureBlocks] = useState<StructureBlock[]>(DEFAULT_STRUCTURE);
  const [targetDuration, setTargetDuration] = useState(3.5);
  const [bpm, setBpm] = useState(120);

  // Common
  const [customInstructions, setCustomInstructions] = useState('');

  // Sync workstation state with parent on mount and change
  useEffect(() => {
    if (activeTab === 'arrangement' && useStructureBuilder) {
      onWorkstationChange?.(true);
    } else {
      onWorkstationChange?.(false);
    }
  }, [useStructureBuilder, activeTab, onWorkstationChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'inspiration') {
      onSubmit({
        mode: 'inspiration',
        modelVersion: 'v5', // Always V5
        topic,
        mood,
        genre,
        customInstructions,
        instrumental
      });
    } else {
      onSubmit({
        mode: 'arrangement',
        modelVersion: 'v5', // Always V5
        originalLyrics: lyrics,
        customInstructions,
        useStructureBuilder,
        structureBlocks: useStructureBuilder ? structureBlocks : undefined,
        targetDuration,
        bpm: useStructureBuilder ? bpm : undefined
      });
    }
  };

  const selectBadge = (current: string, setFn: (v: string) => void, value: string) => {
    setFn(current === value ? '' : value);
  };

  const applyVisualPreset = (preset: typeof VISUAL_PRESETS[0]) => {
    setGenre(preset.genre);
    setMood(preset.mood);
    setCustomInstructions(preset.instruction);
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      
      {/* Mode Switcher */}
      <div className="flex p-1 space-x-1 bg-black/60 rounded-xl border border-white/10 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab('inspiration')}
          className={`flex-1 flex items-center justify-center py-2.5 text-xs font-bold tracking-wide rounded-lg transition-all duration-300 ${
            activeTab === 'inspiration'
              ? 'bg-suno-primary text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 mr-2" />
          灵感 (Idea)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('arrangement')}
          className={`flex-1 flex items-center justify-center py-2.5 text-xs font-bold tracking-wide rounded-lg transition-all duration-300 ${
            activeTab === 'arrangement'
              ? 'bg-suno-neonBlue text-black shadow-[0_0_15px_rgba(0,243,255,0.5)]'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <FileAudio className="w-3.5 h-3.5 mr-2" />
          歌词编曲 (Lyrics)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* === INSPIRATION MODE === */}
        {activeTab === 'inspiration' && (
          <div className="space-y-6 animate-fade-in">
             
             {/* 1. Master Toolkit (Visual Cards) */}
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider flex items-center">
                  <Star className="w-3 h-3 mr-2" /> 大师风格罗盘 (Master Compass)
                </label>
                <div className="grid grid-cols-2 gap-2">
                   {VISUAL_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyVisualPreset(preset)}
                        className={`relative overflow-hidden rounded-lg p-3 text-left border border-white/5 hover:border-white/20 transition-all group bg-gradient-to-br ${preset.colors} bg-opacity-20`}
                      >
                         <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                         <div className="relative z-10">
                            <h4 className="text-xs font-bold text-white mb-0.5">{preset.name}</h4>
                            <p className="text-[9px] text-white/70 font-mono">{preset.tag}</p>
                         </div>
                         <Zap className="absolute bottom-2 right-2 w-4 h-4 text-white/20 group-hover:text-white/80 transition-colors" />
                      </button>
                   ))}
                </div>
             </div>

             {/* 2. Core Idea */}
             <div className="space-y-2">
              <label className="text-[10px] font-bold text-suno-primary uppercase tracking-wider flex items-center">
                <AlignLeft className="w-3 h-3 mr-2" /> 核心主题 / 故事 (Theme)
              </label>
              <textarea
                required={!instrumental}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-suno-primary focus:border-suno-primary transition-all min-h-[80px] text-sm"
                placeholder="在此输入您的灵感... (例如：雨夜、失恋、赛博朋克城市的追逐战)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* 3. Tags Selection */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-suno-neonPink uppercase tracking-wider flex items-center">
                  <Music className="w-3 h-3 mr-2" /> 流派 (Genre) & 情绪 (Mood)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => selectBadge(genre, setGenre, g)}
                      className={`px-3 py-1 rounded-sm text-[10px] font-medium transition-all border ${
                        genre === g
                          ? 'bg-suno-neonPink/20 border-suno-neonPink text-suno-neonPink'
                          : 'bg-transparent border-white/10 text-gray-500'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => selectBadge(mood, setMood, m)}
                      className={`px-3 py-1 rounded-sm text-[10px] font-medium transition-all border ${
                        mood === m
                          ? 'bg-suno-neonBlue/20 border-suno-neonBlue text-suno-neonBlue'
                          : 'bg-transparent border-white/10 text-gray-500'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

             <div className="flex items-center space-x-3 bg-black/40 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-colors">
                <input
                    type="checkbox"
                    id="instrumental"
                    checked={instrumental}
                    onChange={(e) => setInstrumental(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 text-suno-primary focus:ring-suno-primary bg-black"
                />
                <label htmlFor="instrumental" className="text-xs font-medium text-gray-300 cursor-pointer select-none">
                    纯音乐模式 (Instrumental)
                </label>
              </div>
          </div>
        )}

        {/* === ARRANGEMENT MODE === */}
        {activeTab === 'arrangement' && (
          <div className="space-y-4 animate-fade-in">
             
            {/* Visual Builder Toggle */}
            <div className="flex justify-between items-center bg-black/40 p-2.5 rounded-lg border border-white/5">
                <div className="flex items-center space-x-3">
                   <div className={`p-1.5 rounded-lg ${useStructureBuilder ? 'bg-suno-neonBlue/20 text-suno-neonBlue' : 'bg-gray-800 text-gray-400'}`}>
                      <LayoutTemplate className="w-4 h-4" />
                   </div>
                   <div>
                      <h4 className="text-xs font-bold text-white">可视化工作台 (Visual Workstation)</h4>
                      <p className="text-[9px] text-gray-500">DAW 模式 / 全屏编曲 / 时长控制</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={useStructureBuilder} onChange={(e) => setUseStructureBuilder(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-suno-neonBlue"></div>
                </label>
            </div>

            {useStructureBuilder ? (
               // --- VISUAL EDITOR UI ---
               <div className="space-y-4">
                  <StructureEditor 
                    blocks={structureBlocks} 
                    setBlocks={setStructureBlocks} 
                    bpm={bpm}
                    setBpm={setBpm}
                    targetDuration={targetDuration}
                    setTargetDuration={setTargetDuration}
                  />
               </div>
            ) : (
               // --- TEXT AREA UI ---
               <div className="space-y-2">
                <label className="flex items-center justify-between text-[10px] font-bold text-suno-neonBlue uppercase tracking-wider">
                  <span className="flex items-center"><AlignLeft className="w-3 h-3 mr-2" /> 输入歌词 (Lyrics)</span>
                  <span className="text-[9px] text-gray-500 font-normal">AI 将自动优化结构和标签</span>
                </label>
                <textarea
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-gray-200 placeholder-gray-700 focus:ring-1 focus:ring-suno-neonBlue focus:border-suno-neonBlue transition-all min-h-[250px] font-mono text-sm leading-relaxed"
                  placeholder={`粘贴您的歌词...
例如：
广寒宫，不算凉，反正心头比它更滚烫...`}
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                />
              </div>
            )}
          </div>
        )}

        {/* Common Footer: Custom Instructions */}
        <div className="space-y-2 pt-2 border-t border-white/10">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
               <Settings2 className="w-3 h-3 inline mr-1" /> 
               {activeTab === 'inspiration' ? '额外指令 (Custom Instructions)' : '编曲偏好 (Preferences)'}
            </label>
            <div className="relative">
              <textarea
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-suno-primary focus:border-suno-primary placeholder-gray-700 text-xs h-16"
                placeholder={activeTab === 'inspiration' ? "例如：BPM 120, 强烈的鼓点..." : "点击工作台的预设会自动填充..."}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
              />
            </div>
        </div>

        <Button
            type="submit"
            isLoading={isLoading}
            variant={activeTab === 'inspiration' ? 'primary' : 'neon'}
            className="w-full py-3 text-sm shadow-2xl"
        >
            <Wand2 className="w-4 h-4 mr-2" />
            {activeTab === 'inspiration' ? 'AI 自动编曲 (Auto-Compose)' : '生成 V5 编曲代码 (Generate)'}
        </Button>

      </form>
    </div>
  );
};
