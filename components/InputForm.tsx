
import React, { useState, useEffect } from 'react';
import { SongRequest, StructureBlock } from '../types';
import { Button } from './Button';
import { StructureEditor } from './StructureEditor';
import { Wand2, Mic, Music, AlignLeft, Sparkles, FileAudio, Settings2, Zap, Rocket, LayoutTemplate, Heart } from 'lucide-react';

interface InputFormProps {
  onSubmit: (request: SongRequest) => void;
  isLoading: boolean;
  onWorkstationChange?: (isActive: boolean) => void;
}

const MOODS = ['充满活力 (Energetic)', '忧伤 (Melancholic)', '慵懒 (Chill)', '愤怒 (Aggressive)', '浪漫 (Romantic)', '空灵 (Ethereal)', '暗黑 (Dark)'];
const GENRES = ['流行 (Pop)', '古风 (Traditional Chinese)', '摇滚 (Rock)', '电子 (Electronic)', '爵士 (Jazz)', 'R&B', '嘻哈 (Hip Hop)', '金属 (Metal)'];

const MASTER_PRESETS = [
  { name: "大师: 王菲 (空灵梦幻)", desc: "Style of Faye Wong, Dream Pop, Ethereal, Whispery vocals, Avant-garde, Atmospheric", icon: "🧚‍♀️" },
  { name: "大师: 汪峰 (人文摇滚)", desc: "Style of Wang Feng, Mando-Rock, Raspy male vocals, Piano intro, Philosophical, Explosive Chorus", icon: "🎸" },
  { name: "大师: 邓紫棋 (铁肺R&B)", desc: "Style of G.E.M., Power Pop, Soul, R&B, Belting high notes, Emotional", icon: "🎤" },
  { name: "大师: 黄龄 (痒·妩媚)", desc: "Style of Huang Ling, Sultry, Lazy phrasing, Breathy, Nu-Disco, Chinese Opera touch", icon: "💋" },
  { name: "风格: 武侠琵琶杀伐", desc: "Aggressive Pipa solo, fast-paced plucking, war drums, intense, Wuxia Movie Theme", icon: "⚔️" },
  { name: "风格: 赛博朋克 (V5)", desc: "Cyberpunk, Dark Synthwave, Heavy Bass, Distorted vocals, Future Bass", icon: "🤖" },
];

const VOCAL_LAB = {
  gender: ['男声 (Male)', '女声 (Female)', '对唱 (Duet)'],
  range: ['高音 (High-pitched)', '中音 (Alto/Baritone)', '低音 (Deep)', '假声 (Falsetto)'],
  texture: ['气声 (Breathy)', '沙哑 (Raspy)', '清澈 (Clear)', '厚重 (Rich)'],
  style: ['慵懒 (Lazy)', '歌剧 (Operatic)', '戏腔 (Chinese Opera)', '耳语 (Whisper)']
};

const INSTRUMENT_DEPOT = {
  ancient: ['古筝 (Guzheng)', '琵琶 (Pipa)', '二胡 (Erhu)', '笛子 (Dizi)', '唢呐 (Suona)', '箫 (Xiao)', '古琴 (Guqin)', '马头琴 (Matouqin)', '编钟 (Chime Bells)'],
  pop: ['钢琴 (Piano)', '木吉他 (Acoustic Gtr)', '合成器 (Synth)', '鼓机 (Drum Machine)', '弦乐 (Strings)', '电钢琴 (Rhodes)', '放克贝斯 (Funky Bass)'],
  rock: ['失真吉他 (Distorted Gtr)', '电吉他 (Electric Gtr)', '架子鼓 (Drum Kit)', '强力和弦 (Power Chords)', '贝斯 (Pick Bass)', '过载 (Overdrive)'],
  emotion: ['忧伤 (Melancholic)', '史诗 (Epic)', '空灵 (Ethereal)', '暗黑 (Dark)', '治愈 (Healing)', '激进 (Aggressive)', '浪漫 (Romantic)', '赛博 (Cyber)']
};

