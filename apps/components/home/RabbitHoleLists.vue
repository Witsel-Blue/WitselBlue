<template>
    <div
        id='rabbit-hole-lists'
        ref='root'
    >
        <canvas ref='canvas' />
    </div>
</template>

<script>
    import archiveData from '@/assets/data/archive.js';

    const CAMERA_Z = 50;
    const START_DIST = 270;
    const PASS_DIST = 80;
    const DEPTH_STEP = 100;
    const SPRITE_SCALE = { x: 24, y: 20 };
    const FOG_NEAR = 70;
    const FOG_FAR = 300;
    const LIST_INDEXES = [0, 2, 3, 4, 5, 9];

    const LIST_ITEMS = LIST_INDEXES
        .map((index) => archiveData[index])
        .filter(Boolean)
        .map((item) => ({
            img: item.images?.thumb,
            link: item.link?.href || '',
            target: item.link?.target || '_blank',
            slug: item.slug,
        }))
        .filter((item) => item.img);

    function getListTravelDepth(count = LIST_ITEMS.length) {
        const n = Math.max(count, 1);
        return START_DIST + PASS_DIST + (n - 1) * DEPTH_STEP;
    }

    export default {
        name: 'RabbitHoleLists',
        props: {
            scrollProgress: {
                type: Number,
                default: 0,
            },
            fogColor: {
                type: String,
                default: '#454545',
            },
            active: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                hovering: false,
            };
        },
        watch: {
            scrollProgress(value) {
                this.syncTargetZ(value);
            },
            fogColor(value) {
                if (this.fog) this.fog.color.set(value);
            },
            active(value) {
                if (value && !this.ready) this.initScene();
            },
        },
        mounted() {
            if (!process.client) return;

            this.three = null;
            this.renderer = null;
            this.scene = null;
            this.camera = null;
            this.boxGroup = null;
            this.fog = null;
            this.raycaster = null;
            this.pointer = null;
            this.rafId = null;
            this.ready = false;
            this.width = 0;
            this.height = 0;
            this.targetZ = 0;
            this.moveZ = 0;
            this.mouseX = 0;
            this.mouseY = 0;
            this.moveX = 0;
            this.moveY = 0;
            this.totalDepth = getListTravelDepth(LIST_ITEMS.length);
            this.startZ = CAMERA_Z - START_DIST;

            if (this.active) this.initScene();

            window.addEventListener('resize', this.onResize, { passive: true });
            window.addEventListener('pointermove', this.onPointerMove, {
                passive: true,
            });
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
            window.removeEventListener('pointermove', this.onPointerMove);
            const canvas = this.$refs.canvas;
            if (canvas) {
                canvas.removeEventListener('pointermove', this.onCanvasPointerMove);
                canvas.removeEventListener('click', this.onCanvasClick);
            }
            this.stopLoop();
            this.disposeScene();
        },
        methods: {
            clamp(value, min, max) {
                return Math.max(min, Math.min(max, value));
            },
            syncTargetZ(progress) {
                this.targetZ = this.clamp(progress, 0, 1) * this.totalDepth;
            },
            async initScene() {
                if (this.ready || this._initPromise) return this._initPromise;

                this._initPromise = (async () => {
                    const canvas = this.$refs.canvas;
                    if (!canvas) return;

                    const THREE = await import('three');
                    this.three = THREE;

                    const root = this.$refs.root;
                    this.width = root?.clientWidth || window.innerWidth;
                    this.height = root?.clientHeight || window.innerHeight;

                    this.scene = new THREE.Scene();
                    this.fog = new THREE.Fog(this.fogColor, FOG_NEAR, FOG_FAR);
                    this.scene.fog = this.fog;

                    this.camera = new THREE.PerspectiveCamera(
                        75,
                        this.width / Math.max(this.height, 1),
                        1,
                        1000,
                    );
                    this.camera.position.set(0, 0, CAMERA_Z);

                    this.renderer = new THREE.WebGLRenderer({
                        canvas,
                        antialias: true,
                        alpha: true,
                    });
                    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                    this.renderer.setSize(this.width, this.height, false);
                    this.renderer.setClearColor(0x000000, 0);
                    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

                    const hemi = new THREE.HemisphereLight(0xffffff, 0x080820, 0.85);
                    hemi.position.set(100, 100, 0);
                    this.scene.add(hemi);

                    const point = new THREE.PointLight(0xffffff, 0.45);
                    point.position.set(15, 15, 20);
                    this.scene.add(point);

                    this.boxGroup = new THREE.Object3D();
                    this.scene.add(this.boxGroup);

                    const loader = new THREE.TextureLoader();
                    LIST_ITEMS.forEach((item, index) => {
                        const texture = loader.load(item.img);
                        texture.colorSpace = THREE.SRGBColorSpace;
                        const material = new THREE.SpriteMaterial({
                            map: texture,
                            fog: true,
                            depthTest: true,
                            depthWrite: false,
                        });
                        const sprite = new THREE.Sprite(material);
                        sprite.scale.set(SPRITE_SCALE.x, SPRITE_SCALE.y, 1);
                        sprite.position.set(
                            Math.random() * 100 - 50,
                            Math.random() * 50 - 25,
                            this.startZ - index * DEPTH_STEP,
                        );
                        sprite.userData.link = item.link;
                        sprite.userData.target = item.target;
                        this.boxGroup.add(sprite);
                    });

                    this.raycaster = new THREE.Raycaster();
                    this.pointer = new THREE.Vector2();

                    canvas.addEventListener('pointermove', this.onCanvasPointerMove, {
                        passive: true,
                    });
                    canvas.addEventListener('click', this.onCanvasClick);

                    this.syncTargetZ(this.scrollProgress);
                    this.moveZ = this.targetZ;
                    this.ready = true;
                    this.startLoop();
                })();

                return this._initPromise;
            },
            startLoop() {
                if (this.rafId) return;
                const tick = () => {
                    this.rafId = requestAnimationFrame(tick);
                    this.renderFrame();
                };
                this.rafId = requestAnimationFrame(tick);
            },
            stopLoop() {
                if (!this.rafId) return;
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            },
            renderFrame() {
                if (!this.ready || !this.renderer || !this.boxGroup) return;

                this.moveZ += (this.targetZ - this.moveZ) * 0.08;
                this.boxGroup.position.z = this.moveZ;

                const cx = this.width * 0.5;
                const cy = this.height * 0.5;
                this.moveX += (this.mouseX - cx - this.moveX) * 0.05;
                this.moveY += (this.mouseY - cy - this.moveY) * 0.05;
                this.boxGroup.position.x = -(this.moveX / 50);
                this.boxGroup.position.y = this.moveY / 50;

                this.camera.lookAt(this.scene.position);
                this.renderer.render(this.scene, this.camera);
            },
            onResize() {
                if (!this.ready || !this.camera || !this.renderer) return;
                const root = this.$refs.root;
                this.width = root?.clientWidth || window.innerWidth;
                this.height = root?.clientHeight || window.innerHeight;
                this.camera.aspect = this.width / Math.max(this.height, 1);
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(this.width, this.height, false);
            },
            onPointerMove(event) {
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
            },
            hitTest(event) {
                if (!this.ready || !this.boxGroup) return null;

                const canvas = this.$refs.canvas;
                if (!canvas) return null;

                const rect = canvas.getBoundingClientRect();
                this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                this.raycaster.setFromCamera(this.pointer, this.camera);

                const hits = this.raycaster.intersectObjects(this.boxGroup.children, false);
                return hits[0]?.object || null;
            },
            onCanvasPointerMove(event) {
                const hit = this.hitTest(event);
                this.hovering = Boolean(hit);
                const canvas = this.$refs.canvas;
                if (canvas) {
                    canvas.style.cursor = hit ? 'pointer' : 'auto';
                }
            },
            onCanvasClick(event) {
                const hit = this.hitTest(event);
                const link = hit?.userData?.link;
                if (!link) return;
                const target = hit.userData.target || '_blank';
                window.open(link, target, 'noopener,noreferrer');
            },
            disposeScene() {
                this.ready = false;
                this._initPromise = null;

                if (this.boxGroup) {
                    this.boxGroup.children.forEach((sprite) => {
                        sprite.material?.map?.dispose?.();
                        sprite.material?.dispose?.();
                    });
                }

                this.renderer?.dispose?.();
                this.renderer = null;
                this.scene = null;
                this.camera = null;
                this.boxGroup = null;
                this.fog = null;
                this.raycaster = null;
                this.pointer = null;
                this.three = null;
            },
        },
    };
</script>

<style lang='scss' scoped>
    #rabbit-hole-lists {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;

        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
</style>
