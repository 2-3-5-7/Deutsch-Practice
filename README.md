# 芯语伴 SprechMate

> 和 AI 用 23 种语言聊天 → 一键生成母语原声 → 录音跟读 → Azure 发音打分。纯静态 PWA，数据全在本地。
>
> Chat with AI in 23 languages → one-tap native audio → record & shadow → Azure pronunciation scoring. Pure-static PWA, all data stays local.

在线体验 Demo：https://sprechmate.308611.xyz/ 仓库 Repo：https://github.com/2-3-5-7/SprechMate

---

## 中文

### 功能

- 💬 **多语言 AI 聊天**：OpenAI 兼容接口，SSE 流式输出；23 种学习语言（德 / 英 / 日 / 法 / 西 / 韩 / 意 / 俄 / 葡 / 阿 / 泰 / 越 / 荷 / 波 / 瑞 / 丹 / 芬 / 挪 / 印地 / 马来 / 泰米尔 / 加泰 / 中文），提示词模板按语言自动切换
- 🔊 **一键原声**：点击聊天里的任意一句话，自动生成 Azure 神经网络语音并播放；同一句话 + 同一声音只调一次 API，本地缓存（IndexedDB）
- 🎙️ **录音打分**：总分 / 准确度 / 流利度 / 完整度（英语另有韵律分），单词按颜色标出读错、漏读、多读，点击单词看音素得分（英语为真实 IPA）
- 🌐 **中英双语界面**：界面语言独立于学习语言，一键切换；小屏幕（iPhone SE）专门优化
- 📝 **提示词模板**：可保存多个 system prompt 模板（如"海关官员"场景任务），切换即时生效；译文约定用 `>` 引用块，可单独隐藏、双击切换显隐
- 📊 **用量统计**：Azure TTS 字符 / 语音秒数按自然月统计，聊天 token 统计 + 花费估算，今日打卡图生成（40 张本地实拍背景 + 400 句谚语库）
- 🔗 **多设备同步**：二维码同步今日练习计数，无需后端
- 📱 **PWA**：可安装到手机主屏幕，离线可用

### 快速开始

不要直接双击用 `file://` 打开（麦克风在 file 协议下可能被浏览器限制）。在项目目录执行：

```bash
python3 -m http.server 8000
```

浏览器打开 http://localhost:8000 即可（localhost 算安全上下文，麦克风可用）。

### 首次配置（App 内「设置」）

1. **聊天接口**：Base URL、模型、API Key（OpenAI 兼容渠道）→ 点「测试连接」
2. **Azure Speech**：填 Speech Key + Region（33 个区可选，默认 `westus2`，以你建资源时选的区域为准），选声音 → 点「测试 TTS」应能听到对应语言
3. **学习语言 / 界面语言**：「语言与显示」卡片内切换，提示词模板、声音、打分 locale 自动跟随
4. 所有 Key 和聊天记录只保存在你自己的浏览器里，不会上传

### 部署到 Cloudflare Pages（网页后台上传，无需命令行）

1. 登录 https://dash.cloudflare.com → 左侧 **Workers & Pages** → 右上 **创建应用程序** → 切换到 **Pages** 选项卡 → **上传资产（Upload assets）**
2. 把项目整个目录内容拖进上传框（`index.html`、`manifest.json`、`sw.js`、图标、`quotes.js`、`qrgen.js`、`qr-scanner-worker.min.js`、`img/checkin/` 等，确保都在站点根目录）
3. 点 **Deploy**，得到 `https://xxx.pages.dev`（可再绑定自己的域名）
4. 手机浏览器打开 → 「安装应用」/「添加到主屏幕」，即可以全屏 App 形态使用

备选：`npx wrangler pages deploy .`，或 GitHub 仓库关联自动部署。

### 使用流程（一个页面走完）

1. **聊天**：和 AI 用目标语言对话；点击任意一句话 → 自动提取目标语言文本（跳过译文引用块），生成原声并播放，句子填入跟读框
2. **跟读**：跟读框（标题随学习语言变化，如"德语跟读"）+「生成原声」+ 播放器（可拖进度条、0.5x–1.5x 变速）+ 下载原声
3. **录音打分**：点红色录音键开始 → 说完点停止 → 自动打分；网络失败可"重新打分"不用重录
4. **看历史**：点某条练习记录，完整还原打分明细、原声、你的录音

注意：麦克风需要 HTTPS（Pages 默认提供）+ 浏览器授权。切换会话时跟读区自动回到初始状态。

### 技术特点

- **纯静态**：`index.html` 单文件（内联 CSS/JS）+ PWA 资源，无构建、无依赖、无 CDN、无外部字体，离线可用
- **无 SDK**：聊天、TTS、发音评估全部浏览器原生 `fetch` + REST 直调
- **数据全在本地**：设置放 localStorage，对话、录音、原声缓存放 IndexedDB（GB 级），不经过任何服务器
- **33 个 Azure 区**、46 个内置语音（已用真 Key 逐个核对）

### 文件说明

