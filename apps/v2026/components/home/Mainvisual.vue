<template>
    <div id='mainvisual'>
        <canvas ref='canvas' @click='onCanvasClick'/>

        <div
            v-if='ready && clickCount >= 1 && !exploded'
            class='content__item content__item--1'
            :class='{ visible: show1, "fade-out": clickCount >= 2 }'
        >
            <TextShifting
                :text="$t('intro.textShift1')"
                :playing='play1'
            />
        </div>

        <div
            v-if='ready && clickCount >= 2 && !exploded'
            class='content__item content__item--2'
            :class='{ visible: show2 }'
        >
            <TextShifting
                :text="$t('intro.textShift2')"
                :playing='play2'
            />
        </div>

        <p v-if='!exploded && ready' class='hint'>
            {{ $t('intro.hint') }}
        </p>

        <div
            v-if='exploded'
            class='title'
        >
            <div ref='logoAnchor' class='title__logo-spacer' aria-hidden='true' />
            <div class='title__content__text' :style='titleScrollStyle'>
                <h2>{{ $t('home.mainSub') }}</h2>
                <h1>{{ $t('home.mainTitle') }}</h1>
                <p>{{ $t('home.mainText') }}</p>
                <button type='button' class='scroll-down' @click='scrollToAbout'>
                    <Scrolldown />
                    <TextShifting text='scroll down' />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import TextShifting from '@/components/TextShifting.vue';
    import Scrolldown from '@/components/svg/scrolldown.vue';
    import nacreShardUrl from '@/assets/model/texture/nacre.png';

    const INTRO_ROOT_KEY = '$wb2026IntroDone';
    /** anchor1→anchor2 산개 — 화면 frustum 배율 (절대 줄이지 말 것) */
    const G2_SCATTER = {
        VIEW_XY: 2.8,
        Z_FACTOR: 2.1,
        Z_BIAS: 0.28,
        FRONT_BLUR: 0.35,
        MAX_SCALE: 0.78,
    };
    /** anchor2 top 위치 → gather2Progress */
    const G2_SCROLL = {
        G1_GATE: 0.85,
        START_TOP: 1.0,
        END_TOP: 0.12,
    };
    /** gather2Progress 내부 페이즈 */
    const G2_PHASE = {
        SCATTER_START: 0.38,
        SCATTER_END: 0.58,
        GATHER_START: 0.68,
    };
    const SHARD_SCALE = {
        MAIN: 1,
        GATHERED: 0.2,
    };
    const GATHER_PLANE = {
        BRIGHTNESS: 1.2,
    };

    export default {
        components: {
            TextShifting,
            Scrolldown,
        },
        data() {
            return {
                exploded: false,
                ready: false,
                clickCount: 0,
                show1: false,
                show2: false,
                play1: false,
                play2: false,
                scrollProgress: 0,
                winH: typeof window !== 'undefined' ? window.innerHeight : 800,
                logoTop0: 0,
            };
        },

        computed: {
            titleScrollStyle() {
                const p = this.scrollProgress;
                const fp = Math.min(1, p / 0.4);
                const t = fp * fp * (3 - 2 * fp);
                const scale = 1 - t * 0.5;
                const opacity = 1 - t;
                return {
                    opacity,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    pointerEvents: opacity > 0.02 ? 'auto' : 'none',
                };
            },
        },

        mounted() {
            this.three = null;
            this.renderer = null;
            this.scene = null;
            this.camera = null;
            this.controls = null;
            this.animId = null;
            this.model = null;
            this.modelSize = null;
            this.shellBaseRot = { x: 0, y: 0 };
            this.shellRot = { x: 0, y: 0 };
            this.shellTargetRot = { x: 0, y: 0 };
            this.shards = [];
            this.crackAudio = null;
            this.textTargetsBuilt = false;
            this.textTargets2Built = false;
            this.gather2Progress = 0;
            this.gatherFlakeRadius = 0;
            this.gather2FlakeRadius = 0;
            this.maskTexture = null;
            this.maskTexture2 = null;
            this._lastG1 = 0;
            this._lastG2 = 0;
            this._g2GatherSnapshotted = false;
            this._gatherSnapValid = false;
            this._wasShardGathering = false;
            this._g2LooseValid = false;
            this.gatherPlane1 = null;
            this.gatherPlane2 = null;
            if (process.client && this.$root[INTRO_ROOT_KEY]) {
                this.exploded = true;
            }
            this.initThree();
            this.$nextTick(() => {
                if (this.exploded) {
                    this.$root.$emit('mainvisual-intro-state', true);
                    this.$nextTick(() => {
                        this.measureLogo();
                        this.emitHeaderLogoMetrics();
                    });
                } else {
                    this.syncIntroState();
                }
            });
        },

        beforeDestroy() {
            if (this.animId) cancelAnimationFrame(this.animId);
            if (this.controls) this.controls.dispose();
            if (this.renderer) this.renderer.dispose();
            window.removeEventListener('resize', this.onResize);
            window.removeEventListener('scroll', this.onScroll);
            if (this.$refs.canvas) this.$refs.canvas.removeEventListener('mousemove', this.onMouseMove);
            if (this.$refs.canvas) this.$refs.canvas.removeEventListener('mouseleave', this.onMouseLeave);
        },

        methods: {
            async initThree() {
                const THREE = await import('three');
                const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
                const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
                const { RoomEnvironment } = await import(
                    'three/examples/jsm/environments/RoomEnvironment.js'
                );

                this.three = THREE;

                const canvas = this.$refs.canvas;
                const { clientWidth: w, clientHeight: h } = canvas;

                // Renderer
                this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
                this.renderer.setSize(w, h);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.renderer.outputColorSpace = THREE.SRGBColorSpace;
                this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
                this.renderer.toneMappingExposure = 1.0;

                // Scene
                this.scene = new THREE.Scene();

                // 환경맵
                const pmrem = new THREE.PMREMGenerator(this.renderer);
                pmrem.compileEquirectangularShader();
                this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
                pmrem.dispose();

                // 자개 텍스처 미리 로딩
                this.getNacreTexture();

                // Camera
                this.camera = new THREE.PerspectiveCamera(60, w / h, 0.05, 200);
                this.camera.position.set(0, 0, 6);

                // Lighting
                this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
                this.scene.add(this.ambientLight);

                this.keyLight = new THREE.DirectionalLight(0xffffff, 0.01);
                this.keyLight.position.set(3, 5, 4);
                this.scene.add(this.keyLight);

                this.fillLight = new THREE.DirectionalLight(0xd0c8ff, 0.01);
                this.fillLight.position.set(-4, 1, 2);
                this.scene.add(this.fillLight);

                // 자개 반사용 순환 포인트라이트 (색상이 천천히 변하며 회전)
                this.iridLight1 = new THREE.PointLight(0xffc0e0, 3.5, 18);
                this.iridLight2 = new THREE.PointLight(0xb0d8ff, 3.0, 18);
                this.iridLight3 = new THREE.PointLight(0xc8ffdc, 2.5, 18);
                this.scene.add(this.iridLight1);
                this.scene.add(this.iridLight2);
                this.scene.add(this.iridLight3);

                // OrbitControls
                this.controls = new OrbitControls(this.camera, canvas);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.08;
                this.controls.enableZoom = false;
                this.controls.enablePan = false;


                // 방사형 블러 + Z 블러
                const depthTex = new THREE.DepthTexture(w, h);
                depthTex.type = THREE.UnsignedShortType;

                this.sceneRT = new THREE.WebGLRenderTarget(w, h, {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    depthTexture: depthTex,
                    depthBuffer: true,
                });

                const blurMat = new THREE.ShaderMaterial({
                    uniforms: {
                        tColor: { value: this.sceneRT.texture },
                        tDepth: { value: depthTex },
                        radialAmt: { value: 0.0 },
                        frontAmt: { value: 0.0 },
                        aspectRatio: { value: w / h },
                        near: { value: 0.1 },
                        far: { value: 100.0 },
                        focusViewZ: { value: -6.0 },
                        tMask: { value: null },
                        maskMin: { value: new THREE.Vector2(0, 0) },
                        maskSize: { value: new THREE.Vector2(1, 1) },
                        maskStrength: { value: 0.0 },
                    },
                    vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = vec4(position.xy, 0.0, 1.0);
                    }
                `,
                    fragmentShader: `
                    uniform sampler2D tColor;
                    uniform sampler2D tDepth;
                    uniform float radialAmt;
                    uniform float frontAmt;
                    uniform float aspectRatio;
                    uniform float near;
                    uniform float far;
                    uniform float focusViewZ;
                    uniform sampler2D tMask;
                    uniform vec2 maskMin;
                    uniform vec2 maskSize;
                    uniform float maskStrength;
                    varying vec2 vUv;

                    float depthToViewZ(float depth) {
                        return -(near * far) / (depth * (far - near) - far);
                    }

                    void main() {
                        vec2 toCenter = vUv - 0.5;
                        toCenter.x *= aspectRatio;
                        float dist = length(toCenter);
                        float invertDist = max(0.0, 0.72 - dist);
                        float radialR = invertDist * invertDist * radialAmt * 0.01;

                        float rawDepth = texture2D(tDepth, vUv).r;
                        float viewZ = depthToViewZ(rawDepth);
                        float frontR = max(0.0, viewZ - focusViewZ) * frontAmt * 0.005;
                        frontR = min(frontR, 0.001);

                        float totalR = radialR + frontR;

                        vec4 color = vec4(0.0);
                        const int N = 16;
                        for (int i = 0; i < N; i++) {
                            float angle = float(i) * 6.28318 / float(N);
                            vec2 offset = vec2(cos(angle), sin(angle)) * totalR;
                            color += texture2D(tColor, clamp(vUv + offset, 0.0, 1.0));
                        }
                        vec4 outc = color / float(N);

                        // 글자 모양 마스크: 글자 영역 밖을 잘라 외곽선을 또렷하게
                        if (maskStrength > 0.0) {
                            vec2 muv = (vUv - maskMin) / maskSize;
                            float inside =
                                step(0.0, muv.x) * step(muv.x, 1.0) *
                                step(0.0, muv.y) * step(muv.y, 1.0);
                            float m = texture2D(tMask, muv).a * inside;
                            outc *= mix(1.0, m, maskStrength);
                        }

                        gl_FragColor = outc;
                    }
                `,
                    depthTest: false,
                    depthWrite: false,
                });

                this.blurMat = blurMat;
                const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMat);
                this.postScene = new THREE.Scene();
                this.postScene.add(postQuad);
                this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

                // Load model
                const loader = new GLTFLoader();
                loader.load('/models/seashell.glb', (gltf) => {
                    this.model = gltf.scene;

                    const box = new THREE.Box3().setFromObject(this.model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());
                    this.model.position.sub(center);

                    const maxDim = Math.max(size.x, size.y, size.z);
                    this.camera.position.z = maxDim * 2.2;

                    this.blurMat.uniforms.focusViewZ.value = -this.camera.position.z;

                    // 카메라 Spherical 초기화
                    this.camSph = new THREE.Spherical().setFromVector3(this.camera.position);
                    this.camSphTarget = this.camSph.clone();

                    this.modelSize = size;
                    this.shellBaseRot = {
                        x: this.model.rotation.x,
                        y: this.model.rotation.y,
                    };
                    this.scene.add(this.model);
                    this.ready = true;
                    if (this.exploded) {
                        this.explode();
                        this.$nextTick(() => this.measureLogo());
                    }
                    this.animate();
                });

                window.addEventListener('resize', this.onResize);
                window.addEventListener('scroll', this.onScroll, { passive: true });
                canvas.addEventListener('mousemove', this.onMouseMove);
                canvas.addEventListener('mouseleave', this.onMouseLeave);
            },

            getNacreTexture() {
                const THREE = this.three;
                if (this._nacreTex) return this._nacreTex;
                const tex = new THREE.TextureLoader().load(nacreShardUrl);
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.wrapS = THREE.RepeatWrapping;
                tex.wrapT = THREE.RepeatWrapping;
                this._nacreTex = tex;
                return tex;
            },

            // ExtrudeGeometry UV를 shape 경계 기준 0~1로 리맵 (텍스처가 면에 꽉 차도록)
            remapGeoUV(geo) {
                const pos = geo.attributes.position;
                const uv = geo.attributes.uv;
                if (!pos || !uv) return;
                geo.computeBoundingBox();
                const bb = geo.boundingBox;
                const sx = bb.max.x - bb.min.x || 1;
                const sy = bb.max.y - bb.min.y || 1;
                for (let i = 0; i < pos.count; i++) {
                    uv.setXY(
                        i,
                        (pos.getX(i) - bb.min.x) / sx,
                        (pos.getY(i) - bb.min.y) / sy,
                    );
                }
                uv.needsUpdate = true;
            },

            makeShardGeo() {
                const THREE = this.three;
                const shape = new THREE.Shape();
                const verts = 5 + Math.floor(Math.random() * 3);

                for (let i = 0; i < verts; i++) {
                    const baseAngle = (i / verts) * Math.PI * 2;
                    const jitter = (Math.random() - 0.5) * 0.5;
                    const r = 0.035 + Math.random() * 0.065;
                    const x = Math.cos(baseAngle + jitter) * r;
                    const y = Math.sin(baseAngle + jitter) * r;
                    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
                }
                shape.closePath();

                return new THREE.ExtrudeGeometry(shape, {
                    depth: 0.005 + Math.random() * 0.007,
                    bevelEnabled: true,
                    bevelThickness: 0.002,
                    bevelSize: 0.003,
                    bevelSegments: 1,
                });
            },

            explode() {
                const THREE = this.three;
                const size = this.modelSize;
                const SHARD_COUNT = 400;
                const baseTex = this.getNacreTexture();

                for (let i = 0; i < SHARD_COUNT; i++) {
                    const geo = this.makeShardGeo();
                    geo.computeBoundingSphere();
                    this.remapGeoUV(geo);

                    // 자개 텍스처에서 조각마다 다른 영역을 샘플링 (clone은 .source 공유)
                    const tex = baseTex.clone();
                    tex.needsUpdate = true;
                    const zoom = 0.22 + Math.random() * 0.16;
                    tex.repeat.set(zoom, zoom);
                    tex.offset.set(
                        Math.random() * (1 - zoom),
                        Math.random() * (1 - zoom),
                    );
                    tex.rotation = Math.random() * Math.PI * 2;
                    tex.center.set(0.5, 0.5);

                    // 자개 텍스처만 표시 (물리 광택·쉰 제거)
                    const mat = new THREE.MeshBasicMaterial({
                        map: tex,
                        toneMapped: true,
                    });

                    const mesh = new THREE.Mesh(geo, mat);

                    mesh.position.set(
                        (Math.random() - 0.5) * size.x * 0.9,
                        (Math.random() - 0.5) * size.y * 0.9,
                        (Math.random() - 0.5) * size.z * 0.9,
                    );

                    mesh.rotation.set(
                        Math.random() * Math.PI * 2,
                        Math.random() * Math.PI * 2,
                        Math.random() * Math.PI * 2,
                    );

                    const dir = mesh.position.clone();
                    if (dir.length() < 0.001)
                        dir.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
                    dir.normalize();

                    const speed = 0.05 + Math.random() * 0.13;
                    const vel = dir.multiplyScalar(speed);
                    vel.z *= 2.2;
                    mesh.userData.vel = vel;

                    mesh.userData.spin = new THREE.Euler(
                        (Math.random() - 0.5) * 0.03,
                        (Math.random() - 0.5) * 0.03,
                        (Math.random() - 0.5) * 0.14,
                    );

                    mesh.userData.floatPhase = Math.random() * Math.PI * 2;
                    mesh.userData.floatAmp = 0.0008 + Math.random() * 0.001;
                    mesh.userData.floatSpeed = 0.4 + Math.random() * 0.5;
                    mesh.userData.frame = 0;
                    mesh.userData.geoRadius = geo.boundingSphere ? geo.boundingSphere.radius : 0.08;
                    mesh.userData.mainScale = 1;
                    mesh.userData.scatterPos = mesh.position.clone();
                    mesh.userData.scatterQuat = mesh.quaternion.clone();
                    mesh.userData.scatterVel = vel.clone();

                    this.scene.add(mesh);
                    this.shards.push(mesh);
                }

                this.model.visible = false;

                this.targetRadial = 1.0;
                this.targetFront = 1.0;

                this.ambientLight.intensity = 0.5;
                this.ambientLight.color.set(0xfff5e6);
                this.keyLight.intensity = 1.8;
                this.fillLight.intensity = 0.4;

                this.controls.enabled = false;

                const canvas = this.$refs.canvas;
                if (canvas) {
                    canvas.style.cursor = 'initial';
                    canvas.style.pointerEvents = 'none';
                }

                this.syncIntroState();
                this.buildTextTargets();
                this.$nextTick(() => this.onScroll());
            },

            syncIntroState() {
                this.$root.$emit('mainvisual-intro-state', this.exploded);
                if (!this.exploded) {
                    this.scrollProgress = 0;
                    window.scrollTo(0, 0);
                }
                this.emitHeaderLogoMetrics();
            },

            onCanvasClick(event) {
                if (!this.ready || this.exploded) return;

                const THREE = this.three;
                const canvas = this.$refs.canvas;
                const rect = canvas.getBoundingClientRect();

                const mouse = new THREE.Vector2(
                    ((event.clientX - rect.left) / rect.width) * 2 - 1,
                    -((event.clientY - rect.top) / rect.height) * 2 + 1,
                );

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, this.camera);

                const hits = raycaster.intersectObject(this.model, true);
                if (hits.length === 0) return;

                this.clickCount++;

                if (this.clickCount === 1) {
                    if (this.camSphTarget) {
                        this.camSphTarget.theta -= -Math.PI * 0.40;
                        this.camSphTarget.phi   -= Math.PI * 0.20;
                    }
                    this.playcrack();
                    this.show1 = true;
                    this.play1 = true;
                } else if (this.clickCount === 2) {
                    this.playcrack();
                    if (this.camSphTarget) {
                        this.camSphTarget.theta -= -Math.PI * 0.80;
                        this.camSphTarget.phi   -= Math.PI * 0.20;
                    }

                    this.show2 = true;
                    this.play2 = true;
                } else {
                    this.exploded = true;
                    if (process.client) {
                        this.$root[INTRO_ROOT_KEY] = true;
                    }
                    this.explode();
                    this.$nextTick(() => this.measureLogo());
                }
            },

            measureLogo() {
                const el = this.$refs.logoAnchor;
                if (el) this.logoTop0 = el.getBoundingClientRect().top;
                this.emitHeaderLogoMetrics();
            },

            emitHeaderLogoMetrics() {
                if (!process.client) return;
                this.$root.$emit('header-logo-metrics', {
                    scrollProgress: this.scrollProgress,
                    logoTop0: this.logoTop0,
                    active: this.exploded,
                });
            },

            playcrack() {
                if (this.crackAudio) {
                    this.crackAudio.pause();
                    this.crackAudio.currentTime = 0;
                } else {
                    this.crackAudio = new Audio('/sound/crack.mp3');
                }
                this.crackAudio.play().catch(() => {});
            },

            animate() {
                this.animId = requestAnimationFrame(this.animate);

                // 카메라 트위닝 (클릭 1·2회 회전)
                if (this.camSph && this.camSphTarget && !this.exploded) {
                    const LERP = 0.05;
                    const thetaDiff = Math.abs(this.camSphTarget.theta - this.camSph.theta);
                    const phiDiff   = Math.abs(this.camSphTarget.phi   - this.camSph.phi);
                    const isAnimating = thetaDiff > 0.001 || phiDiff > 0.001;

                    if (isAnimating) {
                        this.controls.enabled = false;
                        this.camSph.theta += (this.camSphTarget.theta - this.camSph.theta) * LERP;
                        this.camSph.phi   += (this.camSphTarget.phi   - this.camSph.phi)   * LERP;
                        this.camera.position.setFromSpherical(this.camSph);
                        this.camera.lookAt(0, 0, 0);
                    } else {
                        this.controls.enabled = true;
                        this.controls.update();
                    }
                } else {
                    this.controls.update();
                }

                const t = performance.now() * 0.001;

                if (this.iridLight1) {
                    const r = 5;
                    this.iridLight1.position.set(
                        Math.cos(t * 0.31) * r,
                        Math.sin(t * 0.19) * r * 0.6,
                        Math.sin(t * 0.31) * r,
                    );
                    this.iridLight2.position.set(
                        Math.cos(t * 0.23 + 2.1) * r,
                        Math.sin(t * 0.27 + 1.0) * r * 0.6,
                        Math.sin(t * 0.23 + 2.1) * r,
                    );
                    this.iridLight3.position.set(
                        Math.cos(t * 0.17 + 4.2) * r,
                        Math.sin(t * 0.22 + 3.5) * r * 0.6,
                        Math.sin(t * 0.17 + 4.2) * r,
                    );
                }

                const prevG1 = this._lastG1;
                const prevG2 = this._lastG2;

                const g1 = this.scrollProgress;
                const g1PosEase = this.smoothstep(g1);
                const g1GatherScale = g1PosEase;
                const g1PlaneFade = this.gatherShrinkEase(g1);
                const g2Raw = this.gather2Progress || 0;
                const g2 =
                    g1 >= G2_SCROLL.G1_GATE ? g2Raw : 0;
                const returningToMain = g1 < prevG1 - 0.0001;
                const g2Anim =
                    returningToMain && g1 < 0.22 && g2 > 0.001 ? 0 : g2;
                const g2Phase = this.computeG2Phase(g2Anim);

                if (g1 <= 0.001 && prevG1 > 0.001) {
                    this.clearGather1From();
                }
                const atMainRest = g1 < 0.02 && g2Anim < 0.02;
                if (atMainRest) {
                    this.resetMainShardScales();
                }
                if (g2Anim <= 0.001 && prevG2 > 0.001) {
                    this._g2LooseValid = false;
                    this.clearG2ShardState();
                    this.resetMainShardScales();
                }
                if (
                    this.exploded &&
                    g1 >= G2_SCROLL.G1_GATE &&
                    g2Anim > 0.001 &&
                    g2Phase.scatterEase > 0.001 &&
                    this.textTargets2Built &&
                    !this._g2LooseValid
                ) {
                    this.buildG2LooseTargets();
                    this._g2LooseValid = true;
                }
                this._lastG1 = g1;
                this._lastG2 = g2;

                const inG2Zone =
                    this.exploded &&
                    this.textTargets2Built &&
                    g1 >= G2_SCROLL.G1_GATE &&
                    g2Anim > 0.001;
                const beforeG2Scatter =
                    inG2Zone &&
                    g2Phase.scatterEase < 0.001 &&
                    g2Phase.gatherEase < 0.001;
                const g2Loose =
                    inG2Zone &&
                    g2Phase.scatterEase > 0.001 &&
                    g2Phase.gatherEase < 0.001;
                const g2Gathering = inG2Zone && g2Phase.gatherEase > 0.001;

                if (g2Gathering) {
                    if (!this._g2GatherSnapshotted) {
                        this.snapshotG2GatherFrom();
                        this._g2GatherSnapshotted = true;
                    }
                } else {
                    this._g2GatherSnapshotted = false;
                }

                const gathering1 =
                    this.exploded &&
                    this.textTargetsBuilt &&
                    g1 > 0.001 &&
                    !inG2Zone;

                if (
                    gathering1 &&
                    !this._gatherSnapValid &&
                    prevG1 <= 0.001
                ) {
                    this.snapshotGather1From();
                    this._gatherSnapValid = true;
                }

                const isShardGathering = gathering1 || g2Loose || g2Gathering;
                const leftGather = this._wasShardGathering && !isShardGathering;
                this._wasShardGathering = isShardGathering;

                const half = this.gatherVisibleH / 2;
                const aspect = this.camera.aspect;
                let centerX = 0;
                let centerY = 0;
                let centerX2 = 0;
                let centerY2 = 0;

                if (gathering1 || g2Loose || g2Gathering || g1 >= 0.98) {
                    const shapeAnchor =
                        this._shapeAnchor ||
                        (this._shapeAnchor = document.querySelector(
                            '#about .shape-anchor',
                        ));
                    const c1 = this.shapeAnchorCenter(shapeAnchor, half, aspect);
                    centerX = c1.x;
                    centerY = c1.y;
                }
                if (g2Loose || g2Gathering || (inG2Zone && g2Anim >= 0.98)) {
                    const shapeAnchor2 =
                        this._shapeAnchor2 ||
                        (this._shapeAnchor2 = document.querySelector(
                            '#about .shape-anchor2',
                        ));
                    const c2 = this.shapeAnchorCenter(
                        shapeAnchor2,
                        half,
                        aspect,
                    );
                    centerX2 = c2.x;
                    centerY2 = c2.y;
                }

                const tv = this._scratchVec || (this._scratchVec = new this.three.Vector3());
                const tvG1 =
                    this._scratchVecG1 ||
                    (this._scratchVecG1 = new this.three.Vector3());
                const tvG2 =
                    this._scratchVecG2 ||
                    (this._scratchVecG2 = new this.three.Vector3());

                let plane1Opacity = 0;
                let plane2Opacity = 0;
                const g2Shrink = this.gatherShrinkEase(g2Phase.gatherEase);
                const planeFill2 = inG2Zone && g2Anim >= 0.98;
                const planeFill1 =
                    g1 >= 0.98 && (!inG2Zone || beforeG2Scatter) && !planeFill2;

                if (planeFill1) {
                    plane1Opacity = 1;
                } else if (gathering1 && g1PlaneFade > 0) {
                    plane1Opacity = g1PlaneFade;
                }
                if (planeFill2) {
                    plane2Opacity = 1;
                } else if (g2Gathering && g2Shrink > 0) {
                    plane2Opacity = g2Shrink;
                }

                // 마스크 박스
                if (this.blurMat && (this.maskTexture || this.maskTexture2)) {
                    const u = this.blurMat.uniforms;
                    if (g2Gathering) {
                        const fd = this.gatherFocusDist;
                        const halfX = this.textHalfX2;
                        const halfY = this.textHalfY2;
                        tv.set(centerX2 - halfX, centerY2 - halfY, -fd);
                        this.camera.localToWorld(tv).project(this.camera);
                        const ax = tv.x * 0.5 + 0.5;
                        const ay = tv.y * 0.5 + 0.5;
                        tv.set(centerX2 + halfX, centerY2 + halfY, -fd);
                        this.camera.localToWorld(tv).project(this.camera);
                        const bx = tv.x * 0.5 + 0.5;
                        const by = tv.y * 0.5 + 0.5;
                        u.maskMin.value.set(Math.min(ax, bx), Math.min(ay, by));
                        u.maskSize.value.set(Math.abs(bx - ax), Math.abs(by - ay));
                        u.tMask.value = this.maskTexture2;
                        const maskIn = Math.max(
                            0,
                            Math.min(1, (g2Phase.gatherEase - 0.995) / 0.005),
                        );
                        u.maskStrength.value =
                            maskIn * maskIn * (3 - 2 * maskIn);
                    } else if (gathering1) {
                        const fd = this.gatherFocusDist;
                        tv.set(centerX - this.textHalfX, centerY - this.textHalfY, -fd);
                        this.camera.localToWorld(tv).project(this.camera);
                        const ax = tv.x * 0.5 + 0.5;
                        const ay = tv.y * 0.5 + 0.5;
                        tv.set(centerX + this.textHalfX, centerY + this.textHalfY, -fd);
                        this.camera.localToWorld(tv).project(this.camera);
                        const bx = tv.x * 0.5 + 0.5;
                        const by = tv.y * 0.5 + 0.5;
                        u.maskMin.value.set(Math.min(ax, bx), Math.min(ay, by));
                        u.maskSize.value.set(Math.abs(bx - ax), Math.abs(by - ay));
                        u.tMask.value = this.maskTexture;
                        const maskIn = Math.max(
                            0,
                            Math.min(1, (g1PlaneFade - 0.995) / 0.005),
                        );
                        u.maskStrength.value =
                            maskIn * maskIn * (3 - 2 * maskIn);
                    } else {
                        u.maskStrength.value = 0;
                    }
                }

                for (const s of this.shards) {
                    const ud = s.userData;
                    if (planeFill1 || planeFill2) {
                        s.visible = false;
                        continue;
                    }
                    s.visible = true;
                    if (s.material.opacity !== 1) s.material.opacity = 1;

                    if (g2Gathering) {
                        tvG2.set(
                            centerX2 + ud.textLocal2.x,
                            centerY2 + ud.textLocal2.y,
                            -this.gatherFocusDist,
                        );
                        this.camera.localToWorld(tvG2);
                        const fromPos =
                            ud.g2GatherFromPos ||
                            ud.g2LoosePos ||
                            ud.g2ScatterFromPos ||
                            ud.scatterPos;
                        const fromQuat =
                            ud.g2GatherFromQuat ||
                            ud.g2ScatterFromQuat ||
                            ud.scatterQuat;
                        const g2g = g2Phase.gatherEase;
                        s.position.lerpVectors(fromPos, tvG2, g2g);
                        s.quaternion.copy(fromQuat).slerp(this.textQuat, g2g);
                        this.applyG2GatherScale(s, ud, g2g);
                        continue;
                    }

                    if (g2Loose) {
                        tvG1.set(
                            centerX + ud.textLocal.x,
                            centerY + ud.textLocal.y,
                            -this.gatherFocusDist,
                        );
                        this.camera.localToWorld(tvG1);
                        const fromPos =
                            ud.g2ScatterFromPos || tvG1;
                        const toPos = ud.g2LoosePos || tvG1;
                        const fromQuat =
                            ud.g2ScatterFromQuat || this.textQuat;
                        const g2s = g2Phase.scatterEase;
                        s.position.lerpVectors(fromPos, toPos, g2s);
                        s.quaternion.copy(fromQuat).slerp(this.textQuat, g2s * 0.35);
                        this.applyG2LooseScale(s, g2s);
                        continue;
                    }

                    if (gathering1) {
                        const fromPos = ud.gatherFromPos || ud.scatterPos;
                        const fromQuat = ud.gatherFromQuat || ud.scatterQuat;
                        tv.set(
                            centerX + ud.textLocal.x,
                            centerY + ud.textLocal.y,
                            -this.gatherFocusDist,
                        );
                        this.camera.localToWorld(tv);
                        s.position.lerpVectors(fromPos, tv, g1PosEase);
                        s.quaternion.copy(fromQuat).slerp(this.textQuat, g1PosEase);
                        this.setShardGatherScale(s, ud, g1GatherScale);
                        continue;
                    }

                    const atMainVisual = g1 <= 0.001 && g2 <= 0.001;

                    if (leftGather && atMainVisual) {
                        this.restoreScatterDynamics(ud);
                    }

                    s.scale.setScalar(SHARD_SCALE.MAIN);

                    ud.frame++;

                    const speed = ud.vel.length();

                    if (speed > 0.0002) {
                        s.position.add(ud.vel);
                        ud.vel.multiplyScalar(0.972);
                        ud.spin.x *= 0.98;
                        ud.spin.y *= 0.98;
                        ud.spin.z *= 0.98;
                    } else {
                        s.position.y += Math.sin(t * ud.floatSpeed + ud.floatPhase) * ud.floatAmp;
                    }

                    s.rotation.x += ud.spin.x;
                    s.rotation.y += ud.spin.y;
                    s.rotation.z += ud.spin.z;
                }

                if (plane1Opacity > 0.001 && this.gatherPlane1 && half) {
                    this.updateGatherPlane(
                        this.gatherPlane1,
                        centerX,
                        centerY,
                        plane1Opacity,
                    );
                } else if (this.gatherPlane1) {
                    this.gatherPlane1.visible = false;
                }

                if (plane2Opacity > 0.001 && this.gatherPlane2 && half) {
                    this.updateGatherPlane(
                        this.gatherPlane2,
                        centerX2,
                        centerY2,
                        plane2Opacity,
                    );
                } else if (this.gatherPlane2) {
                    this.gatherPlane2.visible = false;
                }

                // exploded 이전 조개 모델 마우스 회전
                if (this.model && !this.exploded) {
                    const ROT_LERP = 0.08;
                    this.shellRot.x += (this.shellTargetRot.x - this.shellRot.x) * ROT_LERP;
                    this.shellRot.y += (this.shellTargetRot.y - this.shellRot.y) * ROT_LERP;
                    this.model.rotation.x = this.shellBaseRot.x + this.shellRot.x;
                    this.model.rotation.y = this.shellBaseRot.y + this.shellRot.y;
                }

                // 블러: anchor1/2 plane·모임 완료 시 선명, g2 산개는 Z축(depth) 블러 유지
                const anchor1Sharp =
                    planeFill1 ||
                    (gathering1 && !inG2Zone && (g1 >= 0.82 || plane1Opacity > 0.01));
                const anchor2Sharp =
                    planeFill2 ||
                    (g2Gathering && plane2Opacity > 0.01 && g2Phase.gatherEase >= 0.95);
                const anchorSharp = anchor1Sharp || anchor2Sharp;
                if (this.exploded) {
                    if (anchorSharp) {
                        this.targetRadial = 0;
                        this.targetFront = 0;
                    } else if (g2Anim > 0.001) {
                        const phase = g2Phase;
                        const blur = 1 - phase.gatherEase;
                        this.targetRadial = g2Loose ? 0 : blur;
                        this.targetFront = blur * G2_SCATTER.FRONT_BLUR;
                    } else {
                        this.targetRadial = 1 - this.scrollProgress;
                        this.targetFront = 1 - this.scrollProgress;
                    }
                }

                if (this.blurMat) {
                    const u = this.blurMat.uniforms;
                    const g2p = g2Anim;
                    const atGatherFocus =
                        this.exploded &&
                        this.gatherFocusDist &&
                        (g1 >= 0.5 || g2p > 0.001);
                    if (atGatherFocus) {
                        u.focusViewZ.value = -this.gatherFocusDist;
                    } else {
                        u.focusViewZ.value = -this.camera.position.z;
                    }
                    if (anchorSharp) {
                        u.radialAmt.value = 0;
                        u.frontAmt.value = 0;
                    } else if (g2Loose) {
                        u.radialAmt.value = 0;
                        u.frontAmt.value +=
                            (this.targetFront - u.frontAmt.value) * 0.12;
                    } else {
                        if (this.targetRadial !== undefined)
                            u.radialAmt.value +=
                                (this.targetRadial - u.radialAmt.value) * 0.02;
                        if (this.targetFront !== undefined)
                            u.frontAmt.value +=
                                (this.targetFront - u.frontAmt.value) * 0.1;
                    }
                }

                this.renderer.setRenderTarget(this.sceneRT);
                this.renderer.render(this.scene, this.camera);

                this.renderer.setRenderTarget(null);
                this.renderer.render(this.postScene, this.postCamera);
            },

            onMouseMove(event) {
                if (!this.model || this.exploded) return;

                const canvas = this.$refs.canvas;
                const rect = canvas.getBoundingClientRect();
                const mouse = new this.three.Vector2(
                    ((event.clientX - rect.left) / rect.width) * 2 - 1,
                    -((event.clientY - rect.top) / rect.height) * 2 + 1,
                );

                // 마우스 위치와 반대 방향으로 미세 회전
                this.shellTargetRot.y = -mouse.x * 0.2;
                this.shellTargetRot.x = -mouse.y * 0.2;

                const raycaster = new this.three.Raycaster();
                raycaster.setFromCamera(mouse, this.camera);
                const hits = raycaster.intersectObject(this.model, true);
                canvas.style.cursor = hits.length > 0 ? 'pointer' : 'default';
            },

            onMouseLeave() {
                if (this.exploded) return;
                this.shellTargetRot.x = 0;
                this.shellTargetRot.y = 0;
                if (this.$refs.canvas) this.$refs.canvas.style.cursor = 'default';
            },

            scrollToAbout() {
                const about = document.querySelector('#about');
                if (about) {
                    about.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            },

            smoothstep(t) {
                const c = Math.max(0, Math.min(1, t));
                return c * c * (3 - 2 * c);
            },

            gatherShrinkEase(t) {
                return Math.max(0, Math.min(1, (t - 0.98) / 0.02));
            },

            anchorGatherScale() {
                return SHARD_SCALE.GATHERED;
            },

            placeShardsForG2Progress() {
                const g2 = this.gather2Progress || 0;
                const phase = this.computeG2Phase(g2);
                const g2s = phase.scatterEase;
                for (const s of this.shards) {
                    const ud = s.userData;
                    if (!ud.g2ScatterFromPos || !ud.g2LoosePos) continue;
                    s.position.lerpVectors(
                        ud.g2ScatterFromPos,
                        ud.g2LoosePos,
                        g2s,
                    );
                    this.applyG2LooseScale(s, g2s);
                }
            },

            resetMainShardScales() {
                for (const s of this.shards) {
                    s.scale.setScalar(SHARD_SCALE.MAIN);
                }
            },

            setShardGatherScale(s, ud, shrink) {
                const main = SHARD_SCALE.MAIN;
                const small = SHARD_SCALE.GATHERED;
                s.scale.setScalar(main + (small - main) * shrink);
            },

            /** g2 산개: 작음(1) → 큼(0), 점차 */
            g2ScatterScaleEase(scatterEase) {
                return 1 - this.smoothstep(scatterEase);
            },

            /** g2 모임: 큼(0) → 작음(1), 점차 */
            g2GatherScaleEase(gatherEase) {
                return this.smoothstep(gatherEase);
            },

            applyG2LooseScale(s, scatterEase) {
                const shrink = this.g2ScatterScaleEase(scatterEase);
                this.setShardGatherScale(s, s.userData, shrink);
                const limited = Math.min(
                    s.scale.x,
                    SHARD_SCALE.MAIN * G2_SCATTER.MAX_SCALE,
                );
                s.scale.setScalar(limited);
            },

            /** g2 모임: 산개 크기 → anchor2 작은 크기 (전 구간 점진) */
            applyG2GatherScale(s, ud, gatherEase) {
                const main = SHARD_SCALE.MAIN;
                const from = main * G2_SCATTER.MAX_SCALE;
                const to = main * SHARD_SCALE.GATHERED;
                const t = this.smoothstep(gatherEase);
                s.scale.setScalar(from + (to - from) * t);
            },

            computeG2Phase(g2) {
                const { SCATTER_START, SCATTER_END, GATHER_START } = G2_PHASE;
                if (g2 <= 0) return { scatterEase: 0, gatherEase: 0 };
                if (g2 < SCATTER_START) {
                    return { scatterEase: 0, gatherEase: 0 };
                }
                if (g2 < SCATTER_END) {
                    return {
                        scatterEase:
                            (g2 - SCATTER_START) / (SCATTER_END - SCATTER_START),
                        gatherEase: 0,
                    };
                }
                if (g2 < GATHER_START) {
                    return { scatterEase: 1, gatherEase: 0 };
                }
                return {
                    scatterEase: 1,
                    gatherEase: this.smoothstep(
                        (g2 - GATHER_START) / (1 - GATHER_START),
                    ),
                };
            },

            computeGather2Progress(vh, g1) {
                if (g1 < G2_SCROLL.G1_GATE) return 0;
                const anchor2 = document.querySelector('#about .shape-anchor2');
                if (!anchor2) return 0;
                const top = anchor2.getBoundingClientRect().top;
                const start = vh * G2_SCROLL.START_TOP;
                const end = vh * G2_SCROLL.END_TOP;
                const raw = (start - top) / (start - end);
                return Math.max(0, Math.min(1, raw));
            },

            buildG2LooseTargets() {
                const half = this.gatherVisibleH / 2;
                if (!half || half < 0.01 || !this.camera) return;

                this.snapShardsToAnchor1();

                const aspect = this.camera.aspect;
                const spreadX = half * aspect * G2_SCATTER.VIEW_XY;
                const spreadY = half * G2_SCATTER.VIEW_XY;
                const focusDist = this.gatherFocusDist;
                const zSpan = focusDist * G2_SCATTER.Z_FACTOR;
                const tv = new this.three.Vector3();

                for (const s of this.shards) {
                    const ud = s.userData;
                    ud.g2ScatterFromPos = s.position.clone();
                    ud.g2ScatterFromQuat = s.quaternion.clone();

                    const lx = (Math.random() - 0.5) * spreadX;
                    const ly = (Math.random() - 0.5) * spreadY;
                    const lz =
                        -focusDist * (1 + G2_SCATTER.Z_BIAS) +
                        (Math.random() - 0.5) * zSpan;

                    tv.set(lx, ly, lz);
                    this.camera.localToWorld(tv);
                    ud.g2LoosePos = tv.clone();
                }
            },

            snapShardsToAnchor1() {
                if (!this.textTargetsBuilt || !this.camera) return;
                const shapeAnchor = document.querySelector('#about .shape-anchor');
                const half = this.gatherVisibleH / 2;
                const aspect = this.camera.aspect;
                const { x: centerX, y: centerY } = this.shapeAnchorCenter(
                    shapeAnchor,
                    half,
                    aspect,
                );
                const tv = new this.three.Vector3();
                for (const s of this.shards) {
                    const ud = s.userData;
                    if (!ud.textLocal) continue;
                    tv.set(
                        centerX + ud.textLocal.x,
                        centerY + ud.textLocal.y,
                        -this.gatherFocusDist,
                    );
                    this.camera.localToWorld(tv);
                    s.position.copy(tv);
                    s.quaternion.copy(this.textQuat);
                    s.scale.setScalar(SHARD_SCALE.GATHERED);
                }
            },

            clearG2ShardState() {
                for (const s of this.shards) {
                    const ud = s.userData;
                    ud.g2ScatterFromPos = null;
                    ud.g2ScatterFromQuat = null;
                    ud.g2LoosePos = null;
                    ud.g2GatherFromPos = null;
                    ud.g2GatherFromQuat = null;
                }
            },

            snapshotGather1From() {
                for (const s of this.shards) {
                    const ud = s.userData;
                    ud.gatherFromPos = s.position.clone();
                    ud.gatherFromQuat = s.quaternion.clone();
                }
            },

            clearGather1From() {
                this._gatherSnapValid = false;
                for (const s of this.shards) {
                    const ud = s.userData;
                    ud.gatherFromPos = null;
                    ud.gatherFromQuat = null;
                }
            },

            snapshotG2GatherFrom() {
                for (const s of this.shards) {
                    const ud = s.userData;
                    ud.g2GatherFromPos = s.position.clone();
                    ud.g2GatherFromQuat = s.quaternion.clone();
                }
            },

            restoreScatterDynamics(ud) {
                if (!ud.scatterVel || ud.vel.length() > 0.005) return;
                ud.vel.copy(ud.scatterVel);
            },

            onScroll() {
                if (!this.exploded) return;

                const vh = window.innerHeight;
                const start = vh * 0.2;
                const end = vh; // About 섹션이 화면 중앙에 올 때 완성
                const y = window.scrollY || window.pageYOffset || 0;

                let p = (y - start) / (end - start);
                p = Math.max(0, Math.min(1, p));
                this.scrollProgress = p;

                this.gather2Progress = this.computeGather2Progress(vh, p);
                if (this.gather2Progress > 0 && !this.textTargets2Built) {
                    this.buildTextTargets2();
                }

                this.emitHeaderLogoMetrics();

                if (p > 0 && !this.textTargetsBuilt) this.buildTextTargets();
            },

            loadShapeImage() {
                if (this._shapeImg) return Promise.resolve(this._shapeImg);
                return new Promise((resolve, reject) => {
                    const image = new Image();
                    image.crossOrigin = 'anonymous';
                    image.onload = () => {
                        this._shapeImg = image;
                        resolve(image);
                    };
                    image.onerror = reject;
                    image.src = require('@/assets/img/home/bird.svg');
                });
            },

            async buildTextTargets() {
                const THREE = this.three;
                if (!THREE || !this.camera || this.shards.length === 0) return;

                let image;
                try {
                    image = await this.loadShapeImage();
                } catch {
                    return;
                }
                // 비동기 로딩 중 다른 호출이 이미 완성했을 수 있음
                if (this.textTargetsBuilt) return;

                // 샘플링용 캔버스
                const SAMPLE = 512;
                const imgAspect = image.width / image.height;
                const cv = document.createElement('canvas');
                cv.width = imgAspect >= 1 ? SAMPLE : Math.round(SAMPLE * imgAspect);
                cv.height = imgAspect >= 1 ? Math.round(SAMPLE / imgAspect) : SAMPLE;
                const ctx = cv.getContext('2d');
                ctx.drawImage(image, 0, 0, cv.width, cv.height);

                const img = ctx.getImageData(0, 0, cv.width, cv.height).data;

                // 불투명 픽셀(=그림 실루엣) 수집
                const filled = [];
                for (let y = 0; y < cv.height; y++) {
                    for (let x = 0; x < cv.width; x++) {
                        if (img[(y * cv.width + x) * 4 + 3] > 48) filled.push([x, y]);
                    }
                }
                if (filled.length === 0) return;

                // 균일 격자 샘플링
                const targetCount = this.shards.length;
                const cell = Math.max(2, Math.sqrt(filled.length / targetCount));
                const cellMap = new Map();
                for (const [x, y] of filled) {
                    const key = `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
                    if (!cellMap.has(key)) cellMap.set(key, [x, y]);
                }
                const pts = Array.from(cellMap.values());

                for (let i = pts.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [pts[i], pts[j]] = [pts[j], pts[i]];
                }
                if (pts.length === 0) return;

                const focusDist = this.camera.position.length();
                const fovRad = (this.camera.fov * Math.PI) / 180;
                const visibleH = 2 * focusDist * Math.tan(fovRad / 2);
                const worldPerPx = visibleH / window.innerHeight;

                // #about .shape-anchor 박스 크기에 맞춰 월드 높이 산정
                const shapeAnchor = document.querySelector('#about .shape-anchor');
                let worldHeight;
                if (shapeAnchor && shapeAnchor.getBoundingClientRect().height > 4) {
                    worldHeight = shapeAnchor.getBoundingClientRect().height * worldPerPx;
                } else {
                    worldHeight = visibleH * 0.45;
                }
                const pxToWorld = worldHeight / cv.height;

                // 조각 크기 (작을수록 디테일↑, 마스크가 가장자리 정리)
                this.gatherFlakeRadius = pxToWorld * cell * 1.2;
                this.gatherFocusDist = focusDist;
                this.gatherVisibleH = visibleH;
                this.textQuat = this.camera.quaternion.clone();

                // 그림 실루엣 알파 마스크 (조각이 모이는 영역과 동일한 cv 좌표계)
                const maskTex = new THREE.CanvasTexture(cv);
                maskTex.colorSpace = THREE.SRGBColorSpace;
                maskTex.minFilter = THREE.LinearFilter;
                maskTex.magFilter = THREE.LinearFilter;
                maskTex.generateMipmaps = false;
                maskTex.needsUpdate = true;
                this.maskTexture = maskTex;
                this._maskCanvas = cv;
                if (this.blurMat) this.blurMat.uniforms.tMask.value = maskTex;
                this.textHalfX = (cv.width / 2) * pxToWorld;
                this.textHalfY = (cv.height / 2) * pxToWorld;

                this.shards.forEach((s, i) => {
                    const [x, y] = pts[i % pts.length];
                    const localX = (x - cv.width / 2) * pxToWorld;
                    const localY = -(y - cv.height / 2) * pxToWorld;
                    s.userData.textLocal = new THREE.Vector3(localX, localY, 0);
                });

                if (!this.gatherPlane1) {
                    this.gatherPlane1 = this.createGatherPlane(
                        maskTex,
                        this.textHalfX,
                        this.textHalfY,
                    );
                }

                this.textTargetsBuilt = true;
            },

            shapeAnchorCenter(shapeAnchor, half, aspect) {
                let nx = 0;
                let ny = 0;
                if (shapeAnchor) {
                    const r = shapeAnchor.getBoundingClientRect();
                    nx = ((r.left + r.width / 2) / window.innerWidth) * 2 - 1;
                    ny =
                        -((r.top + r.height / 2) / window.innerHeight) * 2 + 1;
                }
                return { x: nx * half * aspect, y: ny * half };
            },

            createGatherPlane(tex, halfX, halfY) {
                const THREE = this.three;
                const geo = new THREE.PlaneGeometry(halfX * 2, halfY * 2);
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.generateMipmaps = false;

                const mat = new THREE.MeshBasicMaterial({
                    map: tex,
                    transparent: true,
                    alphaTest: 0.06,
                    side: THREE.DoubleSide,
                    depthWrite: true,
                    toneMapped: false,
                    color: new THREE.Color(1, 1, 1),
                });

                const mesh = new THREE.Mesh(geo, mat);
                mesh.visible = false;
                mesh.frustumCulled = false;
                mesh.renderOrder = 10;
                this.scene.add(mesh);
                return mesh;
            },

            updateGatherPlane(plane, centerX, centerY, opacity) {
                if (!plane) return;
                const tv =
                    this._planeVec ||
                    (this._planeVec = new this.three.Vector3());
                tv.set(centerX, centerY, -this.gatherFocusDist);
                this.camera.localToWorld(tv);
                plane.position.copy(tv);
                plane.quaternion.copy(this.textQuat);
                plane.visible = opacity > 0.01;
                plane.material.opacity = opacity;
                const fade = Math.max(0, Math.min(1, opacity));
                const bright =
                    1 + (GATHER_PLANE.BRIGHTNESS - 1) * fade;
                plane.material.color.setScalar(bright);
            },

            loadShapeImage2() {
                if (this._shapeImg2) return Promise.resolve(this._shapeImg2);
                return new Promise((resolve, reject) => {
                    const image = new Image();
                    image.crossOrigin = 'anonymous';
                    image.onload = () => {
                        this._shapeImg2 = image;
                        resolve(image);
                    };
                    image.onerror = reject;
                    image.src = require('@/assets/img/home/flower.svg');
                });
            },

            async buildTextTargets2() {
                const THREE = this.three;
                if (!THREE || !this.camera || this.shards.length === 0) return;

                let image;
                try {
                    image = await this.loadShapeImage2();
                } catch {
                    return;
                }
                if (this.textTargets2Built) return;

                const SAMPLE = 512;
                const imgAspect = image.width / image.height;
                const cv = document.createElement('canvas');
                cv.width = imgAspect >= 1 ? SAMPLE : Math.round(SAMPLE * imgAspect);
                cv.height = imgAspect >= 1 ? Math.round(SAMPLE / imgAspect) : SAMPLE;
                const ctx = cv.getContext('2d');
                ctx.drawImage(image, 0, 0, cv.width, cv.height);

                const img = ctx.getImageData(0, 0, cv.width, cv.height).data;
                const filled = [];
                for (let y = 0; y < cv.height; y++) {
                    for (let x = 0; x < cv.width; x++) {
                        const i = (y * cv.width + x) * 4;
                        const a = img[i + 3];
                        if (a > 48) filled.push([x, y]);
                    }
                }
                if (filled.length === 0) return;

                const targetCount = this.shards.length;
                const cell = Math.max(2, Math.sqrt(filled.length / targetCount));
                const cellMap = new Map();
                for (const [x, y] of filled) {
                    const key = `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
                    if (!cellMap.has(key)) cellMap.set(key, [x, y]);
                }
                const pts = Array.from(cellMap.values());
                for (let i = pts.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [pts[i], pts[j]] = [pts[j], pts[i]];
                }
                if (pts.length === 0) return;

                const focusDist = this.gatherFocusDist || this.camera.position.length();
                const fovRad = (this.camera.fov * Math.PI) / 180;
                const visibleH = 2 * focusDist * Math.tan(fovRad / 2);
                const worldPerPx = visibleH / window.innerHeight;

                const shapeAnchor = document.querySelector(
                    '#about .shape-anchor2',
                );
                let worldHeight;
                if (shapeAnchor && shapeAnchor.getBoundingClientRect().height > 4) {
                    worldHeight =
                        shapeAnchor.getBoundingClientRect().height * worldPerPx;
                } else {
                    worldHeight = visibleH * 0.45;
                }
                const pxToWorld = worldHeight / cv.height;

                this.gather2FlakeRadius = this.gatherFlakeRadius || pxToWorld * cell * 1.2;
                this.textHalfX2 = (cv.width / 2) * pxToWorld;
                this.textHalfY2 = (cv.height / 2) * pxToWorld;

                const maskTex = new THREE.CanvasTexture(cv);
                maskTex.colorSpace = THREE.SRGBColorSpace;
                maskTex.minFilter = THREE.LinearFilter;
                maskTex.magFilter = THREE.LinearFilter;
                maskTex.generateMipmaps = false;
                maskTex.needsUpdate = true;
                this.maskTexture2 = maskTex;
                this._maskCanvas2 = cv;

                this.shards.forEach((s, i) => {
                    const [x, y] = pts[i % pts.length];
                    const localX = (x - cv.width / 2) * pxToWorld;
                    const localY = -(y - cv.height / 2) * pxToWorld;
                    s.userData.textLocal2 = new THREE.Vector3(localX, localY, 0);
                });

                if (!this.gatherPlane2) {
                    this.gatherPlane2 = this.createGatherPlane(
                        maskTex,
                        this.textHalfX2,
                        this.textHalfY2,
                    );
                }

                this.textTargets2Built = true;
                if ((this.gather2Progress || 0) > 0.001) {
                    this._g2LooseValid = false;
                }
            },

            onResize() {
                this.winH = window.innerHeight;
                if (this.scrollProgress < 0.01) this.$nextTick(() => this.measureLogo());
                const canvas = this.$refs.canvas;
                if (!canvas) return;
                const w = canvas.clientWidth;
                const h = canvas.clientHeight;
                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
                if (this.sceneRT) this.sceneRT.setSize(w, h);
                if (this.blurMat) this.blurMat.uniforms.aspectRatio.value = w / h;
            },
        },
    }
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables' as *;

#mainvisual {
    position: relative;
    width: 100%;
    height: 100vh;

    canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: block;
        z-index: 1;
    }

    .content__item {
        position: absolute;
        z-index: 2;
        user-select: none;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.7s ease;

        ::v-deep span {
            display: inline-block;
            min-width: 8px;
            position: relative;
            letter-spacing: 0.2em;
            text-transform: uppercase;
        }

        &.visible {
            opacity: 0.4;
        }

        &.fade-out {
            opacity: 0;
        }

        &--1 {
            top: 30vh;
            left: 20vw;
            text-align: center;

            ::v-deep span:nth-child(10),
            ::v-deep span:nth-child(24) {
                display: block;
            }
        }

        &--2 {
            top: 60vh;
            right: 20vw;
            transform: translateX(50%);
            text-align: center;

            ::v-deep span:nth-child(16),
            ::v-deep span:nth-child(32),
            ::v-deep span:nth-child(51) {
                display: block;
            }
        }
    }

    .hint {
        position: absolute;
        z-index: 2;
        bottom: 5vw;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        text-align: center;
        opacity: 0.4;
        animation: blink 2s ease-in-out infinite;
        user-select: none;
    }

    .title {
        position: fixed;
        inset: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        pointer-events: none;

        .title__logo-spacer {
            width: auto;
            height: 20vh;
            flex-shrink: 0;
            visibility: hidden;
            pointer-events: none;
        }

        .title__content__text {
            z-index: 3;
            text-align: center;
            transform-origin: top center;
            will-change: transform, opacity;

            h2 {
                margin-top: 1.5rem;
                font-size: 1.5rem;
                font-weight: 400;
                font-family: $ft-basic, $ft-hahmlet;
                letter-spacing: 0.1em;
                user-select: none;
            }

            h1 {
                margin-top: 0.5rem;
                font-size: 4rem;
                font-family: $ft-tanpearl, $ft-bagel;
                letter-spacing: 0.1em;
                user-select: none;
                text-shadow: $text-shadow;
            }

            p {
                margin-top: 0.5rem;
                font-size: 0.75rem;
                letter-spacing: 0.2em;
                text-transform: uppercase;
                text-align: center;
                opacity: 0.4;
                animation: blink 2s ease-in-out infinite;
                user-select: none;
            }
        }

        .scroll-down {
            position: absolute;
            left: 50%;
            bottom: -5vw;
            transform: translate(-50%, 100%);
            z-index: 3;
            font-size: 0.75rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            text-align: center;
            cursor: pointer;

            ::v-deep .text-shifting {
                margin-top: 1rem;
                
                span {
                    display: inline-block;
                    min-width: 8px;
                }
            }
        }
    }
}

@keyframes blink {
    0%,
    100% {
        opacity: 0.4;
    }
    50% {
        opacity: 0.2;
    }
}
</style>

<style lang='scss'>
.lang-ko {
    #mainvisual {
        .content__item {
            &--1 {
                span:nth-child(10),
                span:nth-child(24) {
                    display: inline-block;
                }

                span:nth-child(12) {
                    display: block;
                }
            }

            &--2 {
                span:nth-child(16),
                span:nth-child(32),
                span:nth-child(51) {
                    display: inline-block;
                }

                span:nth-child(10),
                span:nth-child(23) {
                    display: block;
                }
            }
        }

        .hint {
            font-size: 0.9rem;
        }

        .title {
            h1 {
                line-height: 1;
                font-size: 6rem;
                letter-spacing: 0;
            }

            p {
                margin-top: 1rem;
                font-size: 0.9rem;
            }
        }
    }
}
</style>