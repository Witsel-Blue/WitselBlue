<template>
    <div id='archive'>
        <div class='archive-sticky'>
            <canvas ref='canvas' />
        </div>
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
    const ENTRANCE_VH = 1.0; // 진입 스케일
    const ROT_VH = 1.0; // top→side 회전(스크롤 스크럽)
    const HOLD_VH = 0.05; // 회전 후 바로 오픈되도록 최소 버퍼
    const OPEN_VH = 0.3; // 오픈 후 머무는 구간(짧게 → 올릴 때 바로 닫힘)
    const PINNED_VH = ROT_VH + HOLD_VH + OPEN_VH;
    const TRACK_VH = ENTRANCE_VH + PINNED_VH;
    const ROT_END = ROT_VH / PINNED_VH; // 회전 종료 지점
    const OPEN_POINT = (ROT_VH + HOLD_VH) / PINNED_VH; // 뚜껑+조각 트리거 지점
    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    // 흩어지는 핀: { idx: archive.js 항목 번호, model: 0=hairpin.glb, 1=hairpin2.glb }
    const SHARD_DEFS = [
        { idx: 9, model: 1 }, // oxfam
        { idx: 3, model: 0 }, // monimo
        { idx: 0, model: 0 }, // cusme
        { idx: 5, model: 1 }, // dcamp
        { idx: 2, model: 0 }, // myportfolio
    ];
    const SHARD_THUMB_IDX = SHARD_DEFS.map((d) => d.idx);
    const SHARD_THUMBS = SHARD_THUMB_IDX.map((i) => archiveData[i].images.thumb);
    const SHARD_COUNT = SHARD_DEFS.length;
    const SHARD_REL = 0.32; // 박스 최대치수 대비 핀 크기(클수록 큼)
    // 핀이 thumb 면을 카메라로 향하도록 기본 회전(모델 방향에 맞게 조정)
    const HAIRPIN_BASE_ROT = { x: 0, y: 0, z: 0 };
    // 모델별 썸네일 텍스처 회전: [0]=hairpin.glb, [1]=hairpin2.glb
    // ±90도면 cover 시 가로/세로 자동 보정됨
    const THUMB_ROT = [-Math.PI / 2, 0];
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
            const canvas = this.$refs.canvas;
            if (canvas) {
                canvas.removeEventListener('pointermove', this.onShardHover);
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
                this.controls.enableRotate = false; // 마우스 회전 막기

                const light = new THREE.DirectionalLight(0xffffff, 0.6);
                light.position.set(3, 4, 5);
                this.scene.add(light);
                this.scene.add(new THREE.AmbientLight(0xffffff, 0.08));

                // 환경광
                if ('environmentIntensity' in this.scene) {
                    this.scene.environmentIntensity = 0.35;
                }

                // 핀(hairpin) 전용 씬 - 박스 위에 항상 덮어 그려 겹침 방지
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

                    // 스케일 1일 때 화면의 약 50%를 채우도록 카메라 거리 설정
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const fov = (this.camera.fov * Math.PI) / 180;
                    const dist = maxDim / (2 * VIEW_FILL * Math.tan(fov / 2));
                    this.camDist = dist;
                    this.camera.position.set(0, 0, dist);
                    this.camera.lookAt(0, 0, 0);
                    this.controls.update();

                    const viewH = maxDim / VIEW_FILL;
                    model.position.y -= (0.5 - BOX_FROM_BOTTOM) * viewH;

                    // 박스에서 나올 핀(hairpin) 2종 로드 후 준비
                    const origin = model.position.clone();
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
                                this.onArchiveScroll();
                                this.renderScene();
                            }
                        });
                    });

                    // 스크롤 진행도로 스케일/회전 초기화
                    this.onArchiveScroll();
                    this.renderScene();
                });

                canvas.addEventListener('pointermove', this.onShardHover);
                canvas.addEventListener('click', this.onShardClick);
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

            // thumb 면(노드)에 들어갈 썸네일 머티리얼
            // plateAspect: thumb 판 가로/세로 비율, rotation: 텍스처 회전
            makeThumbMaterial(url, plateAspect = 1, rotation = 0) {
                const THREE = this.three;
                // ±90도 회전이면 가로/세로가 바뀌므로 cover 보정
                const swap =
                    Math.abs(Math.round(rotation / (Math.PI / 2)) % 2) === 1;
                const tex = new THREE.TextureLoader().load(url, (t) => {
                    this.fitThumbCover(t, plateAspect, swap);
                    this.renderScene();
                });
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false; // glTF UV 규약
                tex.wrapS = THREE.ClampToEdgeWrapping;
                tex.wrapT = THREE.ClampToEdgeWrapping;
                // 썸네일 이미지만 회전(모델 회전 X)
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

            // rim/pin: 은색 금속 + metal.png 텍스쳐
            makeSilverMaterial() {
                const THREE = this.three;
                const tex = new THREE.TextureLoader().load(metalUrl, () =>
                    this.renderScene(),
                );
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false; // glTF UV 규약
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

            // flower: 연베이지색 옥(반투명) + jade.png 텍스쳐
            makeJadeMaterial() {
                const THREE = this.three;
                const tex = new THREE.TextureLoader().load(jadeUrl, () =>
                    this.renderScene(),
                );
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.flipY = false; // glTF UV 규약
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

            // 실제 UV 기준 thumb 판의 U축/V축 길이 비율(가로/세로) 계산
            // position ≈ A·u + B·v + C 평면 회귀로 |A|/|B| 산출
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

            // object-fit: cover. repeat<1로 줌인하여 빈틈 없이 채우고 중앙 크롭
            // swap=true면 텍스처가 ±90도 회전돼 가로/세로가 바뀐 것을 보정
            fitThumbCover(tex, plateAspect, swap) {
                const img = tex.image;
                if (!img || !img.width) return;
                const imgAspect = img.width / img.height;
                if (swap) {
                    // 90도 회전: 채움 비율 r = imgAspect * plateAspect
                    const r = imgAspect * plateAspect;
                    if (r >= 1) tex.repeat.set(1 / r, 1);
                    else tex.repeat.set(1, r);
                } else {
                    // 회전 없음: 표준 cover
                    if (imgAspect >= plateAspect) {
                        tex.repeat.set(plateAspect / imgAspect, 1);
                    } else {
                        tex.repeat.set(1, imgAspect / plateAspect);
                    }
                }
                tex.needsUpdate = true;
            },

            // 박스에서 나와 흩어지는 hairpin 핀 생성(thumb 노드에 이미지)
            setupShards(maxDim, origin) {
                const THREE = this.three;
                const protos = (this.hairpinProtos || []).filter(Boolean);
                if (!protos.length) return;
                this.shards = [];
                const targetR = SHARD_REL * maxDim;

                // 클릭 포커스: 화면 중앙
                this.focusPos = new THREE.Vector3(0, 0, (this.camDist || 1) * 0.35);
                this.selected = null;

                for (let i = 0; i < SHARD_COUNT; i++) {
                    const item = archiveData[SHARD_THUMB_IDX[i]];

                    // 핀 모델을 항목별로 지정(SHARD_DEFS.model)
                    const modelIdx = Math.min(
                        SHARD_DEFS[i].model,
                        protos.length - 1,
                    );
                    const proto = protos[modelIdx];

                    // 프로토타입 크기/중심 기준 스케일 산출(모델마다 다름)
                    const pbox = new THREE.Box3().setFromObject(proto);
                    const pcenter = pbox.getCenter(new THREE.Vector3());
                    const psize = pbox.getSize(new THREE.Vector3());
                    const pMax = Math.max(psize.x, psize.y, psize.z) || 1;
                    const baseScale = (targetR * 2) / pMax;

                    // 핀 복제 + 중심 정렬 + 기본 방향
                    const pin = proto.clone(true);
                    pin.position.sub(pcenter);
                    pin.rotation.set(
                        HAIRPIN_BASE_ROT.x,
                        HAIRPIN_BASE_ROT.y,
                        HAIRPIN_BASE_ROT.z,
                    );

                    // thumb 노드에 썸네일 입히기
                    const thumb = pin.getObjectByName('thumb');
                    if (thumb) {
                        let tmesh = null;
                        thumb.traverse((o) => {
                            if (o.isMesh && !tmesh) tmesh = o;
                        });
                        // 실제 UV 기준 thumb 판 가로/세로 비율
                        const plateAspect = tmesh
                            ? this.computePlateAspect(tmesh)
                            : 1;
                        const rotation =
                            THUMB_ROT[modelIdx] !== undefined
                                ? THUMB_ROT[modelIdx]
                                : THUMB_ROT[0];
                        const mat = this.makeThumbMaterial(
                            SHARD_THUMBS[i],
                            plateAspect,
                            rotation,
                        );
                        thumb.traverse((o) => {
                            if (o.isMesh) o.material = mat;
                        });
                    }

                    // 부품 재질: flower=연베이지 옥, 그 외(rim/pin)=은색 금속
                    const silver = this.makeSilverMaterial();
                    const jade = this.makeJadeMaterial();
                    const ancestorHas = (obj, key) => {
                        let p = obj;
                        while (p) {
                            if ((p.name || '').toLowerCase().includes(key))
                                return true;
                            p = p.parent;
                        }
                        return false;
                    };
                    pin.traverse((o) => {
                        if (!o.isMesh) return;
                        if (ancestorHas(o, 'thumb')) return; // 썸네일 유지
                        if (ancestorHas(o, 'flower')) o.material = jade;
                        else o.material = silver;
                    });

                    const group = new THREE.Group();
                    group.add(pin);

                    // 클릭 포커스 시 thumb가 카메라(+Z)를 향하도록 하는 회전
                    const focusQuat = this.computeThumbFocusQuat(group, thumb);

                    // x축 부채꼴 + y축도 산재
                    const t = SHARD_COUNT > 1 ? i / (SHARD_COUNT - 1) : 0.5;
                    const fanX = (t - 0.5) * 2; // -1..1
                    const dir = new THREE.Vector3(
                        fanX * 1.2 + (Math.random() - 0.5) * 0.2,
                        0.35 + Math.random() * 0.95,
                        (Math.random() - 0.5) * 0.25,
                    ).normalize();

                    group.userData = {
                        href: item.link && item.link.href,
                        origin: origin.clone(),
                        dir,
                        dist:
                            maxDim *
                            (0.6 + Math.abs(fanX) * 0.7 + Math.random() * 0.4),
                        scaleBase: baseScale,
                        rot0z: Math.random() * Math.PI * 2,
                        spinZ: (Math.random() - 0.5) * 2,
                        floatPhase: Math.random() * Math.PI * 2,
                        floatAmp: maxDim * (0.03 + Math.random() * 0.03),
                        floatSpeed: 0.6 + Math.random() * 0.6,
                        // 클릭 포커스(0→1: 중앙·정면)
                        focus: 0,
                        focusTarget: 0,
                        focusQuat,
                        focusScale: baseScale * 1.4,
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

            // 클릭 포커스 회전: 핀 기본 자세(=썸네일 정면)로 복귀
            // scatter 시 더해진 Z 스핀만 제거하면 되므로 단위 쿼터니언(뒤집힘 없음)
            computeThumbFocusQuat() {
                return new this.three.Quaternion();
            },

            // 진행도(amt 0~1) + 시간(now)으로 조각 위치/스케일/회전/floating 적용
            applyShards(amt, now) {
                if (!this.shards) return;
                for (const s of this.shards) {
                    const d = s.userData;
                    s.visible = amt > 0.001;

                    // scatter 기본 포즈
                    const pos = d.origin
                        .clone()
                        .addScaledVector(d.dir, d.dist * amt);
                    pos.y +=
                        Math.sin(now * 0.001 * d.floatSpeed + d.floatPhase) *
                        d.floatAmp *
                        amt;
                    let sc = d.scaleBase * amt;
                    const wob =
                        Math.sin(now * 0.0006 * d.floatSpeed + d.floatPhase) *
                        0.15 *
                        amt;
                    const rz = d.rot0z + d.spinZ * amt + wob;
                    const THREE = this.three;
                    const quat = new THREE.Quaternion().setFromEuler(
                        new THREE.Euler(0, 0, rz),
                    );

                    // 클릭 포커스: 중앙으로 이동 + 살짝 크게 + thumb 정면
                    d.focus += (d.focusTarget - d.focus) * 0.15;
                    if (d.focus > 0.001 && this.focusPos) {
                        pos.lerp(this.focusPos, d.focus);
                        const fScale = d.focusScale || this.focusScale || sc;
                        sc += (fScale - sc) * d.focus;
                        if (d.focusQuat) quat.slerp(d.focusQuat, d.focus);
                    }

                    s.position.copy(pos);
                    s.scale.setScalar(sc);
                    s.quaternion.copy(quat);
                }
            },

            // 목표치(0/1)를 향해 부드럽게 보간 + scatter 동안 지속 floating
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
                    // target=1이면 보간이 끝나도 floating 위해 계속 루프
                    if (moving || (t === 1 && this.scatterAmt > 0.01)) {
                        this.shardRaf = requestAnimationFrame(frame);
                    } else {
                        this.shardRaf = null;
                    }
                };
                this.shardRaf = requestAnimationFrame(frame);
            },

            // 포인터 위치에서 조각(그룹) 찾기
            pickShard(e) {
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
                let o = hits[0].object;
                while (o && this.shards.indexOf(o) === -1) o = o.parent;
                return o;
            },

            // 호버: 커서만 변경(클릭 가능 표시)
            onShardHover(e) {
                if (!this.$refs.canvas) return;
                if (!this.shards || this.scatterAmt < 0.6) {
                    this.$refs.canvas.style.cursor = '';
                    return;
                }
                this.$refs.canvas.style.cursor = this.pickShard(e)
                    ? 'pointer'
                    : '';
            },

            // 클릭: 핀을 중앙으로 포커스(다시/다른/바깥 클릭 시 원위치)
            onShardClick(e) {
                if (!this.shards || this.scatterAmt < 0.6) return;
                const hit = this.pickShard(e);
                this.selectShard(hit && hit !== this.selected ? hit : null);
            },

            selectShard(shard) {
                this.selected = shard;
                this.shards.forEach((s) => {
                    s.userData.focusTarget = s === shard ? 1 : 0;
                });
                this.ensureShardLoop();
            },

            // 뚜껑 노드 회전
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

            // 오픈 시퀀스: 열기=뚜껑→(잠시 후)조각, 닫기=조각→(잠시 후)뚜껑
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

            // 뚜껑 목표치(0/1)를 향해 부드럽게 보간
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

                // 오픈 트리거: 한 지점에서 뚜껑 열림→조각 흩뿌리기(역방향은 반대 순서)
                this.setOpen(pinned >= OPEN_POINT);

                this.renderScene();
            },

            renderScene() {
                if (!this.renderer || !this.scene || !this.camera) return;
                this.renderer.render(this.scene, this.camera);
                // 핀은 깊이 버퍼를 지우고 위에 덮어 그림(박스와 겹침 방지)
                if (this.shardScene) {
                    this.renderer.autoClear = false;
                    this.renderer.clearDepth();
                    this.renderer.render(this.shardScene, this.camera);
                    this.renderer.autoClear = true;
                }
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
