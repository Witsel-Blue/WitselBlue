<template>
    <div id='featured-work'>
        <div ref='viewport' class='featured-work-viewport'>
            <div
                class='featured-work-pin'
                :class='{ "is-pinned": isPinned }'
                :style='pinLayerStyle'
            >
                <canvas ref='canvas' />
                <p
                    v-show='cursorHint.visible'
                    class='shard-cursor-hint'
                    :style='cursorHintStyle'
                >
                    {{ cursorHint.text }}
                </p>
                <div
                    v-show='frontPanel.visible'
                    class='shard-front-panel'
                    :style='frontPanelStyle'
                >
                    <p v-if='frontPanel.summary' class='summary'>
                        {{ frontPanel.summary }}
                    </p>
                    <p v-if='frontPanel.duration' class='duration'>
                        {{ frontPanel.duration }}
                    </p>
                    <p v-if='frontPanel.stack' class='stack'>
                        {{ frontPanel.stack }}
                    </p>
                    <a
                        v-if='frontPanel.href'
                        class='link-btn'
                        :href='frontPanel.href'
                        :target='frontPanel.target'
                        rel='noopener noreferrer'
                        @click.stop
                    >
                        {{ frontPanel.linkText }}
                    </a>
                </div>
            </div>
        </div>
        <div class='featured-work-trail' aria-hidden='true' />
    </div>
</template>

