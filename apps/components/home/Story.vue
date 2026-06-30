<template>
    <div id='story'>
        <section>
            <div class='inner'>
                <TextStagger
                    :paragraphs='introParagraphs'
                    speed-mode='slow'
                />
                <p>
                    Explore and discover my journey as a developer.
                </p>
            </div>
        </section>
        <section>
            <div class='inner'>
                <div ref='storyTrack' class='story-track'>
                    <div
                        v-for='(slot, i) in storySlots'
                        :key='slot.key'
                        class='story-slot'
                    >
                        <article v-if='slot.item' class='story-card'>
                            <p class='story-card__progress'>
                                <span :style='lineStyle(i, 0)'>{{ slot.item.progress }}</span>
                            </p>
                            <h3 class='story-card__title'>
                                <span :style='lineStyle(i, 1)'>{{ slot.item.title }}</span>
                            </h3>
                            <p class='story-card__company'>
                                <span :style='lineStyle(i, 2)'>{{ slot.item.company }}</span>
                            </p>
                            <p class='story-card__desc'>
                                <span :style='lineStyle(i, 3)'>{{ slot.item.desc }}</span>
                            </p>
                            <p class='story-card__skills'>
                                <span :style='lineStyle(i, 4)'>{{ slot.item.skills }}</span>
                            </p>
                            <p class='story-card__year'>
                                <span :style='lineStyle(i, 5)'>{{ slot.item.year }}</span>
                            </p>
                        </article>
                    </div>
                </div>
                <div ref='line' class='line'>
                    <div class='line__fill' :style='fillStyle' />
                </div>
                <div class='sphere-column'>
                    <div class='sphere-spacer' aria-hidden='true' />
                    <div class='sphere-sticky'>
                        <canvas ref='sphereCanvas' class='sphere-canvas' />
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import TextStagger from '@/components/TextStagger.vue';

    const CARD_LINE_COUNT = 6;

    export default {
        name: 'Story',
        components: {
            TextStagger,
        },
        data() {
            return {
                introParagraphs: [
                    'When People look for pearls,',
                    'I find value in the shell.',
                ],
                fillHeight: 0,
                slotProgress: [0, 0, 0, 0],
                storyData: [
                    {
                        id: 1,
                        progress: '줄음질',
                        title: 'Design and Development Education',
                        company: 'SBS Academy',
                        desc: 'Learned general planning, design, publishing of web development.',
                        skills: 'Photoshop / Illustrator / HTML / CSS',
                        year: '2020'
                    },
                    {
                        id: 2,
                        progress: '끊음질',
                        title: 'Web Agency',
                        company: 'Skunkworks Studio',
                        desc: 'Frontend developer activities in a startup web agency company. I joined the company as a new hire and took sole responsibility for the entire frontend, building about eight new websites from scratch.',
                        skills: 'Drupal / HTML / CSS / jQuery / GSAP',
                        year: 'April 2021 - April 2022',
                    },
                    {
                        id: 3,
                        progress: '모조법',
                        title: 'Major Company Project',
                        company: 'Lisn Design',
                        desc: 'Participated as a team member in the renewal of the Samsung Card Monimo app. Collaborated with a team of five developers to revamp over 1,400 pages within the project timeframe. Specifically responsible for redesigning the main card page using technologies such as Lottie and Swiper.',
                        skills: 'Vue / Nuxt / SCSS / javascript / Storybook / Lottie',
                        year: 'June 2024 - November 2024',
                    },
                    {
                        id: 4,
                        progress: '타발법',
                        title: '3D Configurator',
                        company: 'Higgs Company',
                        desc: 'Footwear sales startup. Proposed using a 3D configurator tool instead of traditional sketch-based planning; single-handedly managed the entire process—including planning, design, and development. Established workflows and reporting systems. Trained junior front-end staff.',
                        skills: 'React / Next /SCSS / three.js / GSAP / Lottie',
                        year: 'January 2026 - April 2026',
                    }
                ]
            };
        },
        computed: {
            storySlots() {
                return this.storyData.map((item) => ({
                    key: item.id,
                    item,
                }));
            },
            fillStyle() {
                return {
                    height: `${this.fillHeight}px`,
                };
            },
        },
        mounted() {
            if (process.client) {
                this.$nextTick(() => this.initSphere());
            }

            this.onScroll = () => {
                const line = this.$refs.line;
                if (!line) return;

                const sectionRect = this.$el.getBoundingClientRect();
                const lineRect = line.getBoundingClientRect();
                const vh = window.innerHeight;
                const centerY = vh * 0.5;

                const total = this.$el.offsetHeight - vh;
                const scrolled = Math.max(0, -sectionRect.top);
                const progress =
                    total > 0 ? Math.max(0, Math.min(1, scrolled / total)) : 0;

                const maxFill = Math.max(
                    0,
                    Math.min(lineRect.height, centerY - lineRect.top),
                );
                this.fillHeight = progress * maxFill;

                const track = this.$refs.storyTrack;
                if (track) {
                    const slots = track.querySelectorAll('.story-slot');
                    this.slotProgress = Array.from(slots).map((slot) => {
                        const rect = slot.getBoundingClientRect();
                        const slotCenter = rect.top + rect.height / 2;
                        const range = vh * 0.5;
                        const p = (vh - slotCenter) / range;
                        return Math.max(0, Math.min(1, p));
                    });
                }
            };

            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            this.onScroll();
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onScroll);
            this.destroySphere();
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
            lineStyle(slotIndex, lineIndex) {
                const progress = this.slotProgress[slotIndex] || 0;
                const e = this.itemReveal(
                    lineIndex,
                    progress,
                    CARD_LINE_COUNT,
                );
                return {
                    opacity: 0.18 + 0.82 * e,
                    transform: `translateY(${(1 - e) * 0.7}em)`,
                    filter: `blur(${(1 - e) * 14}px)`,
                };
            },
            async initSphere() {
                const canvas = this.$refs.sphereCanvas;
                if (!canvas) return;

                const THREE = await import('three');
                const { RoomEnvironment } = await import(
                    'three/examples/jsm/environments/RoomEnvironment.js'
                );

                this.three = THREE;

                const w = canvas.clientWidth || 280;
                const h = canvas.clientHeight || 280;

                this.sphereRenderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                });
                this.sphereRenderer.setSize(w, h);
                this.sphereRenderer.setPixelRatio(
                    Math.min(window.devicePixelRatio, 2),
                );
                this.sphereRenderer.outputColorSpace = THREE.SRGBColorSpace;
                this.sphereRenderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.sphereRenderer.toneMappingExposure = 0.9;

                this.sphereScene = new THREE.Scene();

                const pmrem = new THREE.PMREMGenerator(this.sphereRenderer);
                this.sphereEnvMap = pmrem
                    .fromScene(new RoomEnvironment(), 0.04)
                    .texture;
                this.sphereScene.environment = this.sphereEnvMap;
                pmrem.dispose();

                if ('environmentIntensity' in this.sphereScene) {
                    this.sphereScene.environmentIntensity = 0.85;
                }

                const key = new THREE.DirectionalLight(0xffffff, 1.1);
                key.position.set(2.5, 4, 3);
                this.sphereScene.add(key);
                this.sphereScene.add(new THREE.AmbientLight(0xffffff, 0.12));

                this.sphereCamera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
                this.sphereCamera.position.set(0, 0, 3.2);

                const geometry = new THREE.SphereGeometry(1, 64, 64);
                this.sphereMaterial = new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(0xece8da),
                    metalness: 1,
                    roughness: 0.18,
                    envMapIntensity: 1.2,
                    clearcoat: 1,
                    clearcoatRoughness: 0.08,
                });
                this.sphereMesh = new THREE.Mesh(geometry, this.sphereMaterial);
                this.sphereScene.add(this.sphereMesh);

                this.sphereVisible = true;
                this.sphereAnimate();

                this.onSphereResize = () => {
                    const cw = canvas.clientWidth;
                    const ch = canvas.clientHeight;
                    if (!cw || !ch) return;
                    this.sphereCamera.aspect = cw / ch;
                    this.sphereCamera.updateProjectionMatrix();
                    this.sphereRenderer.setSize(cw, ch);
                };
                window.addEventListener('resize', this.onSphereResize, {
                    passive: true,
                });

                this.sphereObserver = new IntersectionObserver(
                    ([entry]) => {
                        this.sphereVisible = entry.isIntersecting;
                    },
                    { threshold: 0.05 },
                );
                this.sphereObserver.observe(
                    canvas.closest('.sphere-column') || canvas,
                );
            },

            sphereAnimate() {
                const frame = (time) => {
                    this.sphereRaf = requestAnimationFrame(frame);
                    if (
                        !this.sphereVisible ||
                        !this.sphereRenderer ||
                        !this.sphereMesh
                    ) {
                        return;
                    }

                    const t = time * 0.001;
                    this.sphereMesh.rotation.y = t * 0.35;
                    this.sphereMesh.rotation.x = Math.sin(t * 0.25) * 0.12;
                    this.sphereRenderer.render(
                        this.sphereScene,
                        this.sphereCamera,
                    );
                };
                this.sphereRaf = requestAnimationFrame(frame);
            },

            destroySphere() {
                if (this.sphereRaf) cancelAnimationFrame(this.sphereRaf);
                if (this.sphereObserver) this.sphereObserver.disconnect();
                if (this.onSphereResize) {
                    window.removeEventListener('resize', this.onSphereResize);
                }
                if (this.sphereMesh?.geometry) {
                    this.sphereMesh.geometry.dispose();
                }
                if (this.sphereMaterial) this.sphereMaterial.dispose();
                if (this.sphereEnvMap) this.sphereEnvMap.dispose();
                if (this.sphereRenderer) this.sphereRenderer.dispose();
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #story {
        width: 100%;
        height: 200vh;

        section:first-child {
            margin: 20vh 0;
            
            .inner {
                height: 100%;
                text-align: center;

                #text-stagger::v-deep {

                    p {
                        font-family: "tanpearl";
                        font-size: 3rem;
                        line-height: 1.4;
                    }
                }

                p {
                    margin-top: 2rem;
                }
            }
        }

        section:last-child {
            height: 100%;

            .inner {
                height: 100%;
                display: flex;
                justify-content: center;
                position: relative;

                .story-track {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: min(44vw, 440px);
                    height: 100%;
                    transform: translateX(calc(-100% - 2.5rem));
                    display: flex;
                    flex-direction: column;
                }

                .story-slot {
                    flex: 0 0 25%;
                    height: 25%;
                    display: flex;
                    align-items: center;
                }

                .story-card {
                    p span,
                    h3 span {
                        display: block;
                        will-change: opacity, transform, filter;
                    }

                    &__progress {
                        font-size: 0.75rem;
                        letter-spacing: 0.08em;
                        color: $gray2;
                        margin-bottom: 0.35rem;
                    }

                    &__title {
                        font-family: $ft-tanpearl;
                        font-size: 1.25rem;
                        line-height: 1.3;
                        margin-bottom: 0.25rem;
                    }

                    &__company {
                        font-size: 0.875rem;
                        color: $gray1;
                        margin-bottom: 0.5rem;
                    }

                    &__desc {
                        font-size: 0.8125rem;
                        line-height: 1.55;
                        color: $gray2;
                        margin-bottom: 0.5rem;
                    }

                    &__skills {
                        font-size: 0.75rem;
                        color: $gray1;
                        margin-bottom: 0.25rem;
                    }

                    &__year {
                        font-size: 0.75rem;
                        color: $gray2;
                    }
                }

                .sphere-column {
                    position: absolute;
                    top: 0;
                    left: calc(50% + 10rem);
                    width: min(40vw, 400px);
                    height: 100%;
                    pointer-events: none;

                    .sphere-spacer {
                        height: 5rem;
                    }

                    .sphere-sticky {
                        position: sticky;
                        top: calc(50vh - min(20vw, 200px));
                        width: min(40vw, 400px);
                        height: min(40vw, 400px);

                        .sphere-canvas {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                }

                .line {
                    width: 1px;
                    height: 100%;
                    background-color: $gray3;
                    position: relative;

                    &__fill {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        background-color: $white;
                        will-change: height;

                        &::after {
                            content: '';
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            transform: translate(-50%, 50%);
                            width: 10px;
                            height: 10px;
                            background-color: $white;
                            border-radius: 50%;
                        }
                    }
                }
            }
        }
    }
</style>
