import Vue from 'vue';

export const gatherAnchorState = Vue.observable({
    anchor1Gathered: false,
});

export function syncGatherAnchorState(anchor1Gathered) {
    if (gatherAnchorState.anchor1Gathered !== anchor1Gathered) {
        gatherAnchorState.anchor1Gathered = anchor1Gathered;
    }
}

export function resetGatherAnchorState() {
    syncGatherAnchorState(false);
}
