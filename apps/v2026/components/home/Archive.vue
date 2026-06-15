<template>
    <div id='archive'>
        <div class='archive-sticky'>
            <canvas ref='canvas' />
        </div>
    </div>
</template>

<script>
    import nacreboxUrl from '@/assets/model/nacrebox.glb';
    import nacreRedUrl from '@/assets/model/texture/nacre_red.png';
    import nacrePurpleUrl from '@/assets/model/texture/nacre_purple.png';
    import nacreWhiteUrl from '@/assets/model/texture/nacre_white.png';
    import nacreBeigeUrl from '@/assets/model/texture/nacre_beige.png';

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
    const LID_HINGE = 'box-top'; // 회전 기준점
    const LID_OPEN_AXIS = 'x';
    const LID_OPEN_ANGLE = -Math.PI / 2;

    // 스크롤 연출
    const VIEW_FILL = 0.5;
    const BOX_FROM_BOTTOM = 0.35; // 고정 위치
    const SCROLL_ROT_AXIS = 'x';
    const SCROLL_ROT_FROM = Math.PI / 2;
    const SCROLL_ROT_TO = Math.PI / 8;

    // 각 단계가 차지하는 스크롤 길이(화면 높이 vh 배수)
    const ENTRANCE_VH = 1.0;
    const ROT_VH = 1.0;
    const HOLD_VH = 0.2;
    const LID_VH = 1.2;
    const PINNED_VH = ROT_VH + HOLD_VH + LID_VH;
    const TRACK_VH = ENTRANCE_VH + PINNED_VH;
    const ROT_END = ROT_VH / PINNED_VH;
    const LID_START = (ROT_VH + HOLD_VH) / PINNED_VH;
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const NACRE_GROUPS = [
        {
            names: ['top-flower', 'side-flower'],
            url: nacreRedUrl,
            base: 0xffffff
        },
        {
            names: ['top-butterfly', 'side-butterfly'],
            url: nacrePurpleUrl,
            base: 0xffffff,
        },
        {
            names: ['top-leaf'],
            url: nacreWhiteUrl,
            base: 0xffffff,
        },
        {
            names: ['top-corner', 'side-corner'],
            url: nacreBeigeUrl,
            base: 0xffffff,
        },
    ];

    export default {
        name: 'Archive',
        mounted() {
            // 단계 길이 합으로 스크롤 트랙 높이 설정
            this.$el.style.height = `${TRACK_VH * 100}vh`;
            this.initThree();
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
            window.removeEventListener('scroll', this.onArchiveScroll);
            if (this.lidRaf) cancelAnimationFrame(this.lidRaf);
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

                // 환경맵(자개 광택/반사·이리데센스 표현에 필요)
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
                this.controls.addEventListener('change', this.renderScene);

                const light = new THREE.DirectionalLight(0xffffff, 0.6);
                light.position.set(3, 4, 5);
                this.scene.add(light);
                this.scene.add(new THREE.AmbientLight(0xffffff, 0.08));

                // 환경광
                if ('environmentIntensity' in this.scene) {
                    this.scene.environmentIntensity = 0.35;
                }

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

                    // 스케일 1일 때 화면의 약 50%를 채우도록 카메라 거리 설정
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const fov = (this.camera.fov * Math.PI) / 180;
                    const dist = maxDim / (2 * VIEW_FILL * Math.tan(fov / 2));
                    this.camera.position.set(0, 0, dist);
                    this.camera.lookAt(0, 0, 0);
                    this.controls.update();

                    const viewH = maxDim / VIEW_FILL;
                    model.position.y -= (0.5 - BOX_FROM_BOTTOM) * viewH;

                    // 스크롤 진행도로 스케일/회전 초기화
                    this.onArchiveScroll();
                    this.renderScene();
                });

                window.addEventListener('resize', this.onResize);
                window.addEventListener('scroll', this.onArchiveScroll, {
                    passive: true,
                });
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

            // 옻칠: 검정 베이스 + 강한 광택 + 클리어코트
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

                // 옻칠 광택
                this.applyMaterialToNodes(
                    root,
                    LACQUER_NODES,
                    this.makeLacquerMaterial(),
                );
            },

            // 뚜껑 노드 회전
            setupLid(model) {
                const THREE = this.three;

                // 디버그: 실제 노드 이름 확인용
                const names = [];
                model.traverse((o) => o.name && names.push(o.name));
                console.log('[Archive] node names:', names);

                const hinge = model.getObjectByName(LID_HINGE);
                if (!hinge) {
                    console.warn('[Archive] hinge node not found:', LID_HINGE);
                    return;
                }

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
                this.lidOpen = false;
            },

            // 스크롤 진행도로 모델 스케일(진입) + 회전(top→side) + 뚜껑 열림 구동
            onArchiveScroll() {
                if (!this.model) return;
                const rect = this.$el.getBoundingClientRect();
                const vh = window.innerHeight;

                // 진입 스케일
                const entrance = clamp01((vh - rect.top) / vh);
                this.model.scale.setScalar(entrance);

                // 고정
                const pinnedDist = Math.max(rect.height - vh, 1);
                const pinned = clamp01(-rect.top / pinnedDist);

                // side 회전
                const rp = clamp01(pinned / ROT_END);
                this.model.rotation[SCROLL_ROT_AXIS] =
                    SCROLL_ROT_FROM + (SCROLL_ROT_TO - SCROLL_ROT_FROM) * rp;

                // 뚜껑 열림
                if (this.lid) {
                    const lp = clamp01(
                        (pinned - LID_START) / (1 - LID_START),
                    );
                    this.lid.rotation[LID_OPEN_AXIS] =
                        this.lidClosed + LID_OPEN_ANGLE * lp;
                }

                this.renderScene();
            },

            renderScene() {
                if (!this.renderer || !this.scene || !this.camera) return;
                this.renderer.render(this.scene, this.camera);
            },
            onResize() {
                const canvas = this.$refs.canvas;
                if (!canvas || !this.renderer || !this.camera) return;

                const w = canvas.clientWidth;
                const h = canvas.clientHeight;

                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
                this.onArchiveScroll();
            },
        },
    };
</script>

<style lang='scss' scoped>
    #archive {
        position: relative;
        width: 100%;

        .archive-sticky {
            position: sticky;
            top: 0;
            width: 100%;
            height: 100vh;
        }

        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
</style>
