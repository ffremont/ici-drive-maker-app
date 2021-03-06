// This is the "Offline page" service worker

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

if (firebase) {
  firebase.initializeApp({
    apiKey: "AIzaSyBhKGZb-0hVnWkRhImIaywwJ9eZIXRDzpI",
    authDomain: "app.ici-drive.fr",
    databaseURL: "https://ici-drive.firebaseio.com",
    projectId: "ici-drive",
    storageBucket: "ici-drive.appspot.com",
    messagingSenderId: "197845039865",
    appId: "1:197845039865:web:8c0b37d09dbff116248028",
    measurementId: "G-DWMZEW5DNP"
  });
}

const CACHE = "pwabuilder-page_2";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
    .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});

self.onmessage = function (msg) {
  switch (msg.data.name) {
      case 'push':
        const {title, body,icon, tag, url} = msg.data;
        const notificationOptions = {
          body,
          icon: icon,
          data: {
            url: url
          },
          tag
        };
    
        self.registration.showNotification(title, notificationOptions);
      break;
  }
}


