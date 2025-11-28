
# 🎵 SONIC ARCHITECT V5 - SUNO 编曲大师

![Sonic Architect V5 Workstation](https://ft.puu.me/api/cfile/AgACAgEAAyEGAAStzBFnAAMTaSmvmSWI_zC36numc8-QFttHPVIAAhoLaxu-GlBF-eFKVE7uJr0BAAMCAAN3AAM2BA
)

**Sonic Architect (声波架构师)** 是专为 [Suno.com](https://suno.com) 最新的 **V5 模型** 打造的高级 AI 音乐编曲工作台。

不同于传统的“抽卡式”生成，Sonic Architect 引入了 **DAW（数字音频工作站）** 的可视化操作逻辑，让您像搭积木一样设计歌曲的结构、乐器、时长和情感，精准控制 AI 的生成结果。
**演示地址[演示地址]（suno.oogg.me）需要自行配置API

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
*   **☁️ 云端/本地双适配**:
    *   支持 Cloudflare Pages/Workers 一键部署。
    *   API Key 本地存储，无需担心隐私泄露。

---

## 🛠️ 快速开始

### 1. 获取 API Key
本项目依赖 Google Gemini (Flash 2.0/1.5) 进行自然语言处理。请前往 [Google AI Studio](https://aistudio.google.com/) 免费获取 API Key。

### 2. 启动项目
```bash
# 安装依赖
npm install

# 本地运行
npm run dev
```

### 3. 配置 API
打开网页后，点击右上角的 **"系统设置"** 图标，粘贴您的 Gemini API Key 并保存。

---

## 📖 使用指南

### 第一步：进入编曲模式
在左侧面板选择 **"歌词编曲 (Lyrics)"** 并开启 **"可视化工作台"** 开关。

### 第二步：搭建骨架 (Track 1)
在时间轴上点击 `+` 号添加段落。
*   **类型**: 点击积木标题（如 Verse）可切换为 Chorus, Bridge, Solo 等。
*   **时长**: 鼠标悬停在积木右侧边缘，拖动调整该段落的时长（例如将前奏拖到 20秒）。

### 第三步：配置乐器 (Track 3)
这是 V5 的核心玩法。双击 **乐器轨 (青色)** 的积木，底部面板会自动聚焦。
*   **点击预设**: 在右侧面板点击 "国风" -> "古筝"、"琵琶"，或 "流行" -> "钢琴"、"808 Bass"。
*   **自由组合**: 比如 *Grand Piano, Orchestral Strings, Heavy Drums*。

### 第四步：注入灵魂 (Track 4)
双击 **叙事轨 (粉色)** 的积木。在这里输入自然语言描述。
*   *示例*: "一位沧桑的男歌手正在低声诉说，背景有雨声和黑胶唱片的底噪。"
*   或者直接点击左侧的 **"大师短语"** 快速插入。

### 第五步：生成与使用
配置完成后，点击左侧底部的 **"生成 V5 编曲"** 按钮。
1.  系统会生成 **Style Prompt**（风格提示词）和 **Lyrics**（带标签的歌词）。
2.  打开 Suno.com，选择 **Custom Mode**。
3.  将 **Style Prompt** 粘贴到 Style of Music。
4.  将 **Lyrics** 粘贴到 Lyrics。
5.  点击 Suno 的 Create！

---

## 🔥 热门歌曲风格参数库 (Copy & Paste)

想做出类似大热单曲的风格？尝试在工作台的 **叙事描述 (Narrative)** 或 **风格指令 (Style)** 中填入以下参数：

### 1. 史诗国风·神话感 (类似《大鱼》《左手指月》)
*   **风格标签**: `Epic Chinese, Cinematic, Ethereal, Orchestral`
*   **乐器配置**: `Guzheng (古筝), Dizi (笛子), Strings (弦乐群), Big Drum (大鼓), Piano`
*   **叙事描述**:
    > "Ethereal female vocals with a wide range, singing a hauntingly beautiful melody. The atmosphere is like a fantasy myth, vast and ocean-like. Emotional build-up with orchestral strings."
    > (空灵的女声，音域宽广，唱着凄美动人的旋律。氛围如同奇幻神话，广阔如海。管弦乐将情感推向高潮。)

### 2. 复古合成器·午夜狂飙 (类似 The Weeknd - Blinding Lights)
*   **风格标签**: `80s Synthwave, Retro Pop, Upbeat, Neon`
*   **乐器配置**: `Analog Synthesizers, Drum Machine (LinnDrum), Pulsating Bass, Pad`
*   **叙事描述**:
    > "A high-energy 80s retro track. Driving drum machine beat with a catchy synthesizer hook. The mood is like driving through a neon city at midnight. Reverb-heavy male vocals."
    > (高能量的80年代复古单曲。强劲的鼓机节拍搭配抓耳的合成器钩子。氛围如同午夜在霓虹城市飙车。人声带有重混响。)

### 3. 现代流行·撕心裂肺 (类似 邓紫棋/Adele 风格)
*   **风格标签**: `Power Pop, Soul, Emotional Ballad`
*   **乐器配置**: `Grand Piano (三角钢琴), Bass, Drum Kit, Subtle Strings`
*   **叙事描述**:
    > "A powerful, emotional ballad featuring a female powerhouse vocalist. Starts intimate with just piano, then builds to an explosive chorus with full band. Belting high notes and soulful runs."
    > (一首充满力量与情感的抒情歌，由铁肺女声以此演唱。钢琴独奏开场，副歌部分全乐队进入，情感爆发。包含高音Belting和灵魂乐转音。)

### 4. 赛博朋克·暗黑工业 (游戏/影视配乐风)
*   **风格标签**: `Cyberpunk, Industrial, Glitch, Dark`
*   **乐器配置**: `Distorted Bass (失真贝斯), Glitchy Drums, Sirens, Metallic SFX`
*   **叙事描述**:
    > "Dark, dystopian atmosphere. Heavy distorted bass lines that vibrate the floor. Glitchy, mechanical drum patterns. Aggressive and futuristic. No vocals or processed robotic vocals."
    > (黑暗、反乌托邦氛围。沉重的失真贝斯震动地板。故障感的机械鼓点。激进且充满未来感。)

---

## 🚢 部署 (Cloudflare Pages)

本项目已针对 Cloudflare 进行了完美适配。

1.  Fork 本仓库到您的 GitHub。
2.  登录 Cloudflare Dashboard，进入 **Workers & Pages**。
3.  点击 **Create Application** -> **Connect to Git**。
4.  选择本项目。
5.  **Build Settings**:
    *   Framework Preset: `Vite` (或者 None)
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
6.  点击 **Save and Deploy**。

---

## 📜 License

MIT License. Designed for the AI Music Community.
