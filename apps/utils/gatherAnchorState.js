import Vue from 'vue';

export const gatherAnchorState = Vue.observable({
    anchor1Gathered: false,
    anchor2Gathered: false,
});

export function syncGatherAnchorState(anchor1Gathered, anchor2Gathered) {
    if (gatherAnchorState.anchor1Gathered !== anchor1Gathered) {
        gatherAnchorState.anchor1Gathered = anchor1Gathered;
    }
    if (gatherAnchorState.anchor2Gathered !== anchor2Gathered) {
        gatherAnchorState.anchor2Gathered = anchor2Gathered;
    }
}

export function resetGatherAnchorState() {
    syncGatherAnchorState(false, false);
}
