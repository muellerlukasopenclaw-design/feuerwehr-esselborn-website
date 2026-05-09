/**
 * Feuerwehr Esselborn - Service Worker
 * Offline-First Strategie mit Cache-Management
 * Version: 1.0.0
 */

const CACHE_NAME = 'feuerwehr-esselborn-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/data/mannschaft.json',
  '/data/termine.json',
  '/404.html',
  '/favicon.svg'
];

// Install: Cache statische Assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installiere Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching statische Assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Assets gecached, skipWaiting...');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Fehler beim Caching:', err);
      })
  );
});

// Activate: Alte Caches aufräumen
self.addEventListener('activate', (event) => {
  console.log('[SW] Aktiviere Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Lösche alten Cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients...');
        return self.clients.claim();
      })
  );
});

// Fetch: Cache-Strategien
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Nur GET-Requests cachen
  if (request.method !== 'GET') {
    return;
  }
  
  // JSON-Dateien: Network First, dann Cache
  if (url.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Statische Assets: Cache First, dann Network
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Alles andere: Network with Cache Fallback
  event.respondWith(networkWithCacheFallback(request));
});

// Cache-Strategien
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Cache First failed:', error);
    throw error;
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, versuche Cache...');
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function networkWithCacheFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Offline-Fallback für HTML-Requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return cache.match('/404.html');
    }
    
    throw error;
  }
}

// Hilfsfunktionen
function isStaticAsset(pathname) {
  const staticExtensions = ['.css', '.js', '.svg', '.png', '.jpg', '.woff', '.woff2'];
  return staticExtensions.some((ext) => pathname.endsWith(ext));
}

// Background Sync für Formulare (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('[SW] Background Sync ausgeführt');
  }
});

// Push Notifications (optional, für Einsatzbenachrichtigungen)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: data.tag || 'default'
      })
    );
  }
});
