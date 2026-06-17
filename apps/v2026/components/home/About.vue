<template>
    <div id='about'>
        <div class='inner'>
            <section>
                <div class='shape-anchor' aria-hidden='true' />
                <h2>
                    <span
                        v-for='(line, i) in titleLines'
                        :key='"t1-" + i'
                        :style='lineStyle(i, 0)'
                        v-html='line'
                    />
                </h2>
                <p>
                    <span
                        v-for='(line, i) in descLines'
                        :key='"d1-" + i'
                        :style='lineStyle(titleLines.length + i, 0)'
                    >
                        {{ line }}
                    </span>
                </p>
            </section>
            <section>
                <div class='shape-anchor2' aria-hidden='true' />
                <h2>
                    <span
                        v-for='(line, i) in titleLines2'
                        :key='"t2-" + i'
                        :style='lineStyle(i, 1)'
                        v-html='line'
                    />
                </h2>
                <p>
                    <span
                        v-for='(line, i) in descLines2'
                        :key='"d2-" + i'
                        :style='lineStyle(titleLines2.length + i, 1)'
                    >
                        {{ line }}
                    </span>
                </p>
                <ParllaxComponent />
                <div class='btn-wrap' :style='btnStyle'>
                    <ButtonRound :link='{ href: "/", text: "About Me" }' />
                </div>
            </section>
        </div>
        <!-- <TextMarquee :image='knot' /> -->
    </div>
</template>

<script>
    import ParllaxComponent from '@/components/ParallaxComponent.vue';
    import ButtonRound from '@/components/ButtonRound.vue';
    import TextMarquee from '@/components/TextMarquee.vue';

    export default {
        name: 'About',
        components: {
            ParllaxComponent,
            ButtonRound,
            TextMarquee,
        },
        data() {
            return {
                sectionProgress: [0, 0],
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
                titleLines2: [
                    'As a <span class="highlight">frontend developer</span>, I create',
                    '<span class="highlight">interactive</span> websites and apps ',
                    'inspired by aesthetics and good ideas.',
                    'Creating new <span class="highlight">digital experiences</span>',
                    'beyond just obtaining information',
                    'with precision and <span class="highlight">scalability</span> is my strength.'
                ],
                descLines2: [
                    'I specialize in interactive development,',
                    '3D web experiences and AI coding.',
                    'Capable of both Vue.js and React.js,',
                    'for more ability and development skills,',
                    'you can view ‘About Me’ page.'
                ],
            };
        },
        computed: {
            section1ItemCount() {
                return this.titleLines.length + this.descLines.length;
            },
            section2ItemCount() {
                return this.titleLines2.length + this.descLines2.length;
            },
            btnStyle() {
                const progress = this.sectionProgress[1] || 0;
                const e = this.itemReveal(
                    this.section2ItemCount,
                    progress,
                    this.section2ItemCount + 1,
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
        position: relative;
        z-index: 1;

        .shape-anchor {
            position: absolute;
            top: 12vh;
            left: 10vw;
            width: 40vh;
            height: 40vh;
            opacity: 0;
            pointer-events: none;
        }

        section {
            position: relative;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            
            &:nth-of-type(1) {
                h2 {
                    margin-top: 12vw;

                    span {
                        font-family: 'tanpearl';
                        font-size: 3rem;
                        line-height: 1.4;
                    }
                }
            }

            &:nth-of-type(2) {
                .shape-anchor2 {
                    position: absolute;
                    top: 5vw;
                    right: 10vw;
                    width: 24vh;
                    height: 24vh;
                    opacity: 0;
                    pointer-events: none;
                }

                h2 {
                    margin-top: 6vw;
                    span::v-deep {
                        font-size: 3rem;
                        line-height: 1.4;

                        .highlight {
                            font-family: 'tanpearl';
                        }

                        &:nth-child(4),
                        &:nth-child(5),
                        &:nth-child(6) {
                            padding-left: 28vw;
                        }
                    }
                }

                p {
                    padding-left: 30vw;
                    text-align: left;
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

            h2 span,
            p span {
                display: block;
                will-change: opacity, transform, filter;
            }
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