<script>
    import nacreboxUrl from '@/assets/model/nacrebox.glb';
    import hairpinUrl from '@/assets/model/hairpin.glb';
    import hairpin2Url from '@/assets/model/hairpin2.glb';
    import nacreRedUrl from '@/assets/model/texture/nacre_red.png';
    import nacrePurpleUrl from '@/assets/model/texture/nacre_purple.png';
    import nacreWhiteUrl from '@/assets/model/texture/nacre_white.png';
    import nacreBeigeUrl from '@/assets/model/texture/nacre_beige.png';
    import jadeUrl from '@/assets/model/texture/jade.png';
    import metalUrl from '@/assets/model/texture/metal.png';
    import archiveData from '@/assets/data/archive.js';

    // 노드별 자개 텍스처 + 베이스색(빛 반사는 공통적으로 무지개빛)
    const NACRE_STRENGTH = 0.6;
    // 옻칠(검정 광택) 노드
    const LACQUER_NODES = ['box-top', 'box_bottom'];

    // 뚜껑 구성 노드
    const LID_PARTS = [
        'box-top',
        'box-top-inner',
        'top-flower',
        'top-corner',
        'top-butterfly',
        'top-leaf',
    ];
    const LID_HINGE = 'box-top';
    const LID_OPEN_AXIS = 'x';
    const LID_OPEN_ANGLE = -Math.PI / 2;

    // 스크롤 연출
    const VIEW_FILL = 0.5;
    const BOX_FROM_BOTTOM = 0.35;
    const SCROLL_ROT_AXIS = 'x';
    const SCROLL_ROT_FROM = Math.PI / 2;
    const SCROLL_ROT_TO = Math.PI / 8;

    // 스크롤 트랙
    const ROT_VH = 1.0;
    const HOLD_VH = 0.05;
    const OPEN_VH = 0.3;
    const ANIM_VH = ROT_VH + HOLD_VH + OPEN_VH;
    const STICKY_VH = 2.5;
    const EXIT_VH = 1.0;
    const TRACK_VH = 1.0 + STICKY_VH + EXIT_VH;
    const ROT_END = ROT_VH / ANIM_VH;
    const OPEN_POINT = (ROT_VH + HOLD_VH) / ANIM_VH;
    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    // 떨잠: { idx: archive.js 항목 번호, model: 0=hairpin.glb, 1=hairpin2.glb }
    const SHARD_DEFS = [
        { idx: 9, model: 0 }, // oxfam
        { idx: 3, model: 1 }, // monimo
        { idx: 2, model: 0 }, // myportfolio
        { idx: 0, model: 0 }, // cusme
        { idx: 5, model: 1 }, // dcamp
    ];
    const SHARD_THUMB_IDX = SHARD_DEFS.map((d) => d.idx);
    const SHARD_THUMBS = SHARD_THUMB_IDX.map((i) => archiveData[i].images.thumb);
    const SHARD_COUNT = SHARD_DEFS.length;
    const SHARD_REL = 0.32;
    const HAIRPIN_BASE_ROT = [
        { x: 0, y: Math.PI, z: 0 },
    ];
    const HAIRPIN_THUMB_ROT = -Math.PI * 0.25;
    const HAIRPIN2_THUMB_ROT = 0;
    const THUMB_ROT = [HAIRPIN_THUMB_ROT, HAIRPIN2_THUMB_ROT];
    const HAIRPIN_FLOWER_ROT = -Math.PI / 2;
    const HAIRPIN2_FLOWER_ROT = -Math.PI / 2;
    const FLOWER_ROT = [HAIRPIN_FLOWER_ROT, HAIRPIN2_FLOWER_ROT];
    const FLOWER_MIRROR = [true, false];
    // flower 뒷면 텍스트 스타일
    const FLOWER_TEXT_STYLE = {
        titleSizeRatio: 0.1, // 제목 폰트 크기
        titleWeight: 700,
        // titleFontFamily: "'Diphylleia', serif",
        titleYRatio: 0.5, // 제목 Y 위치
        titleMaxWidthRatio: 0.8, // 제목 최대 폭
        titleLineHeightRatio: 1, // 제목 줄간격
        titleLetterSpacingEm: 0.05, // 제목 자간
        titleUppercase: true, // 제목 대문자 변환
    };
    // scatter 화면 제약
    const SCATTER_MAX_WIDTH_PX = 1400;
    const SCATTER_MAX_WIDTH_RATIO_SMALL = 0.8;
    const SCATTER_MAX_HEIGHT_RATIO = 0.8;
    const SCATTER_VIEW_MARGIN_PX = 8;
    const IN_BOX_SCALE = 0.7;
    const NACRE_GROUPS = [
        {
            names: ['top-flower'],
            url: nacreRedUrl,
            base: 0xffffff
        },
        {
            names: ['top-butterfly'],
            url: nacrePurpleUrl,
            base: 0xffffff,
        },
        {
            names: ['top-leaf', 'side-butterfly'],
            url: nacreWhiteUrl,
            base: 0xffffff,
        },
        {
            names: ['top-corner', 'side-corner', 'side-flower'],
            url: nacreBeigeUrl,
            base: 0xffffff,
        },
    ];

    export default {
        name: 'FeaturedWork',
        data() {
            return {
                cursorHint: {
                    visible: false,
                    x: 0,
                    y: 0,
                    text: '',
                },
                frontPanel: {
                    visible: false,
                    x: 0,
                    y: 0,
                    summary: '',
                    duration: '',
                    stack: '',
                    href: '',
                    target: '_blank',
                    linkText: '',
                },
                isPinned: false,
                isExiting: false,
                pinExitY: 0,
            };
        },
        computed: {
            cursorHintStyle() {
                return {
                    left: `${this.cursorHint.x}px`,
                    top: `${this.cursorHint.y}px`,
                };
            },
            frontPanelStyle() {
                return {
                    left: `${this.frontPanel.x}px`,
                    top: `${this.frontPanel.y}px`,
                };
            },
            pinLayerStyle() {
                if (!this.isExiting) return null;
                return {
                    transform: `translate3d(0, ${this.pinExitY}px, 0)`,
                };
            },
        },
        mounted() {
            this.$el.style.setProperty('--fw-track-vh', String(TRACK_VH));
            this.$el.style.setProperty('--fw-pinned-vh', String(STICKY_VH + EXIT_VH));
            this.$el.style.height = `${TRACK_VH * 100}vh`;
            window.addEventListener('scroll', this.onFeaturedWorkScroll, {
                passive: true,
            });
            window.addEventListener('resize', this.onResize);
            this.initThree();
            this.$nextTick(() => this.onFeaturedWorkScroll());
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
            window.removeEventListener('scroll', this.onFeaturedWorkScroll);
            const canvas = this.$refs.canvas;
            if (canvas) {
                canvas.removeEventListener('pointermove', this.onShardHover);
                canvas.removeEventListener('pointerleave', this.onShardLeave);
                canvas.removeEventListener('click', this.onShardClick);
            }
            if (this.openTimer) clearTimeout(this.openTimer);
            if (this.lidRaf) cancelAnimationFrame(this.lidRaf);
            if (this.shardRaf) cancelAnimationFrame(this.shardRaf);
            if (this.controls) this.controls.dispose();
            if (this.renderer) this.renderer.dispose();
        },
        methods: {
            async initThree() {
                const THREE = await import('three');
                const { GLTFLoader } = await import(
                    'three/examples/jsm/loaders/GLTFLoader.js'
                );
                const { OrbitControls } = await import(
                    'three/examples/jsm/controls/OrbitControls.js'
                );
                const { RoomEnvironment } = await import(
                    'three/examples/jsm/environments/RoomEnvironment.js'
                );

                this.three = THREE;

                const canvas = this.$refs.canvas;
                if (!canvas) return;

                const w = canvas.clientWidth;
                const h = canvas.clientHeight;

                this.renderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                });
                this.renderer.setSize(w, h);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.renderer.outputColorSpace = THREE.SRGBColorSpace;
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 0.85;

                this.scene = new THREE.Scene();

                // 환경맵 (자개 광택/반사·이리데센스 표현에 필요)
                const pmrem = new THREE.PMREMGenerator(this.renderer);
                this.scene.environment = pmrem.fromScene(
                    new RoomEnvironment(),
                    0.04,
                ).texture;
                pmrem.dispose();

                this.camera = new THREE.PerspectiveCamera(50, w / h, 0.05, 200);
                this.controls = new OrbitControls(this.camera, canvas);
                this.controls.enablePan = false;
                this.controls.enableZoom = false;
                this.controls.enableRotate = false;

                const light = new THREE.DirectionalLight(0xffffff, 0.6);
                light.position.set(3, 4, 5);
                this.scene.add(light);
                this.scene.add(new THREE.AmbientLight(0xffffff, 0.08));

                // 환경광
                if ('environmentIntensity' in this.scene) {
                    this.scene.environmentIntensity = 0.35;
                }

                this.shardScene = new THREE.Scene();
                this.shardScene.environment = this.scene.environment;
                if ('environmentIntensity' in this.shardScene) {
                    this.shardScene.environmentIntensity = 0.5;
                }
                const slight = new THREE.DirectionalLight(0xffffff, 0.7);
                slight.position.set(3, 4, 5);
                this.shardScene.add(slight);
                this.shardScene.add(new THREE.AmbientLight(0xffffff, 0.15));

                this.noiseTex = this.makeNoiseTexture();

                const loader = new GLTFLoader();
                loader.load(nacreboxUrl, (gltf) => {
                    const model = gltf.scene;
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());

                    model.position.sub(center);
                    this.scene.add(model);

                    this.applyNacreMaterial(model);

                    this.model = model;

                    const guide = model.getObjectByName('box_top-guide');
                    if (guide) guide.visible = false;

                    this.setupLid(model);

                    const maxDim = Math.max(size.x, size.y, size.z);
                    const fov = (this.camera.fov * Math.PI) / 180;
                    const dist = maxDim / (2 * VIEW_FILL * Math.tan(fov / 2));
                    this.camDist = dist;
                    this.camera.position.set(0, 0, dist);
                    this.camera.lookAt(0, 0, 0);
                    this.controls.update();

                    const viewH = maxDim / VIEW_FILL;
                    model.position.y -= (0.5 - BOX_FROM_BOTTOM) * viewH;

                    const origin = model.position.clone();

                    // 박스 내부 캐비티 경계(월드 좌표) 계산
                    model.updateMatrixWorld(true);
                    this.boxInner = null;
                    const innerNode =
                        model.getObjectByName('box_bottom_inner');
                    if (innerNode) {
                        this.boxInner = new THREE.Box3().setFromObject(
                            innerNode,
                        );
                    }

                    const hpLoader = new GLTFLoader();
                    const urls = [hairpinUrl, hairpin2Url];
                    this.hairpinProtos = [];
                    let loaded = 0;
                    urls.forEach((url, idx) => {
                        hpLoader.load(url, (hp) => {
                            this.hairpinProtos[idx] = hp.scene;
                            loaded += 1;
                            if (loaded === urls.length) {
                                this.setupShards(maxDim, origin);
                                this.onFeaturedWorkScroll();
                                this.renderScene();
                            }
                        });
                    });

                    this.onFeaturedWorkScroll();
                    this.renderScene();
                });

                canvas.addEventListener('pointermove', this.onShardHover);
                canvas.addEventListener('pointerleave', this.onShardLeave);
                canvas.addEventListener('click', this.onShardClick);
            },

            createTexture(url) {
                const THREE = this.three;
                const tex = new THREE.TextureLoader().load(url, () =>
                    this.renderScene(),
                );
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false;
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;
                return tex;
            },

            makeNoiseTexture() {
                const THREE = this.three;
                const size = 64;
                const data = new Uint8Array(size * size * 4);
                for (let i = 0; i < size * size; i++) {
                    const v = Math.floor(Math.random() * 256);
                    data[i * 4] = v;
                    data[i * 4 + 1] = v;
                    data[i * 4 + 2] = v;
                    data[i * 4 + 3] = 255;
                }
                const tex = new THREE.DataTexture(data, size, size);
                tex.colorSpace = THREE.NoColorSpace;
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;
                tex.magFilter = THREE.LinearFilter;
                tex.minFilter = THREE.LinearFilter;
                tex.repeat.set(3, 3);
                tex.needsUpdate = true;
                return tex;
            },

            makeIridescentMaterial(tex, base, strength) {
                const THREE = this.three;
                return new THREE.MeshPhysicalMaterial({
                    map: tex,
                    color: new THREE.Color(base),
                    roughness: 0.16,
                    metalness: 0.0,
                    iridescence: strength,
                    iridescenceIOR: 1.35,
                    iridescenceThicknessRange: [100, 800],
                    iridescenceThicknessMap: this.noiseTex,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.1,
                    envMapIntensity: 0.9,
                });
            },

            // 옻칠
            makeLacquerMaterial() {
                const THREE = this.three;
                return new THREE.MeshPhysicalMaterial({
                    color: new THREE.Color(0x0a0a0a),
                    roughness: 0.05,
                    metalness: 0.0,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.04,
                    envMapIntensity: 0.6,
                });
            },

            applyMaterialToNodes(root, names, material) {
                names.forEach((name) => {
                    const node = root.getObjectByName(name);
                    if (!node) return;
                    node.traverse((obj) => {
                        if (obj.isMesh) obj.material = material;
                    });
                });
            },

            applyNacreMaterial(root) {
                NACRE_GROUPS.forEach((group) => {
                    const tex = this.createTexture(group.url);
                    const material = this.makeIridescentMaterial(
                        tex,
                        group.base,
                        NACRE_STRENGTH,
                    );
                    this.applyMaterialToNodes(root, group.names, material);
                });

                this.applyMaterialToNodes(
                    root,
                    LACQUER_NODES,
                    this.makeLacquerMaterial(),
                );
            },

            makeThumbMaterial(url, plateAspect = 1, rotation = 0) {
                const THREE = this.three;
                const swap =
                    Math.abs(Math.round(rotation / (Math.PI / 2)) % 2) === 1;
                const tex = new THREE.TextureLoader().load(url, (t) => {
                    this.fitThumbCover(t, plateAspect, swap);
                    this.renderScene();
                });
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false;
                tex.wrapS = THREE.ClampToEdgeWrapping;
                tex.wrapT = THREE.ClampToEdgeWrapping;
                tex.center.set(0.5, 0.5);
                tex.rotation = rotation;
                return new THREE.MeshPhysicalMaterial({
                    map: tex,
                    color: 0xffffff,
                    roughness: 0.3,
                    metalness: 0.0,
                    clearcoat: 0.8,
                    clearcoatRoughness: 0.15,
                    envMapIntensity: 1.0,
                    side: THREE.DoubleSide,
                });
            },

            makeJadeTitleTexture(
                info,
                plateAspect = 1,
                rotation = 0,
                swap = false,
                mirror = true,
            ) {
                const THREE = this.three;
                const H = 512;
                const aspect = swap ? 1 / (plateAspect || 1) : plateAspect || 1;
                const W = Math.max(64, Math.round(H * aspect));
                const canvas = document.createElement('canvas');
                canvas.width = W;
                canvas.height = H;
                const ctx = canvas.getContext('2d');
                const bgImg = new Image();

                const drawImageCover = (img) => {
                    const iw = img.naturalWidth || img.width;
                    const ih = img.naturalHeight || img.height;
                    if (!iw || !ih) return false;
                    const scale = Math.max(W / iw, H / ih);
                    const dw = iw * scale;
                    const dh = ih * scale;
                    const dx = (W - dw) * 0.5;
                    const dy = (H - dh) * 0.5;
                    ctx.drawImage(img, dx, dy, dw, dh);
                    return true;
                };

                const draw = () => {
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.clearRect(0, 0, W, H);
                    if (!drawImageCover(bgImg)) {
                        ctx.fillStyle = '#e8dec5';
                        ctx.fillRect(0, 0, W, H);
                    }
                    if (mirror) {
                        ctx.translate(W, 0);
                        ctx.scale(-1, 1);
                    }
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const ts = Math.round(H * FLOWER_TEXT_STYLE.titleSizeRatio);
                    ctx.font = `${FLOWER_TEXT_STYLE.titleWeight} ${ts}px ${FLOWER_TEXT_STYLE.titleFontFamily}`;
                    ctx.fillStyle = '#111111';
                    this.wrapText(
                        ctx,
                        info.title,
                        W / 2,
                        H * FLOWER_TEXT_STYLE.titleYRatio,
                        W * FLOWER_TEXT_STYLE.titleMaxWidthRatio,
                        ts * FLOWER_TEXT_STYLE.titleLineHeightRatio,
                        ts * FLOWER_TEXT_STYLE.titleLetterSpacingEm,
                        FLOWER_TEXT_STYLE.titleUppercase,
                    );
                };

                draw();
                const tex = new THREE.CanvasTexture(canvas);
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false;
                tex.wrapS = THREE.ClampToEdgeWrapping;
                tex.wrapT = THREE.ClampToEdgeWrapping;
                tex.center.set(0.5, 0.5);
                tex.rotation = rotation;
                bgImg.onload = () => {
                    draw();
                    tex.needsUpdate = true;
                    this.renderScene();
                };
                bgImg.src = jadeUrl;
                if (document.fonts && document.fonts.ready) {
                    document.fonts.ready.then(() => {
                        draw();
                        tex.needsUpdate = true;
                        this.renderScene();
                    });
                }
                return tex;
            },

            formatDuration(duration) {
                if (!duration) return '';
                const start = duration.start || '';
                const end = duration.end || '';
                if (start && end) return `${start} — ${end}`;
                return start || end;
            },

            archiveField(field) {
                if (!field) return '';
                return field.en || field.ko || '';
            },

            ancestorMeshHas(obj, key) {
                let p = obj;
                while (p) {
                    if ((p.name || '').toLowerCase().includes(key)) return true;
                    p = p.parent;
                }
                return false;
            },

            hideShardOverlays() {
                this.cursorHint.visible = false;
                this.frontPanel.visible = false;
            },

            updateFrontPanelPosition(shard) {
                if (
                    !shard ||
                    !this.camera ||
                    !this.renderer ||
                    (shard.userData.focus || 0) < 0.35
                ) {
                    this.frontPanel.visible = false;
                    return;
                }
                const canvas = this.renderer.domElement;
                const rect = canvas.getBoundingClientRect();
                const THREE = this.three;
                shard.updateMatrixWorld(true);
                const box = new THREE.Box3().setFromObject(shard);
                const bottom = new THREE.Vector3(
                    (box.min.x + box.max.x) * 0.5,
                    box.min.y,
                    (box.min.z + box.max.z) * 0.5,
                );
                bottom.applyMatrix4(shard.matrixWorld);
                const projected = bottom.clone().project(this.camera);
                const info = shard.userData.info || {};
                this.frontPanel.visible = true;
                this.frontPanel.x =
                    rect.left + (projected.x * 0.5 + 0.5) * rect.width;
                this.frontPanel.y =
                    rect.top + (-projected.y * 0.5 + 0.5) * rect.height + 14;
                this.frontPanel.summary = info.summary || '';
                this.frontPanel.duration = info.duration || '';
                this.frontPanel.stack = info.stack || '';
                this.frontPanel.href = info.href || '';
                this.frontPanel.target = info.target || '_blank';
                this.frontPanel.linkText = info.linkText || 'View Project';
            },

            pickShardHit(e) {
                const THREE = this.three;
                const canvas = this.$refs.canvas;
                const rect = canvas.getBoundingClientRect();
                const ndc = new THREE.Vector2(
                    ((e.clientX - rect.left) / rect.width) * 2 - 1,
                    -((e.clientY - rect.top) / rect.height) * 2 + 1,
                );
                if (!this.raycaster) this.raycaster = new THREE.Raycaster();
                this.raycaster.setFromCamera(ndc, this.camera);
                const hits = this.raycaster.intersectObjects(this.shards, true);
                if (!hits.length) return null;
                const mesh = hits[0].object;
                let shard = mesh;
                while (shard && this.shards.indexOf(shard) === -1) {
                    shard = shard.parent;
                }
                if (!shard) return null;
                return {
                    shard,
                    isThumb: this.ancestorMeshHas(mesh, 'thumb'),
                    isFlower: this.ancestorMeshHas(mesh, 'flower'),
                };
            },

            transformText(text, uppercase = false) {
                const t = String(text || '');
                return uppercase ? t.toUpperCase() : t;
            },

            shouldApplyLetterSpacing(curr, next) {
                return curr !== ' ' && next !== ' ';
            },

            measureTextWithSpacing(ctx, text, letterSpacing = 0) {
                const src = String(text || '');
                if (!src) return 0;
                if (Math.abs(letterSpacing) < 1e-6) return ctx.measureText(src).width;
                const chars = Array.from(src);
                let w = 0;
                chars.forEach((ch, i) => {
                    w += ctx.measureText(ch).width;
                    if (
                        i < chars.length - 1 &&
                        this.shouldApplyLetterSpacing(ch, chars[i + 1])
                    ) {
                        w += letterSpacing;
                    }
                });
                return w;
            },

            drawTextWithSpacing(ctx, text, x, y, letterSpacing = 0) {
                const src = String(text || '');
                if (!src) return;
                if (Math.abs(letterSpacing) < 1e-6) {
                    ctx.fillText(src, x, y);
                    return;
                }
                const chars = Array.from(src);
                if (!chars.length) return;
                const total = this.measureTextWithSpacing(
                    ctx,
                    chars.join(''),
                    letterSpacing,
                );
                let cx = x - total / 2;
                const prevAlign = ctx.textAlign;
                ctx.textAlign = 'left';
                chars.forEach((ch, i) => {
                    ctx.fillText(ch, cx, y);
                    cx += ctx.measureText(ch).width;
                    if (
                        i < chars.length - 1 &&
                        this.shouldApplyLetterSpacing(ch, chars[i + 1])
                    ) {
                        cx += letterSpacing;
                    }
                });
                ctx.textAlign = prevAlign;
            },

            wrapText(
                ctx,
                text,
                x,
                y,
                maxWidth,
                lineHeight,
                letterSpacing = 0,
                uppercase = false,
            ) {
                const src = this.transformText(text, uppercase);
                const words = src.split(' ');
                const lines = [];
                let line = '';
                for (const word of words) {
                    const test = line ? `${line} ${word}` : word;
                    if (
                        this.measureTextWithSpacing(ctx, test, letterSpacing) > maxWidth &&
                        line
                    ) {
                        lines.push(line);
                        line = word;
                    } else {
                        line = test;
                    }
                }
                if (line) lines.push(line);
                const startY = y - ((lines.length - 1) * lineHeight) / 2;
                lines.forEach((l, i) =>
                    this.drawTextWithSpacing(
                        ctx,
                        l,
                        x,
                        startY + i * lineHeight,
                        letterSpacing,
                    ),
                );
            },

            // rim/pin
            makeSilverMaterial() {
                const THREE = this.three;
                const tex = new THREE.TextureLoader().load(metalUrl, () =>
                    this.renderScene(),
                );
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false;
                return new THREE.MeshPhysicalMaterial({
                    map: tex,
                    color: 0xffffff,
                    metalness: 1.0,
                    roughness: 0.22,
                    clearcoat: 0.3,
                    clearcoatRoughness: 0.15,
                    envMapIntensity: 1.3,
                });
            },

            // flower
            makeJadeMaterial() {
                const THREE = this.three;
                const tex = new THREE.TextureLoader().load(jadeUrl, () =>
                    this.renderScene(),
                );
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false;
                return new THREE.MeshPhysicalMaterial({
                    map: tex,
                    color: 0xe8dec5,
                    metalness: 0.0,
                    roughness: 0.35,
                    transmission: 0.35,
                    ior: 1.5,
                    thickness: 0.6,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.2,
                    sheen: 0.4,
                    sheenColor: new THREE.Color(0xfff4e0),
                    envMapIntensity: 0.9,
                });
            },

            setPlanarUV(mesh) {
                const THREE = this.three;
                const geo = mesh.geometry;
                const pos = geo.attributes.position;
                if (!pos) return 1;
                geo.computeBoundingBox();
                const bb = geo.boundingBox;
                const size = new THREE.Vector3();
                bb.getSize(size);
                const axes = [
                    ['x', size.x],
                    ['y', size.y],
                    ['z', size.z],
                ].sort((a, b) => a[1] - b[1]);
                const rest = axes.slice(1).sort((a, b) => b[1] - a[1]);
                const ua = rest[0][0];
                const va = rest[1][0];
                const get = (axis, i) => {
                    if (axis === 'x') return pos.getX(i);
                    if (axis === 'y') return pos.getY(i);
                    return pos.getZ(i);
                };
                const uMin = bb.min[ua];
                const vMin = bb.min[va];
                const uR = size[ua] || 1;
                const vR = size[va] || 1;
                const n = pos.count;
                const uv = new Float32Array(n * 2);
                for (let i = 0; i < n; i++) {
                    uv[i * 2] = (get(ua, i) - uMin) / uR;
                    uv[i * 2 + 1] = (get(va, i) - vMin) / vR;
                }
                geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
                return uR / vR;
            },

            computePlateAspect(mesh) {
                const geo = mesh && mesh.geometry;
                const pos = geo && geo.attributes.position;
                const uv = geo && geo.attributes.uv;
                if (!pos || !uv) return 1;
                let Suu = 0;
                let Suv = 0;
                let Su = 0;
                let Svv = 0;
                let Sv = 0;
                const n = pos.count;
                const bu = [0, 0, 0];
                const bv = [0, 0, 0];
                const b1 = [0, 0, 0];
                for (let i = 0; i < n; i++) {
                    const u = uv.getX(i);
                    const v = uv.getY(i);
                    const px = pos.getX(i);
                    const py = pos.getY(i);
                    const pz = pos.getZ(i);
                    Suu += u * u;
                    Suv += u * v;
                    Su += u;
                    Svv += v * v;
                    Sv += v;
                    bu[0] += u * px;
                    bu[1] += u * py;
                    bu[2] += u * pz;
                    bv[0] += v * px;
                    bv[1] += v * py;
                    bv[2] += v * pz;
                    b1[0] += px;
                    b1[1] += py;
                    b1[2] += pz;
                }
                const inv = this.invert3([
                    [Suu, Suv, Su],
                    [Suv, Svv, Sv],
                    [Su, Sv, n],
                ]);
                if (!inv) return 1;
                const A = [0, 0, 0];
                const B = [0, 0, 0];
                for (let c = 0; c < 3; c++) {
                    const rhs = [bu[c], bv[c], b1[c]];
                    A[c] =
                        inv[0][0] * rhs[0] +
                        inv[0][1] * rhs[1] +
                        inv[0][2] * rhs[2];
                    B[c] =
                        inv[1][0] * rhs[0] +
                        inv[1][1] * rhs[1] +
                        inv[1][2] * rhs[2];
                }
                const lenA = Math.hypot(A[0], A[1], A[2]);
                const lenB = Math.hypot(B[0], B[1], B[2]);
                if (!lenA || !lenB) return 1;
                return lenA / lenB;
            },

            invert3(m) {
                const a = m[0][0];
                const b = m[0][1];
                const c = m[0][2];
                const d = m[1][0];
                const e = m[1][1];
                const f = m[1][2];
                const g = m[2][0];
                const h = m[2][1];
                const i = m[2][2];
                const A = e * i - f * h;
                const B = -(d * i - f * g);
                const C = d * h - e * g;
                const det = a * A + b * B + c * C;
                if (Math.abs(det) < 1e-9) return null;
                const id = 1 / det;
                return [
                    [A * id, (c * h - b * i) * id, (b * f - c * e) * id],
                    [B * id, (a * i - c * g) * id, (c * d - a * f) * id],
                    [C * id, (b * g - a * h) * id, (a * e - b * d) * id],
                ];
            },

            fitThumbCover(tex, plateAspect, swap) {
                const img = tex.image;
                if (!img || !img.width) return;
                const imgAspect = img.width / img.height;
                if (swap) {
                    const r = imgAspect * plateAspect;
                    if (r >= 1) tex.repeat.set(1 / r, 1);
                    else tex.repeat.set(1, r);
                } else {
                    if (imgAspect >= plateAspect) {
                        tex.repeat.set(plateAspect / imgAspect, 1);
                    } else {
                        tex.repeat.set(1, imgAspect / plateAspect);
                    }
                }
                tex.needsUpdate = true;
            },

            setupShards(maxDim, origin) {
                const THREE = this.three;
                const protos = (this.hairpinProtos || []).filter(Boolean);
                if (!protos.length) return;
                this.shards = [];
                const targetR = SHARD_REL * maxDim;

                this.focusPos = new THREE.Vector3(0, 0, (this.camDist || 1) * 0.35);
                this.selected = null;

                for (let i = 0; i < SHARD_COUNT; i++) {
                    const item = archiveData[SHARD_THUMB_IDX[i]];
                    // 떨잠 뒷면 상세 정보
                    const info = {
                        title: this.archiveField(item.title),
                        summary: this.archiveField(item.summary),
                        duration: this.formatDuration(item.desc && item.desc.duration),
                        stack: this.archiveField(item.desc && item.desc.stack),
                        href: item.link && item.link.href,
                        target: (item.link && item.link.target) || '_blank',
                        linkText: this.archiveField(item.link && item.link.text) ||
                            'View Project',
                    };
                    const modelIdx = Math.min(
                        SHARD_DEFS[i].model,
                        protos.length - 1,
                    );
                    const proto = protos[modelIdx];
                    const pbox = new THREE.Box3().setFromObject(proto);
                    const pcenter = pbox.getCenter(new THREE.Vector3());
                    const psize = pbox.getSize(new THREE.Vector3());
                    const pMax = Math.max(psize.x, psize.y, psize.z) || 1;
                    const baseScale = (targetR * 2) / pMax;
                    const pin = proto.clone(true);
                    pin.position.sub(pcenter);
                    const baseRot =
                        HAIRPIN_BASE_ROT[modelIdx] || HAIRPIN_BASE_ROT[0];
                    pin.rotation.set(baseRot.x, baseRot.y, baseRot.z);

                    const thumb = pin.getObjectByName('thumb');
                    const thumbMeshes = [];
                    let thumbAspect = 1;
                    let thumbRot = THUMB_ROT[0];
                    let thumbFrontMat = null;
                    let thumbBackMat = null;
                    if (thumb) {
                        let tmesh = null;
                        thumb.traverse((o) => {
                            if (o.isMesh) {
                                thumbMeshes.push(o);
                                if (!tmesh) tmesh = o;
                            }
                        });
                        thumbAspect = tmesh
                            ? this.computePlateAspect(tmesh)
                            : 1;
                        thumbRot =
                            THUMB_ROT[modelIdx] !== undefined
                                ? THUMB_ROT[modelIdx]
                                : THUMB_ROT[0];
                        thumbFrontMat = this.makeThumbMaterial(
                            SHARD_THUMBS[i],
                            thumbAspect,
                            thumbRot,
                        );
                        thumbBackMat = this.makeThumbMaterial(
                            SHARD_THUMBS[i],
                            thumbAspect,
                            thumbRot,
                        );
                        thumbMeshes.forEach((m) => {
                            m.material = thumbFrontMat;
                        });
                    }

                    const silver = this.makeSilverMaterial();
                    const ancestorHas = (obj, key) => {
                        let p = obj;
                        while (p) {
                            if ((p.name || '').toLowerCase().includes(key))
                                return true;
                            p = p.parent;
                        }
                        return false;
                    };

                    const flowerNode = pin.getObjectByName('flower');
                    const flowerMeshes = [];
                    let flowerAspect = 1;
                    if (flowerNode) {
                        flowerNode.traverse((o) => {
                            if (o.isMesh) {
                                flowerAspect = this.setPlanarUV(o);
                                flowerMeshes.push(o);
                            }
                        });
                    }
                    const fRot =
                        FLOWER_ROT[modelIdx] !== undefined
                            ? FLOWER_ROT[modelIdx]
                            : FLOWER_ROT[0];
                    const fSwap =
                        Math.abs(Math.round(fRot / (Math.PI / 2)) % 2) === 1;
                    const fMirror =
                        FLOWER_MIRROR[modelIdx] !== undefined
                            ? FLOWER_MIRROR[modelIdx]
                            : FLOWER_MIRROR[0];

                    const flowerFrontMat = this.makeJadeMaterial();
                    flowerFrontMat.side = THREE.DoubleSide;
                    flowerFrontMat.map = this.makeJadeTitleTexture(
                        info,
                        flowerAspect,
                        fRot,
                        fSwap,
                        fMirror,
                    );
                    flowerFrontMat.needsUpdate = true;
                    const flowerBackMat = this.makeJadeMaterial();
                    flowerBackMat.side = THREE.DoubleSide;

                    pin.traverse((o) => {
                        if (!o.isMesh) return;
                        if (ancestorHas(o, 'thumb')) return;
                        if (ancestorHas(o, 'flower')) o.material = flowerFrontMat;
                        else o.material = silver;
                    });

                    const group = new THREE.Group();
                    group.add(pin);

                    const focusQuat = this.computeThumbFocusQuat(group, thumb);

                    const t = SHARD_COUNT > 1 ? i / (SHARD_COUNT - 1) : 0.5;
                    const fanX = (t - 0.5) * 2;
                    const dir = new THREE.Vector3(
                        fanX * 1.2 + (Math.random() - 0.5) * 0.2,
                        0.35 + Math.random() * 0.95,
                        (Math.random() - 0.5) * 0.25,
                    ).normalize();

                    // 박스 내부에 떨잠 수납
                    const inBoxPos = origin.clone();
                    if (this.boxInner) {
                        const inboxRadius =
                            pMax * baseScale * 0.5 * IN_BOX_SCALE;
                        const c = this.boxInner.getCenter(
                            new THREE.Vector3(),
                        );
                        const sz = this.boxInner.getSize(
                            new THREE.Vector3(),
                        );
                        const usableX = Math.max(
                            0,
                            sz.x * 0.5 - inboxRadius,
                        );
                        inBoxPos.set(
                            c.x + (t - 0.5) * 2 * usableX,
                            this.boxInner.min.y +
                                Math.min(inboxRadius, sz.y * 0.5),
                            c.z,
                        );
                    }

                    group.userData = {
                        href: item.link && item.link.href,
                        origin: origin.clone(),
                        inBoxPos,
                        dir,
                        dist:
                            maxDim *
                            (0.6 + Math.abs(fanX) * 0.7 + Math.random() * 0.4),
                        scatterRadius: pMax * baseScale * 0.5,
                        scaleBase: baseScale,
                        rot0z: Math.random() * Math.PI * 2,
                        spinZ: (Math.random() - 0.5) * 2,
                        floatPhase: Math.random() * Math.PI * 2,
                        floatAmp: maxDim * (0.03 + Math.random() * 0.03),
                        floatSpeed: 0.6 + Math.random() * 0.6,
                        focus: 0,
                        focusTarget: 0,
                        focusQuat,
                        focusScale: baseScale * 1.4,
                        flip: 0,
                        flipTarget: 0,
                        info,
                        flowerMeshes,
                        flowerFrontMat,
                        flowerBackMat,
                        thumbMeshes,
                        thumbFrontMat,
                        thumbBackMat,
                    };

                    group.position.copy(origin);
                    group.scale.setScalar(0);
                    group.visible = false;
                    this.shardScene.add(group);
                    this.shards.push(group);
                }
                this.scatterAmt = 0;
                this.scatterTarget = 0;
                this.isOpen = false;
            },

            computeThumbFocusQuat() {
                return new this.three.Quaternion();
            },

            // scatter 위치
            clampScatterToView(pos, radiusWorld = 0) {
                if (!this.camera || !this.renderer) return pos;
                const canvas = this.renderer.domElement;
                const vw = canvas.clientWidth || window.innerWidth || 1;
                const vh = canvas.clientHeight || window.innerHeight || 1;
                const fovRad = ((this.camera.fov || 50) * Math.PI) / 180;
                const depth = Math.max(
                    0.001,
                    (this.camera.position && this.camera.position.z) - pos.z,
                );
                const halfH = Math.tan(fovRad * 0.5) * depth;
                const halfW = halfH * (this.camera.aspect || vw / vh || 1);

                const maxWidthRatio =
                    vw < SCATTER_MAX_WIDTH_PX
                        ? SCATTER_MAX_WIDTH_RATIO_SMALL
                        : SCATTER_MAX_WIDTH_PX / vw;
                const halfWCap = halfW * maxWidthRatio;
                const halfHCap = halfH * SCATTER_MAX_HEIGHT_RATIO * 0.5;

                const marginX = halfW * ((SCATTER_VIEW_MARGIN_PX * 2) / vw);
                const marginY = halfH * ((SCATTER_VIEW_MARGIN_PX * 2) / vh);

                const minX = -Math.max(0, halfWCap - marginX - radiusWorld);
                const maxX = Math.max(0, halfWCap - marginX - radiusWorld);
                const minY = -Math.max(0, halfHCap - marginY - radiusWorld);
                const maxY = Math.max(0, halfHCap - marginY - radiusWorld);

                pos.x = Math.max(minX, Math.min(maxX, pos.x));
                pos.y = Math.max(minY, Math.min(maxY, pos.y));
                return pos;
            },

            applyShards(amt, now) {
                if (!this.shards) return;
                const lidClosing =
                    this.lidTarget === 0 && (this.lidAmt || 0) < 0.9;
                for (const s of this.shards) {
                    const d = s.userData;
                    s.visible = amt > 0.001 && !lidClosing;

                    const floatFull = d.origin
                        .clone()
                        .addScaledVector(d.dir, d.dist);
                    const pos = (d.inBoxPos || d.origin)
                        .clone()
                        .lerp(floatFull, amt);
                    pos.y +=
                        Math.sin(now * 0.001 * d.floatSpeed + d.floatPhase) *
                        d.floatAmp *
                        amt;
                    this.clampScatterToView(pos, (d.scatterRadius || 0) * amt);
                    let sc =
                        d.scaleBase * (IN_BOX_SCALE + (1 - IN_BOX_SCALE) * amt);
                    const wob =
                        Math.sin(now * 0.0006 * d.floatSpeed + d.floatPhase) *
                        0.15 *
                        amt;
                    const rz = d.rot0z + d.spinZ * amt + wob;
                    const THREE = this.three;
                    const quat = new THREE.Quaternion().setFromEuler(
                        new THREE.Euler(0, 0, rz),
                    );

                    d.focus += (d.focusTarget - d.focus) * 0.15;
                    if (d.focus > 0.001 && this.focusPos) {
                        pos.lerp(this.focusPos, d.focus);
                        const fScale = d.focusScale || this.focusScale || sc;
                        sc += (fScale - sc) * d.focus;
                        if (d.focusQuat) quat.slerp(d.focusQuat, d.focus);
                    }

                    d.flip += ((d.flipTarget || 0) - d.flip) * 0.15;
                    if (d.flip > 0.001) {
                        const flipQ =
                            new THREE.Quaternion().setFromAxisAngle(
                                new THREE.Vector3(0, 1, 0),
                                d.flip * Math.PI,
                            );
                        quat.multiply(flipQ);
                    }
                    if (d.flowerMeshes && d.flowerMeshes.length) {
                        const useBack = d.flip > 0.5;
                        const flowerWant = useBack
                            ? d.flowerBackMat
                            : d.flowerFrontMat;
                        if (d.flowerMeshes[0].material !== flowerWant) {
                            d.flowerMeshes.forEach((m) => {
                                m.material = flowerWant;
                            });
                        }
                    }
                    if (d.thumbMeshes && d.thumbMeshes.length) {
                        const useBack = d.flip > 0.5;
                        const thumbWant = useBack
                            ? d.thumbBackMat
                            : d.thumbFrontMat;
                        if (
                            d.thumbFrontMat &&
                            d.thumbBackMat &&
                            d.thumbMeshes[0].material !== thumbWant
                        ) {
                            d.thumbMeshes.forEach((m) => {
                                m.material = thumbWant;
                            });
                        }
                    }

                    s.position.copy(pos);
                    s.scale.setScalar(sc);
                    s.quaternion.copy(quat);
                }
                if (this.selected) {
                    this.updateFrontPanelPosition(this.selected);
                }
            },

            ensureShardLoop() {
                if (this.shardRaf) return;
                const frame = () => {
                    const now = performance.now();
                    const t = this.scatterTarget;
                    this.scatterAmt += (t - this.scatterAmt) * 0.1;
                    if (Math.abs(t - this.scatterAmt) < 0.001) {
                        this.scatterAmt = t;
                    }
                    this.applyShards(this.scatterAmt, now);
                    this.renderScene();

                    const moving = Math.abs(t - this.scatterAmt) > 0.0005;
                    if (moving || (t === 1 && this.scatterAmt > 0.01)) {
                        this.shardRaf = requestAnimationFrame(frame);
                    } else {
                        this.shardRaf = null;
                    }
                };
                this.shardRaf = requestAnimationFrame(frame);
            },

            onShardLeave() {
                if (this.$refs.canvas) this.$refs.canvas.style.cursor = '';
                this.cursorHint.visible = false;
            },

            onShardHover(e) {
                const canvas = this.$refs.canvas;
                if (!canvas) return;
                const HINT_OFFSET = 18;

                if (!this.shards || this.scatterAmt < 0.6) {
                    canvas.style.cursor = '';
                    this.hideShardOverlays();
                    return;
                }

                const hit = this.pickShardHit(e);

                if (this.selected) {
                    this.updateFrontPanelPosition(this.selected);
                }

                if (hit && hit.shard === this.selected) {
                    canvas.style.cursor = 'pointer';
                    if (this.flipped && hit.isThumb) {
                        const info = this.selected.userData.info || {};
                        this.cursorHint.visible = true;
                        this.cursorHint.x = e.clientX + HINT_OFFSET;
                        this.cursorHint.y = e.clientY;
                        this.cursorHint.text = this.transformText(
                            info.linkText || 'View Project',
                            FLOWER_TEXT_STYLE.linkUppercase,
                        );
                    } else if (!this.flipped) {
                        this.cursorHint.visible = true;
                        this.cursorHint.x = e.clientX + HINT_OFFSET;
                        this.cursorHint.y = e.clientY;
                        this.cursorHint.text = 'click to flip';
                    } else {
                        this.cursorHint.visible = false;
                    }
                } else if (hit) {
                    canvas.style.cursor = 'pointer';
                    this.cursorHint.visible = false;
                } else {
                    canvas.style.cursor = '';
                    this.cursorHint.visible = false;
                }
            },

            onShardClick(e) {
                if (!this.shards || this.scatterAmt < 0.6) return;
                const hit = this.pickShardHit(e);
                const shard = hit && hit.shard;
                if (shard && shard === this.selected) {
                    if (this.flipped) {
                        if (hit.isThumb) {
                            const info = this.selected.userData.info;
                            if (info && info.href) {
                                window.open(info.href, info.target || '_blank');
                            }
                        }
                    } else {
                        this.setFlip(true);
                    }
                } else if (shard) {
                    this.selectShard(shard);
                } else {
                    this.selectShard(null);
                }
            },

            selectShard(shard) {
                this.selected = shard;
                this.flipped = false;
                this.cursorHint.visible = false;
                if (!shard) {
                    this.frontPanel.visible = false;
                }
                this.shards.forEach((s) => {
                    s.userData.focusTarget = s === shard ? 1 : 0;
                    s.userData.flipTarget = 0;
                });
                this.ensureShardLoop();
            },

            setFlip(on) {
                if (!this.selected) return;
                this.flipped = on;
                this.selected.userData.flipTarget = on ? 1 : 0;
                this.cursorHint.visible = false;
                this.ensureShardLoop();
                this.updateFrontPanelPosition(this.selected);
            },

            setupLid(model) {
                const THREE = this.three;
                const hinge = model.getObjectByName(LID_HINGE);

                model.updateMatrixWorld(true);

                const hingeWorld = new THREE.Vector3();
                hinge.getWorldPosition(hingeWorld);

                const pivot = new THREE.Group();
                model.add(pivot);
                pivot.position.copy(model.worldToLocal(hingeWorld.clone()));
                pivot.updateMatrixWorld(true);

                LID_PARTS.forEach((name) => {
                    const node = model.getObjectByName(name);
                    if (node) pivot.attach(node);
                });

                this.lid = pivot;
                this.lidClosed = pivot.rotation[LID_OPEN_AXIS];
                this.lidAmt = 0;
                this.lidTarget = 0;
            },

            setOpen(open) {
                if (this.isOpen === open) return;
                this.isOpen = open;
                if (this.openTimer) {
                    clearTimeout(this.openTimer);
                    this.openTimer = null;
                }
                if (open) {
                    this.lidTarget = 1;
                    this.ensureLidLoop();
                    this.openTimer = setTimeout(() => {
                        this.scatterTarget = 1;
                        this.ensureShardLoop();
                    }, 300);
                } else {
                    this.scatterTarget = 0;
                    this.ensureShardLoop();
                    this.openTimer = setTimeout(() => {
                        this.lidTarget = 0;
                        this.ensureLidLoop();
                    }, 300);
                }
            },

            ensureLidLoop() {
                if (this.lidRaf) return;
                const frame = () => {
                    const t = this.lidTarget;
                    this.lidAmt += (t - this.lidAmt) * 0.12;
                    if (Math.abs(t - this.lidAmt) < 0.001) this.lidAmt = t;
                    this.lid.rotation[LID_OPEN_AXIS] =
                        this.lidClosed + LID_OPEN_ANGLE * this.lidAmt;
                    this.renderScene();
                    this.lidRaf =
                        Math.abs(t - this.lidAmt) > 0.0005
                            ? requestAnimationFrame(frame)
                            : null;
                };
                this.lidRaf = requestAnimationFrame(frame);
            },

            onFeaturedWorkScroll() {
                const viewport = this.$refs.viewport;
                if (!viewport || !this.$el) return;

                const rect = this.$el.getBoundingClientRect();
                const viewportRect = viewport.getBoundingClientRect();
                const vh = window.innerHeight;
                const pinPx = STICKY_VH * vh;
                const animPx = ANIM_VH * vh;
                const sectionScroll = Math.max(0, -rect.top);
                const inSection = rect.top <= 0 && rect.bottom > 0;

                const isPinPhase = inSection && sectionScroll <= pinPx;
                const isExiting = inSection && sectionScroll > pinPx;
                const nextPinned = isPinPhase || isExiting;
                const nextExitY = isExiting ? rect.top + pinPx : 0;
                const wasPinned = this.isPinned;

                this.isPinned = nextPinned;
                this.isExiting = isExiting;
                this.pinExitY = nextExitY;

                if (wasPinned !== nextPinned) {
                    this.$nextTick(() => this.onResize());
                }

                if (!this.model) return;

                const entrance = clamp01((vh - viewportRect.top) / vh);
                this.model.scale.setScalar(entrance);

                let pinned = 0;
                if (isPinPhase) {
                    pinned = clamp01(sectionScroll / animPx);
                } else if (isExiting) {
                    pinned = 1;
                }

                const rp = clamp01(pinned / ROT_END);
                this.model.rotation[SCROLL_ROT_AXIS] =
                    SCROLL_ROT_FROM + (SCROLL_ROT_TO - SCROLL_ROT_FROM) * rp;

                this.setOpen(pinned >= OPEN_POINT);

                this.renderScene();
            },

            renderScene() {
                if (!this.renderer || !this.scene || !this.camera) return;
                this.renderer.render(this.scene, this.camera);
                if (this.shardScene) {
                    this.renderer.autoClear = false;
                    this.renderer.clearDepth();
                    this.renderer.render(this.shardScene, this.camera);
                    this.renderer.autoClear = true;
                }
            },
            onResize() {
                const canvas = this.$refs.canvas;
                const viewport = this.$refs.viewport;
                if (!canvas || !this.renderer || !this.camera) return;

                const w = this.isPinned
                    ? window.innerWidth
                    : viewport?.clientWidth || canvas.clientWidth;
                const h = this.isPinned
                    ? window.innerHeight
                    : viewport?.clientHeight || canvas.clientHeight;

                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
                if (this.model) this.onFeaturedWorkScroll();
            },
        },
    };
