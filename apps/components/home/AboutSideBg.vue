<template>
    <div
        id='about-side-bg'
        aria-hidden='true'
        :style='pinStyle'
    >
        <img
            class='left'
            :src='sideImg'
            alt=''
        />
        <img
            class='right'
            :src='sideImg'
            alt=''
        />
    </div>
</template>

<script>
    import sideImg from '@/assets/img/home/about_side.svg';

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
            };
        },
        mounted() {
            if (!process.client) return;

            this.onScroll = () => {
                const about = this.$el?.parentElement;
                if (!about) return;

                const rect = about.getBoundingClientRect();
                const vh = window.innerHeight;

                // 진입 전·진입 중: about 상단에 붙어서 함께 올라옴
                if (rect.top >= 0) {
                    this.pinStyle = {
                        position: 'absolute',
                        top: '0',
                        bottom: 'auto',
                    };
                    return;
                }

                // 이탈: about 하단에 붙여 두 번째 섹션과 함께 올라감
                if (rect.bottom <= vh) {
                    this.pinStyle = {
                        position: 'absolute',
                        top: 'auto',
                        bottom: '0',
                    };
                    return;
                }

                // 두 섹션을 지나는 동안 화면 고정
                this.pinStyle = {
                    position: 'fixed',
                    top: '0',
                    bottom: 'auto',
                };
            };

            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            this.onScroll();
        },
        beforeDestroy() {
            if (!this.onScroll) return;
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onScroll);
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #about-side-bg {
        z-index: 0;
        width: 100%;
        height: 100vh;
        pointer-events: none;
        overflow: hidden;
        position: relative;

        .left {
            width: 40vw;
            height: auto;
            display: block;
            user-select: none;
            position: absolute;
            top: 40%;
            left: 0;
            transform: translateY(-50%) scaleX(-1);
        }

        .right {
            width: 40vw;
            height: auto;
            display: block;
            user-select: none;
            position: absolute;
            top: 40%;
            right: 0;
            transform: translateY(-50%);
        }
    }
</style>
