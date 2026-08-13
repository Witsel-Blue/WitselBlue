import Vue from 'vue';

export const cursorHintState = Vue.observable({
    label: '',
});

const stack = [];

export function enterCursorZone(id, label) {
    stack.push({ id, label });
    cursorHintState.label = label;
}

export function leaveCursorZone(id) {
    const index = stack.findIndex((zone) => zone.id === id);
    if (index >= 0) stack.splice(index, 1);
    cursorHintState.label = stack.length
        ? stack[stack.length - 1].label
        : '';
}
