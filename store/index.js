export const state = () => ({
  isDetailPage: false,
  isNoUIPage: false,
});

export const mutations = {
  setDetailPage(state, value) {
    state.isDetailPage = value;
  },
  setNoUIPage(state, value) {
    state.isNoUIPage = value;
  }
};