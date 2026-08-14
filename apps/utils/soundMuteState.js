import Vue from 'vue';

export const SOUND_MUTE_STORAGE_KEY = 'wb2026SoundMuted';

export const soundMuteState = Vue.observable({
    muted: false,
});

export function isSoundMuted() {
    if (!process.client) return false;
    return soundMuteState.muted;
}

export function syncSoundMutedFromStorage() {
    if (!process.client) return false;

    const muted = window.localStorage.getItem(SOUND_MUTE_STORAGE_KEY) === '1';
    soundMuteState.muted = muted;
    return muted;
}

export function setSoundMuted(muted) {
    if (!process.client) return;

    soundMuteState.muted = muted;

    if (muted) {
        window.localStorage.setItem(SOUND_MUTE_STORAGE_KEY, '1');
        return;
    }

    window.localStorage.removeItem(SOUND_MUTE_STORAGE_KEY);
}
