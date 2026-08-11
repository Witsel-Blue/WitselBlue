<template>
    <div id='about'>
        <div class='inner-l'>
            <section>
                <div class='shape-anchor' aria-hidden='true' />
                <div class='text-wrap'>
                    <h2>
                        <span
                            v-for='(line, i) in titleLines'
                            :key='"t1-" + i'
                            :style='lineStyle(i, 0)'
                            v-html='line'
                        />
                    </h2>
                </div>
            </section>
            <section>
                <div class='shape-anchor2' aria-hidden='true' />
                <div class='text-wrap'>
                    <p>
                        <span
                            v-for='(line, i) in descLines'
                            :key='"d1-" + i'
                            :style='lineStyle(i, 1)'
                        >
                            {{ line }}
                        </span>
                    </p>
                    <div class='btn-wrap' :style='btnStyle'>
                        <ButtonRound :link='{ href: "/aboutme", text: "About Me" }' />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import ButtonRound from '@/components/common/ButtonRound.vue';

    export default {
        name: 'About',
        components: {
            ButtonRound,
        },
        data() {
            return {
                sectionProgress: [0, 0],
                titleLines: [
                    'Mother of pearl radiates different colors',
                    'depending on the angles of light.',
                ],
                descLines: [
                    'My development philosophy is also similar to mother-of-pearl,',
                    'which provides new experiences to users every time',
                    'depending on the point where technology and senses meet.',
                ],
                titleLines2: [],
                descLines2: [],
            };
        },
        computed: {
            section1ItemCount() {
                return this.titleLines.length + this.descLines.length;
            },
            section2ItemCount() {
                return this.titleLines2.length + this.descLines2.length || this.descLines.length;
            },
            section2RevealCount() {
                return this.section2ItemCount + 2;
            },
            btnStyle() {
                const progress = this.sectionProgress[1] || 0;
                const e = this.itemReveal(
                    this.section2ItemCount + 1,
                    progress,
                    this.section2RevealCount,
                );
                return {
                    opacity: e,
                    transform: `translateY(${(1 - e) * 30}px)`,
                    pointerEvents: e > 0.9 ? 'auto' : 'none',
                };
            },
        },
        mounted() {
            this.onScroll = () => {
                const sections = this.$el.querySelectorAll('section');
                this.sectionProgress = Array.from(sections).map((section) => {
                    const rect = section.getBoundingClientRect();
                    const vh = window.innerHeight;
                    const center = rect.top + rect.height / 2;
                    const p = (vh - center) / (vh * 0.5);
                    return Math.max(0, Math.min(1, p));
                });
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
            easeInOut(t) {
                return t < 0.5
                    ? 4 * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            },
            itemReveal(index, progress, itemCount) {
                const win = 0.65;
                const step =
                    itemCount > 1 ? (1 - win) / (itemCount - 1) : 0;
                const start = index * step;
                let local = (progress - start) / win;
                local = Math.max(0, Math.min(1, local));
                return this.easeInOut(local);
            },
            lineStyle(index, sectionIndex = 0) {
                const progress = this.sectionProgress[sectionIndex] || 0;
                const itemCount =
                    sectionIndex === 0
                        ? this.section1ItemCount
                        : this.section2ItemCount;
                const e = this.itemReveal(index, progress, itemCount);
                return {
                    opacity: 0.18 + 0.82 * e,
                    transform: `translateY(${(1 - e) * 0.7}em)`,
                    filter: `blur(${(1 - e) * 14}px)`,
                };
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #about {
        width: 100%;
        display: flex;

        section {
            position: relative;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            
            &:nth-of-type(1) {
                .shape-anchor {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 50vh;
                    height: 50vh;
                    opacity: 0;
                    pointer-events: none;
                }
            }

            &:nth-of-type(2) {    
                .shape-anchor2 {
                    position: absolute;
                    top: 40%;
                    right: 50%;
                    transform: translate(50%, -50%);
                    width: 70vh;
                    height: 70vh;
                    opacity: 0;
                    pointer-events: none;
                }
            }
        }

        .text-wrap {
            padding-top: 40vh;
            position: sticky;
            bottom: 20vh;
            text-align: center;
            z-index: 1;

            h2 {
                // text-shadow: $text-shadow;
                z-index: 1;

                span {
                    font-family: 'tanpearl';
                    font-size: 3rem;
                    line-height: 1.4;
                }
            }

            p {
                margin-top: 2rem;
                text-align: center;
                        
                span {
                    font-size: 1.2rem;
                    line-height: 1.5;
                    font-family: 'basic_font';
                }
            }

            .btn-wrap {
                margin-top: 2rem;
            }
        }

        h2 span,
        p span {
            display: block;
            will-change: opacity, transform, filter;
        }
    }
</style>