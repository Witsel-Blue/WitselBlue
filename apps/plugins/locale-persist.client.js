import { ensureLocaleMessages } from '@/utils/localeMessages';
import { getSavedLocale, setSavedLocale, SUPPORTED_LOCALES } from '@/utils/localeState';

function resolveLocalePath(app, routeLike, locale) {
    const prevLocale = app.i18n.locale;

    app.i18n.locale = locale;
    const localized = app.localePath(routeLike);
    app.i18n.locale = prevLocale;

    return localized;
}

function syncLocaleFromStorage(app, router) {
    const saved = getSavedLocale();
    if (!saved) return false;

    ensureLocaleMessages(app.i18n, saved);

    if (app.i18n.locale !== saved) {
        app.i18n.locale = saved;
    }

    if (typeof app.i18n.setLocaleCookie === 'function') {
        app.i18n.setLocaleCookie(saved);
    }

    const targetPath = resolveLocalePath(app, router.currentRoute.fullPath, saved);

    if (targetPath && router.currentRoute.fullPath !== targetPath) {
        router.replace(targetPath);
        return true;
    }

    return false;
}

export default ({ app }) => {
    if (!process.client) return;

    const router = app.router;
    if (!router) return;

    router.beforeEach((to, from, next) => {
        const saved = getSavedLocale();
        if (!saved) {
            next();
            return;
        }

        ensureLocaleMessages(app.i18n, saved);

        if (app.i18n.locale !== saved) {
            app.i18n.locale = saved;
        }

        const localizedPath = resolveLocalePath(app, to.fullPath, saved);

        if (localizedPath && to.fullPath !== localizedPath) {
            next(localizedPath);
            return;
        }

        next();
    });

    router.onReady(() => {
        syncLocaleFromStorage(app, router);
    });

    router.afterEach(() => {
        const saved = getSavedLocale();
        if (!saved || !SUPPORTED_LOCALES.includes(saved)) return;

        setSavedLocale(saved);
    });
};
