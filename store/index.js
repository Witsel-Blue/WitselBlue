export const state = () => ({
    isNoUIPage: false,
    isDetailPage: false,
    nextProject: null,
    nextArchiveDev: null,
    nextArchiveMusic: null,
});

export const mutations = {
    setNoUIPage(state, value) {
        state.isNoUIPage = value;
    },
    setDetailPage(state, value) {
        state.isDetailPage = value;
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