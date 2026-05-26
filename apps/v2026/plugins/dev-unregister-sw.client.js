if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => reg.unregister());
    });
    caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key));
    });
}
