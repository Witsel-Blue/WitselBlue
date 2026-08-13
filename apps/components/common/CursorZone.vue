<template>
    <component
        :is='rootTag'
        :class='rootClass'
        aria-hidden='true'
        @mouseenter='onWrapperEnter'
        @mouseleave='onWrapperLeave'
    >
        <slot v-if='!attachToParent' />
    </component>
</template>

<script>
    import { enterCursorZone, leaveCursorZone } from '@/utils/cursorHint';

    export default {
        name: 'CursorZone',
        props: {
            label: {
                type: String,
                required: true,
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
                return this.attachToParent ? 'cursor-zone-anchor' : 'cursor-zone';
            },
        },
        created() {
            this.zoneId = `cursor-zone-${Math.random().toString(36).slice(2, 9)}`;
        },
        mounted() {
            if (!this.attachToParent) return;

            this.targetEl = this.$el.parentElement;
            if (!this.targetEl) return;

            this.targetEl.addEventListener('mouseenter', this.onEnter);
            this.targetEl.addEventListener('mouseleave', this.onLeave);
        },
        beforeDestroy() {
            leaveCursorZone(this.zoneId);

            if (this.targetEl) {
                this.targetEl.removeEventListener('mouseenter', this.onEnter);
                this.targetEl.removeEventListener('mouseleave', this.onLeave);
            }
        },
        methods: {
            onWrapperEnter() {
                if (!this.attachToParent) this.onEnter();
            },
            onWrapperLeave() {
                if (!this.attachToParent) this.onLeave();
            },
            onEnter() {
                enterCursorZone(this.zoneId, this.label);
            },
            onLeave() {
                leaveCursorZone(this.zoneId);
            },
        },
    };
</script>

<style scoped>
    .cursor-zone-anchor {
        display: none;
    }
</style>
