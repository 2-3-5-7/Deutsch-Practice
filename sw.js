/* 德语口语练习 Service Worker
 * 作用：满足 Chrome PWA 可安装要求（必须有带 fetch 处理的 SW）+ 弱网/离线兜底。
 * 策略：本站 GET 请求走网络优先，失败时读缓存；API 与 CDN 请求不拦截。
 * 注意：更新 index.html 后刷新页面即生效，无需手动清缓存。
 */
const CACHE = 'deutsch-practice-v2';
const ASSETS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // 只接管本站 GET（页面 / manifest / 图标）；API 与 CDN 直接放行
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match('index.html')))
  );
});
