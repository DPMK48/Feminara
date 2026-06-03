'use client';

let handledChunkError = false;

function clearServiceWorkerCaches() {
  if (!('caches' in window)) return;
  caches.keys()
    .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
    .catch(() => {});
}

function reloadAfterChunkError() {
  if (handledChunkError) return;
  handledChunkError = true;

  clearServiceWorkerCaches();
  window.location.reload();
}

export function setupServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  if (process.env.NODE_ENV !== 'production') {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .then(() => clearServiceWorkerCaches())
      .catch(() => {});
    return;
  }

  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

export function setupChunkErrorRecovery() {
  if (typeof window === 'undefined') return;

  const isChunkError = (value: unknown) => {
    const message = value instanceof Error ? value.message : String(value);
    return /ChunkLoadError|Loading chunk .* failed|Loading CSS chunk .* failed/.test(message);
  };

  const onError = (event: ErrorEvent) => {
    if (isChunkError(event.error) || isChunkError(event.message)) {
      reloadAfterChunkError();
    }
  };

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (isChunkError(event.reason)) {
      reloadAfterChunkError();
    }
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onUnhandledRejection);

  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onUnhandledRejection);
  };
}
