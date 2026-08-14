<template>
    <component
        :is='rootTag'
        :class='rootClass'
        aria-hidden='true'
        @mouseenter='onWrapperEnter'
    >
        <slot v-if='!attachToParent' />
    </component>
</template>

<script>
    import { isSoundMuted } from '@/utils/soundMuteState';

    const CLICK_SOUND_SRC = '/sound/click.mp3';

    export default {
        name: 'ClickSound',
        props: {
            src: {
                type: String,
                default: CLICK_SOUND_SRC,
            },
            tag: {
                type: String,
                default: 'div',
            },
            attachToParent: {
                type: Boolean,
                default: false,
            },
        },
        computed: {
            rootTag() {
                return this.attachToParent ? 'span' : this.tag;
            },
            rootClass() {
                return this.attachToParent ? 'click-sound-anchor' : 'click-sound';
            },
        },
        mounted() {
            if (!process.client) return;
            if (!window.matchMedia('(pointer: fine)').matches) return;

            if (!this.attachToParent) return;

            this.targetEl = this.$el.parentElement;
            if (!this.targetEl) return;

            this.targetEl.addEventListener('mouseenter', this.onEnter);
        },
        beforeDestroy() {
            if (this.targetEl) {
                this.targetEl.removeEventListener('mouseenter', this.onEnter);
            }
        },
        methods: {
            onWrapperEnter() {
                if (!this.attachToParent) this.onEnter();
            },
            onEnter() {
                if (!process.client) return;
                if (isSoundMuted()) return;

                if (!this.audio) {
                    this.audio = new Audio(this.src);
                }

                this.audio.currentTime = 0;
                this.audio.play().catch(() => {});
            },
        },
    };
</script>

<style scoped>
    .click-sound-anchor {
        display: none;
    }
</style>
