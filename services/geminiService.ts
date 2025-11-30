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

**任务模式 (TASK MODES):**

**模式 A: 灵感创作 (Inspiration Mode)**
- 用户只提供主题或心情。
- **你的任务**: 扮演全能制作人，自动脑补出一首完整的歌曲。
- **必须生成**: 
  1. 完整的 **Style Prompt** (风格流派).
  2. 完整的 **歌词与结构 (Lyrics)**。你必须自己创作歌词，并自动规划 [Intro], [Verse], [Chorus], [Bridge], [Outro] 结构。
  3. 在每个段落标签中，必须加入自动脑补的乐器和情感指令。例如: **[Verse 1: Melancholic Piano, 30s]**。

**模式 B: 编曲工作台 (Arrangement Mode)**
- 用户提供了详细的结构积木 (Blocks)。
- **你的任务**: 严格执行用户的结构规划。
- 提取用户定义的乐器、风格、时长，生成精准的 V5 标签。

**通用规则**:
1. **首尾锚定**: 在 Style Prompt 的开头和结尾重复核心风格词。
2. **JSON 增强**: 尝试使用伪 JSON 格式增强 Style Prompt 的可读性 (如 "Genre: Pop, Vibe: Sad")。
3. **中文语境**: 除非用户要求英文歌，否则默认生成中文歌词，但标签保留英文 (Suno 对英文标签理解更好)。

**响应格式 (JSON)**:
{
  "title": "歌名 (中文/英文)",
  "stylePrompt": "填入 Suno Style 栏的字符串",
  "lyrics": "填入 Suno Lyrics 栏的完整内容 (包含所有 [标签])",
  "explanation": "简短的中文解释 (你的编曲思路)",
  "styleDescription": "一段详细的英文描述，用于解释歌曲的整体画面感 (Optional)"
}
`;

/**
 * Validates the API key connection by making a minimal request.
 * Used for system diagnostics.
 */
export const validateApiKey = async (): Promise<boolean> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return false;

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey });
    // Minimal request to check validity
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "ping",
    });
    return true;
  } catch (error) {
    console.error("API Validation Failed:", error);
    return false;
  }
};

export const generateSunoPrompt = async (request: SongRequest): Promise<GeneratedSong> => {
  // STRICT SECURITY: Use process.env.API_KEY exclusively.
  // The API key must be provided via environment variables in the build/deployment environment.
  // The 'vite.config.ts' define property ensures this is replaced by the actual string at build time.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key Missing! Please configure 'API_KEY' or 'VITE_GEMINI_API_KEY' in your Cloudflare/Vercel Environment Variables and REDEPLOY.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });

  let context = "";
  
  if (request.mode === 'inspiration') {
    context = `
    TASK: Inspiration Mode (Auto-Arrangement).
    User Topic/Theme: ${request.topic}
    User Mood: ${request.mood}
    User Genre: ${request.genre}
    Instrumental: ${request.instrumental}
    
    INSTRUCTION:
    The user has only provided a vague idea. You must act as the Music Producer.
    1. Create a catchy Song Title.
    2. Compose original Lyrics based on the topic.
    3. Structure the song fully (Intro -> Verse -> Chorus -> ... -> Outro).
    4. For EACH section, add detailed V5 tags with Instruments and Vibe. 
       Example: [Chorus: Powerful, Soaring Strings, 25s]
    `;
  } else if (request.useStructureBuilder && request.structureBlocks) {
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
    context = `
    TASK: Standard Text Arrangement.
    Original Lyrics: ${request.originalLyrics}
    Custom Instructions: ${request.customInstructions}
    `;
  }

  const prompt = `
    Target Model: Suno V5
    
    KNOWLEDGE BASE:
    ${ARTIST_KNOWLEDGE}

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
