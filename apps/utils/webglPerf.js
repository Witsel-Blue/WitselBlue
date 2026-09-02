export function getWebGLPixelRatio(max = 1.75) {
    if (typeof window === 'undefined') return 1;
    const dpr = window.devicePixelRatio || 1;
    const cap = window.innerWidth <= 768 ? Math.min(max, 1.25) : max;
    return Math.min(dpr, cap);
}

export function observeVisibility(el, onChange, options = {}) {
    if (!el || typeof IntersectionObserver === 'undefined') {
        onChange(true);
        return () => {};
    }

    const observer = new IntersectionObserver(
        ([entry]) => {
            onChange(Boolean(entry?.isIntersecting));
        },
        {
            threshold: 0.01,
            ...options,
        }
    );
    observer.observe(el);
    return () => observer.disconnect();
}
