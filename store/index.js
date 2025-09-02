export const state = () => ({
  isDetailPage: false,
  isNoUIPage: false,
  nextProject: null,
  nextArchiveDev: null,
  nextArchiveMusic: null,
});

export const mutations = {
  setDetailPage(state, value) {
    state.isDetailPage = value;
  },
  setNoUIPage(state, value) {
    state.isNoUIPage = value;
  },
  setNextProject(state, project) {
    state.nextProject = project;
  },
  clearNextProject(state) {
    state.nextProject = null;
  },
  setNextArchiveDev(state, archive) {
    state.nextArchiveDev = archive;
  },
  clearNextArchiveDev(state) {
    state.nextArchiveDev = null;
  },
  setNextArchiveMusic(state, archive) {
    state.nextArchiveMusic = archive;
  },
  clearNextArchiveMusic(state) {
    state.nextArchiveMusic = null;
  }
};