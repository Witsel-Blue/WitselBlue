export const state = () => ({
  layout: 'list',
});

export const mutations = {
  SET_LAYOUT(state, mode) {
    state.layout = mode;
  },
};

export const actions = {
  setLayout({ commit }, mode) {
    commit('SET_LAYOUT', mode);
  },
};

export const getters = {
  layout: (state) => state.layout,
};