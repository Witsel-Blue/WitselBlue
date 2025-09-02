export const state = () => ({
  isDetailPage: false,
  isNoUIPage: false,
  nextProject: null,
});

export const mutations = {
  setDetailPage(state, value) {
    state.isDetailPage = value;
  },
  setNoUIPage(state, value) {
    state.isNoUIPage = value;
  },
  setNextProject(state, item) {
    state.nextProject = item;
  },
  clearNextProject(state) {
    state.nextProject = null;
  },
};