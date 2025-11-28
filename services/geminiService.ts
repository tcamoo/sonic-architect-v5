
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

**Suno V5 Prompting Rules:**
1. **Anchoring**: Place the most important style keyword at the VERY START and VERY END of the prompt.
   - Example: "Cinematic Soul, slow build... Cinematic Soul".
2. **JSON-Style (Experimental)**: V5 understands structured data.
   - Example: {"genre": "Trap", "vocal": "Deep", "bpm": 140}.
3. **Dynamic Tags**: Use time duration in brackets.
   - Example: [Solo: 12s Saxophone], [Intro: 15s Slow build].
`;

const SYSTEM_INSTRUCTION = `
你是一位 Suno.com 提示词专家，精通最新的 V5 模型特性。
请根据用户的请求（V4 或 V5 模式）生成最佳的提示词。

${ARTIST_KNOWLEDGE}

**生成规则**：

1. **Style Prompt (风格栏)**:
   - **如果是 V5 模式**:
     - 必须使用 **首尾锚定 (Anchoring)** 策略。
     - 尝试使用 **JSON-Like** 的描述方式（虽然 Suno 输入框是文本，但我们用紧凑的文本模拟 JSON 结构，或者使用极度精确的关键词链）。
     - 格式示例: "Art Pop, Ethereal, [Genre: Dream Pop], [Vocals: Whispery], [Mood: Melancholic] ... Art Pop"
   - **如果是 V4 模式**:
     - 使用传统的逗号分隔标签。
     - 格式示例: "Mandopop, Female Vocals, Sad, Piano, Slow"

2. **Lyrics (歌词栏 - 包含结构)**:
   - 如果用户提供了 "Structure Blocks" (积木结构)：
     - 你必须严格按照积木的顺序生成歌词。
     - 将积木的 "Type", "Duration" (时长), "Style" (技术标签), "Instruments" (乐器) 和 "Description" (自然语言描述) 融合。
     - 示例标签: [Verse 1 (30s): Soft vocals, Piano accomp]
     - 务必在方括号内标记估算的时长。
     - 如果用户设置了 BPM，请在歌词最上方添加 [BPM: 120] 标签。
   - **通用规则**:
     - 乐器提示必须用 **方括号 []** 包裹（严禁圆括号）。
     - 包含 [Verse], [Chorus], [Bridge], [Outro] 等标准结构。

**响应格式 (JSON)**:
{
  "title": "中文歌名",
  "stylePrompt": "生成的英文提示词字符串",
  "lyrics": "包含标签的歌词",
  "explanation": "简短中文说明 (如：'采用了王菲式的空灵唱腔，并使用了V5的首尾锚定技巧')",
  "styleDescription": "详细的编曲描述 (英文)"
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
  // Priority: Local Storage (User Settings) -> Environment Variable (Deployment)
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
    // Make a minimal request to check validity
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
    throw new Error("API Key 未配置。请点击右上角 'API 设置' 进行配置。");
  }

  const ai = new GoogleGenAI({ apiKey });

  let context = "";
  if (request.mode === 'inspiration') {
    context = `Mode: Inspiration. Theme: ${request.topic}, Mood: ${request.mood}, Genre: ${request.genre}`;
  } else if (request.useStructureBuilder && request.structureBlocks) {
    // Compile structure blocks into a readable format for the LLM
    const structureDesc = request.structureBlocks.map(b => 
      `Section: [${b.type}]
       Target Duration: ${b.duration} seconds
       Technical Tags: ${b.style}
       Instruments: ${b.instruments || "None"}
       Narrative Description: ${b.description || "None"}
       Lyrics Content: ${b.lyrics || "(Generate lyrics based on theme or keep instrumental)"}`
    ).join("\n---\n");
    
    context = `Mode: Structure Builder.
    Total Estimated Duration: ${request.targetDuration} minutes.
    BPM: ${request.bpm || "Auto"}.
    
    Defined Structure:
    ${structureDesc}`;
  } else {
    context = `Mode: Standard Arrangement. Original Lyrics: ${request.originalLyrics}`;
  }

  const prompt = `
    Suno Model Version: ${request.modelVersion.toUpperCase()}
    Custom Instructions: ${request.customInstructions || "None"}
    Instrumental: ${request.instrumental || false}
    
    Content Context:
    ${context}

    Task: Create the perfect Suno prompt. 
    If Structure Builder is used, STRICTLY follow the section order and styles provided. 
    If V5, use anchoring and dynamic timing tags (e.g. [Intro: 15s]).
    If the user mentions a specific artist (e.g. Faye Wong, G.E.M.), refer to the Artist Knowledge Base.
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
