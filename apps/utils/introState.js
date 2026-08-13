export const INTRO_STORAGE_KEY = 'wb2026IntroDone';
export const INTRO_ROOT_KEY = '$wb2026IntroDone';

export function isHomeRoute(route) {
    const path = route?.path || '';
    return path === '/' || path === '/ko';
}

export function isIntroDone() {
    if (!process.client) return false;
    return window.localStorage.getItem(INTRO_STORAGE_KEY) === '1';
}

export function setIntroDone(root) {
    if (!process.client) return;
    window.localStorage.setItem(INTRO_STORAGE_KEY, '1');
    if (root) root[INTRO_ROOT_KEY] = true;
}

export function clearIntroDone(root) {
    if (!process.client) return;
    window.localStorage.removeItem(INTRO_STORAGE_KEY);
    if (root) root[INTRO_ROOT_KEY] = false;
}

export function syncIntroDoneToRoot(root) {
    if (!process.client || !root) return false;
    if (!isIntroDone()) return false;
    root[INTRO_ROOT_KEY] = true;
    return true;
}

export function shouldUseIntroLayout(route) {
    if (!process.client) return false;
    return isHomeRoute(route) && !isIntroDone();
}
