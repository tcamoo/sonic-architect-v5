
import { GoogleGenAI, Type } from "@google/genai";
import { SongRequest, GeneratedSong } from "../types";

// --- Knowledge Base for V5 & Artists ---
const ARTIST_KNOWLEDGE = `
**Suno V5 Artist Styles (Master Presets):**
1. **Faye Wong (王菲)**:
   - Keywords: "Dream Pop, Ethereal, Cantopop, Alternative Rock, Avant-garde".
   - Vocals: "Whispery, airy, head voice, yodeling (falssetto breaks), lazy phrasing, ethereal female vocals".
   - Instruments: "Reverb-heavy guitars, atmospheric pads, acoustic guitar, subtle electronic beats".
   - Structure: often loose, atmospheric.

2. **Wang Feng (汪峰)**:
   - Keywords: "Mando-Rock, Stadium Rock, Folk Rock, Philosophical".
   - Vocals: "Raspy male vocals, emotional shouting, gritty, storytelling, powerful belting".
   - Instruments: "Piano intro (essential), distorted electric guitar solo, driving drum beat, acoustic guitar strumming".
   - Mood: "Existential, longing, inspiring, rebellious".

3. **G.E.M. (邓紫棋)**:
   - Keywords: "C-Pop, Mandopop, Soul, R&B, Power Ballad".
   - Vocals: "Powerhouse female vocals, extensive range, belting high notes, R&B runs, emotional, agile".
   - Instruments: "Grand piano, modern pop production, heavy bass, electronic elements mixed with orchestral strings".

4. **Huang Ling (黄龄/痒)**:
   - Keywords: "Electro-Chinoiserie, Nu-Disco, Sultry Pop".
   - Vocals: "Sultry, coquettish, breathy, melismatic runs, slide notes, distinct Chinese opera influence".

**Suno V5 Prompting Rules (CRITICAL):**
1. **Global Consistency**: Ensure the "Style Prompt" defines the overall genre, and individual sections (Verse/Chorus) follow that genre but add variations.
2. **Anchoring**: Place the most important style keyword at the VERY START and VERY END of the style prompt string.
3. **Section Headers**: V5 reads section headers for context. Combine Type + Tempo/Vibe + Instruments.
   - GOOD: [Verse 1: Soft Piano, Slow build]
   - BAD: [Verse 1] (Too generic)
4. **Timing**: Use the estimated duration to control pacing.
   - Example: [Intro: 15s Atmospheric]
`;

const SYSTEM_INSTRUCTION = `
你是一位世界顶级的音乐制作人和 Suno V5 提示词工程师 (Sonic Architect)。
你的任务是将用户的编曲意图转化为 Suno V5 最能完美执行的 Prompt。

**核心生成逻辑**：

1. **分析整体氛围 (Global Vibe Analysis)**:
   - 扫描用户提供的所有 Structure Blocks。
   - 提取共性的风格 (Style) 和乐器 (Instruments)。
   - 确定一首歌曲的 "主基调" (例如：是悲伤的钢琴民谣，还是激进的摇滚)。
   - 在生成的 Style Prompt 中，必须体现这个主基调，并使用 **首尾锚定**。

2. **构建风格提示词 (Style Prompt Construction)**:
   - 格式：[Primary Genre], [Mood], [Global Instruments], [Vocal Style] ... [Primary Genre]
   - 如果用户选择了 "大师预设" 或特定艺人风格，务必加入相关的专业关键词（如 "Dream Pop" for Faye Wong）。
   - **V5 特性**: 尝试使用伪 JSON 格式增强理解，例如: "Genre: Pop, Vibe: Sad, Inst: Piano".

3. **构建歌词与结构 (Lyrics & Structure Construction)**:
   - **严格遵守** 用户在工作台定义的结构顺序。
   - **智能融合标签**: 将 [Type], [Duration], [Instruments] 融合为一个强大的段落头。
     - 格式: **[SectionType: Mood/Vibe, Main Instrument]**
     - 示例: **[Verse 1: Melancholic, Acoustic Guitar Arpeggio]**
   - **歌词内容**:
     - 如果用户提供了歌词，请按段落分配。
     - 如果是纯音乐 (Instrumental)，请在段落内填写具体的演奏细节描述（如 "The guitar plays a sorrowful melody..."）。
     - 必须在开头添加 **[BPM: {bpm}]** 标签。

**响应格式 (JSON)**:
{
  "title": "歌名 (中文/英文)",
  "stylePrompt": "填入 Suno Style 栏的字符串",
  "lyrics": "填入 Suno Lyrics 栏的完整内容 (包含所有 [标签])",
  "explanation": "简短的中文解释 (你的编曲思路)",
  "styleDescription": "一段详细的英文描述，用于解释歌曲的整体画面感 (Optional)"
}
`;

