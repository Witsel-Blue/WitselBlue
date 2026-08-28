<template>
    <div
        id='rabbit-hole-lists'
        ref='root'
        :class='{ "is-focused": isFocused }'
    >
        <canvas ref='canvas' />
        <transition name='list-detail'>
            <div
                v-if='detailOpen'
                class='list-detail-layer'
            >
                <button
                    v-if='detailPlacement === "bottom"'
                    type='button'
                    class='close-btn top'
                    :style='closeStyle'
                    @click='closeItem'
                >
                    <div class='line-wrap'>
                        <div class='line' />
                        <div class='line' />
                    </div>
                </button>
                <aside
                    class='list-detail'
                    :class='`is-${detailPlacement}`'
                    :style='detailStyle'
                >
                    <button
                        v-if='detailPlacement !== "bottom"'
                        type='button'
                        class='close-btn'
                        @click='closeItem'
                    >
                        <div class='line-wrap'>
                            <div class='line' />
                            <div class='line' />
                        </div>
                    </button>
                    <a v-if='archive.link && detailPlacement === "bottom"' :href='archive.link' target='_blank' class='title_bottom'>
                        {{ archive.title }}
                    </a>
                    <h2 v-else class='title'>{{ archive.title }}</h2>
                    <h3 v-if='archive.summary' class='summary'>{{ archive.summary }}</h3>
                    <p v-if='archive.stack && detailPlacement !== "bottom"' class='stack'>
                        {{ archive.stack }}
                    </p>
                    <p v-if='archive.duration && detailPlacement !== "bottom"' class='duration'>
                        {{ archive.duration }}
                    </p>
                    <ButtonRound
                        v-if='archive.link && detailPlacement !== "bottom"'
                        :link='{ href: archive.link, target: archive.linkTarget, text: archive.linkText }'
                    />
                </aside>
            </div>
        </transition>
    </div>
</template>

