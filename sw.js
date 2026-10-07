/* 德语口语练习 Service Worker
 * 作用：满足 Chrome PWA 可安装要求（必须有带 fetch 处理的 SW）+ 弱网/离线兜底。
 * 策略：本站 GET 请求走网络优先，失败时读缓存；API 与 CDN 请求不拦截。
 * 注意：更新 index.html 后刷新页面即生效，无需手动清缓存。
 */
const CACHE = 'deutsch-practice-v2';
const ASSETS = ['./', 'index.html', 'quotes.js', 'qrgen.js', 'qr-scanner-worker.min.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];

const PHOTOS = [
  'img/checkin/01-schwarzwald-1.webp',
  'img/checkin/02-schwarzwald-2.webp',
  'img/checkin/03-koenigssee-1.webp',
  'img/checkin/04-koenigssee-2.webp',
  'img/checkin/05-eibsee-1.webp',
  'img/checkin/06-eibsee-2.webp',
  'img/checkin/07-bastei-1.webp',
  'img/checkin/08-bastei-2.webp',
  'img/checkin/09-rakotzbruecke-1.webp',
  'img/checkin/10-rakotzbruecke-2.webp',
  'img/checkin/11-neuschwanstein-1.webp',
  'img/checkin/12-neuschwanstein-2.webp',
  'img/checkin/13-hohenzollern-1.webp',
  'img/checkin/14-hohenzollern-2.webp',
  'img/checkin/15-eltz-1.webp',
  'img/checkin/16-eltz-2.webp',
  'img/checkin/17-moritzburg-1.webp',
  'img/checkin/18-moritzburg-2.webp',
  'img/checkin/19-speicherstadt-1.webp',
  'img/checkin/20-speicherstadt-2.webp',
  'img/checkin/21-cologne-1.webp',
  'img/checkin/22-cologne-2.webp',
  'img/checkin/23-rothenburg-1.webp',
  'img/checkin/24-rothenburg-2.webp',
  'img/checkin/25-bamberg-1.webp',
  'img/checkin/26-bamberg-2.webp',
  'img/checkin/27-heidelberg-1.webp',
  'img/checkin/28-heidelberg-2.webp',
  'img/checkin/29-dresden-1.webp',
  'img/checkin/30-dresden-2.webp',
  'img/checkin/31-brandenburg-1.webp',
  'img/checkin/32-brandenburg-2.webp',
  'img/checkin/33-sanssouci-1.webp',
  'img/checkin/34-sanssouci-2.webp',
  'img/checkin/35-ruegen-1.webp',
  'img/checkin/36-ruegen-2.webp',
  'img/checkin/37-hintersee-1.webp',
  'img/checkin/38-hintersee-2.webp',
  'img/checkin/39-lorelei-1.webp',
  'img/checkin/40-lorelei-2.webp',
];
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
      // 打卡照片后台预热：逐张尽力缓存，单张失败不影响安装
      .then(() => caches.open(CACHE))
      .then((c) => Promise.allSettled(PHOTOS.map((u) => c.add(u))))
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
