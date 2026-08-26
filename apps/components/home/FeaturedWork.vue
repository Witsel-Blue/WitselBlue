<template>
    <div id='featured-work'>
        <section
            ref='wipingSection'
            class='wiping-surface'
            :class='{
                "is-active": isWipeActive,
                "is-complete": isComplete,
            }'
        >
            <p v-if='!isComplete' class='hint'>Move cursor to wipe the surface</p>
            <canvas
                ref='canvas'
                aria-label='Move the pointer to cover the canvas'
                @pointerenter='onPointerEnter'
                @pointermove='onPointerMove'
                @pointerleave='onPointerLeave'
            />
        </section>
        <section ref='modelSection' class='nacre-box'>
            <canvas ref='modelCanvas' aria-label='Nacre box 3D model' />
        </section>
    </div>
</template>

<script>
    import nacreBoxUrl from '@/assets/model/nacrebox.glb';

    const GRID_COLUMNS = 56;
    const GRID_ROWS = 36;
    const COMPLETE_RATIO = 0.9;
    const BRUSH_VMIN_RATIO = 0.15;
    const WIPE_SURFACE_COLOR = '#232221';
    const MODEL_TOP_COVER_SCALE = 0.68;
    const MODEL_FRONT_WIDTH_RATIO = 0.4;
    const MODEL_ZOOM_END = 0.2;
    const MODEL_ORBIT_START = 0.22;
    const MODEL_ORBIT_END = 0.45;
    const MODEL_FRONT_TRANSITION_RATIO = 0.8;
    const MODEL_LOWER_START = 0.48;
    const MODEL_LOWER_END = 0.68;
    const MODEL_LOWER_VIEWPORT_RATIO = 0.15;
    const MODEL_LID_START = 0.72;
    const MODEL_LID_OPEN_ANGLE = -Math.PI / 2;
    const MODEL_TOP_NODE_NAMES = [
        'box_top-guide',
        'top-butterfly',
        'top-leaf',
        'top-flower',
        'top-corner',
        'box-top',
        'box-top-inner',
    ];

    export default {
        name: 'FeaturedWork',
        data() {
            return {
                isComplete: false,
                isScrollLocked: false,
                isWipeActive: false,
                modelScrollProgress: 0,
            };
        },
        mounted() {
            this.coveredCells = new Uint8Array(GRID_COLUMNS * GRID_ROWS);
            this.coveredCellCount = 0;
            this.lastPointer = null;
            this.sectionTop = 0;
            this.touchStartY = 0;
            this.canvasInitialized = false;
            this.resizeCanvas();
            this.updateSectionTop();
            this.initNacreBox();

            window.addEventListener('resize', this.onResize, { passive: true });
            window.addEventListener('scroll', this.onScroll, { passive: true });
            window.addEventListener('wheel', this.onWheel, { passive: false });
            window.addEventListener('touchstart', this.onTouchStart, { passive: true });
            window.addEventListener('touchmove', this.onTouchMove, { passive: false });
            window.addEventListener('keydown', this.onKeyDown);
            this.onScroll();
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('wheel', this.onWheel);
            window.removeEventListener('touchstart', this.onTouchStart);
            window.removeEventListener('touchmove', this.onTouchMove);
            window.removeEventListener('keydown', this.onKeyDown);

            if (this.resizeRafId) cancelAnimationFrame(this.resizeRafId);
            if (this.lockRafId) cancelAnimationFrame(this.lockRafId);
            if (this.modelAnimationId) cancelAnimationFrame(this.modelAnimationId);
            if (this.modelObserver) this.modelObserver.disconnect();

            this.disposeNacreBox();
        },
        methods: {
            clamp(value, min, max) {
                return Math.max(min, Math.min(max, value));
            },
            updateSectionTop() {
                const section = this.$refs.wipingSection;
                if (!section) return;

                const rect = section.getBoundingClientRect();
                this.sectionTop = window.scrollY + rect.top;
            },
            resizeCanvas() {
                const canvas = this.$refs.canvas;
                if (!canvas) return;

                let snapshot = null;
                if (this.canvasInitialized && !this.isComplete) {
                    snapshot = document.createElement('canvas');
                    snapshot.width = canvas.width;
                    snapshot.height = canvas.height;
                    snapshot.getContext('2d').drawImage(canvas, 0, 0);
                }

                const rect = canvas.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                canvas.width = Math.max(1, Math.round(rect.width * dpr));
                canvas.height = Math.max(1, Math.round(rect.height * dpr));

                const context = canvas.getContext('2d');
                context.setTransform(dpr, 0, 0, dpr, 0, 0);
                context.globalCompositeOperation = 'source-over';

                if (!this.isComplete) {
                    if (snapshot) {
                        context.drawImage(snapshot, 0, 0, rect.width, rect.height);
                    } else {
                        context.fillStyle = WIPE_SURFACE_COLOR;
                        context.fillRect(0, 0, rect.width, rect.height);
                    }
                }

                context.globalCompositeOperation = 'destination-out';
                context.lineCap = 'round';
                context.lineJoin = 'round';
                context.strokeStyle = '#000';
                context.fillStyle = '#000';
                this.canvasInitialized = true;
            },
            onResize() {
                if (this.resizeRafId) return;

                this.resizeRafId = requestAnimationFrame(() => {
                    this.resizeRafId = null;
                    this.resizeCanvas();
                    this.resizeModelRenderer();
                    this.updateSectionTop();
                    this.onScroll();
                });
            },
            async initNacreBox() {
                const canvas = this.$refs.modelCanvas;
                if (!canvas) return;

                const THREE = await import('three');
                const { GLTFLoader } = await import(
                    'three/examples/jsm/loaders/GLTFLoader.js'
                );
                const { RoomEnvironment } = await import(
                    'three/examples/jsm/environments/RoomEnvironment.js'
                );

                if (!this.$refs.modelCanvas) return;

                this.modelThree = THREE;
                this.modelScene = new THREE.Scene();
                this.modelCamera = new THREE.PerspectiveCamera(35, 1, 0.01, 1000);
                this.modelRenderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                });
                this.modelRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                this.modelRenderer.outputColorSpace = THREE.SRGBColorSpace;
                this.modelRenderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.modelRenderer.toneMappingExposure = 1;

                this.modelPmrem = new THREE.PMREMGenerator(this.modelRenderer);
                const room = new RoomEnvironment();
                this.modelEnvironment = this.modelPmrem.fromScene(room, 0.04).texture;
                room.dispose();
                this.modelScene.environment = this.modelEnvironment;

                const ambientLight = new THREE.HemisphereLight(0xffffff, 0x39332d, 1.5);
                const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
                keyLight.position.set(3, 4, 5);
                this.modelScene.add(ambientLight, keyLight);

                this.resizeModelRenderer();

                this.modelObserver = new IntersectionObserver(
                    ([entry]) => {
                        this.isModelVisible = entry.isIntersecting;
                    },
                    { threshold: 0.01 },
                );
                this.modelObserver.observe(this.$refs.modelSection);

                const loader = new GLTFLoader();
                loader.load(nacreBoxUrl, (gltf) => {
                    if (!this.modelScene) return;

                    this.nacreBoxModel = gltf.scene;
                    this.centerAndFitModel();
                    this.modelScene.add(this.nacreBoxModel);
                });

                this.animateNacreBox();
            },
            centerAndFitModel() {
                const THREE = this.modelThree;
                const model = this.nacreBoxModel;
                const camera = this.modelCamera;
                if (!THREE || !model || !camera) return;

                model.updateMatrixWorld(true);
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDimension = Math.max(size.x, size.y, size.z) || 1;
                const bottomBox = new THREE.Box3();

                ['box_bottom', 'box_bottom_inner'].forEach((name) => {
                    const node = model.getObjectByName(name);
                    if (node) bottomBox.expandByObject(node);
                });

                this.setupLidPivot(center, bottomBox);
                model.position.sub(center);
                model.updateMatrixWorld(true);

                this.modelMetrics = {
                    width: size.x,
                    height: size.y,
                    depth: size.z,
                    maxDimension,
                };
                this.updateModelCamera();
            },
            setupLidPivot(center, bottomBox) {
                const THREE = this.modelThree;
                const model = this.nacreBoxModel;
                if (!THREE || !model || bottomBox.isEmpty()) return;

                const topNodes = MODEL_TOP_NODE_NAMES
                    .map((name) => model.getObjectByName(name))
                    .filter(Boolean);
                if (!topNodes.length) return;

                const pivot = new THREE.Group();
                pivot.name = 'box-top-group';
                pivot.position.set(
                    center.x,
                    bottomBox.max.y,
                    bottomBox.min.z,
                );
                model.add(pivot);
                model.updateMatrixWorld(true);

                topNodes.forEach((node) => pivot.attach(node));
                this.lidPivot = pivot;
                this.updateLidRotation();
            },
            updateLidRotation() {
                if (!this.lidPivot) return;

                const rawProgress = this.clamp(
                    (this.modelScrollProgress - MODEL_LID_START)
                        / (1 - MODEL_LID_START),
                    0,
                    1,
                );
                const progress =
                    rawProgress * rawProgress * (3 - 2 * rawProgress);
                this.lidPivot.rotation.x = MODEL_LID_OPEN_ANGLE * progress;
            },
            updateModelCamera() {
                const THREE = this.modelThree;
                const camera = this.modelCamera;
                const metrics = this.modelMetrics;
                if (!THREE || !camera || !metrics) return;

                const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
                const topDistanceForWidth =
                    (metrics.width * 0.5)
                    / (Math.tan(halfFov) * camera.aspect);
                const topDistanceForHeight =
                    (metrics.depth * 0.5) / Math.tan(halfFov);
                const topDistance =
                    Math.min(topDistanceForWidth, topDistanceForHeight)
                    * MODEL_TOP_COVER_SCALE;
                const frontDistance =
                    (metrics.width * 0.5)
                    / (
                        Math.tan(halfFov)
                        * camera.aspect
                        * MODEL_FRONT_WIDTH_RATIO
                    );
                const modelTop = metrics.height * 0.5;
                const rawProgress = this.clamp(this.modelScrollProgress, 0, 1);
                const rawZoomProgress = this.clamp(
                    rawProgress / MODEL_ZOOM_END,
                    0,
                    1,
                );
                const zoomProgress =
                    rawZoomProgress
                    * rawZoomProgress
                    * (3 - 2 * rawZoomProgress);
                const rawOrbitProgress = this.clamp(
                    (rawProgress - MODEL_ORBIT_START)
                        / (MODEL_ORBIT_END - MODEL_ORBIT_START),
                    0,
                    1,
                );
                const orbitProgress =
                    rawOrbitProgress
                    * rawOrbitProgress
                    * (3 - 2 * rawOrbitProgress);
                const viewProgress =
                    orbitProgress * MODEL_FRONT_TRANSITION_RATIO;
                const cameraDistance =
                    topDistance + (frontDistance - topDistance) * zoomProgress;
                const orbitAngle = viewProgress * Math.PI * 0.5;
                const targetY = modelTop * (1 - viewProgress);
                const target = new THREE.Vector3(0, targetY, 0);
                const up = new THREE.Vector3(0, 0, -1)
                    .lerp(new THREE.Vector3(0, 1, 0), viewProgress)
                    .normalize();
                const rawLowerProgress = this.clamp(
                    (rawProgress - MODEL_LOWER_START)
                        / (MODEL_LOWER_END - MODEL_LOWER_START),
                    0,
                    1,
                );
                const lowerProgress =
                    rawLowerProgress
                    * rawLowerProgress
                    * (3 - 2 * rawLowerProgress);
                const visibleHeight =
                    2 * cameraDistance * Math.tan(halfFov);
                const cameraShift =
                    visibleHeight
                    * MODEL_LOWER_VIEWPORT_RATIO
                    * lowerProgress;

                camera.position.set(
                    0,
                    targetY + Math.cos(orbitAngle) * cameraDistance,
                    Math.sin(orbitAngle) * cameraDistance,
                );
                camera.up.copy(up);
                camera.position.addScaledVector(up, cameraShift);
                target.addScaledVector(up, cameraShift);
                camera.near = Math.max(
                    Math.min(topDistance, frontDistance) / 100,
                    0.01,
                );
                camera.far = Math.max(
                    topDistance,
                    frontDistance,
                    metrics.maxDimension,
                ) * 100;
                camera.lookAt(target);
                camera.updateProjectionMatrix();
            },
            updateModelScrollProgress() {
                if (!this.isComplete) {
                    this.modelScrollProgress = 0;
                    this.updateModelCamera();
                    return;
                }

                const scrollRange = Math.max(
                    this.$el.offsetHeight - window.innerHeight,
                    1,
                );
                this.modelScrollProgress = this.clamp(
                    (window.scrollY - this.sectionTop) / scrollRange,
                    0,
                    1,
                );
                this.updateModelCamera();
                this.updateLidRotation();
            },
            resizeModelRenderer() {
                const canvas = this.$refs.modelCanvas;
                const renderer = this.modelRenderer;
                const camera = this.modelCamera;
                if (!canvas || !renderer || !camera) return;

                const width = canvas.clientWidth;
                const height = canvas.clientHeight;
                if (!width || !height) return;

                renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
                renderer.setSize(width, height, false);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();

                if (this.nacreBoxModel) this.updateModelCamera();
            },
            animateNacreBox() {
                this.modelAnimationId = requestAnimationFrame(this.animateNacreBox);

                if (!this.isModelVisible || !this.modelRenderer || !this.modelScene) return;

                this.modelRenderer.render(this.modelScene, this.modelCamera);
            },
            disposeNacreBox() {
                if (this.nacreBoxModel) {
                    this.nacreBoxModel.traverse((object) => {
                        if (object.geometry) object.geometry.dispose();
                        if (!object.material) return;

                        const materials = Array.isArray(object.material)
                            ? object.material
                            : [object.material];
                        materials.forEach((material) => {
                            Object.values(material).forEach((value) => {
                                if (value?.isTexture) value.dispose();
                            });
                            material.dispose();
                        });
                    });
                }

                if (this.modelEnvironment) this.modelEnvironment.dispose();
                if (this.modelPmrem) this.modelPmrem.dispose();
                if (this.modelRenderer) this.modelRenderer.dispose();

                this.nacreBoxModel = null;
                this.modelScene = null;
                this.modelCamera = null;
                this.modelRenderer = null;
            },
            shouldLockScroll() {
                if (this.isComplete) return false;
                return window.scrollY >= this.sectionTop - 1;
            },
            onScroll() {
                const shouldLock = this.shouldLockScroll();
                this.isScrollLocked = shouldLock;
                this.isWipeActive = shouldLock && !this.isComplete;
                this.updateModelScrollProgress();

                if (!this.isWipeActive) this.lastPointer = null;

                if (!shouldLock || window.scrollY <= this.sectionTop + 1) return;
                if (this.lockRafId) return;

                this.lockRafId = requestAnimationFrame(() => {
                    this.lockRafId = null;
                    window.scrollTo(0, this.sectionTop);
                });
            },
            onWheel(event) {
                if (this.isComplete || event.deltaY <= 0) return;

                const reachesSection =
                    window.scrollY + event.deltaY >= this.sectionTop;
                if (!this.shouldLockScroll() && !reachesSection) return;

                event.preventDefault();
                window.scrollTo(0, this.sectionTop);
            },
            onTouchStart(event) {
                this.touchStartY = event.touches[0]?.clientY || 0;
            },
            onTouchMove(event) {
                const currentY = event.touches[0]?.clientY || 0;
                const isScrollingDown = currentY < this.touchStartY;

                if (this.shouldLockScroll() && isScrollingDown) {
                    event.preventDefault();
                }

                this.touchStartY = currentY;
            },
            onKeyDown(event) {
                const blockedKeys = ['ArrowDown', 'PageDown', ' ', 'End'];
                if (!blockedKeys.includes(event.key) || !this.shouldLockScroll()) return;

                event.preventDefault();
                window.scrollTo(0, this.sectionTop);
            },
            getPointerPosition(event) {
                const canvas = this.$refs.canvas;
                const rect = canvas?.getBoundingClientRect();
                if (!rect) return null;

                return {
                    x: this.clamp(event.clientX - rect.left, 0, rect.width),
                    y: this.clamp(event.clientY - rect.top, 0, rect.height),
                };
            },
            getBrushRadius() {
                const canvas = this.$refs.canvas;
                if (!canvas) return 0;

                return Math.min(canvas.clientWidth, canvas.clientHeight)
                    * BRUSH_VMIN_RATIO;
            },
            onPointerEnter(event) {
                if (!this.isWipeActive || this.isComplete) return;

                const point = this.getPointerPosition(event);
                if (!point) return;

                this.lastPointer = point;
                this.drawBrushSegment(point, point);
            },
            onPointerMove(event) {
                if (!this.isWipeActive || this.isComplete) {
                    this.lastPointer = null;
                    return;
                }

                const point = this.getPointerPosition(event);
                if (!point) return;

                const from = this.lastPointer || point;
                this.drawBrushSegment(from, point);
                this.lastPointer = point;
            },
            onPointerLeave() {
                this.lastPointer = null;
            },
            drawBrushSegment(from, to) {
                const canvas = this.$refs.canvas;
                const context = canvas?.getContext('2d');
                if (!canvas || !context) return;

                const radius = this.getBrushRadius();
                context.lineWidth = radius * 2;
                context.beginPath();
                context.moveTo(from.x, from.y);
                context.lineTo(to.x, to.y);
                context.stroke();

                if (from.x === to.x && from.y === to.y) {
                    context.beginPath();
                    context.arc(to.x, to.y, radius, 0, Math.PI * 2);
                    context.fill();
                }

                this.markCoveredCells(from, to, radius);
            },
            distanceToSegment(px, py, from, to) {
                const dx = to.x - from.x;
                const dy = to.y - from.y;
                const lengthSquared = dx * dx + dy * dy;

                if (!lengthSquared) {
                    return Math.hypot(px - from.x, py - from.y);
                }

                const t = this.clamp(
                    ((px - from.x) * dx + (py - from.y) * dy) / lengthSquared,
                    0,
                    1,
                );
                const closestX = from.x + t * dx;
                const closestY = from.y + t * dy;

                return Math.hypot(px - closestX, py - closestY);
            },
            markCoveredCells(from, to, radius) {
                const canvas = this.$refs.canvas;
                const width = canvas?.clientWidth || 0;
                const height = canvas?.clientHeight || 0;
                if (!width || !height) return;

                const minColumn = this.clamp(
                    Math.floor(((Math.min(from.x, to.x) - radius) / width) * GRID_COLUMNS),
                    0,
                    GRID_COLUMNS - 1,
                );
                const maxColumn = this.clamp(
                    Math.ceil(((Math.max(from.x, to.x) + radius) / width) * GRID_COLUMNS),
                    0,
                    GRID_COLUMNS - 1,
                );
                const minRow = this.clamp(
                    Math.floor(((Math.min(from.y, to.y) - radius) / height) * GRID_ROWS),
                    0,
                    GRID_ROWS - 1,
                );
                const maxRow = this.clamp(
                    Math.ceil(((Math.max(from.y, to.y) + radius) / height) * GRID_ROWS),
                    0,
                    GRID_ROWS - 1,
                );

                for (let row = minRow; row <= maxRow; row += 1) {
                    for (let column = minColumn; column <= maxColumn; column += 1) {
                        const index = row * GRID_COLUMNS + column;
                        if (this.coveredCells[index]) continue;

                        const x = ((column + 0.5) / GRID_COLUMNS) * width;
                        const y = ((row + 0.5) / GRID_ROWS) * height;
                        if (this.distanceToSegment(x, y, from, to) > radius) continue;

                        this.coveredCells[index] = 1;
                        this.coveredCellCount += 1;
                    }
                }

                const totalCells = GRID_COLUMNS * GRID_ROWS;
                if (this.coveredCellCount / totalCells >= COMPLETE_RATIO) {
                    this.completeWipe();
                }
            },
            completeWipe() {
                if (this.isComplete) return;

                this.isComplete = true;
                this.isScrollLocked = false;
                this.isWipeActive = false;
                this.updateModelScrollProgress();
                const canvas = this.$refs.canvas;
                const context = canvas?.getContext('2d');
                if (!canvas || !context) return;

                context.globalCompositeOperation = 'source-over';
                context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables.scss' as *;

    #featured-work {
        position: relative;
        width: 100%;
        height: 400vh;
        margin-top: -45vh;

        .wiping-surface {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            width: 100%;
            height: 100vh;
            overflow: hidden;

            .hint {
                z-index: 3;
                bottom: 5vw;
                font-size: 0.8rem;
                left: 50%;
                letter-spacing: 0.2em;
                position: absolute;
                text-align: center;
                text-transform: uppercase;
                transform: translateX(-50%);
                animation: hint-blink 2s ease-in-out infinite;
            }

            canvas {
                position: absolute;
                inset: 0;
                display: block;
                width: 100%;
                height: 100%;
                cursor: default;
                touch-action: none;
            }

            &.is-active canvas {
                cursor: none;
            }

            &.is-complete {
                pointer-events: none;
            }
        }

        .nacre-box {
            position: sticky;
            top: 0;
            z-index: 1;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            background: $white;

            canvas {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
    }

    @keyframes hint-blink {
        0%,
        100% {
            opacity: 0.4;
        }
        50% {
            opacity: 0.2;
        }
    }
</style>