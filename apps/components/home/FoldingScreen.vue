<template>
    <div id='folding-screen'>
        <canvas ref='zoomCanvas' aria-hidden='true' />
        <div class='folding-copy'>
            <p
                v-for='(line, i) in copyLines'
                :key='"fold-line-" + i'
                :style='copyLineStyle(i)'
            >
                {{ line }}
            </p>
        </div>
    </div>
</template>

<script>
    import treeUrl from '@/assets/img/home/tree.svg';
    import mountain1Url from '@/assets/img/home/mountain1.svg';
    import mountain2Url from '@/assets/img/home/mountain2.svg';
    import mountain3Url from '@/assets/img/home/mountain3.svg';
    import moonUrl from '@/assets/img/home/moon.svg';

    const DEPTH_NUM = 10;
    const ZOOM_Z_MULT = 2;
    const ZOOM_SCALE_START = 0.4;
    const ZOOM_SCALE_END = 1;
    const LAYER_LERP = 0.1;
    const LAYER_LERP_FINISH = 0.2;

    const LAYERS = [
        { url: treeUrl, y: -12, scale: [140, 80], revealOrder: 0 },
        { url: mountain1Url, y: -10, scale: [180, 70], revealOrder: 1 },
        { url: mountain2Url, y: -9, scale: [150, 75], revealOrder: 2 },
        { url: mountain3Url, y: -1, scale: [180, 140], revealOrder: 3 },
        { url: moonUrl, y: 15, scale: [160, 100], revealOrder: 4 },
    ];
    const REVEAL_WIN = 0.3;
    const COPY_IN_START = 0.6;
    const COPY_IN_WIN = 0.08;
    const COPY_IN_GAP = 0.07;
    const COPY_HOLD_MS = 1200;
    const COPY_FADE_MS = 500;

    export default {
        name: 'FoldingScreen',
        props: {
            scrollProgress: {
                type: Number,
                default: 0,
            },
            layerReveal: {
                type: Number,
                default: 0,
            },
            active: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                zoomVisual: 0,
                copyNow: 0,
                copyHoldStartedAt: 0,
            };
        },
        computed: {
            copyLines() {
                const lines = this.$t('home.foldingCopyLines');
                return Array.isArray(lines) ? lines : [lines];
            },
        },
        watch: {
            scrollProgress() {
                this.syncZoomFromProgress();
            },
            layerReveal() {
                this.syncLayerOpacity();
            },
            active(value) {
                if (value && !this.zoomReady) this.initZoomScene();
            },
        },
        mounted() {
            if (!process.client) return;

            window.addEventListener('resize', this.onZoomResize, { passive: true });
            if (this.active) this.initZoomScene();
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onZoomResize);
            this.disposeZoomScene();
        },
        methods: {
            clamp(value, min, max) {
                return Math.max(min, Math.min(max, value));
            },
            copyLineStyle(index) {
                const p = this.zoomVisual;
                const start = COPY_IN_START + index * COPY_IN_GAP;
                const enter = this.clamp((p - start) / COPY_IN_WIN, 0, 1);
                const hide = this.copyHideAmount();
                const visible = enter * (1 - hide);

                return {
                    opacity: visible,
                    transform: `translateY(${(1 - enter) * 0.6}em)`,
                    filter: `blur(${((1 - enter) + hide) * 10}px)`,
                };
            },
            copyAllInAt() {
                const lines = Math.max(this.copyLines?.length || 1, 1);
                return COPY_IN_START + (lines - 1) * COPY_IN_GAP + COPY_IN_WIN;
            },
            copyHideAmount() {
                if (!this.copyHoldStartedAt) return 0;

                const elapsed = this.copyNow - this.copyHoldStartedAt;
                if (elapsed < COPY_HOLD_MS) return 0;

                return this.clamp(
                    (elapsed - COPY_HOLD_MS) / COPY_FADE_MS,
                    0,
                    1,
                );
            },
            updateCopyHold(now) {
                this.copyNow = now;
                if (this.zoomVisual >= this.copyAllInAt()) {
                    if (!this.copyHoldStartedAt) this.copyHoldStartedAt = now;
                    return;
                }

                this.copyHoldStartedAt = 0;
            },
            syncZoomFromProgress() {
                if (!this.zoomReady) return;
                const t = this.clamp(this.scrollProgress, 0, 1);
                this.zoomTargetZ = t * this.zoomMaxTargetZ;
            },
            syncLayerOpacity(force = false) {
                if (!this.zoomSprites) return;

                const reveal = this.clamp(this.layerReveal, 0, 1);
                const lastOrder = LAYERS.length - 1;
                const step = lastOrder > 0 ? (1 - REVEAL_WIN) / lastOrder : 0;

                this.zoomSprites.forEach((sprite) => {
                    const order = sprite.userData.revealOrder ?? 0;
                    const local = this.clamp(
                        (reveal - order * step) / REVEAL_WIN,
                        0,
                        1,
                    );
                    const eased = local * local * (3 - 2 * local);
                    const prev = sprite.userData.revealOpacity ?? 0;
                    const next = force ? eased : prev + (eased - prev) * 0.08;
                    sprite.userData.revealOpacity = next;

                    const base = sprite.userData.baseOpacity ?? 1;
                    sprite.material.opacity = base * next;
                    sprite.visible = next > 0.001;
                });
            },
            async initZoomScene() {
                const canvas = this.$refs.zoomCanvas;
                if (!canvas || this.zoomReady || this._initPromise) return;

                this._initPromise = (async () => {
                    const THREE = await import('three');
                    this.three = THREE;

                    const w = canvas.clientWidth || window.innerWidth;
                    const h = canvas.clientHeight || window.innerHeight;

                    const scene = new THREE.Scene();
                    const camera = new THREE.PerspectiveCamera(
                        75,
                        w / Math.max(h, 1),
                        5,
                        1000,
                    );
                    camera.position.set(0, 0, 50);

                    const renderer = new THREE.WebGLRenderer({
                        canvas,
                        antialias: true,
                        alpha: true,
                    });
                    renderer.setSize(w, h, false);
                    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                    renderer.setClearColor(0x000000, 0);

                    const light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
                    light.position.set(100, 100, 0);
                    scene.add(light);

                    const point = new THREE.PointLight(0xffffff, 0.4);
                    point.position.set(15, 15, 20);
                    scene.add(point);

                    const boxGroup = new THREE.Object3D();
                    const loader = new THREE.TextureLoader();
                    const totalNum = LAYERS.length - 1;
                    const maxTargetZ = ((totalNum * DEPTH_NUM) / 10) * ZOOM_Z_MULT;
                    const zoomSprites = [];

                    LAYERS.forEach((layer, i) => {
                        const tex = loader.load(layer.url);
                        tex.colorSpace = THREE.SRGBColorSpace;
                        const material = new THREE.SpriteMaterial({
                            map: tex,
                            transparent: true,
                            opacity: layer.opacity ?? 1,
                            depthWrite: false,
                        });
                        const sprite = new THREE.Sprite(material);
                        sprite.userData.baseScale = [...layer.scale];
                        sprite.userData.baseOpacity = layer.opacity ?? 1;
                        sprite.userData.revealOrder = layer.revealOrder ?? i;
                        sprite.userData.revealOpacity = 0;
                        sprite.material.opacity = 0;
                        sprite.visible = false;
                        sprite.position.set(0, layer.y, -i * DEPTH_NUM);
                        boxGroup.add(sprite);
                        zoomSprites.push(sprite);
                    });

                    const applyZoomScale = (t) => {
                        const mul =
                            ZOOM_SCALE_START
                            + (ZOOM_SCALE_END - ZOOM_SCALE_START) * t;
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
                    this.zoomSprites = zoomSprites;
                    this.zoomTargetZ = 0;
                    this.zoomMoveZ = 0;
                    this.zoomMaxTargetZ = maxTargetZ;
                    this.zoomReady = true;

                    const frame = () => {
                        const progress = this.clamp(this.scrollProgress, 0, 1);
                        const lerp = progress > 0.88 ? LAYER_LERP_FINISH : LAYER_LERP;
                        this.zoomMoveZ += (this.zoomTargetZ - this.zoomMoveZ) * lerp;
                        if (progress >= 0.995) this.zoomMoveZ = this.zoomTargetZ;
                        boxGroup.position.z = this.zoomMoveZ;

                        const t =
                            this.zoomMaxTargetZ > 0
                                ? this.zoomMoveZ / this.zoomMaxTargetZ
                                : 0;
                        this.zoomVisual = this.clamp(t, 0, 1);
                        this.updateCopyHold(performance.now());
                        applyZoomScale(t);
                        this.syncLayerOpacity();

                        camera.lookAt(scene.position);
                        renderer.render(scene, camera);
                        this.zoomRaf = requestAnimationFrame(frame);
                    };
                    this.zoomRaf = requestAnimationFrame(frame);
                    this.syncZoomFromProgress();
                    this.onZoomResize();
                })();

                return this._initPromise;
            },
            onZoomResize() {
                const canvas = this.$refs.zoomCanvas;
                if (!canvas || !this.zoomRenderer || !this.zoomCamera) return;

                const w = canvas.clientWidth || window.innerWidth;
                const h = canvas.clientHeight || window.innerHeight;
                this.zoomCamera.aspect = w / Math.max(h, 1);
                this.zoomCamera.updateProjectionMatrix();
                this.zoomRenderer.setSize(w, h, false);
            },
            disposeZoomScene() {
                if (this.zoomRaf) cancelAnimationFrame(this.zoomRaf);
                this.zoomRenderer?.dispose?.();
                this.zoomReady = false;
                this._initPromise = null;
                this.zoomRenderer = null;
                this.zoomScene = null;
                this.zoomCamera = null;
                this.zoomGroup = null;
                this.zoomSprites = null;
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #folding-screen {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;

        canvas {
            position: relative;
            z-index: 0;
            display: block;
            width: 100%;
            height: 100%;
        }

        .folding-copy {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 2;
            width: min(86vw, 720px);
            text-align: center;
            transform: translate(-50%, -50%);
            pointer-events: none;

            p {
                display: block;
                font-family: $ft-orangeavenue, $ft-sungkokserif;
                font-size: clamp(1.6rem, 4vw, 3rem);
                line-height: 1.35;
                color: $black;
                text-shadow: $text-shadow;
                will-change: opacity, transform, filter;
            }
        }
    }
</style>
