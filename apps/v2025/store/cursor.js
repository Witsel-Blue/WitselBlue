export const state = () => ({
    extraClass: '',
    text: '',
    showImg: false,
    showLottie: false,
    animationData: null,
});

export const mutations = {
    setCursorClass(state, cls) {
        state.extraClass = cls;
    },
    setCursorText(state, txt) {
        state.text = txt;
    },
    setCursorImage(state, flag) {
        state.showImg = flag;
    },
    setCursorLottie(state, flag) {
        state.showLottie = flag;
    },
    setCursorAnimation(state, animationData) { 
        state.animationData = animationData; 
    },
};