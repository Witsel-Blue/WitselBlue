<template>
    <div id='folding-screen'>
        <section>
            <div class='inner'>
                <p>
                    <span
                        v-for='(line, i) in textLines'
                        :key='i'
                        :style='lineStyle(i)'
                    >
                        {{ line }}
                    </span>
                </p>
            </div>
        </section>
        <section ref='zoomSection' class='folding-zoom'>
            <div class='folding-zoom-viewport'>
                <canvas ref='zoomCanvas' />
            </div>
            <div class='folding-zoom-trail' aria-hidden='true' />
        </section>
    </div>
</template>

<script>
    import waveUrl from '@/assets/img/home/wave.svg';
    import treeUrl from '@/assets/img/home/tree.svg';
    import mountain1Url from '@/assets/img/home/mountain1.svg';
    import mountain2Url from '@/assets/img/home/mountain2.svg';
    import mountain3Url from '@/assets/img/home/mountain3.svg';
    import moonUrl from '@/assets/img/home/moon.svg';

    const DEPTH_NUM = 20;
    const ZOOM_SCROLL_VH = 5;
    const ZOOM_Z_MULT = 1;
    const ZOOM_SCALE_START = 0.4;
    const ZOOM_SCALE_END = 1.2;
    const LAYER_LERP = 0.02;

    // 앞(가까움) → 뒤(멀음)
    const LAYERS = [
        { url: waveUrl, y: -1, scale: [160, 100] },
        { url: treeUrl, y: -2.5, scale: [160, 100] },
        { url: mountain1Url, y: 0, scale: [180, 80] },
        { url: mountain2Url, y: 5, scale: [150, 90] },
        { url: mountain3Url, y: 10, scale: [160, 110] },
        { url: moonUrl, y: 30, scale: [160, 100] },
    ];

    export default {
        name: 'FoldingScreen',
        data() {
            return {
                sectionProgress: 0,
                textLines: ['And yet...', "the crafting doesn't end."],
            };
        },
        mounted() {
            this.onScroll = () => {
                this.updateTextReveal();
                this.updateZoomScroll();
            };
            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onScroll, { passive: true });
            window.addEventListener('resize', this.onZoomResize, { passive: true });
            this.onScroll();
            this.$nextTick(() => this.initZoomScene());
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('resize', this.onScroll);
            window.removeEventListener('resize', this.onZoomResize);
            this.disposeZoomScene();
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
            lineStyle(index) {
                const e = this.itemReveal(
                    index,
                    this.sectionProgress,
                    this.textLines.length,
                );
                return {
                    opacity: 0.18 + 0.82 * e,
                    transform: `translateY(${(1 - e) * 0.7}em)`,
                    filter: `blur(${(1 - e) * 14}px)`,
                };
            },
            updateTextReveal() {
                const section = this.$el.querySelector('section');
                if (!section) return;

                const rect = section.getBoundingClientRect();
                const vh = window.innerHeight;
                const center = rect.top + rect.height / 2;
                const p = (vh - center) / (vh * 0.5);
                this.sectionProgress = Math.max(0, Math.min(1, p));
            },
            async initZoomScene() {
                const canvas = this.$refs.zoomCanvas;
                const section = this.$refs.zoomSection;
                if (!canvas || !section || this.zoomReady) return;

                section.style.setProperty(
                    '--fold-zoom-vh',
                    String(ZOOM_SCROLL_VH),
                );

                const THREE = await import('three');
                this.three = THREE;

                const w = canvas.clientWidth;
                const h = canvas.clientHeight;

                const scene = new THREE.Scene();
                const camera = new THREE.PerspectiveCamera(75, w / h, 5, 1000);
                camera.position.set(0, 0, 50);

                const renderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                });
                renderer.setSize(w, h);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                const light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
                light.position.set(100, 100, 0);
                scene.add(light);

                const point = new THREE.PointLight(0xffffff, 0.4);
                point.position.set(15, 15, 20);
                scene.add(point);

                const boxGroup = new THREE.Object3D();
                const loader = new THREE.TextureLoader();
                const totalNum = LAYERS.length - 1;
                const maxTargetZ =
                    ((totalNum * DEPTH_NUM) / 10) * ZOOM_Z_MULT;
                const zoomSprites = [];

                LAYERS.forEach((layer, i) => {
                    const tex = loader.load(layer.url);
                    tex.colorSpace = THREE.SRGBColorSpace;
                    const material = new THREE.SpriteMaterial({
                        map: tex,
                        transparent: true,
                    });
                    const sprite = new THREE.Sprite(material);
                    sprite.userData.baseScale = [...layer.scale];
                    sprite.position.set(0, layer.y, -i * DEPTH_NUM);
                    boxGroup.add(sprite);
                    zoomSprites.push(sprite);
                });

                const applyZoomScale = (t) => {
                    const mul =
                        ZOOM_SCALE_START +
                        (ZOOM_SCALE_END - ZOOM_SCALE_START) * t;
                    zoomSprites.forEach((sprite) => {
                        const [bx, by] = sprite.userData.baseScale;
                        sprite.scale.set(bx * mul, by * mul, 1);
                    });
                };
                applyZoomScale(0);

                scene.add(boxGroup);

                this.zoomScene = scene;
                this.zoomCamera = camera;
                this.zoomRenderer = renderer;
                this.zoomGroup = boxGroup;
                this.zoomTargetZ = 0;
                this.zoomMoveZ = 0;
                this.zoomMaxTargetZ = maxTargetZ;
                this.zoomReady = true;

                const frame = () => {
                    this.zoomMoveZ +=
                        (this.zoomTargetZ - this.zoomMoveZ) * LAYER_LERP;
                    boxGroup.position.z = this.zoomMoveZ;

                    const t =
                        this.zoomMaxTargetZ > 0
                            ? this.zoomMoveZ / this.zoomMaxTargetZ
                            : 0;
                    applyZoomScale(t);

                    camera.lookAt(scene.position);
                    renderer.render(scene, camera);
                    this.zoomRaf = requestAnimationFrame(frame);
                };
                this.zoomRaf = requestAnimationFrame(frame);
                this.updateZoomScroll();
            },
            updateZoomScroll() {
                if (!this.zoomReady) return;

                const section = this.$refs.zoomSection;
                if (!section) return;

                const rect = section.getBoundingClientRect();
                const vh = window.innerHeight;
                const trailPx = ZOOM_SCROLL_VH * vh;
                const sectionScroll = Math.max(0, -rect.top);
                const progress = Math.min(1, sectionScroll / trailPx);

                this.zoomTargetZ = progress * this.zoomMaxTargetZ;
            },
            onZoomResize() {
                const canvas = this.$refs.zoomCanvas;
                if (!canvas || !this.zoomRenderer || !this.zoomCamera) return;

                const w = canvas.clientWidth;
                const h = canvas.clientHeight;
                this.zoomCamera.aspect = w / h;
                this.zoomCamera.updateProjectionMatrix();
                this.zoomRenderer.setSize(w, h);
            },
            disposeZoomScene() {
                if (this.zoomRaf) cancelAnimationFrame(this.zoomRaf);
                if (this.zoomRenderer) this.zoomRenderer.dispose();
                this.zoomReady = false;
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #folding-screen {
        width: 100%;

        section:nth-of-type(1) {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;

            p {
                font-size: 0.75rem;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                text-align: center;

                span {
                    display: block;
                    will-change: opacity, transform, filter;

                    &:nth-child(2) {
                        margin-top: 2rem;
                    }
                }
            }
        }

        .folding-zoom {
            position: relative;
            width: 100%;

            .folding-zoom-viewport {
                position: sticky;
                top: 0;
                width: 100%;
                height: 100vh;
                z-index: 1;
            }

            .folding-zoom-trail {
                height: calc(var(--fold-zoom-vh, 5) * 100vh);
                pointer-events: none;
            }

            canvas {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