<script>
    import ButtonRound from '@/components/common/ButtonRound.vue';
    import gsap from 'gsap';
    import archiveData from '@/assets/data/archive.js';
    import mirrorUrl from '@/assets/model/mirror.glb';
    import jadeUrl from '@/assets/model/texture/jade.png';

    const CAMERA_Z = 50;
    const START_DIST = 270;
    const PASS_DIST = 80;
    const DEPTH_STEP = 100;
    const MIRROR_SIZE = 40;
    const FOG_NEAR = 70;
    const FOG_FAR = 300;
    const FOCUS_SCREEN_HEIGHT = 0.6;
    const FOCUS_DISTANCE = 36;
    const FOCUS_DURATION = 0.9;
    const LIST_INDEXES = [0, 2, 3, 4, 5, 9];

    const LIST_ITEMS = LIST_INDEXES
        .map((index) => archiveData[index])
        .filter(Boolean)
        .filter((item) => item.images?.thumb);

    function pickLocale(value, locale) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[locale] || value.en || '';
    }

    function formatDuration(duration) {
        if (!duration) return '';
        const { start, end } = duration;
        if (start && end) return `${start} - ${end}`;
        return start || end || '';
    }

    function localizeArchive(item, locale) {
        if (!item) return null;
        return {
            slug: item.slug,
            title: pickLocale(item.title, locale),
            summary: pickLocale(item.summary, locale),
            stack: pickLocale(item.desc?.stack, locale),
            duration: formatDuration(item.desc?.duration),
            link: item.link?.href || '',
            linkTarget: item.link?.target || '_blank',
            linkText: pickLocale(item.link?.text, locale),
        };
    }

    function getListTravelDepth(count = LIST_ITEMS.length) {
        const n = Math.max(count, 1);
        return START_DIST + PASS_DIST + (n - 1) * DEPTH_STEP;
    }

    export default {
        name: 'RabbitHoleLists',
        components: {
            ButtonRound,
        },
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
                isFocused: false,
                detailOpen: false,
                selectedSlug: null,
                detailPlacement: 'side',
                detailAnchor: { x: 0, y: 0 },
                closeAnchor: { x: 0, y: 0 },
            };
        },
        computed: {
            archive() {
                if (!this.selectedSlug) return {};
                const item = archiveData.find(
                    (entry) => entry.slug === this.selectedSlug,
                );
                const locale = this.$i18n?.locale || 'en';
                return localizeArchive(item, locale) || {};
            },
            detailStyle() {
                return {
                    left: `${this.detailAnchor.x}px`,
                    top: `${this.detailAnchor.y}px`,
                };
            },
            closeStyle() {
                return {
                    left: `${this.closeAnchor.x}px`,
                    top: `${this.closeAnchor.y}px`,
                };
            },
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
            this.thumbAspect = 1;
            this.selectedMirror = null;
            this.focusTween = null;

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
            this.focusTween?.kill();
            this.focusTween = null;
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
                    const { GLTFLoader } = await import(
                        'three/examples/jsm/loaders/GLTFLoader.js'
                    );
                    const { RoomEnvironment } = await import(
                        'three/examples/jsm/environments/RoomEnvironment.js'
                    );
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
                    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                    this.renderer.toneMappingExposure = 1;

                    this.pmrem = new THREE.PMREMGenerator(this.renderer);
                    const room = new RoomEnvironment();
                    this.scene.environment = this.pmrem.fromScene(room, 0.04).texture;
                    room.dispose();

                    const hemi = new THREE.HemisphereLight(0xffffff, 0x080820, 0.85);
                    hemi.position.set(100, 100, 0);
                    this.scene.add(hemi);

                    const point = new THREE.PointLight(0xffffff, 0.45);
                    point.position.set(15, 15, 20);
                    this.scene.add(point);

                    const key = new THREE.DirectionalLight(0xffffff, 0.55);
                    key.position.set(8, 12, 20);
                    this.scene.add(key);

                    this.boxGroup = new THREE.Object3D();
                    this.scene.add(this.boxGroup);

                    const gltf = await new Promise((resolve, reject) => {
                        new GLTFLoader().load(mirrorUrl, resolve, undefined, reject);
                    });
                    const template = this.prepareMirrorTemplate(gltf.scene);
                    this.ensureMeshUVs(template);
                    this.thumbAspect = this.getThumbAspect(template);

                    const textureLoader = new THREE.TextureLoader();
                    const jadeTexture = await new Promise((resolve, reject) => {
                        textureLoader.load(jadeUrl, resolve, undefined, reject);
                    });
                    jadeTexture.colorSpace = THREE.SRGBColorSpace;
                    jadeTexture.flipY = true;
                    jadeTexture.wrapS = THREE.RepeatWrapping;
                    jadeTexture.wrapT = THREE.RepeatWrapping;
                    jadeTexture.repeat.set(2, 2);
                    this.applyJadeMaterial(template, jadeTexture);

                    LIST_ITEMS.forEach((item, index) => {
                        const mirror = template.clone(true);
                        const texture = textureLoader.load(item.images.thumb, (loaded) => {
                            loaded.colorSpace = THREE.SRGBColorSpace;
                            loaded.flipY = true;
                            this.coverTexture(loaded, this.thumbAspect);
                        });
                        texture.colorSpace = THREE.SRGBColorSpace;
                        texture.flipY = true;
                        this.applyThumbTexture(mirror, texture);
                        mirror.position.set(
                            Math.random() * 100 - 50,
                            Math.random() * 50 - 25,
                            this.startZ - index * DEPTH_STEP,
                        );
                        mirror.rotation.y = (Math.random() - 0.5) * 0.5;
                        this.captureRestPose(mirror);
                        mirror.userData.isListItem = true;
                        mirror.userData.slug = item.slug;
                        this.boxGroup.add(mirror);
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

                if (!this.isFocused) {
                    this.moveZ += (this.targetZ - this.moveZ) * 0.08;
                    this.boxGroup.position.z = this.moveZ;

                    const cx = this.width * 0.5;
                    const cy = this.height * 0.5;
                    this.moveX += (this.mouseX - cx - this.moveX) * 0.05;
                    this.moveY += (this.mouseY - cy - this.moveY) * 0.05;
                    this.boxGroup.position.x = -(this.moveX / 50);
                    this.boxGroup.position.y = this.moveY / 50;
                }

                this.camera.lookAt(this.scene.position);
                if (this.detailOpen) this.updateDetailAnchor();
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
                if (this.isFocused && this.selectedMirror && !this.focusTween) {
                    const focus = this.getFocusTransform();
                    this.selectedMirror.position.set(
                        focus.position.x,
                        focus.position.y,
                        focus.position.z,
                    );
                    this.selectedMirror.scale.setScalar(focus.scale);
                    this.updateDetailAnchor();
                }
            },
            onPointerMove(event) {
                this.mouseX = event.clientX;
                this.mouseY = event.clientY;
            },
            prepareMirrorTemplate(scene) {
                const THREE = this.three;
                const wrapper = new THREE.Group();
                wrapper.add(scene);
                wrapper.updateMatrixWorld(true);

                const box = new THREE.Box3().setFromObject(wrapper);
                const center = box.getCenter(new THREE.Vector3());
                scene.position.sub(center);

                wrapper.updateMatrixWorld(true);
                const size = new THREE.Box3()
                    .setFromObject(wrapper)
                    .getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z) || 1;
                wrapper.scale.setScalar(MIRROR_SIZE / maxDim);
                return wrapper;
            },
            projectPlanarUVs(geometry) {
                const THREE = this.three;
                geometry.computeBoundingBox();
                const box = geometry.boundingBox;
                const size = box.getSize(new THREE.Vector3());
                const pos = geometry.attributes.position;
                const uv = new Float32Array(pos.count * 2);
                const sx = size.x || 1;
                const sy = size.y || 1;

                for (let i = 0; i < pos.count; i += 1) {
                    uv[i * 2] = (pos.getX(i) - box.min.x) / sx;
                    uv[i * 2 + 1] = (pos.getY(i) - box.min.y) / sy;
                }

                geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
                geometry.attributes.uv.needsUpdate = true;
            },
            ensureMeshUVs(root) {
                root.traverse((object) => {
                    if (!object.isMesh || !object.geometry) return;
                    object.geometry = object.geometry.clone();
                    this.projectPlanarUVs(object.geometry);
                });
            },
            getThumbAspect(root) {
                const THREE = this.three;
                const thumb = root.getObjectByName('thumb');
                if (!thumb) return 1;
                const size = new THREE.Box3()
                    .setFromObject(thumb)
                    .getSize(new THREE.Vector3());
                return (size.x || 1) / (size.y || 1);
            },
            coverTexture(texture, meshAspect) {
                const THREE = this.three;
                const image = texture.image;
                if (!image?.width || !image?.height) return;

                const imageAspect = image.width / image.height;
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;

                if (imageAspect > meshAspect) {
                    const repeatX = meshAspect / imageAspect;
                    texture.repeat.set(repeatX, 1);
                    texture.offset.set((1 - repeatX) / 2, 0);
                } else {
                    const repeatY = imageAspect / meshAspect;
                    texture.repeat.set(1, repeatY);
                    texture.offset.set(0, (1 - repeatY) / 2);
                }
                texture.needsUpdate = true;
            },
            isThumbMesh(object) {
                let node = object;
                while (node) {
                    if (String(node.name || '').toLowerCase() === 'thumb') return true;
                    node = node.parent;
                }
                return false;
            },
            applyJadeMaterial(root, texture) {
                const THREE = this.three;
                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    color: 0xffffff,
                    roughness: 0.35,
                    metalness: 0,
                    envMapIntensity: 0.45,
                    fog: true,
                    side: THREE.DoubleSide,
                });
                material.needsUpdate = true;

                root.traverse((object) => {
                    if (!object.isMesh) return;
                    if (this.isThumbMesh(object)) return;
                    object.material = material;
                });
            },
            applyThumbTexture(root, texture) {
                const THREE = this.three;
                const thumb = root.getObjectByName('thumb');
                if (!thumb) return;

                const material = new THREE.MeshBasicMaterial({
                    map: texture,
                    color: 0xffffff,
                    fog: true,
                    toneMapped: false,
                });

                thumb.traverse((object) => {
                    if (!object.isMesh) return;
                    object.material = material;
                });
            },
            captureRestPose(object) {
                const THREE = this.three;
                const rotY = object.rotation.y;
                object.rotation.set(0, 0, 0);
                object.updateMatrixWorld(true);
                const size = new THREE.Box3()
                    .setFromObject(object)
                    .getSize(new THREE.Vector3());
                object.userData.restHeight = size.y || 1;
                object.rotation.y = rotY;
                object.updateMatrixWorld(true);
                object.userData.restPosition = object.position.clone();
                object.userData.restRotation = {
                    x: object.rotation.x,
                    y: object.rotation.y,
                    z: object.rotation.z,
                };
                object.userData.restScale = object.scale.clone();
            },
            getFocusTransform() {
                const THREE = this.three;
                const mirror = this.selectedMirror;
                const restScale = mirror?.userData?.restScale?.x || 1;
                const worldZ = CAMERA_Z - FOCUS_DISTANCE;
                const position = {
                    x: -this.boxGroup.position.x,
                    y: -this.boxGroup.position.y,
                    z: worldZ - this.boxGroup.position.z,
                };

                if (!mirror || !this.camera) {
                    return { position, scale: restScale };
                }

                const prevPos = mirror.position.clone();
                const prevRot = mirror.rotation.clone();
                const prevScl = mirror.scale.clone();

                mirror.position.set(position.x, position.y, position.z);
                mirror.rotation.set(0, 0, 0);
                mirror.scale.setScalar(restScale);
                this.camera.lookAt(this.scene.position);
                mirror.updateWorldMatrix(true, true);

                const box = new THREE.Box3().setFromObject(mirror);
                const cx = (box.min.x + box.max.x) * 0.5;
                const cz = (box.min.z + box.max.z) * 0.5;
                const top = new THREE.Vector3(cx, box.max.y, cz).project(this.camera);
                const bottom = new THREE.Vector3(cx, box.min.y, cz).project(this.camera);
                const currentFraction = Math.abs(top.y - bottom.y) / 2;
                const scale = restScale
                    * (FOCUS_SCREEN_HEIGHT / Math.max(currentFraction, 0.0001));

                mirror.position.copy(prevPos);
                mirror.rotation.copy(prevRot);
                mirror.scale.copy(prevScl);

                return { position, scale };
            },
            updateDetailAnchor() {
                if (!this.selectedMirror || !this.camera) return;

                const THREE = this.three;
                this.selectedMirror.updateWorldMatrix(true, true);
                const box = new THREE.Box3().setFromObject(this.selectedMirror);
                const useBottom = this.width <= 768;
                this.detailPlacement = useBottom ? 'bottom' : 'side';
                const pad = 20;

                if (useBottom) {
                    const bottomPoint = new THREE.Vector3(
                        (box.min.x + box.max.x) * 0.5,
                        box.min.y,
                        box.max.z,
                    );
                    const topPoint = new THREE.Vector3(
                        (box.min.x + box.max.x) * 0.5,
                        box.max.y,
                        box.max.z,
                    );
                    bottomPoint.project(this.camera);
                    topPoint.project(this.camera);

                    const bx = (bottomPoint.x * 0.5 + 0.5) * this.width;
                    const by = (-bottomPoint.y * 0.5 + 0.5) * this.height;
                    const tx = (topPoint.x * 0.5 + 0.5) * this.width;
                    const ty = (-topPoint.y * 0.5 + 0.5) * this.height;

                    this.closeAnchor = {
                        x: this.clamp(tx, pad, this.width - pad),
                        y: this.clamp(ty - 16, pad, this.height - pad),
                    };
                    this.detailAnchor = {
                        x: this.clamp(bx, pad, this.width - pad),
                        y: this.clamp(by + 20, pad, this.height - pad),
                    };
                    return;
                }

                const point = new THREE.Vector3(
                    box.max.x,
                    (box.min.y + box.max.y) * 0.5,
                    box.max.z,
                );
                point.project(this.camera);

                const x = (point.x * 0.5 + 0.5) * this.width;
                const y = (-point.y * 0.5 + 0.5) * this.height;
                this.detailAnchor = {
                    x: this.clamp(x + 24, pad, this.width - pad),
                    y: this.clamp(y, pad, this.height - pad),
                };
            },
            openItem(mirror) {
                if (!mirror || this.isFocused) return;

                this.isFocused = true;
                this.hovering = false;
                this.selectedMirror = mirror;
                this.selectedSlug = mirror.userData.slug;

                const canvas = this.$refs.canvas;
                if (canvas) canvas.style.cursor = 'auto';

                const focus = this.getFocusTransform();
                const others = this.boxGroup.children.filter((item) => item !== mirror);

                this.focusTween?.kill();
                this.focusTween = gsap.timeline({
                    onComplete: () => {
                        this.focusTween = null;
                    },
                });
                this.focusTween.to(mirror.position, {
                    x: focus.position.x,
                    y: focus.position.y,
                    z: focus.position.z,
                    duration: FOCUS_DURATION,
                    ease: 'power3.inOut',
                }, 0);
                this.focusTween.to(mirror.rotation, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: FOCUS_DURATION,
                    ease: 'power3.inOut',
                }, 0);
                this.focusTween.to(mirror.scale, {
                    x: focus.scale,
                    y: focus.scale,
                    z: focus.scale,
                    duration: FOCUS_DURATION,
                    ease: 'power3.inOut',
                }, 0);
                others.forEach((other) => {
                    this.focusTween.to(other.scale, {
                        x: 0,
                        y: 0,
                        z: 0,
                        duration: 0.55,
                        ease: 'power2.in',
                    }, 0);
                });
                this.focusTween.add(() => {
                    this.detailOpen = true;
                    this.$nextTick(() => this.updateDetailAnchor());
                }, 0.45);
            },
            closeItem() {
                if (!this.isFocused || !this.selectedMirror) return;

                const mirror = this.selectedMirror;
                const restPos = mirror.userData.restPosition;
                const restRot = mirror.userData.restRotation;
                const restScale = mirror.userData.restScale;
                this.detailOpen = false;

                this.focusTween?.kill();
                this.focusTween = gsap.timeline({
                    onComplete: () => {
                        this.isFocused = false;
                        this.selectedMirror = null;
                        this.selectedSlug = null;
                        this.focusTween = null;
                    },
                });
                this.focusTween.to(mirror.position, {
                    x: restPos.x,
                    y: restPos.y,
                    z: restPos.z,
                    duration: 0.8,
                    ease: 'power3.inOut',
                }, 0);
                this.focusTween.to(mirror.rotation, {
                    x: restRot.x,
                    y: restRot.y,
                    z: restRot.z,
                    duration: 0.8,
                    ease: 'power3.inOut',
                }, 0);
                this.focusTween.to(mirror.scale, {
                    x: restScale.x,
                    y: restScale.y,
                    z: restScale.z,
                    duration: 0.8,
                    ease: 'power3.inOut',
                }, 0);
                this.boxGroup.children.forEach((other) => {
                    if (other === mirror) return;
                    const scale = other.userData.restScale;
                    this.focusTween.to(other.scale, {
                        x: scale.x,
                        y: scale.y,
                        z: scale.z,
                        duration: 0.7,
                        ease: 'power2.out',
                    }, 0.12);
                });
            },
            hitTest(event) {
                if (!this.ready || !this.boxGroup) return null;

                const canvas = this.$refs.canvas;
                if (!canvas) return null;

                const rect = canvas.getBoundingClientRect();
                this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                this.raycaster.setFromCamera(this.pointer, this.camera);

                const hits = this.raycaster.intersectObjects(
                    this.boxGroup.children,
                    true,
                );
                let object = hits[0]?.object || null;
                while (object && !object.userData?.isListItem) {
                    object = object.parent;
                }
                return object;
            },
            onCanvasPointerMove(event) {
                if (this.isFocused) {
                    this.hovering = false;
                    const canvas = this.$refs.canvas;
                    if (canvas) canvas.style.cursor = 'auto';
                    return;
                }
                const hit = this.hitTest(event);
                this.hovering = Boolean(hit);
                const canvas = this.$refs.canvas;
                if (canvas) {
                    canvas.style.cursor = hit ? 'pointer' : 'auto';
                }
            },
            onCanvasClick(event) {
                if (this.isFocused) return;
                const hit = this.hitTest(event);
                if (!hit) return;
                this.openItem(hit);
            },
            disposeScene() {
                this.ready = false;
                this._initPromise = null;

                if (this.boxGroup) {
                    const disposed = new Set();
                    this.boxGroup.traverse((object) => {
                        if (!object.isMesh) return;
                        const materials = Array.isArray(object.material)
                            ? object.material
                            : [object.material];
                        materials.forEach((material) => {
                            if (!material || disposed.has(material)) return;
                            disposed.add(material);
                            material.map?.dispose?.();
                            material.dispose?.();
                        });
                    });
                }

                this.scene?.environment?.dispose?.();
                this.pmrem?.dispose?.();
                this.pmrem = null;
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
    @use '@/assets/scss/base/variables' as *;

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

        .list-detail-layer {
            position: absolute;
            inset: 0;
            z-index: 2;
            pointer-events: none;

            .close-btn,
            .list-detail {
                pointer-events: auto;
            }
        }

        .list-detail {
            position: absolute;
            z-index: 2;
            display: flex;
            flex-direction: column;

            &.is-side {
                transform: translateY(-50%);
            }

            &.is-bottom {
                transform: translate(-50%, 0);
                width: 90vw;
                text-align: center;
                align-items: center;

                .title_bottom {
                    font-size: 2rem;
                    line-height: 1;
                    font-family: $ft-orangeavenue, $ft-sungkokserif;
                    color: $white;
                }
            }

            .title {
                margin-top: 2rem;
                font-size: 2rem;
                line-height: 1;
                font-family: $ft-orangeavenue, $ft-sungkokserif;
                color: $white;
            }

            .summary,
            .stack,
            .duration {
                margin-top: 0.5rem;
                font-size: 1rem;
                line-height: 1;
            }

            .summary {
                font-weight: 400;
                color: $gray1;
            }

            .stack,
            .duration {
                color: $gray2;
            }

            .duration {
                font-weight: 500;
            }

            #button-round {
                margin-top: 2rem;
            }
        }

        .close-btn {
            display: flex;
            align-items: center;
            padding: 0;
            border: 0;
            background: transparent;
            cursor: pointer;

            &.top {
                position: absolute;
                z-index: 3;
                justify-content: center;
                transform: translate(-50%, -100%);
            }

            .line-wrap {
                width: 24px;
                height: 1rem;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                .line {
                    display: block;
                    width: 100%;
                    height: 1px;
                    background-color: $white;
                    transition: transform 0.4s ease;

                    &:first-child {
                        transform: rotate(45deg);
                    }

                    &:last-child {
                        transform: rotate(-45deg);
                    }
                }

                &:hover {
                    .line {
                        &:first-child {     
                            animation: close-line-a 0.4s ease-in;
                        }

                        &:last-child {
                            animation: close-line-b 0.4s ease-in;
                            animation-delay: 0.2s;
                        }
                    }
                }
            }
        }
    }

    @keyframes close-line-a {
        0%,
        100% {
            transform: rotate(45deg) scale(1);
        }

        50% {
            transform: rotate(45deg) scale(0);
        }
    }

    @keyframes close-line-b {
        0%,
        100% {
            transform: rotate(-45deg) scale(1);
        }

        50% {
            transform: rotate(-45deg) scale(0);
        }
    }
</style>
