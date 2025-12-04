
# 🎵 SONIC ARCHITECT V5 - SUNO 编曲大师

![Sonic Architect V5 Workstation]![image.png](https://ft.puu.me/api/cfile/AgACAgEAAyEGAAStzBFnAAMUaTDyuBhEoa4dImAAAcuvey9JPR8QAAIcC2sbX5SIRfe6PjB_TbpqAQADAgADdwADNgQ)

**Sonic Architect (声波架构师)** 是专为 [Suno.com](https://suno.com) 最新的 **V5 模型** 打造的高级 AI 音乐编曲工作台。

不同于传统的“抽卡式”生成，Sonic Architect 引入了 **DAW（数字音频工作站）** 的可视化操作逻辑，让您像搭积木一样设计歌曲的结构、乐器、时长和情感，精准控制 AI 的生成结果。
                                                                              演示地址[演示地址](https://suno.puu.me)需要自行配置API

---

## ✨ 核心特性

*   **🎹 可视化编曲工作台 (Visual Workstation)**:
    *   **四轨道设计**: 结构轨、风格轨、乐器轨、叙事轨，分层管理音乐元素。
    *   **拖拽控制时长**: 鼠标拖动积木边缘，精确控制每一段落（Intro, Verse, Chorus）的秒数。
    *   **实时缩放**: 支持从宏观结构到微观细节的无级缩放。
*   **🚀 Suno V5 深度优化**:
    *   **首尾锚定 (Anchoring)**: 自动生成符合 V5 逻辑的 Prompt，锁定曲风。
    *   **动态时间标签**: 自动插入如 `[Intro: 15s]` 的时间戳指令。
    *   **JSON 结构化**: 采用 V5 更易理解的结构化提示词。
*   **🎸 强大的乐器与风格库**:
    *   **独奏生成器**: 一键生成“失真的电吉他速弹”、“哀婉的二胡独奏”等专业指令。
    *   **智能风格库**: 内置史诗国风、Synthwave、Lofi、K-Pop 等数十种细分风格。
    *   **大师预设**: 内置王菲、汪峰、邓紫棋等巨星的声线与编曲风格模板。

---

## 🛠️ 快速开始

### 1. 获取 API Key
本项目依赖 Google Gemini (Flash 2.0/1.5) 进行自然语言处理。请前往 [Google AI Studio](https://aistudio.google.com/) 免费获取 API Key。

### 2. 部署指南 (Cloudflare Pages)

本项目已针对 Cloudflare 进行了完美适配。

1.  Fork 本仓库到您的 GitHub。
2.  登录 Cloudflare Dashboard，进入 **Workers & Pages**。
3.  点击 **Create Application** -> **Connect to Git**。
4.  选择本项目，点击 **Save and Deploy** (保持默认设置即可，预设框架选 Vite 或 None)。
5.  **配置 API Key (重要)**:
    *   在 Cloudflare Pages 项目页面，点击 **Settings** -> **Environment variables**。
    *   点击 **Add variable**。
    *   **Variable name**: `API_KEY`
    *   **Value**: 您的 Google Gemini API Key。
    *   点击 **Save**。
    *   **重新部署**: 点击 **Deployments** -> **Create deployment** 以使变量生效。

### 3. 本地运行
```bash
# 安装依赖
npm install

# 设置环境变量
# (Linux/Mac)
export API_KEY=your_gemini_key
# (Windows PowerShell)
$env:API_KEY="your_gemini_key"

# 运行
npm run dev
```

---

## 📖 使用指南

### 模式 A: 灵感创作 (Inspiration)
适合只有一个模糊想法的用户。
1.  切换到 **"灵感 (Idea)"** 标签。
2.  点击 **"大师风格罗盘"** (如王菲、赛博朋克) 快速选择风格。
3.  输入主题 (如 "雨夜失恋")。
4.  点击生成。**AI 会自动脑补完整的 Intro, Verse, Chorus 结构和歌词。**

### 模式 B: 编曲工作台 (Arrangement)
适合需要精准控制的专业用户。
1.  切换到 **"歌词编曲 (Lyrics)"** 并开启 **"可视化工作台"**。
2.  **Track 1 (结构)**: 拖拽积木边缘调整时长。
3.  **Track 3 (乐器)**: 双击青色积木，在右侧面板点击 "国风" -> "古筝" 添加乐器。
4.  **Track 4 (叙事)**: 双击粉色积木，输入画面描述 (如 "Sultry female vocals")。
5.  点击生成，将结果复制到 Suno。

---

## 🔥 热门歌曲风格参数库 (Copy & Paste)

### 1. 史诗国风·神话感 (类似《大鱼》《左手指月》)
*   **风格标签**: `Epic Chinese, Cinematic, Ethereal, Orchestral`
*   **乐器配置**: `Guzheng (古筝), Dizi (笛子), Strings (弦乐群), Big Drum (大鼓), Piano`
*   **叙事描述**:
    > "Ethereal female vocals with a wide range, singing a hauntingly beautiful melody. The atmosphere is like a fantasy myth, vast and ocean-like. Emotional build-up with orchestral strings."

### 2. 复古合成器·午夜狂飙 (类似 The Weeknd)
*   **风格标签**: `80s Synthwave, Retro Pop, Upbeat, Neon`
*   **乐器配置**: `Analog Synthesizers, Drum Machine (LinnDrum), Pulsating Bass, Pad`
*   **叙事描述**:
    > "A high-energy 80s retro track. Driving drum machine beat with a catchy synthesizer hook. The mood is like driving through a neon city at midnight. Reverb-heavy male vocals."

---

## 📜 License

MIT License. Designed for the AI Music Community.
