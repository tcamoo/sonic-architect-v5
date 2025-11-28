
import React, { useState } from 'react';
import { Copy, Check, Music2, FileText, Info, FileAudio } from 'lucide-react';
import { GeneratedSong } from '../types';
import { Button } from './Button';

interface ResultCardProps {
  song: GeneratedSong;
}

export const ResultCard: React.FC<ResultCardProps> = ({ song }) => {
  const [copiedStyle, setCopiedStyle] = useState(false);
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);

  const handleCopy = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full animate-fade-in space-y-6">
      <div className="bg-suno-card border border-white/10 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-pink-500">
            {song.title}
          </h2>
          <div className="flex items-center text-xs text-gray-400">
            <Info className="w-4 h-4 mr-1" />
            <span>{song.explanation}</span>
          </div>
        </div>

        {/* Style Prompt Section (Short) */}
        <div className="mb-6 group">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-300 flex items-center">
              <Music2 className="w-4 h-4 mr-2 text-purple-400" />
              风格提示词 (Style Prompt)
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(song.stylePrompt, setCopiedStyle)}
              className="text-xs h-8 px-2"
            >
              {copiedStyle ? (
                <span className="flex items-center text-green-400"><Check className="w-3 h-3 mr-1" /> 已复制</span>
              ) : (
                <span className="flex items-center"><Copy className="w-3 h-3 mr-1" /> 复制</span>
              )}
            </Button>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-white/5 font-mono text-sm text-yellow-300 break-words relative overflow-hidden">
             {song.stylePrompt}
          </div>
          <p className="text-[10px] text-gray-500 mt-1">* 填入 Suno 的 "Style of Music" 字段。</p>
        </div>

        {/* Lyrics Section */}
        <div className="group mb-6">
           <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-300 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-400" />
              歌词与编曲 (Lyrics & Cues)
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(song.lyrics, setCopiedLyrics)}
              className="text-xs h-8 px-2"
            >
              {copiedLyrics ? (
                <span className="flex items-center text-green-400"><Check className="w-3 h-3 mr-1" /> 已复制</span>
              ) : (
                <span className="flex items-center"><Copy className="w-3 h-3 mr-1" /> 复制</span>
              )}
            </Button>
          </div>
          <div className="bg-black/30 p-4 rounded-lg border border-white/5 font-mono text-sm text-gray-300 h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed selection:bg-purple-500/30">
            {song.lyrics || <span className="text-gray-600 italic">无歌词 (纯音乐模式)</span>}
          </div>
        </div>

        {/* Style Description (Long) - For Arrangement Mode mostly */}
        {song.styleDescription && (
             <div className="group pt-4 border-t border-white/10">
             <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-300 flex items-center">
                <FileAudio className="w-4 h-4 mr-2 text-pink-400" />
                详细编曲说明 (Detailed Description)
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(song.styleDescription!, setCopiedDesc)}
                className="text-xs h-8 px-2"
              >
                {copiedDesc ? (
                  <span className="flex items-center text-green-400"><Check className="w-3 h-3 mr-1" /> 已复制</span>
                ) : (
                  <span className="flex items-center"><Copy className="w-3 h-3 mr-1" /> 复制</span>
                )}
              </Button>
            </div>
            <div className="bg-black/30 p-4 rounded-lg border border-white/5 font-sans text-sm text-gray-400 leading-relaxed italic">
              {song.styleDescription}
            </div>
          </div>
        )}

      </div>
      
      <div className="text-center text-gray-500 text-sm">
        将 <span className="text-yellow-500">Style Prompt</span> 填入风格栏，<span className="text-blue-400">歌词</span> 填入歌词栏即可。
      </div>
    </div>
  );
};
