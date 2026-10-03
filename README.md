# 德语跟读练习 · Deutsch Practice

一个纯静态的德语口语跟读练习 PWA：和 AI 用德语聊天 → 一键生成德语原声 → 录音跟读 → Azure 发音打分。

A pure-static German shadowing practice PWA: chat in German, generate native audio, record yourself, get pronunciation scores.

## 功能

- 💬 **德语聊天**：OpenAI 兼容接口，SSE 流式输出，支持轻量 Markdown 渲染
- 🔊 **一键原声**：点击聊天里的任意一句话，自动提取德语、生成 Azure 神经网络语音并播放
- 🎙️ **录音打分**：总分 / 准确度 / 流利度 / 完整度，单词按颜色标出读错、漏读、多读，点击单词看音素得分
- 📊 **练习历史**：每条打分自动保存，可完整还原当时的打分、原声和你的录音
- 🔍 **对话搜索**：搜标题和聊天内容，显示高亮命中片段
- 💾 **存储管理**：对话数 / 练习数 / 原声缓存数都可配置上限，超限自动删最老的；设置页实时看空间占用
- 📱 **PWA**：可安装到手机主屏幕，全屏 App 形态使用，支持离线打开

## 技术特点

- **纯静态**：`index.html` 单文件（内联 CSS/JS）+ PWA 资源，无构建、无依赖、无 CDN、无外部字体
- **无 SDK**：聊天、TTS、发音评估全部浏览器原生 `fetch` + REST 直调
- **数据全在本地**：设置放 localStorage，对话、录音、原声缓存放 IndexedDB（GB 级），不经过任何服务器

## 本地运行

不要直接双击用 `file://` 打开（麦克风在 file 协议下可能被浏览器限制）。在项目目录执行：

```bash
python3 -m http.server 8000
```

浏览器打开 http://localhost:8000 即可（localhost 算安全上下文，麦克风可用）。

## 首次使用配置（App 内「设置」Tab）

1. **聊天接口**：Base URL 默认 `https://openrouter.ai/api/v1`，模型如 `openai/gpt-4o-mini`，
   Key 填 OpenRouter（或其它 OpenAI 兼容渠道）的 API Key → 点「测试连接」
2. **Azure Speech**：填 Speech Key + Region（默认 `westus2`，以你建资源时选的区域为准），
   选德语声音 → 点「测试 TTS」应能听到德语
3. 所有 Key 和聊天记录只保存在你自己的浏览器里，不会上传

## 部署到 Cloudflare Pages（网页后台上传，无需命令行）

1. 登录 https://dash.cloudflare.com → 左侧 **Workers & Pages** → 右上 **创建应用程序** → 切换到 **Pages** 选项卡 → **上传资产（Upload assets）**
2. 项目名随便起，如 `deutsch-practice`
3. 把以下 **6 个文件一起拖进上传框**（确保都在站点根目录）：
   `index.html`、`manifest.json`、`sw.js`、`icon-192.png`、`icon-512.png`、`favicon-32.png`
4. 点 **Deploy**，得到 `https://xxx.pages.dev`（可再绑定自己的域名）
5. 手机 Chrome 打开 → 菜单「安装应用」/「添加到主屏幕」，即可以全屏 App 形态使用

注意：`manifest.json` + `sw.js` + 两个图标是 PWA 安装必需的，只传 `index.html` 会提示"无法安装此应用"。
`README.md` 和 `LICENSE` 不用传

备选：`npx wrangler pages deploy .`，或 GitHub 仓库关联自动部署。

## 使用流程（练习 Tab，一个页面走完）

1. **和 AI 用德语聊天**：左上角 ☰ 打开对话列表（可搜索、导出、删除）；
   点击 AI 回复里的任意一句话 → 自动提取纯德语（去 Markdown、去中文讲解、去 emoji），生成原声并播放，句子填入下方文本框
2. **原声跟读**：文本框（随内容自动增高，可手动输入）+「生成原声」+ 播放器（可拖进度条、0.5x–1.5x 变速本地播放）+ 下载原声
3. **录音打分**：点红色录音键开始（有小音量条确认麦克风在收音）→ 说完点停止 → 自动打分；
   录音会自动播放一遍方便对比；支持"重新打分"（网络失败时不用重录）
4. **看历史**：点某条练习记录，完整还原打分明细、原声、你的录音，并自动播放原声

注意：麦克风需要 HTTPS（Pages 默认提供）+ 浏览器授权。

## 文件说明

| 文件 | 说明 |
|---|---|
| `index.html` | 应用本体（HTML/CSS/JS 全内联） |
| `manifest.json` | PWA 安装清单 |
| `sw.js` | Service Worker（离线缓存本站资源，不拦截 API） |
| `icon-192.png` / `icon-512.png` | PWA 图标 |
| `favicon-32.png` | 浏览器标签页图标 |

## 隐私

放心用：所有数据（Key、聊天记录、录音）只存在你的手机/浏览器里，App 没有服务器，不会保存或上传任何东西。换个浏览器或清理数据后需要重新填写。

## 开源协议

MIT，详见 [LICENSE](LICENSE)。欢迎自用、魔改、分享。