// Helper to safely check for API key without throwing context errors
export const hasApiKey = (): boolean => {
  const localKey = localStorage.getItem('gemini_api_key');
  if (localKey && localKey.trim().length > 0) return true;
  
  // Safe check for process.env
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return true;
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  return false;
};

const getApiKey = (): string => {
  const localKey = localStorage.getItem('gemini_api_key');
  if (localKey && localKey.trim().length > 0) {
    return localKey;
  }
  
  try {
     if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
       return process.env.API_KEY;
     }
  } catch (e) {
      console.warn("Could not access process.env");
  }
  return "";
};

export const validateApiKey = async (key: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey: key });
    await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hi",
    });
    return true;
  } catch (e) {
    console.error("API Key Validation Failed:", e);
    return false;
  }
};

export const generateSunoPrompt = async (request: SongRequest): Promise<GeneratedSong> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key 未配置。请点击右上角 '系统设置' 进行配置。");
  }

  const ai = new GoogleGenAI({ apiKey });

  let context = "";
  
  if (request.mode === 'inspiration') {
    context = `
    TASK: Inspiration Mode.
    Topic: ${request.topic}
    Mood: ${request.mood}
    Genre: ${request.genre}
    Instrumental: ${request.instrumental}
    `;
  } else if (request.useStructureBuilder && request.structureBlocks) {
    // Advanced Logic for Structure Builder
    const blocksData = request.structureBlocks.map((b, index) => {
      return `
      Block ${index + 1}:
      - Type: ${b.type}
      - Duration: ${b.duration} seconds
      - Style Tags: ${b.style || "None"}
      - Specific Instruments: ${b.instruments || "None"}
      - Narrative/Vibe: ${b.description || "None"}
      - Lyrics Fragment: "${b.lyrics.substring(0, 50)}..."
      `;
    }).join("\n");

    context = `
    TASK: Arrangement Mode (Visual Workstation).
    
    GLOBAL SETTINGS:
    - BPM: ${request.bpm}
    - Total Duration: ${request.targetDuration} minutes
    - Custom User Instructions: ${request.customInstructions}
    
    STRUCTURE BLUEPRINT (Strictly follow this order):
    ${blocksData}
    
    INSTRUCTION:
    Analyze the "Specific Instruments" and "Narrative/Vibe" from all blocks to determine a cohesive main genre.
    Then, generate a "Style Prompt" that anchors this main genre.
    Finally, write the "Lyrics" field with advanced V5 tags like [Verse 1: Sad Piano, 30s].
    `;
  } else {
    // Text-only mode fallback
    context = `
    TASK: Standard Text Arrangement.
    Original Lyrics: ${request.originalLyrics}
    Custom Instructions: ${request.customInstructions}
    `;
  }

  const prompt = `
    Target Model: Suno V5
    
    INPUT CONTEXT:
    ${context}

    Perform the task acting as the Sonic Architect AI. 
    Ensure the output is musically coherent and leverages V5's ability to understand instrument placement and timing.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          stylePrompt: { type: Type.STRING },
          lyrics: { type: Type.STRING },
          explanation: { type: Type.STRING },
          styleDescription: { type: Type.STRING },
        },
        required: ["title", "stylePrompt", "lyrics", "explanation"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as GeneratedSong;
};
