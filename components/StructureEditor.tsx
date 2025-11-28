
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { StructureBlock } from '../types';
import { Button } from './Button';
import { Trash2, Plus, Music, Settings, ChevronLeft, ChevronRight, Maximize2, Minimize2, LayoutTemplate, Sparkles, Wand2, FileText, Quote, Mic2, Tag, Zap, Guitar, Drum, Piano, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface StructureEditorProps {
  blocks: StructureBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<StructureBlock[]>>;
  bpm: number;
  setBpm: (val: number) => void;
  targetDuration: number;
  setTargetDuration: (val: number) => void;
}

const PIXELS_PER_SECOND = 4; // Scale factor for timeline

// 1. Localized Block Types
const BLOCK_TYPES = [
  { label: '前奏 (Intro)', value: 'Intro', color: 'bg-blue-600', border: 'border-blue-400', text: 'text-blue-100' },
  { label: '主歌 (Verse)', value: 'Verse', color: 'bg-emerald-600', border: 'border-emerald-500', text: 'text-emerald-100' },
  { label: '导歌 (Pre-Chorus)', value: 'Pre-Chorus', color: 'bg-yellow-600', border: 'border-yellow-500', text: 'text-yellow-100' },
  { label: '副歌 (Chorus)', value: 'Chorus', color: 'bg-pink-600', border: 'border-pink-500', text: 'text-pink-100' },
  { label: '桥段 (Bridge)', value: 'Bridge', color: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-100' },
  { label: '间奏 (Instrumental)', value: 'Instrumental', color: 'bg-orange-600', border: 'border-orange-500', text: 'text-orange-100' },
  { label: '尾奏 (Outro)', value: 'Outro', color: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-100' },
];

// 2. Solo Generator Data (Localized)
const SOLO_INSTRUMENTS = [
  "电吉他 (Electric Guitar)", "木吉他 (Acoustic Guitar)", "钢琴 (Piano)", "合成器 (Synthesizer)", "萨克斯 (Saxophone)", 
  "小提琴 (Violin)", "大提琴 (Cello)", "贝斯 (Bass)", "鼓机 (Drum Machine)", "808 Bass",
  "古筝 (Guzheng)", "琵琶 (Pipa)", "二胡 (Erhu)", "笛子 (Dizi)", "唢呐 (Suona)", "马头琴 (Matouqin)"
];
const SOLO_ADJECTIVES = [
  "情感的 (Emotional)", "失真的 (Distorted)", "清音 (Clean)", "快速的 (Fast)", "缓慢的 (Slow)", 
  "旋律化的 (Melodic)", "激进的 (Aggressive)", "柔和的 (Soft)", "史诗的 (Epic)", "爵士感的 (Jazzy)"
];
const SOLO_TECHNIQUES = [
  "独奏 (Solo)", "乐句 (Riff)", "加花 (Licks)", "琶音 (Arpeggio)", "速弹 (Shredding)", 
  "和弦 (Chords)", "即兴 (Improvisation)", "高潮 (Drop)", "过门 (Fill)"
];

// 3. Detailed Smart Library (Accordion)
type StyleGroup = {
    category: string;
    subGroups: {
        name: string;
        tags: { label: string; value: string }[];
    }[];
};

const SMART_LIBRARY: StyleGroup[] = [
    {
        category: "国风/史诗 (Chinese Epic)",
        subGroups: [
            {
                name: "史诗国风 (Epic Chinese)",
                tags: [
                    { label: "史诗国风", value: "Epic Chinese Style" },
                    { label: "电影感", value: "Cinematic" },
                    { label: "管弦乐", value: "Orchestral" },
                    { label: "大气", value: "Atmospheric" },
                    { label: "雄浑男声", value: "Powerful Male Vocals" },
                    { label: "战鼓", value: "War Drums" },
                    { label: "笛子", value: "Dizi" }
                ]
            },
            {
                name: "苍凉叙事 (Narrative)",
                tags: [
                    { label: "中国风", value: "Chinese Style" },
                    { label: "古风", value: "Ancient Style" },
                    { label: "叙事感", value: "Narrative" },
                    { label: "忧郁", value: "Melancholy" },
                    { label: "深沉男中音", value: "Deep Male Baritone" },
                    { label: "古琴", value: "Guqin" },
                    { label: "弦乐", value: "Strings" }
                ]
            },
            {
                name: "摇滚国风 (Rock Chinese)",
                tags: [
                    { label: "国风摇滚", value: "Chinese Style Rock" },
                    { label: "史诗摇滚", value: "Epic Rock" },
                    { label: "交响金属", value: "Symphonic Metal" },
                    { label: "力量金属", value: "Power Metal" },
                    { label: "强劲男声", value: "Strong Male Vocals" },
                    { label: "电吉他", value: "Electric Guitar" },
                    { label: "琵琶", value: "Pipa" }
                ]
            }
        ]
    },
    {
        category: "电子/复古 (Electronic/Retro)",
        subGroups: [
            {
                name: "复古合成器 (Synthwave)",
                tags: [
                    { label: "80s Synthwave", value: "80s Synthwave" },
                    { label: "复古未来", value: "Retro Futuristic" },
                    { label: "强劲贝斯", value: "Driving Bassline" },
                    { label: "史诗合成器", value: "Epic Synthesizer Melody" },
                    { label: "闪亮Pad", value: "Shimmering Pads" },
                    { label: "鼓机", value: "Drum Machine" },
                    { label: "夜间飙车", value: "Driving through Miami at night" }
                ]
            },
            {
                name: "Lofi嘻哈 (Lofi Hip Hop)",
                tags: [
                    { label: "Lofi Hip Hop", value: "Lofi Hip Hop" },
                    { label: "Chill Beat", value: "Chill Beat" },
                    { label: "柔和钢琴", value: "Mellow Piano Chords" },
                    { label: "黑胶爆豆", value: "Vinyl Crackle" },
                    { label: "雨声", value: "Rain Sounds" },
                    { label: "放松", value: "Relaxing" }
                ]
            },
            {
                name: "未来贝斯 (Future Bass)",
                tags: [
                    { label: "Future Bass", value: "Future Bass" },
                    { label: "活力", value: "Energetic" },
                    { label: "卡哇伊", value: "Kawaii" },
                    { label: "超级锯齿波", value: "Supersaw Chords" },
                    { label: "闪亮琶音", value: "Sparkling Arpeggios" },
                    { label: "可爱女声切片", value: "Cute Female Vocal Chops" },
                    { label: "振奋Drop", value: "Uplifting Drop" }
                ]
            }
        ]
    },
    {
        category: "摇滚/金属 (Rock/Metal)",
        subGroups: [
            {
                name: "史诗另类摇滚 (Epic Alt Rock)",
                tags: [
                    { label: "另类摇滚", value: "Alternative Rock" },
                    { label: "圣歌感", value: "Anthemic" },
                    { label: "强力男声", value: "Powerful Male Vocals" },
                    { label: "高亢Riff", value: "Soaring Electric Guitar Riffs" },
                    { label: "强劲鼓点", value: "Driving Drums" },
                    { label: "体育场摇滚", value: "Stadium Rock Feel" },
                    { label: "能量爆发", value: "Chorus Explodes" }
                ]
            },
            {
                name: "民谣金属 (Folk Metal)",
                tags: [
                    { label: "民谣金属", value: "Folk Metal" },
                    { label: "战斗主题", value: "Epic Battle Theme" },
                    { label: "重失真吉他", value: "Heavy Distorted Guitars" },
                    { label: "冲击节拍", value: "Fast Blast Beats" },
                    { label: "传统长笛", value: "Traditional Flute" },
                    { label: "小提琴", value: "Violin" },
                    { label: "嘶吼", value: "Harsh Growling Vocals" }
                ]
            }
        ]
    },
    {
        category: "流行/原声 (Pop/Acoustic)",
        subGroups: [
            {
                name: "清新民谣 (Acoustic Folk)",
                tags: [
                    { label: "原声民谣", value: "Acoustic Folk" },
                    { label: "温柔", value: "Gentle" },
                    { label: "男女对唱", value: "Male and Female Duet" },
                    { label: "和声", value: "Harmony" },
                    { label: "木吉他指弹", value: "Simple Acoustic Guitar Fingerpicking" },
                    { label: "亲密感", value: "Intimate" }
                ]
            },
            {
                name: "现代K-Pop",
                tags: [
                    { label: "K-Pop", value: "K-Pop" },
                    { label: "欢快舞曲", value: "Upbeat Dance-Pop" },
                    { label: "抓耳副歌", value: "Catchy Chorus" },
                    { label: "精良制作", value: "Slick Production" },
                    { label: "男团人声", value: "Male Group Vocals" },
                    { label: "活力说唱", value: "Energetic Rap Verse" },
                    { label: "泡泡糖流行", value: "Bubblegum Pop" }
                ]
            }
        ]
    },
    {
        category: "电影/氛围 (Cinematic)",
        subGroups: [
            {
                name: "宏大配乐 (Epic Orchestral)",
                tags: [
                    { label: "史诗电影", value: "Epic Cinematic" },
                    { label: "管弦乐", value: "Orchestral" },
                    { label: "宏大合唱", value: "Powerful Choir" },
                    { label: "高亢弦乐", value: "Soaring Strings" },
                    { label: "雷鸣打击乐", value: "Thunderous Percussion" },
                    { label: "铜管号角", value: "Brass Fanfare" },
                    { label: "冒险奇幻", value: "Adventure Fantasy" }
                ]
            },
            {
                name: "赛博朋克 (Cyberpunk)",
                tags: [
                    { label: "赛博朋克", value: "Cyberpunk" },
                    { label: "黑暗氛围", value: "Dark Ambient" },
                    { label: "霓虹城市", value: "Neon City" },
                    { label: "反乌托邦", value: "Dystopian" },
                    { label: "脉动贝斯", value: "Pulsating Synth Bass" },
                    { label: "故障音效", value: "Glitchy Effects" },
                    { label: "未来音景", value: "Futuristic Soundscape" }
                ]
            }
        ]
    }
];

// Localized Master Phrases
const LOCALIZED_PHRASES = [
    { label: "充满灵魂且内省的都市民谣", text: "A soulful and introspective Urban Folk ballad" },
    { label: "温暖磁性且具叙事感的男声", text: "Features a warm, magnetic, storytelling male vocal" },
    { label: "以木吉他和钢琴为主导", text: "Led by acoustic guitar and piano" },
    { label: "副歌加入温暖大提琴与细腻弦乐", text: "With a warm cello and subtle string section building in the chorus" },
    { label: "充满灵魂的华语流行抒情歌", text: "A soulful and introspective C-Pop ballad" },
    { label: "成熟磁性、略带沙哑的叙事男声", text: "Featuring a mature, magnetic, storytelling male vocal with a slightly raspy texture" },
    { label: "音乐感觉像是一场亲密的对话", text: "The music feels like an intimate conversation" },
    { label: "以钢琴、木吉他和温暖弦乐为背景", text: "Set to a backdrop of piano, acoustic guitar, and warm strings" },
    { label: "慵懒迷人的中低音女声", text: "Sultry female alto vocals with lazy, charming phrasing" },
    { label: "史诗般的管弦乐铺陈伴随雷鸣打击乐", text: "Epic orchestral build-up with thunderous percussion" },
    { label: "空灵女声漂浮在氛围感合成器之上", text: "Ethereal female vocals floating over atmospheric pads" },
    { label: "激进的失真贝斯跌入重型节拍", text: "Aggressive distorted bass dropping into a heavy beat" },
    { label: "传统中国乐器融合现代Trap节拍", text: "Traditional Chinese instruments blending with modern trap beats" }
];

export const StructureEditor: React.FC<StructureEditorProps> = ({ blocks, setBlocks, bpm, setBpm, targetDuration, setTargetDuration }) => {
  const [selectedId, setSelectedId] = useState<string | null>(blocks[0]?.id || null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'styles' | 'phrases'>('styles');
  
  // Drag State
  const [dragState, setDragState] = useState<{ blockId: string, startX: number, startDuration: number } | null>(null);

  // Library Accordion State
  const [expandedCategory, setExpandedCategory] = useState<string | null>(SMART_LIBRARY[0].category);
  const [expandedSubGroup, setExpandedSubGroup] = useState<string | null>(null);

  // Solo Generator State
  const [soloInst, setSoloInst] = useState(SOLO_INSTRUMENTS[0]);
  const [soloAdj, setSoloAdj] = useState(SOLO_ADJECTIVES[0]);
  const [soloTech, setSoloTech] = useState(SOLO_TECHNIQUES[0]);

  useEffect(() => {
    if (!selectedId && blocks.length > 0) {
      setSelectedId(blocks[0].id);
    }
  }, [blocks, selectedId]);

  // Update total duration when blocks change
  useEffect(() => {
    const totalSeconds = blocks.reduce((acc, b) => acc + b.duration, 0);
    const totalMinutes = parseFloat((totalSeconds / 60).toFixed(1));
    if (Math.abs(totalMinutes - targetDuration) > 0.1 && !dragState) {
        setTargetDuration(totalMinutes);
    }
  }, [blocks, dragState]);

  const addBlock = () => {
    const newBlock: StructureBlock = {
      id: Date.now().toString(),
      type: 'Verse',
      style: '',
      description: '',
      lyrics: '',
      duration: 30
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    setSelectedId(newBlock.id);
  };

  const removeBlock = (id: string) => {
    const newBlocks = blocks.filter(b => b.id !== id);
    setBlocks(newBlocks);
    if (selectedId === id) setSelectedId(newBlocks[0]?.id || null);
  };

  const moveBlock = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
  };

  const updateBlock = (id: string, field: keyof StructureBlock, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  // Dragging Logic
  const handleDragStart = (e: React.MouseEvent, blockId: string, duration: number) => {
    e.stopPropagation();
    setDragState({ blockId, startX: e.clientX, startDuration: duration });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState) return;
      const deltaX = e.clientX - dragState.startX;
      const deltaSeconds = deltaX / PIXELS_PER_SECOND;
      const newDuration = Math.max(5, Math.round(dragState.startDuration + deltaSeconds)); // Min 5 seconds
      
      setBlocks(prev => prev.map(b => b.id === dragState.blockId ? { ...b, duration: newDuration } : b));
    };

    const handleMouseUp = () => {
      setDragState(null);
    };

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, setBlocks]);

  const appendStyleTag = (tag: string) => {
    if (!selectedId) return;
    const block = blocks.find(b => b.id === selectedId);
    if (block) {
      const newStyle = block.style ? `${block.style}, ${tag}` : tag;
      updateBlock(selectedId, 'style', newStyle);
    }
  };

  const appendDescription = (phrase: string) => {
    if (!selectedId) return;
    const block = blocks.find(b => b.id === selectedId);
    if (block) {
      const newDesc = block.description ? `${block.description} ${phrase}` : phrase;
      updateBlock(selectedId, 'description', newDesc);
    }
  };

  const generateSolo = () => {
    const inst = soloInst.split(' (')[0];
    const adj = soloAdj.split(' (')[0];
    const tech = soloTech.split(' (')[0];
    const tag = `[${adj} ${inst} ${tech}]`;
    appendStyleTag(tag);
  };

  const selectedBlock = blocks.find(b => b.id === selectedId);
  const selectedIndex = blocks.findIndex(b => b.id === selectedId);

  // Time Ruler helpers
  const totalDurationSeconds = blocks.reduce((acc, b) => acc + b.duration, 0);

  const containerClasses = isFullScreen 
    ? "fixed inset-0 z-[9999] w-screen h-screen rounded-none bg-[#121212]" 
    : "h-[700px] w-full rounded-xl relative";

  const editorContent = (
    <div className={`flex flex-col bg-[#1a1a1a] border border-[#333] overflow-hidden shadow-2xl font-sans select-none animate-fade-in transition-all duration-300 ${containerClasses}`}>
      
      {/* Top Bar */}
      <div className="h-14 bg-[#252525] border-b border-[#333] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-400">
             <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
             <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="h-6 w-px bg-[#444]"></div>
          <span className="text-sm font-bold text-gray-200 flex items-center tracking-wider">
            <Music className="w-4 h-4 mr-2 text-suno-neonBlue" />
            编曲工作台 (WORKSTATION)
          </span>
        </div>

        <div className="flex items-center space-x-6">
            <div className="flex items-center bg-black/30 rounded-lg px-3 py-1 border border-white/5">
               <span className="text-[10px] text-gray-500 font-bold mr-2 uppercase">BPM (速度)</span>
               <input 
                  type="number" 
                  value={bpm} 
                  onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
                  className="w-12 bg-transparent text-suno-neonPink font-mono font-bold text-sm focus:outline-none text-center"
               />
            </div>
            <div className="flex items-center bg-black/30 rounded-lg px-3 py-1 border border-white/5">
                <Clock className="w-3 h-3 text-suno-neonBlue mr-2" />
                <span className="text-[10px] text-gray-500 font-bold mr-2 uppercase">总时长</span>
                <span className="text-suno-neonBlue font-mono font-bold text-sm text-center">
                    {Math.floor(totalDurationSeconds / 60)}:{(totalDurationSeconds % 60).toString().padStart(2, '0')}
                </span>
            </div>
            <div className="h-6 w-px bg-[#444]"></div>
            <Button 
                type="button" 
                onClick={() => setIsFullScreen(!isFullScreen)} 
                variant="ghost" 
                className="h-8 w-8 p-0 flex items-center justify-center text-gray-400 hover:text-white"
            >
               {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
        </div>
      </div>

      {/* Timeline Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#121212] relative overflow-hidden">
         
         {/* Time Ruler */}
         <div className="h-8 bg-[#1a1a1a] border-b border-[#333] flex items-end px-[200px] shrink-0 overflow-hidden">
             <div className="flex relative h-full w-full" style={{ transform: 'translateX(0px)' }}> {/* Placeholder for scroll sync if needed */}
                {Array.from({ length: Math.ceil(totalDurationSeconds / 5) + 5 }).map((_, i) => (
                    <div key={i} className="absolute bottom-0 border-l border-[#444] h-2 text-[9px] text-gray-500 pl-1 font-mono" style={{ left: i * 5 * PIXELS_PER_SECOND }}>
                        {Math.floor((i * 5) / 60)}:{(i * 5) % 60 < 10 ? '0' : ''}{(i * 5) % 60}
                    </div>
                ))}
             </div>
         </div>

         <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar relative flex">
            
            {/* Track Headers (Left Sidebar) */}
            <div className="w-[200px] bg-[#1f1f1f] border-r border-[#333] flex-shrink-0 z-20 sticky left-0 shadow-lg flex flex-col">
               <div className="h-32 border-b border-[#333] p-4 flex flex-col justify-between group hover:bg-[#2a2a2a] transition-colors">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-200">结构 (Structure)</span>
                     <LayoutTemplate className="w-3 h-3 text-suno-neonBlue" />
                  </div>
                  <div className="text-[9px] text-gray-500">点击积木右侧边缘拖拽调整时长</div>
               </div>
               <div className="h-32 border-b border-[#333] p-4 flex flex-col justify-between group hover:bg-[#2a2a2a] transition-colors bg-[#222]">
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-suno-neonGreen">风格指令 (Style)</span>
                     <Tag className="w-3 h-3 text-suno-neonGreen" />
                  </div>
               </div>
               <div className="h-32 border-b border-[#333] p-4 flex flex-col justify-between group hover:bg-[#2a2a2a] transition-colors bg-[#181818]">
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-bold text-pink-400">叙事描述 (Narrative)</span>
                     <FileText className="w-3 h-3 text-pink-400" />
                  </div>
               </div>
            </div>

            {/* Track Lanes Content */}
            <div className="flex-1 bg-[#121212] relative" style={{ minWidth: totalDurationSeconds * PIXELS_PER_SECOND + 200 }}>
               
               {/* Vertical Grid Lines */}
               <div className="absolute inset-0 pointer-events-none z-0">
                  {Array.from({ length: Math.ceil(totalDurationSeconds / 5) + 5 }).map((_, i) => (
                      <div key={i} className="absolute top-0 bottom-0 border-r border-[#222]" style={{ left: i * 5 * PIXELS_PER_SECOND }}></div>
                  ))}
               </div>

               {/* Track 1: STRUCTURE */}
               <div className="h-32 border-b border-[#333] flex items-center px-0 py-2 relative z-10">
                  {blocks.map((block, index) => {
                    const typeConfig = BLOCK_TYPES.find(t => t.value === block.type) || BLOCK_TYPES[0];
                    const isSelected = block.id === selectedId;
                    const width = block.duration * PIXELS_PER_SECOND;
                    
                    return (
                      <div
                        key={block.id}
                        onClick={() => setSelectedId(block.id)}
                        className={`relative group flex-shrink-0 h-full rounded-lg border cursor-pointer transition-colors duration-200 overflow-hidden flex flex-col ${typeConfig.color} ${typeConfig.border} ${isSelected ? 'ring-2 ring-white shadow-[0_0_20px_rgba(255,255,255,0.4)] z-10' : 'opacity-90 hover:opacity-100'}`}
                        style={{ width: `${width}px`, marginRight: '1px' }}
                      >
                         <div className="bg-black/20 px-2 py-1 flex items-center justify-between backdrop-blur-sm truncate">
                            <select
                                value={block.type}
                                onChange={(e) => updateBlock(block.id, 'type', e.target.value as any)}
                                onClick={(e) => e.stopPropagation()}
                                className={`bg-transparent text-[10px] font-bold uppercase focus:outline-none cursor-pointer appearance-none ${typeConfig.text}`}
                                style={{ width: '100%' }}
                            >
                                {BLOCK_TYPES.map(t => <option key={t.value} value={t.value} className="bg-gray-800 text-white">{t.label}</option>)}
                            </select>
                         </div>
                         <div className="flex-1 p-2 bg-gradient-to-b from-transparent to-black/40 flex flex-col justify-end">
                            <div className="text-[9px] font-mono text-white/70 absolute bottom-1 left-2">{block.duration}s</div>
                         </div>

                         {/* Resize Handle */}
                         <div 
                            className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/30 z-20 flex items-center justify-center group-hover:bg-white/10"
                            onMouseDown={(e) => handleDragStart(e, block.id, block.duration)}
                         >
                            <div className="h-4 w-0.5 bg-white/50 rounded-full"></div>
                         </div>
                      </div>
                    );
                  })}
                  <button type="button" onClick={addBlock} className="h-full w-16 border-2 border-dashed border-[#333] hover:border-suno-neonBlue rounded-lg flex flex-col items-center justify-center text-[#444] hover:text-suno-neonBlue transition-all ml-2 group">
                    <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </button>
               </div>
               
               {/* Track 2: TAGS */}
               <div className="h-32 border-b border-[#333] flex items-center px-0 py-2 relative z-10 bg-[#161616]">
                  {blocks.map((block) => {
                      const isSelected = block.id === selectedId;
                      const width = block.duration * PIXELS_PER_SECOND;
                      return (
                        <div key={block.id + '_style'} onClick={() => setSelectedId(block.id)} className={`flex-shrink-0 h-24 rounded-lg border flex flex-col p-2 overflow-hidden cursor-pointer transition-all ${isSelected ? 'border-suno-neonGreen bg-suno-neonGreen/10 z-10' : 'border-[#333] bg-[#222] hover:border-gray-500'}`} style={{ width: `${width}px`, marginRight: '1px' }}>
                           <p className="text-[10px] text-suno-neonGreen font-mono leading-tight break-words">{block.style || <span className="opacity-30">暂无风格标签...</span>}</p>
                        </div>
                      )
                  })}
               </div>

               {/* Track 3: NARRATIVE */}
               <div className="h-32 border-b border-[#333] flex items-center px-0 py-2 relative bg-[#121212]">
                  {blocks.map((block) => {
                       const isSelected = block.id === selectedId;
                       const width = block.duration * PIXELS_PER_SECOND;
                       return (
                          <div key={block.id + '_desc'} onClick={() => setSelectedId(block.id)} className={`flex-shrink-0 h-24 rounded-lg border bg-[#1a1a1a] p-3 overflow-hidden flex flex-col items-start cursor-pointer transition-all ${isSelected ? 'border-pink-500 bg-pink-900/10 z-10' : 'border-[#333] opacity-60 hover:opacity-100'}`} style={{ width: `${width}px`, marginRight: '1px' }}>
                             <p className="text-[9px] text-pink-300 font-sans leading-relaxed line-clamp-4 w-full italic">
                                {block.description || <span className="opacity-30 not-italic">暂无叙事描述...</span>}
                             </p>
                          </div>
                       )
                  })}
               </div>
            </div>
         </div>
      </div>

      {/* Inspector (Bottom Panel) */}
      <div className="h-[320px] bg-[#1e1e1e] border-t border-black flex flex-col z-20 shadow-[0_-5px_30px_rgba(0,0,0,0.6)] shrink-0">
         <div className="h-10 bg-[#252525] border-b border-[#333] flex items-center px-6 justify-between shrink-0">
             <div className="flex items-center space-x-4">
               <span className="text-xs font-bold text-suno-neonBlue uppercase tracking-widest flex items-center">
                 <Settings className="w-3 h-3 mr-2" /> 属性面板 (INSPECTOR)
               </span>
               <div className="h-4 w-px bg-[#444]"></div>
               <span className="text-[10px] text-gray-500 font-mono">
                 当前编辑: <span className="text-white">{selectedBlock ? BLOCK_TYPES.find(t => t.value === selectedBlock.type)?.label : '未选择'}</span>
               </span>
             </div>
             {selectedBlock && (
                <div className="flex space-x-2">
                   <button type="button" onClick={() => moveBlock(selectedIndex, 'left')} className="p-1.5 bg-[#333] rounded hover:bg-gray-600 text-gray-300"><ChevronLeft className="w-3 h-3" /></button>
                   <button type="button" onClick={() => moveBlock(selectedIndex, 'right')} className="p-1.5 bg-[#333] rounded hover:bg-gray-600 text-gray-300"><ChevronRight className="w-3 h-3" /></button>
                   <div className="w-px h-6 bg-[#444] mx-2"></div>
                   <button type="button" onClick={() => removeBlock(selectedBlock.id)} className="px-3 py-1 bg-red-900/30 border border-red-900/50 rounded hover:bg-red-800 text-red-400 text-xs font-bold flex items-center"><Trash2 className="w-3 h-3 mr-1" /> 删除段落</button>
                </div>
             )}
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {selectedBlock ? (
              <div className="grid grid-cols-12 h-full">
                 
                 {/* LEFT: Smart Library (Accordion) */}
                 <div className="col-span-3 border-r border-[#333] bg-[#1a1a1a] flex flex-col">
                    <div className="flex border-b border-[#333] shrink-0">
                       <button type="button" onClick={() => setActiveTab('styles')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${activeTab === 'styles' ? 'text-suno-neonGreen bg-[#252525]' : 'text-gray-500 hover:bg-[#222]'}`}>智能风格库</button>
                       <button type="button" onClick={() => setActiveTab('phrases')} className={`flex-1 py-2 text-[10px] font-bold uppercase ${activeTab === 'phrases' ? 'text-pink-400 bg-[#252525]' : 'text-gray-500 hover:bg-[#222]'}`}>大师短语</button>
                    </div>
                    <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                       {activeTab === 'styles' ? (
                          <div className="pb-4">
                             {SMART_LIBRARY.map((group) => {
                                const isGroupExpanded = expandedCategory === group.category;
                                return (
                                  <div key={group.category} className="border-b border-[#2a2a2a]">
                                     <button 
                                        type="button"
                                        onClick={() => setExpandedCategory(isGroupExpanded ? null : group.category)}
                                        className="w-full text-left px-3 py-2 text-[10px] font-bold text-gray-400 uppercase bg-[#1e1e1e] hover:bg-[#252525] flex justify-between items-center"
                                     >
                                        {group.category}
                                        {isGroupExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                     </button>
                                     
                                     {isGroupExpanded && (
                                        <div className="bg-[#121212]">
                                           {group.subGroups.map(sub => {
                                              const isSubExpanded = expandedSubGroup === sub.name;
                                              return (
                                                 <div key={sub.name} className="border-t border-[#222]">
                                                    <button 
                                                        type="button"
                                                        onClick={() => setExpandedSubGroup(isSubExpanded ? null : sub.name)}
                                                        className="w-full text-left px-4 py-2 text-[10px] font-medium text-gray-500 hover:text-white flex justify-between items-center bg-[#181818]"
                                                    >
                                                        {sub.name}
                                                        {isSubExpanded ? <ChevronUp className="w-2 h-2 opacity-50" /> : <ChevronDown className="w-2 h-2 opacity-50" />}
                                                    </button>
                                                    
                                                    {isSubExpanded && (
                                                       <div className="p-2 grid grid-cols-2 gap-1 bg-[#0a0a0a]">
                                                          {sub.tags.map(tag => (
                                                             <button 
                                                                key={tag.value} 
                                                                type="button"
                                                                onClick={() => appendStyleTag(tag.value)}
                                                                className="px-2 py-1.5 text-left bg-[#1e1e1e] border border-[#333] rounded hover:border-suno-neonGreen hover:text-suno-neonGreen text-[9px] text-gray-400 transition-colors truncate"
                                                                title={tag.value}
                                                             >
                                                                {tag.label}
                                                             </button>
                                                          ))}
                                                       </div>
                                                    )}
                                                 </div>
                                              )
                                           })}
                                        </div>
                                     )}
                                  </div>
                                )
                             })}
                          </div>
                       ) : (
                          <div className="space-y-1 p-2">
                             {LOCALIZED_PHRASES.map((p, i) => (
                                <button key={i} type="button" onClick={() => appendDescription(p.text)} className="w-full text-left p-2 bg-[#222] border border-[#333] rounded hover:border-pink-500 hover:bg-[#2a2a2a] transition-all group">
                                   <span className="block text-[10px] text-pink-300 font-bold mb-1">{p.label}</span>
                                   <span className="block text-[9px] text-gray-500 italic opacity-60 group-hover:opacity-100">{p.text}</span>
                                </button>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>

                 {/* CENTER: Generator & Editors */}
                 <div className="col-span-5 border-r border-[#333] p-4 flex flex-col space-y-4 bg-[#1e1e1e]">
                     
                     {/* Solo Generator */}
                     <div className="bg-gradient-to-r from-suno-neonBlue/10 to-purple-900/20 p-3 rounded-lg border border-suno-neonBlue/30 shrink-0">
                        <label className="text-[10px] font-bold text-suno-neonBlue uppercase mb-2 flex items-center">
                           <Guitar className="w-3 h-3 mr-1" /> 独奏/加花生成器 (Solo/Lead Generator)
                        </label>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                           <select value={soloInst} onChange={(e) => setSoloInst(e.target.value)} className="bg-[#111] border border-[#333] text-[10px] text-gray-300 rounded px-1 py-1 focus:border-suno-neonBlue outline-none">{SOLO_INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}</select>
                           <select value={soloAdj} onChange={(e) => setSoloAdj(e.target.value)} className="bg-[#111] border border-[#333] text-[10px] text-gray-300 rounded px-1 py-1 focus:border-suno-neonBlue outline-none">{SOLO_ADJECTIVES.map(i => <option key={i} value={i}>{i}</option>)}</select>
                           <select value={soloTech} onChange={(e) => setSoloTech(e.target.value)} className="bg-[#111] border border-[#333] text-[10px] text-gray-300 rounded px-1 py-1 focus:border-suno-neonBlue outline-none">{SOLO_TECHNIQUES.map(i => <option key={i} value={i}>{i}</option>)}</select>
                        </div>
                        <Button type="button" onClick={generateSolo} variant="neon" className="w-full h-7 text-[10px] py-0">✨ 生成指令并添加 (Generate & Add)</Button>
                     </div>

                     <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
                        <div className="flex flex-col h-full">
                            <label className="text-[10px] font-bold text-suno-neonGreen uppercase mb-1 flex items-center"><Tag className="w-3 h-3 mr-1" /> 风格指令 (Style Tags)</label>
                            <textarea 
                               className="flex-1 w-full bg-[#111] border border-[#333] rounded px-2 py-2 text-xs text-suno-neonGreen font-mono focus:border-suno-neonGreen focus:ring-1 focus:ring-suno-neonGreen resize-none"
                               value={selectedBlock.style}
                               onChange={(e) => updateBlock(selectedBlock.id, 'style', e.target.value)}
                               placeholder="此处显示生成的硬性标签..."
                            />
                        </div>
                        <div className="flex flex-col h-full">
                            <label className="text-[10px] font-bold text-pink-400 uppercase mb-1 flex items-center"><FileText className="w-3 h-3 mr-1" /> 叙事描述 (Description)</label>
                            <textarea 
                               className="flex-1 w-full bg-[#111] border border-[#333] rounded px-2 py-2 text-xs text-pink-300 font-sans focus:border-pink-500 focus:ring-1 focus:ring-pink-500 resize-none leading-relaxed"
                               value={selectedBlock.description || ''}
                               onChange={(e) => updateBlock(selectedBlock.id, 'description', e.target.value)}
                               placeholder="此处添加自然语言描述..."
                            />
                        </div>
                     </div>
                 </div>

                 {/* RIGHT: Lyrics */}
                 <div className="col-span-4 p-4 flex flex-col bg-[#1a1a1a]">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center"><Mic2 className="w-3 h-3 mr-1" /> 歌词内容 (Lyrics)</label>
                    <textarea 
                       className="flex-1 w-full bg-[#111] border border-[#333] rounded-lg p-3 text-sm text-gray-300 font-mono focus:border-suno-neonBlue focus:ring-1 focus:ring-suno-neonBlue resize-none leading-relaxed"
                       value={selectedBlock.lyrics}
                       onChange={(e) => updateBlock(selectedBlock.id, 'lyrics', e.target.value)}
                       placeholder="在此输入该段落的歌词..."
                    />
                 </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 opacity-30">
                 <Maximize2 className="w-12 h-12 mb-2" />
                 <p className="text-xs font-bold uppercase">请选择一个段落进行编辑</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );

  if (isFullScreen) return createPortal(editorContent, document.body);
  return editorContent;
};
