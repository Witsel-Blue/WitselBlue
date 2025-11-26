export const state = () => ({
    isNoUIPage: false,
    isDetailPage: false,
    nextProject: null,
    prevProject: null,
    prevPrevProject: null,
    nextNextProject: null,
    nextNextNextProject: null,
    nextArchiveDev: null,
    prevArchiveDev: null,
    prevPrevArchiveDev: null,
    nextNextArchiveDev: null,
    nextNextNextArchiveDev: null,
    nextArchiveMusic: null,
    prevArchiveMusic: null,
    prevPrevArchiveMusic: null,
    nextNextArchiveMusic: null,
    nextNextNextArchiveMusic: null,
    showPageTransition: false,
    pageTransitionTitle: '',
    showIntro: false,
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
    setPrevProject(state, project) {
        state.prevProject = project;
    },
    setPrevPrevProject(state, project) {
        state.prevPrevProject = project;
    },
    setNextNextProject(state, project) {
        state.nextNextProject = project;
    },
    setNextNextNextProject(state, project) {
        state.nextNextNextProject = project;
    },
    clearNextProject(state) {
        state.nextProject = null;
        state.prevProject = null;
        state.prevPrevProject = null;
        state.nextNextProject = null;
        state.nextNextNextProject = null;
    },
    setNextArchiveDev(state, archive) {
        state.nextArchiveDev = archive;
    },
    setPrevArchiveDev(state, archive) {
        state.prevArchiveDev = archive;
    },
    setPrevPrevArchiveDev(state, archive) {
        state.prevPrevArchiveDev = archive;
    },
    setNextNextArchiveDev(state, archive) {
        state.nextNextArchiveDev = archive;
    },
    setNextNextNextArchiveDev(state, archive) {
        state.nextNextNextArchiveDev = archive;
    },
    clearNextArchiveDev(state) {
        state.nextArchiveDev = null;
        state.prevArchiveDev = null;
        state.prevPrevArchiveDev = null;
        state.nextNextArchiveDev = null;
        state.nextNextNextArchiveDev = null;
    },
    setNextArchiveMusic(state, archive) {
        state.nextArchiveMusic = archive;
    },
    setPrevArchiveMusic(state, archive) {
        state.prevArchiveMusic = archive;
    },
    setPrevPrevArchiveMusic(state, archive) {
        state.prevPrevArchiveMusic = archive;
    },
    setNextNextArchiveMusic(state, archive) {
        state.nextNextArchiveMusic = archive;
    },
    setNextNextNextArchiveMusic(state, archive) {
        state.nextNextNextArchiveMusic = archive;
    },
    clearNextArchiveMusic(state) {
        state.nextArchiveMusic = null;
        state.prevArchiveMusic = null;
        state.prevPrevArchiveMusic = null;
        state.nextNextArchiveMusic = null;
        state.nextNextNextArchiveMusic = null;
    },
    setShowPageTransition(state, value) {
        state.showPageTransition = value;
    },
    setPageTransitionTitle(state, title) {
        state.pageTransitionTitle = title;
    },
    setShowIntro(state, value) {
        state.showIntro = value;
    }
};