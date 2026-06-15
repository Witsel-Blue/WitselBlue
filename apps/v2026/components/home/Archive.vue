<template>
    <div id='archive'>
        <canvas ref='canvas' />
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

    // 클릭 시 함께 열릴 뚜껑 구성 노드들 / 회전 기준점(경첩) / 축 / 각도
    const LID_PARTS = [
        'box-top',
        'box-top-inner',
        'top-flower',
        'top-corner',
        'top-butterfly',
        'top-leaf',
    ];
    const LID_HINGE = 'box-top'; // 회전 기준점(블렌더 origin)이 있는 노드
    const LID_OPEN_AXIS = 'x'; // 경첩 축에 맞게 'x' | 'y' | 'z'
    const LID_OPEN_ANGLE = -Math.PI / 2; // 90deg, 방향 반대면 부호만 변경
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
            this.initThree();
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
            const canvas = this.$refs.canvas;
            if (canvas) {
                canvas.removeEventListener('pointerdown', this.onPointerDown);
                canvas.removeEventListener('pointerup', this.onPointerUp);
            }
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

                    const maxDim = Math.max(size.x, size.y, size.z);
                    this.camera.position.set(0, 0, maxDim * 2.5);
                    this.camera.lookAt(0, 0, 0);
                    this.controls.update();
                    this.renderScene();
                });

                canvas.addEventListener('pointerdown', this.onPointerDown);
                canvas.addEventListener('pointerup', this.onPointerUp);
                window.addEventListener('resize', this.onResize);
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

            // 뚜껑 구성 노드들을 box-top origin 피벗에 매달아 함께 회전시킨다
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

                // box-top origin의 월드 좌표 = 회전 피벗
                const hingeWorld = new THREE.Vector3();
                hinge.getWorldPosition(hingeWorld);

                // 모델(루트) 공간에 피벗 생성
                const pivot = new THREE.Group();
                model.add(pivot);
                pivot.position.copy(model.worldToLocal(hingeWorld.clone()));
                pivot.updateMatrixWorld(true);

                // 구성 노드들을 피벗 아래로(월드 변환 유지)
                LID_PARTS.forEach((name) => {
                    const node = model.getObjectByName(name);
                    if (node) pivot.attach(node);
                });

                this.lid = pivot;
                this.lidClosed = pivot.rotation[LID_OPEN_AXIS];
                this.lidOpen = false;
            },

            onPointerDown(e) {
                this.downX = e.clientX;
                this.downY = e.clientY;
            },
            onPointerUp(e) {
                // 드래그(카메라 회전)와 클릭 구분
                const moved = Math.hypot(
                    e.clientX - this.downX,
                    e.clientY - this.downY,
                );
                if (moved > 5) return;
                this.handleClick(e);
            },
            handleClick(e) {
                if (!this.model || !this.lid) return;
                const THREE = this.three;
                const canvas = this.$refs.canvas;
                const rect = canvas.getBoundingClientRect();
                const ndc = new THREE.Vector2(
                    ((e.clientX - rect.left) / rect.width) * 2 - 1,
                    -((e.clientY - rect.top) / rect.height) * 2 + 1,
                );
                if (!this.raycaster) this.raycaster = new THREE.Raycaster();
                this.raycaster.setFromCamera(ndc, this.camera);
                const hits = this.raycaster.intersectObject(this.model, true);
                if (hits.length === 0) return;
                this.toggleLid();
            },
            toggleLid() {
                this.lidOpen = !this.lidOpen;
                this.lidTarget =
                    this.lidClosed + (this.lidOpen ? LID_OPEN_ANGLE : 0);
                this.animateLid();
            },
            animateLid() {
                if (this.lidRaf) cancelAnimationFrame(this.lidRaf);
                const step = () => {
                    const cur = this.lid.rotation[LID_OPEN_AXIS];
                    const next = cur + (this.lidTarget - cur) * 0.15;
                    if (Math.abs(this.lidTarget - next) < 0.001) {
                        this.lid.rotation[LID_OPEN_AXIS] = this.lidTarget;
                        this.renderScene();
                        this.lidRaf = null;
                        return;
                    }
                    this.lid.rotation[LID_OPEN_AXIS] = next;
                    this.renderScene();
                    this.lidRaf = requestAnimationFrame(step);
                };
                step();
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
                this.renderScene();
            },
        },
    };
</script>

<style lang='scss' scoped>
    #archive {
        width: 100%;
        height: 100vh;

        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
</style>