</script>

<style lang='scss' scoped>
    @use '@/assets/scss/base/variables' as *;

    #featured-work {
        position: relative;
        width: 100%;
        height: calc(var(--fw-track-vh, 4.5) * 100vh);

        .featured-work-viewport {
            position: relative;
            width: 100%;
            height: 100vh;
        }

        .featured-work-pin {
            width: 100%;
            height: 100%;

            &.is-pinned {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                z-index: 4;
                will-change: transform;
            }
        }

        .featured-work-trail {
            height: calc(var(--fw-pinned-vh, 3.5) * 100vh);
            pointer-events: none;
        }

        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }

        .shard-cursor-hint {
            position: fixed;
            z-index: 2;
            pointer-events: none;
            font-size: 0.75rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: $white;
            background-color: $black;
            mix-blend-mode: difference;
            padding: 4px 6px;
            margin-left: 8px;
        }

        .shard-front-panel {
            position: fixed;
            z-index: 2;
            transform: translateX(-50%);
            max-width: $tablet;
            text-align: center;
            pointer-events: auto;

            .summary {
                font-size: 1.4rem;
                font-weight: 600;
            }

            .duration,
            .stack {
                margin-top: 0.5rem;
                font-size: 1rem;
            }

            .link-btn {
                margin-top: 1rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                border-radius: 32px;
                border: 1px solid $white;
                color: $white;
                font-size: 0.8rem;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                transition: all 0.4s ease;

                &:hover {
                    background: rgba(236, 232, 218, 0.2);
                    transition: all 0.4s ease;
                }
            }
        }
    }
</style>