const DEFAULT_STRUCTURE: StructureBlock[] = [
  { id: '1', type: 'Intro', style: 'Atmospheric start', lyrics: '', duration: 15 },
  { id: '2', type: 'Verse', style: 'Soft vocals', lyrics: '', duration: 30 },
  { id: '3', type: 'Pre-Chorus', style: 'Building up', lyrics: '', duration: 15 },
  { id: '4', type: 'Chorus', style: 'Powerful, Emotional', lyrics: '', duration: 25 },
  { id: '5', type: 'Outro', style: 'Fading out', lyrics: '', duration: 20 },
];

type Tab = 'inspiration' | 'arrangement';

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, onWorkstationChange }) => {
  // Default to Arrangement Mode & Visual Builder ON
  const [activeTab, setActiveTab] = useState<Tab>('arrangement');
  const [useStructureBuilder, setUseStructureBuilder] = useState(true);
  
  const [modelVersion, setModelVersion] = useState<'v4' | 'v5'>('v5');

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
        modelVersion,
        topic,
        mood,
        genre,
        customInstructions,
        instrumental
      });
    } else {
      onSubmit({
        mode: 'arrangement',
        modelVersion,
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

  const appendInstruction = (text: string) => {
    const cleanText = text.replace(/[\u{1F600}-\u{1F6FF}]/gu, '').trim(); 
    setCustomInstructions(prev => {
      if (prev.includes(cleanText)) return prev;
      return prev ? `${prev}, ${cleanText}` : cleanText;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Model Version Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-black/80 p-1 rounded-full border border-suno-neonBlue/30 flex space-x-2">
            <button 
                type="button"
                onClick={() => setModelVersion('v4')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${modelVersion === 'v4' ? 'bg-gray-700 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
                V4 (Stable)
            </button>
            <button 
                 type="button"
                 onClick={() => setModelVersion('v5')}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center transition-all ${modelVersion === 'v5' ? 'bg-gradient-to-r from-suno-neonBlue to-suno-neonGreen text-black shadow-[0_0_10px_rgba(0,255,157,0.5)]' : 'text-gray-500 hover:text-suno-neonGreen'}`}
            >
                <Rocket className="w-3 h-3 mr-1" />
                V5 (New Engine)
            </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex p-1 space-x-1 bg-black/60 rounded-xl border border-white/10 backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveTab('inspiration')}
          className={`flex-1 flex items-center justify-center py-3 text-sm font-bold tracking-wide rounded-lg transition-all duration-300 ${
            activeTab === 'inspiration'
              ? 'bg-suno-primary text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          灵感 (Idea)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('arrangement')}
          className={`flex-1 flex items-center justify-center py-3 text-sm font-bold tracking-wide rounded-lg transition-all duration-300 ${
            activeTab === 'arrangement'
              ? 'bg-suno-neonBlue text-black shadow-[0_0_15px_rgba(0,243,255,0.5)]'
              : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          }`}
        >
          <FileAudio className="w-4 h-4 mr-2" />
          歌词编曲 (Lyrics)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* === INSPIRATION MODE === */}
        {activeTab === 'inspiration' && (
          <div className="space-y-6 animate-fade-in">
             <div className="space-y-2">
              <label className="text-xs font-bold text-suno-primary uppercase tracking-wider flex items-center">
                <AlignLeft className="w-3 h-3 mr-2" /> 主题 / 故事 (Theme)
              </label>
              <textarea
                required={!instrumental}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white placeholder-gray-600 focus:ring-1 focus:ring-suno-primary focus:border-suno-primary transition-all min-h-[100px]"
                placeholder="例如：一个在雨夜独自开车的失恋男人，看到霓虹灯想起了过去..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-suno-neonPink uppercase tracking-wider flex items-center">
                  <Music className="w-3 h-3 mr-2" /> 流派 (Genre)
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => selectBadge(genre, setGenre, g)}
                      className={`px-3 py-1 rounded-sm text-xs font-medium transition-all border ${
                        genre === g
                          ? 'bg-suno-neonPink/20 border-suno-neonPink text-suno-neonPink shadow-[0_0_8px_rgba(255,0,255,0.4)]'
                          : 'bg-transparent border-white/10 text-gray-500 hover:border-suno-neonPink/50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-bold text-suno-neonBlue uppercase tracking-wider flex items-center">
                  <Mic className="w-3 h-3 mr-2" /> 情绪 (Mood)
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => selectBadge(mood, setMood, m)}
                      className={`px-3 py-1 rounded-sm text-xs font-medium transition-all border ${
                        mood === m
                          ? 'bg-suno-neonBlue/20 border-suno-neonBlue text-suno-neonBlue shadow-[0_0_8px_rgba(0,243,255,0.4)]'
                          : 'bg-transparent border-white/10 text-gray-500 hover:border-suno-neonBlue/50'
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
                <label htmlFor="instrumental" className="text-sm font-medium text-gray-300 cursor-pointer select-none">
                    纯音乐模式 (Instrumental)
                </label>
              </div>
          </div>
        )}

        {/* === ARRANGEMENT MODE === */}
        {activeTab === 'arrangement' && (
          <div className="space-y-6 animate-fade-in">
             
            {/* Visual Builder Toggle */}
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                <div className="flex items-center space-x-3">
                   <div className={`p-2 rounded-lg ${useStructureBuilder ? 'bg-suno-neonBlue/20 text-suno-neonBlue' : 'bg-gray-800 text-gray-400'}`}>
                      <LayoutTemplate className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-white">可视化工作台 (Visual Workstation)</h4>
                      <p className="text-[10px] text-gray-500">专业 DAW 模式 / 全屏编曲 / 时长控制</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={useStructureBuilder} onChange={(e) => setUseStructureBuilder(e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-suno-neonBlue"></div>
                </label>
            </div>

            {useStructureBuilder ? (
               // --- VISUAL EDITOR UI ---
               <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-suno-neonBlue/10 to-transparent border border-suno-neonBlue/30 rounded-lg flex items-center justify-between">
                     <span className="text-xs font-bold text-suno-neonBlue">工作台已就绪 (Workstation Ready)</span>
                     <span className="text-[10px] text-gray-400 animate-pulse">支持拖拽调整段落时长</span>
                  </div>
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
                <label className="flex items-center justify-between text-xs font-bold text-suno-neonBlue uppercase tracking-wider">
                  <span className="flex items-center"><AlignLeft className="w-3 h-3 mr-2" /> 输入歌词 (Lyrics)</span>
                  <span className="text-[10px] text-gray-500 font-normal">AI 将自动优化结构和标签</span>
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
            
            {/* Control Panel: Presets */}
            <div className="space-y-3">
               <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center">
                <Zap className="w-3 h-3 mr-2 text-yellow-400" /> 大师预设 (Master Presets)
              </label>
              <select 
                onChange={(e) => {
                   if(e.target.value) appendInstruction(e.target.value);
                }}
                className="w-full bg-black border border-white/10 rounded-lg p-2 text-sm text-yellow-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              >
                <option value="">-- 选择巨星风格模板 --</option>
                {MASTER_PRESETS.map((p, i) => (
                  <option key={i} value={p.desc}>{p.icon} {p.name}</option>
                ))}
              </select>
            </div>

            {/* Control Panel: Vocal Lab */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-4">
               <label className="text-xs font-bold text-suno-neonPink uppercase tracking-wider flex items-center">
                <Mic className="w-3 h-3 mr-2" /> 人声实验室 (Vocal Lab)
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[...VOCAL_LAB.gender, ...VOCAL_LAB.range, ...VOCAL_LAB.texture, ...VOCAL_LAB.style].map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => appendInstruction(item)}
                      className="text-[10px] py-1.5 px-2 bg-black border border-white/10 hover:border-suno-neonPink hover:text-suno-neonPink text-gray-400 rounded transition-all truncate"
                    >
                      {item}
                    </button>
                ))}
              </div>
            </div>

            {/* Control Panel: Instrument Depot (Categorized) */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-4">
               <label className="text-xs font-bold text-suno-neonGreen uppercase tracking-wider flex items-center">
                <Music className="w-3 h-3 mr-2" /> 乐器库 (Instrument Depot)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ancient */}
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase">国风古韵 (Ancient Chinese)</p>
                  <div className="flex flex-wrap gap-2">
                     {INSTRUMENT_DEPOT.ancient.map(item => (
                       <button key={item} type="button" onClick={() => appendInstruction(item)} className="px-2 py-1 bg-black border border-suno-neonGreen/30 text-suno-neonGreen/80 text-[10px] hover:bg-suno-neonGreen hover:text-black rounded transition-all">{item}</button>
                     ))}
                  </div>
                </div>

                {/* Pop */}
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase">流行与现代 (Pop & Modern)</p>
                  <div className="flex flex-wrap gap-2">
                     {INSTRUMENT_DEPOT.pop.map(item => (
                       <button key={item} type="button" onClick={() => appendInstruction(item)} className="px-2 py-1 bg-black border border-white/10 text-blue-300 text-[10px] hover:border-blue-400 hover:text-white rounded transition-all">{item}</button>
                     ))}
                  </div>
                </div>

                {/* Rock */}
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase">摇滚与金属 (Rock & Metal)</p>
                  <div className="flex flex-wrap gap-2">
                     {INSTRUMENT_DEPOT.rock.map(item => (
                       <button key={item} type="button" onClick={() => appendInstruction(item)} className="px-2 py-1 bg-black border border-white/10 text-red-300 text-[10px] hover:border-red-400 hover:text-white rounded transition-all">{item}</button>
                     ))}
                  </div>
                </div>

                {/* Emotion */}
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-500 uppercase flex items-center">情感氛围 (Emotion & Vibe) <Heart className="w-3 h-3 ml-1 text-pink-500"/></p>
                  <div className="flex flex-wrap gap-2">
                     {INSTRUMENT_DEPOT.emotion.map(item => (
                       <button key={item} type="button" onClick={() => appendInstruction(item)} className="px-2 py-1 bg-black border border-white/10 text-pink-300 text-[10px] hover:border-pink-400 hover:text-white rounded transition-all">{item}</button>
                     ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Common Footer: Custom Instructions */}
        <div className="space-y-2 pt-4 border-t border-white/10">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
               <Settings2 className="w-3 h-3 inline mr-1" /> 
               {activeTab === 'inspiration' ? '额外指令 (Custom Instructions)' : '编曲偏好 (Preferences)'}
            </label>
            <div className="relative">
              <textarea
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-suno-primary focus:border-suno-primary placeholder-gray-700 text-sm h-20"
                placeholder={activeTab === 'inspiration' ? "例如：BPM 120, 强烈的鼓点..." : "点击上方按钮自动填充，或手动输入..."}
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
              />
              <div className="absolute bottom-2 right-2 text-[10px] text-gray-600 pointer-events-none">
                 AI 将根据 {modelVersion.toUpperCase()} 模型自动优化
              </div>
            </div>
        </div>

        <Button
            type="submit"
            isLoading={isLoading}
            variant={activeTab === 'inspiration' ? 'primary' : 'neon'}
            className="w-full py-4 text-base shadow-2xl"
        >
            <Wand2 className="w-5 h-5 mr-2" />
            {activeTab === 'inspiration' ? '生成灵感提示词' : '生成 V5 编曲'}
        </Button>

      </form>
    </div>
  );
};
