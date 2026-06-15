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
            <Logo ref='logoEl' class='title__logo' :style='logoScrollStyle' />
            <div class='title__content__text' :style='titleScrollStyle'>
                <h2>{{ $t('home.mainSub') }}</h2>
                <h1>{{ $t('home.mainTitle') }}</h1>
                <p>{{ $t('home.mainText') }}</p>
                <button type='button' class='scroll-down' @click='scrollToProfile'>
                    <TextShifting text='scroll down' />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import TextShifting from '@/components/TextShifting.vue';
    import Logo from '@/components/svg/logo.vue'
    import nacreShardUrl from '@/assets/model/texture/nacre_white.png';

    export default {
        components: {
            TextShifting,
            Logo,
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
            logoScrollStyle() {
                const p = this.scrollProgress;
                const H = this.winH || 800;
                const lp = Math.min(1, p / 0.55);
                const t = lp * lp * (3 - 2 * lp);
                const hStart = 0.2 * H; // 초기 20vh
                const scaleEnd = 40 / hStart; // 최종 40px
                const scale = 1 + (scaleEnd - 1) * t;
                const topEnd = 0.025 * H;
                const dy = (topEnd - this.logoTop0) * t;
                return {
                    transform: `translateY(${dy}px) scale(${scale})`,
                    transformOrigin: 'top center',
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
            this.gatherFlakeRadius = 0;
            this.maskTexture = null;
            this.initThree();
            this.$nextTick(() => this.syncIntroState());
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

                    // 텍스처 위에 래커 광택 + 은은한 간섭색만 얹음
                    const mat = new THREE.MeshPhysicalMaterial({
                        map: tex,
                        color: 0xffffff,
                        roughness: 0.22,
                        metalness: 0.0,
                        iridescence: 0.9,
                        iridescenceIOR: 1.4,
                        iridescenceThicknessRange: [
                            180 + Math.random() * 120,
                            420 + Math.random() * 320,
                        ],
                        clearcoat: 1.0,
                        clearcoatRoughness: 0.1,
                        sheen: 0.5,
                        sheenRoughness: 0.4,
                        sheenColor: new THREE.Color(0xffffff),
                        envMapIntensity: 1.4,
                        transparent: true,
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
                this.$nextTick(() => this.onScroll());
            },

            syncIntroState() {
                this.$root.$emit('mainvisual-intro-state', this.exploded);
                if (!this.exploded) {
                    this.scrollProgress = 0;
                    window.scrollTo(0, 0);
                }
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
                    this.explode();
                    this.$nextTick(() => this.measureLogo());
                }
            },

            measureLogo() {
                // 스크롤 0(그룹 중앙 정렬) 상태에서 로고의 초기 top 위치를 측정
                const el = this.$refs.logoEl && this.$refs.logoEl.$el;
                if (el) this.logoTop0 = el.getBoundingClientRect().top;
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

                const gathering =
                    this.exploded && this.textTargetsBuilt && this.scrollProgress > 0;
                const gp = this.scrollProgress;
                const gatherEase = gp * gp * (3 - 2 * gp);

                // 마스크 박스 위치
                let centerX = 0;
                let centerY = 0;
                if (gathering) {
                    const half = this.gatherVisibleH / 2;
                    const aspect = this.camera.aspect;
                    const shapeAnchor =
                        this._shapeAnchor ||
                        (this._shapeAnchor = document.querySelector('#profile .shape-anchor'));
                    let nx = 0;
                    let ny = 0;
                    if (shapeAnchor) {
                        const r = shapeAnchor.getBoundingClientRect();
                        nx = ((r.left + r.width / 2) / window.innerWidth) * 2 - 1;
                        ny = -((r.top + r.height / 2) / window.innerHeight) * 2 + 1;
                    }
                    centerX = nx * half * aspect;
                    centerY = ny * half;
                }

                const tv = this._scratchVec || (this._scratchVec = new this.three.Vector3());

                // 마스크 박스
                if (this.blurMat && this.maskTexture) {
                    const u = this.blurMat.uniforms;
                    if (gathering) {
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
                        // gatherEase가 거의 1(조각 완전히 모임)된 뒤에만 마스크
                        const maskIn = Math.max(0, Math.min(1, (gatherEase - 0.995) / 0.005));
                        u.maskStrength.value = maskIn * maskIn * (3 - 2 * maskIn);
                    } else {
                        u.maskStrength.value = 0;
                    }
                }

                for (const s of this.shards) {
                    const ud = s.userData;

                    if (gathering) {
                        if (!ud.anchorPos) {
                            ud.anchorPos = s.position.clone();
                            ud.anchorQuat = s.quaternion.clone();
                        }
                        tv.set(
                            centerX + ud.textLocal.x,
                            centerY + ud.textLocal.y,
                            -this.gatherFocusDist,
                        );
                        this.camera.localToWorld(tv);
                        s.position.lerpVectors(ud.anchorPos, tv, gatherEase);
                        s.quaternion.copy(ud.anchorQuat).slerp(this.textQuat, gatherEase);
                        const targetScale = this.gatherFlakeRadius
                            ? this.gatherFlakeRadius / ud.geoRadius
                            : 0.3;
                        s.scale.setScalar(1 + (targetScale - 1) * gatherEase);
                        continue;
                    }

                    if (ud.anchorPos) {
                        ud.anchorPos = null;
                        ud.anchorQuat = null;
                    }
                    if (s.scale.x !== 1) s.scale.setScalar(1);
                    if (s.material.opacity !== 1) s.material.opacity = 1;

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

                // exploded 이전 조개 모델 마우스 회전
                if (this.model && !this.exploded) {
                    const ROT_LERP = 0.08;
                    this.shellRot.x += (this.shellTargetRot.x - this.shellRot.x) * ROT_LERP;
                    this.shellRot.y += (this.shellTargetRot.y - this.shellRot.y) * ROT_LERP;
                    this.model.rotation.x = this.shellBaseRot.x + this.shellRot.x;
                    this.model.rotation.y = this.shellBaseRot.y + this.shellRot.y;
                }

                // 블러 제거
                if (this.exploded) {
                    this.targetRadial = 1 - this.scrollProgress;
                    this.targetFront = 1 - this.scrollProgress;
                }

                if (this.blurMat) {
                    const u = this.blurMat.uniforms;
                    if (this.targetRadial !== undefined)
                        u.radialAmt.value += (this.targetRadial - u.radialAmt.value) * 0.02;
                    if (this.targetFront !== undefined)
                        u.frontAmt.value += (this.targetFront - u.frontAmt.value) * 0.1;
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

            scrollToProfile() {
                const profile = document.querySelector('#profile');
                if (profile) {
                    profile.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return;
                }
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            },

            onScroll() {
                if (!this.exploded) return;

                const vh = window.innerHeight;
                const start = vh * 0.2;
                const end = vh; // Profile 섹션이 화면 중앙에 올 때 완성
                const y = window.scrollY || window.pageYOffset || 0;

                let p = (y - start) / (end - start);
                p = Math.max(0, Math.min(1, p));
                this.scrollProgress = p;

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
                    image.src = require('@/assets/img/home/profile_nacre.png');
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

                // 샘플링용 캔버스 (성능 위해 축소)
                const SAMPLE = 320;
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
                        if (img[(y * cv.width + x) * 4 + 3] > 80) filled.push([x, y]);
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

                // #profile .shape-anchor 박스 크기에 맞춰 월드 높이 산정
                const shapeAnchor = document.querySelector('#profile .shape-anchor');
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
                maskTex.minFilter = THREE.LinearFilter;
                maskTex.magFilter = THREE.LinearFilter;
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

                this.textTargetsBuilt = true;
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
    }

    .content__item {
        position: absolute;
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

        .title__logo {
            width: auto;
            height: 20vh;
            color: $white;
            mix-blend-mode: difference;
            transform-origin: top center;
            will-change: transform;
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
            }

            p {
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
            margin-top: 2.5rem;
            z-index: 3;
            font-size: 0.75rem;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            text-align: center;
            cursor: pointer;
            background: none;
            border: none;
            color: inherit;
            pointer-events: auto;

            ::v-deep .text-shifting span {
                display: inline-block;
                min-width: 8px;
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