| 文件 | 说明 |
|---|---|
| `index.html` | 应用本体（HTML/CSS/JS 全内联） |
| `manifest.json` | PWA 安装清单 |
| `sw.js` | Service Worker（离线缓存本站资源，不拦截 API） |
| `icon-192.png` / `icon-512.png` | PWA 图标 |
| `favicon-32.png` | 浏览器标签页图标 |
| `quotes.js` | 400 句谚语库（打卡图用） |
| `qrgen.js` / `qr-scanner-worker.min.js` | 二维码生成 / 扫码（多设备同步用） |
| `img/checkin/` | 40 张打卡背景图（本地 Unsplash 实拍） |

### 隐私

放心用：所有数据（Key、聊天记录、录音）只存在你的手机 / 浏览器里，App 没有服务器，不会保存或上传任何东西。换个浏览器或清理数据后需要重新填写。重要数据请用「导出」功能备份。

---

## English

### Features

- 💬 **Multilingual AI chat**: OpenAI-compatible API with SSE streaming; 23 learning languages (German, English, Japanese, French, Spanish, Korean, Italian, Russian, Portuguese, Arabic, Thai, Vietnamese, Dutch, Polish, Swedish, Danish, Finnish, Norwegian, Hindi, Malay, Tamil, Catalan, Chinese); prompt templates follow the language automatically
- 🔊 **One-tap native audio**: tap any chat message to generate Azure neural TTS and play it; same text + same voice hits the API only once, cached locally (IndexedDB)
- 🎙️ **Pronunciation scoring**: overall / accuracy / fluency / completeness (plus prosody for English); words color-coded for mispronunciation, omission, insertion; tap a word for phoneme scores (real IPA for English)
- 🌐 **Bilingual UI**: UI language independent from learning language, one-tap switch; optimized for small screens (iPhone SE)
- 📝 **Prompt templates**: save multiple system-prompt templates (e.g. a "customs officer" role-play task), switch takes effect immediately; translations use the `>` quote convention — hideable, double-tap to toggle
- 📊 **Usage stats**: Azure TTS characters / speech seconds per calendar month, chat token stats + cost estimate, daily check-in card (40 local photos + 400-quote library)
- 🔗 **Multi-device sync**: sync today's practice counts via QR code, no backend needed
- 📱 **PWA**: installable to the home screen, works offline

### Quick start

Don't open it via `file://` (browsers may block the microphone on the file protocol). In the project directory:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 (localhost counts as a secure context, so the mic works).

### First-time setup (in-app "Settings")

1. **Chat API**: Base URL, model, API key (any OpenAI-compatible provider) → "Test connection"
2. **Azure Speech**: Speech Key + Region (33 regions available, default `westus2` — use the one your resource was created in), pick a voice → "Test TTS" should speak
3. **Learning / UI language**: switch in the "Language & Display" card; prompt templates, voices and scoring locale follow automatically
4. Keys and chats live only in your own browser — never uploaded

### Deploy to Cloudflare Pages (web upload, no CLI needed)

1. Log in to https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** tab → **Upload assets**
2. Drag the whole project directory in (`index.html`, `manifest.json`, `sw.js`, icons, `quotes.js`, `qrgen.js`, `qr-scanner-worker.min.js`, `img/checkin/`, … — all at the site root)
3. **Deploy** → you get `https://xxx.pages.dev` (custom domain optional)
4. Open on your phone → "Install app" / "Add to Home Screen" for the full-screen app experience

Alternative: `npx wrangler pages deploy .`, or connect the GitHub repo for auto-deploy.

### Typical flow (one page, start to finish)

1. **Chat**: talk with the AI in your target language; tap any message → target-language text is extracted (translation quote blocks skipped), native audio generated and played, sentence filled into the shadowing box
2. **Shadow**: shadowing box (title follows the learning language, e.g. "German Shadowing") + "Generate audio" + player (seekable, 0.5x–1.5x) + download
3. **Record & score**: hit the red record button → stop when done → auto-scored; "re-score" on network failure without re-recording
4. **History**: tap a practice record to fully restore its score breakdown, native audio and your recording

Note: the microphone needs HTTPS (Pages provides it) + browser permission. The practice area resets when you switch conversations.

### Technical notes

- **Pure static**: single-file `index.html` (inline CSS/JS) + PWA assets — no build, no dependencies, no CDN, no external fonts; works offline
- **No SDKs**: chat, TTS and pronunciation assessment all go through native browser `fetch` + REST
- **All data local**: settings in localStorage; conversations, recordings and audio cache in IndexedDB (GB-scale); no server in the loop
- **33 Azure regions**, 46 built-in voices (each verified against the live API)

### File map

| File | Purpose |
|---|---|
| `index.html` | The app (HTML/CSS/JS inline) |
| `manifest.json` | PWA manifest |
| `sw.js` | Service Worker (caches site assets offline; never intercepts APIs) |
| `icon-192.png` / `icon-512.png` | PWA icons |
| `favicon-32.png` | Browser tab icon |
| `quotes.js` | 400-quote library (check-in cards) |
| `qrgen.js` / `qr-scanner-worker.min.js` | QR generation / scanning (multi-device sync) |
| `img/checkin/` | 40 check-in background photos (local Unsplash shots) |

### Privacy

Everything (keys, chats, recordings) stays in your phone / browser. The app has no server and never saves or uploads anything. You'll need to re-enter settings on a new browser or after clearing data — use the in-app Export to back up important data.

---

## 开源协议 License

MIT. 欢迎自用、魔改、分享。Feel free to use, hack and share.
