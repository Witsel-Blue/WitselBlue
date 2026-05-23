<template>
    <div id='mainvisual'>
        <canvas ref='canvas' @click='onCanvasClick'></canvas>

        <div
            v-if='ready && clickCount >= 1 && !exploded'
            class='content__item content__item--1'
            :class='{ visible: show1, "fade-out": clickCount >= 2 }'
        >
            <TextShifting
                text='Break the harsh reality (seashell),'
                :playing='play1'
            />
            <!-- 거친 현실(껍데기)을 깨부수고, -->
        </div>

        <div
            v-if='ready && clickCount >= 2 && !exploded'
            class='content__item content__item--2'
            :class='{ visible: show2 }'
        >
            <TextShifting
                text='and extract the inherent beauty (nacre/technology) within.'
                :playing='play2'
            />
            <!-- 그 안의 본질적인 아름다움(자개/기술)을 꺼내어 보세요. -->
        </div>

        <p class='hint' v-if='!exploded && ready'>
            click the shell
        </p>
        <div class='title' v-if='exploded'>
            <Logo />
            <h2>frontend developer</h2>
            <h1>WitselBlue</h1>
            <p>inspired by nacre artistry</p>
        </div>
    </div>
</template>

<script>
import TextShifting from '@/components/TextShifting.vue';
import Logo from '@/components/svg/logo.vue'

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
        };
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
        this.shards = [];
        this.crackAudio = null;
        this.initThree();
    },

    beforeDestroy() {
        if (this.animId) cancelAnimationFrame(this.animId);
        if (this.controls) this.controls.dispose();
        if (this.renderer) this.renderer.dispose();
        window.removeEventListener('resize', this.onResize);
        if (this.$refs.canvas) this.$refs.canvas.removeEventListener('mousemove', this.onMouseMove);
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

            // Camera
            this.camera = new THREE.PerspectiveCamera(60, w / h, 0.05, 100);
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

            // ── Post-processing 셋업 ──────────────────────────────────────
            // 씬을 depth texture 포함 RenderTarget에 렌더 후,
            // 풀스크린 quad 셰이더로 ① 방사형 블러 + ② Z 앞쪽 블러 적용

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
                        gl_FragColor = color / float(N);
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

                // 카메라 Spherical 초기화 (트위닝용)
                this.camSph = new THREE.Spherical().setFromVector3(this.camera.position);
                this.camSphTarget = this.camSph.clone();

                this.modelSize = size;
                this.scene.add(this.model);
                this.ready = true;
                this.animate();
            });

            window.addEventListener('resize', this.onResize);
            canvas.addEventListener('mousemove', this.onMouseMove);
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
            const SHARD_COUNT = 110;

            for (let i = 0; i < SHARD_COUNT; i++) {
                const geo = this.makeShardGeo();

                const mat = new THREE.MeshPhysicalMaterial({
                    color: 0xe8e4dc,
                    roughness: 0.06,
                    metalness: 0.0,
                    iridescence: 1.0,
                    iridescenceIOR: 1.8,
                    iridescenceThicknessRange: [80, 500],
                    envMapIntensity: 2.5,
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
            if (canvas) canvas.style.cursor = 'initial';
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

            const FADE_MS = 700;

            if (this.clickCount === 1) {
                if (this.camSphTarget) {
                    this.camSphTarget.theta -= -Math.PI * 0.40;
                    this.camSphTarget.phi   -= Math.PI * 0.20;
                }

                this.$nextTick(() => requestAnimationFrame(() => { this.show1 = true; }));
                setTimeout(() => { this.play1 = true; }, FADE_MS);
                this.playcrack();
            } else if (this.clickCount === 2) {
                if (this.camSphTarget) {
                    this.camSphTarget.theta -= -Math.PI * 0.80;
                    this.camSphTarget.phi   -= Math.PI * 0.20;
                }

                this.$nextTick(() => requestAnimationFrame(() => { this.show2 = true; }));
                setTimeout(() => { this.play2 = true; }, FADE_MS);
                this.playcrack();
            } else {
                this.exploded = true;
                this.explode();
            }
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

            for (const s of this.shards) {
                const ud = s.userData;
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

            if (this.blurMat) {
                const u = this.blurMat.uniforms;
                if (this.targetRadial !== undefined)
                    u.radialAmt.value += (this.targetRadial - u.radialAmt.value) * 0.001;
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

            const raycaster = new this.three.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);
            const hits = raycaster.intersectObject(this.model, true);
            canvas.style.cursor = hits.length > 0 ? 'pointer' : 'default';
        },

        onResize() {
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
        bottom: 2rem;
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
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;

        svg {
            width: auto;
            height: 20vh;
        }

        h2 {
            margin-top: 1.5rem;
            font-size: 1.5rem;
            font-weight: 400;
            letter-spacing: 0.1em;
            user-select: none;
        }

        h1 {
            margin-top: 0.5rem;
            font-size: 4rem;
            font-family: $ft-tanpearl;
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
