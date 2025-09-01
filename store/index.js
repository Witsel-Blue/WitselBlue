export const state = () => ({
  isDetailPage: false, // 기본 Footer
});

export const mutations = {
  setDetailPage(state, value) {
    state.isDetailPage = value;
  },
};