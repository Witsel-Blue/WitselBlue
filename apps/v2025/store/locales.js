export const state = () => ({
    locale: 'en',
});

export const mutations = {
    SET_LOCALE(state, locale) {
        state.locale = locale;
    },
};

export const actions = {
    setLocale({ commit }, locale) {
        commit('SET_LOCALE', locale);
        if (process.client) localStorage.setItem('locale', locale);
    },
    initLocale({ commit }) {
        if (process.client) {
            const saved = localStorage.getItem('locale');
            if (saved) commit('SET_LOCALE', saved);
        }
    },
};