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
                this.targetX = e.clientX + CURSOR_OFFSET_X;
                this.targetY = e.clientY + CURSOR_OFFSET_Y;
                if (!this.visible) {
                    this.x = this.targetX;
                    this.y = this.targetY;
                    this.visible = true;
                }
            };
            this.onLeave = () => {
                this.visible = false;
            };

            window.addEventListener('mousemove', this.onMove, { passive: true });
            document.documentElement.addEventListener('mouseleave', this.onLeave);
            this.tick();
        },
        beforeDestroy() {
            if (!this.active) return;

            window.removeEventListener('mousemove', this.onMove);
            document.documentElement.removeEventListener('mouseleave', this.onLeave);
            if (this.rafId) cancelAnimationFrame(this.rafId);
        },
        methods: {
            syncHintLabel() {
                this.hintLabel = cursorHintState.label;
                this.$watch(
                    () => cursorHintState.label,
                    (label) => {
                        this.hintLabel = label;
                    },
                );
            },
            tick() {
                this.x += (this.targetX - this.x) * 0.22;
                this.y += (this.targetY - this.y) * 0.22;
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

            .site-cursor__hint {
                margin: 0;
                font-size: 0.75rem;
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
            transition: opacity 0.4s ease, transform 0.4s ease;

            .site-cursor__hint {
                transition: opacity 0.4s ease, transform 0.4s ease;
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
