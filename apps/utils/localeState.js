export const LOCALE_STORAGE_KEY = 'witselblue_locale';
export const SUPPORTED_LOCALES = ['en', 'ko'];

export function getSavedLocale() {
    if (!process.client) return null;

    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return SUPPORTED_LOCALES.includes(saved) ? saved : null;
}

export function setSavedLocale(locale) {
    if (!process.client) return;
    if (!SUPPORTED_LOCALES.includes(locale)) return;

    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
