<template>
    <div
        id='about-side-bg'
        aria-hidden='true'
        :style='rootStyle'
    >
        <img
            class='left'
            :src='sideImg'
        />
        <img
            class='right'
            :src='sideImg'
        />
    </div>
</template>

<script>
    import sideImg from '@/assets/img/home/about_side.svg';

    const REVEAL_RADIUS = '90vmin';

    export default {
        name: 'AboutSideBg',
        data() {
            return {
                sideImg,
                pinStyle: {
                    position: 'absolute',
                    top: '0',
                    bottom: 'auto',
                },
                mx: '50%',
                my: '50%',
                reveal: 0,
            };
        },
        computed: {
            rootStyle() {
                return {
                    ...this.pinStyle,
                    '--mx': this.mx,
                    '--my': this.my,
                    '--reveal-radius': this.reveal > 0.01 ? REVEAL_RADIUS : '0px',
                    opacity: this.reveal,
                };
            },
        },
        mounted() {
            if (!process.client) return;

            this.onScroll = () => {
                const about = this.$el?.parentElement;
                if (!about) return;

                const rect = about.getBoundingClientRect();
                const vh = window.innerHeight;

                if (rect.top >= 0) {
                    this.pinStyle = {
                        position: 'absolute',
                        top: '0',
                        bottom: 'auto',
                    };
                    return;
                }

                if (rect.bottom <= vh) {
                    this.pinStyle = {
                        position: 'absolute',
                        top: 'auto',
                        bottom: '0',
                    };
                    return;
                }

                this.pinStyle = {
                    position: 'fixed',
                    top: '0',
                    bottom: 'auto',
                };
            };

            this.onPointerMove = (event) => {
                const el = this.$el;
                const about = el?.parentElement;
                if (!el || !about) return;

                const aboutRect = about.getBoundingClientRect();
                const inside =
                    event.clientX >= aboutRect.left
                    && event.clientX <= aboutRect.right
                    && event.clientY >= aboutRect.top
                    && event.clientY <= aboutRect.bottom;

                if (!inside) {
                    this.reveal = 0;
                    return;
                }

                const rect = el.getBoundingClientRect();
                this.mx = `${event.clientX - rect.left}px`;
                this.my = `${event.clientY - rect.top}px`;
                this.reveal = 1;
            };

            this.onPointerLeaveWindow = () => {
                this.reveal = 0;
            };

            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            window.addEventListener('pointermove', this.onPointerMove, {
                passive: true,
            });
            window.addEventListener('blur', this.onPointerLeaveWindow);
            this.onScroll();
        },
        beforeDestroy() {
            if (this.onScroll) {
                window.removeEventListener('scroll', this.onScroll);
                window.removeEventListener('resize', this.onScroll);
            }
            if (this.onPointerMove) {
                window.removeEventListener('pointermove', this.onPointerMove);
            }
            if (this.onPointerLeaveWindow) {
                window.removeEventListener('blur', this.onPointerLeaveWindow);
            }
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #about-side-bg {
        left: 0;
        z-index: 0;
        width: 100%;
        height: 100vh;
        pointer-events: none;
        overflow: hidden;
        transition: opacity 0.4s ease;
        -webkit-mask-image: radial-gradient(
            circle var(--reveal-radius, 0px) at var(--mx, 50%) var(--my, 50%),
            #000 0%,
            #000 20%,
            rgba(0, 0, 0, 0.7) 40%,
            rgba(0, 0, 0, 0.35) 60%,
            transparent 90%
        );
        mask-image: radial-gradient(
            circle var(--reveal-radius, 0px) at var(--mx, 50%) var(--my, 50%),
            #000 0%,
            #000 20%,
            rgba(0, 0, 0, 0.7) 40%,
            rgba(0, 0, 0, 0.35) 60%,
            transparent 90%
        );
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;

        .left {
            position: absolute;
            top: 40%;
            left: 0;
            display: block;
            width: 40vw;
            height: auto;
            user-select: none;
            transform: translateY(-50%) scaleX(-1);
        }

        .right {
            position: absolute;
            top: 40%;
            right: 0;
            display: block;
            width: 40vw;
            height: auto;
            user-select: none;
            transform: translateY(-50%);
        }
    }
</style>
