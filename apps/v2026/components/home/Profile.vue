<template>
    <div id='profile'>
        <div class='inner'>
            <div class='shape-anchor' :style='{ opacity: shardMode ? 0 : 1 }' />
            <h2>
                <span v-for='(line, i) in titleLines' :key='"t" + i' :style='lineStyle(i)'>
                    {{ line }}
                </span>
            </h2>
            <p>
                <span
                    v-for='(line, i) in descLines'
                    :key='"d" + i'
                    :style='lineStyle(titleLines.length + i)'
                >
                    {{ line }}
                </span>
            </p>
            <div class='btn-wrap' :style='btnStyle'>
                <ButtonRound :link='{ href: "/", text: "About Me" }' />
            </div>
        </div>
        <TextMarquee :image='knot' />
    </div>
</template>

<script>
    import ButtonRound from '@/components/ButtonRound.vue';
    import TextMarquee from '@/components/TextMarquee.vue';

    export default {
        name: 'Profile',
        components: {
            ButtonRound,
            TextMarquee,
        },
        data() {
            return {
                shardMode: true,
                progress: 0,
                knot: require('@/assets/img/home/knot.svg'),
                titleLines: [
                    'Mother of pearl radiates different colors',
                    'depending on the angles of light.',
                ],
                descLines: [
                    'My development philosophy is also similar to mother-of-pearl,',
                    'which provides new experiences to users every time',
                    'depending on the point where technology and senses meet.',
                ],
                profile: {
                    img: require('@/assets/img/home/profile.png'),
                },
            };
        },
        computed: {
            itemCount() {
                return this.titleLines.length + this.descLines.length + 1;
            },
            btnStyle() {
                const e = this.itemReveal(this.itemCount - 1);
                return {
                    opacity: e,
                    transform: `translateY(${(1 - e) * 30}px)`,
                    pointerEvents: e > 0.9 ? 'auto' : 'none',
                };
            },
        },
        mounted() {
            this.onScroll = () => {
                const rect = this.$el.getBoundingClientRect();
                const vh = window.innerHeight;
                const center = rect.top + rect.height / 2;
                let p = (vh - center) / (vh * 0.5);
                this.progress = Math.max(0, Math.min(1, p));
            };
            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            this.onScroll();
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onScroll);
        },
        methods: {
            itemReveal(index) {
                const win = 0.5;
                const step = this.itemCount > 1 ? (1 - win) / (this.itemCount - 1) : 0;
                const start = index * step;
                let local = (this.progress - start) / win;
                local = Math.max(0, Math.min(1, local));
                return 1 - Math.pow(1 - local, 3);
            },
            lineStyle(index) {
                const e = this.itemReveal(index);
                return {
                    opacity: e,
                    transform: `translateY(${(1 - e) * 0.8}em)`,
                    filter: `blur(${(1 - e) * 10}px)`,
                };
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #profile {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        z-index: 1;

        .shape-anchor {
            position: absolute;
            top: 12vh;
            left: 10vw;
            width: 40vh;
            height: 40vh;
        }

        h2 {
            margin-top: 4rem;
            text-align: center;
            font-family: 'tanpearl';
            font-size: 3rem;
            line-height: 1.4;
            z-index: 1;
        }

        p {
            margin-top: 2rem;
            text-align: center;
            font-size: 1.2rem;
            line-height: 1.5;
            font-family: 'basic_font';
        }

        h2 span,
        p span {
            display: block;
            will-change: opacity, transform, filter;
        }

        .btn-wrap {
            margin-top: 2rem;
            text-align: center;
            will-change: opacity, transform;
        }

        #text_marquee::v-deep {
            position: absolute;
            bottom: 0;
        }
    }
</style>