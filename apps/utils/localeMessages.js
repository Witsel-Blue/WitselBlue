import en from '@/locales/en.js';
import ko from '@/locales/ko.js';

export const LOCALE_MESSAGES = { en, ko };

export function ensureLocaleMessages(i18n, locale) {
    if (!LOCALE_MESSAGES[locale]) return;

    if (typeof i18n.setLocaleMessage === 'function') {
        i18n.setLocaleMessage(locale, LOCALE_MESSAGES[locale]);
    }
}
