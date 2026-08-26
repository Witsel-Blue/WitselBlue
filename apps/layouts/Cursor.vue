<template>
    <div class='site-cursor-root'>
        <div
            v-show='visible && !hintLabel'
            class='site-cursor'
            :style='positionStyle'
            aria-hidden='true'
        />
        <Transition name='cursor-hint'>
            <div
                v-if='visible && hintLabel'
                ref='hintWrap'
                class='site-cursor__hint-wrap'
                :style='positionStyle'
                aria-hidden='true'
            >
                <p class='site-cursor__hint'>
                    {{ hintLabel }}
                </p>
            </div>
        </Transition>
    </div>
</template>

<script>
    import { cursorHintState } from '@/utils/cursorHint';

    const CURSOR_OFFSET_X = 24;
    const CURSOR_OFFSET_Y = 32;
    const CURSOR_SIZE = 16;
    const VIEWPORT_MARGIN = 4;

    export default {
        name: 'SiteCursor',
        data() {
            return {
                x: 0,
                y: 0,
                targetX: 0,
                targetY: 0,
                visible: false,
                active: false,
                rafId: null,
                hintLabel: '',
            };
        },
        computed: {
            positionStyle() {
                return {
                    transform: `translate3d(${this.x}px, ${this.y}px, 0)`,
                };
            },
        },
        mounted() {
            if (!process.client) return;
            if (!window.matchMedia('(pointer: fine)').matches) return;

            this.active = true;
            this.syncHintLabel();

            this.onMove = (e) => {
                this.setTargetFromClient(e.clientX, e.clientY);
                if (!this.visible) {
                    this.snapToTarget();
                    this.visible = true;
                }
            };
            this.onEnter = (e) => {
                this.setTargetFromClient(e.clientX, e.clientY);
                this.snapToTarget();
                this.visible = true;
            };
            this.onLeave = () => {
                this.visible = false;
            };

            window.addEventListener('mousemove', this.onMove, { passive: true });
            document.documentElement.addEventListener('mouseenter', this.onEnter);
            document.documentElement.addEventListener('mouseleave', this.onLeave);
            window.addEventListener('resize', this.onResize, { passive: true });
            this.tick();
        },
        beforeDestroy() {
            if (!this.active) return;

            window.removeEventListener('mousemove', this.onMove);
            document.documentElement.removeEventListener('mouseenter', this.onEnter);
            document.documentElement.removeEventListener('mouseleave', this.onLeave);
            window.removeEventListener('resize', this.onResize);
            if (this.rafId) cancelAnimationFrame(this.rafId);
        },
        methods: {
            syncHintLabel() {
                this.hintLabel = cursorHintState.label;
                this.$watch(
                    () => cursorHintState.label,
                    (label) => {
                        this.hintLabel = label;
                        this.$nextTick(() => {
                            this.clampTarget();
                            this.clampCurrent();
                        });
                    },
                );
            },
            getCursorSize() {
                if (this.hintLabel && this.$refs.hintWrap) {
                    return {
                        w: this.$refs.hintWrap.offsetWidth,
                        h: this.$refs.hintWrap.offsetHeight,
                    };
                }

                return { w: CURSOR_SIZE, h: CURSOR_SIZE };
            },
            clampPosition(x, y) {
                const { w, h } = this.getCursorSize();
                const maxX = window.innerWidth - w - VIEWPORT_MARGIN;
                const maxY = window.innerHeight - h - VIEWPORT_MARGIN;

                return {
                    x: Math.max(VIEWPORT_MARGIN, Math.min(x, maxX)),
                    y: Math.max(VIEWPORT_MARGIN, Math.min(y, maxY)),
                };
            },
            setTargetFromClient(clientX, clientY) {
                const clamped = this.clampPosition(
                    clientX + CURSOR_OFFSET_X,
                    clientY + CURSOR_OFFSET_Y,
                );
                this.targetX = clamped.x;
                this.targetY = clamped.y;
            },
            clampTarget() {
                const clamped = this.clampPosition(this.targetX, this.targetY);
                this.targetX = clamped.x;
                this.targetY = clamped.y;
            },
            clampCurrent() {
                const clamped = this.clampPosition(this.x, this.y);
                this.x = clamped.x;
                this.y = clamped.y;
            },
            snapToTarget() {
                this.x = this.targetX;
                this.y = this.targetY;
            },
            onResize() {
                this.clampTarget();
                this.clampCurrent();
            },
            tick() {
                this.x += (this.targetX - this.x) * 0.22;
                this.y += (this.targetY - this.y) * 0.22;
                this.clampCurrent();
                this.rafId = requestAnimationFrame(this.tick);
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    .site-cursor-root {
        pointer-events: none;

        .site-cursor {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: $white_inverted;
            mix-blend-mode: difference;
            will-change: transform;
        }

        .site-cursor__hint-wrap {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9999;
            will-change: transform;
            mix-blend-mode: difference;

            .site-cursor__hint {
                margin: 0;
                font-size: 0.8rem;
                letter-spacing: 0.06em;
                text-transform: uppercase;
                color: $white_inverted;
                white-space: nowrap;
                border: 1px solid rgba($white_inverted, 0.4);
                padding: 8px 12px;
                border-radius: 24px;
                background: rgba($white_inverted, 0.2);
                -webkit-backdrop-filter: blur(8px);
                backdrop-filter: blur(8px);
            }
        }
    }

    .cursor-hint {
        &-enter-active,
        &-leave-active {
            transition: opacity 0.2s ease, transform 0.2s ease;

            .site-cursor__hint {
                transition: opacity 0.2s ease, transform 0.2s ease;
            }
        }

        &-enter,
        &-leave-to {
            opacity: 0;

            .site-cursor__hint {
                opacity: 0;
                transform: translateY(-4px);
            }
        }
    }
</style>
