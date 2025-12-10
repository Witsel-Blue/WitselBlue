<template>
    <div id='MainThree'></div>
</template>
  
<script>
let THREE = null;
let EXRLoader = null;

let renderer = null;
let scene = null;
let camera = null;
let pmremGenerator = null;
let container = null;

let spheres = [];
let mouse = { x: 0, y: 0 };
let animationId = null;
let angle = 0;

const ORBIT_RADIUS = 60;
const ORBIT_HEIGHT = 0;
const SPHERE_COUNT = 10;

export default {
    name: 'MainThree',
    props: {
        envExr: {
            type: String,
            default: '/img/home/env.exr'
        }
    },
    data() {
        return {
            threeLoaded: false
        };
    },
    async mounted() {
        if (process.client) {
            try {
                THREE = await import('three');
                ({ EXRLoader } = await import('three/examples/jsm/loaders/EXRLoader.js'));
                this.threeLoaded = true;
                this.$nextTick(() => {
                    this.init();
                    this.animate();
                });
            } catch (error) {
                console.error('[MainThree] Failed to load Three.js modules:', error);
            }
        }
    },
    beforeDestroy() {
        this.cleanup();
    },
    methods: {
        resolveEnvPath() {
            if (!this.envExr) return '';
            if (this.envExr.startsWith('http')) return this.envExr;
            if (this.envExr.startsWith('/')) return this.envExr;
            return `/${this.envExr}`;
        },

        init() {
            if (typeof window === 'undefined' || !THREE) return;

            container = document.getElementById('MainThree');
            if (!container) return;

            // 렌더러
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setClearColor(0x000000, 0);
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.0;
            container.appendChild(renderer.domElement);

            // 씬
            scene = new THREE.Scene();
            scene.background = null;

            // 카메라
            camera = new THREE.PerspectiveCamera(
                45,
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            camera.position.set(0, 0, 60);

            // 조명
            scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.0));
            const dir = new THREE.DirectionalLight(0xffffff, 1.5);
            dir.position.set(10, 20, 30);
            scene.add(dir);

            // 환경맵
            if (EXRLoader) {
                const envPath = this.resolveEnvPath();
                if (!envPath) {
                    console.warn('[MainThree] envExr 경로가 없습니다. 환경맵을 로드하지 않습니다.');
                } else {
                    pmremGenerator = new THREE.PMREMGenerator(renderer);
                    pmremGenerator.compileEquirectangularShader();

                    const exrLoader = new EXRLoader();
                    exrLoader.setDataType(THREE.FloatType);

                    exrLoader.load(
                        envPath,
                        texture => {
                            const envMap = pmremGenerator.fromEquirectangular(texture).texture;
                            scene.environment = envMap;
                            texture.dispose();
                            pmremGenerator.dispose();
                            pmremGenerator = null;
                        },
                        undefined,
                        err => {
                            console.error('EXR load failed:', err);
                            if (pmremGenerator) {
                                pmremGenerator.dispose();
                                pmremGenerator = null;
                            }
                        }
                    );
                }
            }

            this.createSpheres();
            this.setupEventListeners();
        },

        createSpheres() {
            if (!THREE) return;

            const spheresLocal = [];
            const geo = new THREE.SphereGeometry(2, 32, 24);
            const geo2 = new THREE.SphereGeometry(3.6, 32, 24);
            const geo3 = new THREE.SphereGeometry(1, 32, 24);

            const mat = new THREE.MeshStandardMaterial({
                color: 0xf7f7f7,
                metalness: 1.0,
                roughness: 0.3
            });
            const mat2 = new THREE.MeshStandardMaterial({
                color: 0xf7f7f7,
                metalness: 1,
                roughness: 0.5
            });
            const mat3 = new THREE.MeshStandardMaterial({
                color: 0xf7f7f7,
                metalness: 1,
                roughness: 0.2
            });

            for (let i = 0; i < SPHERE_COUNT; i++) {
                const pos = new THREE.Vector3(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20
                );

                let mesh;
                if (i === 0 || i === 1 || i === 2) {
                    mesh = new THREE.Mesh(geo, mat.clone());
                } else if (i === 3) {
                    mesh = new THREE.Mesh(geo2, mat3.clone());
                } else if (i === 4 || i === 5) {
                    mesh = new THREE.Mesh(geo, mat3.clone());
                } else {
                    mesh = new THREE.Mesh(geo3, mat2.clone());
                }

                mesh.position.copy(pos);
                scene.add(mesh);

                spheresLocal.push({
                    mesh,
                    origin: pos.clone(),
                    velocity: new THREE.Vector3()
                });
            }

            spheres = spheresLocal;
        },

        setupEventListeners() {
            window.addEventListener('pointermove', this.onPointerMove, false);
            window.addEventListener('resize', this.onResize, false);
        },

        onPointerMove(event) {
            if (!container) return;
            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;
            mouse.x = (event.clientX / width) * 2 - 1;
            mouse.y = -(event.clientY / height) * 2 + 1;
        },

        onResize() {
            if (!camera || !renderer || !container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        },

        getMouseWorld() {
            if (!THREE || !camera) return new THREE.Vector3();
            const tmpV = new THREE.Vector3(mouse.x, mouse.y, 0.5);
            tmpV.unproject(camera);
            const dir = tmpV.sub(camera.position).normalize();
            const t = -camera.position.z / dir.z;
            return camera.position.clone().add(dir.multiplyScalar(t));
        },

        animate() {
            if (!THREE || !renderer || !scene || !camera) return;

            animationId = requestAnimationFrame(() => this.animate());

            angle += 0.002;
            camera.position.x = Math.cos(angle) * ORBIT_RADIUS;
            camera.position.z = Math.sin(angle) * ORBIT_RADIUS;
            camera.position.y = ORBIT_HEIGHT;
            camera.lookAt(0, 0, 0);

            const mouseWorld = this.getMouseWorld();

            spheres.forEach(s => {
                const dir = new THREE.Vector3().subVectors(s.mesh.position, mouseWorld);
                const dist = dir.length();
                dir.normalize();

                const forceMag = Math.max(0, 20 - dist) * 0.02;
                const force = dir.multiplyScalar(forceMag);

                s.velocity.add(force);
                s.velocity.multiplyScalar(0.9);

                s.mesh.position.add(s.velocity);

                const back = new THREE.Vector3()
                    .subVectors(s.origin, s.mesh.position)
                    .multiplyScalar(0.02);
                s.velocity.add(back);
            });

            for (let i = 0; i < spheres.length; i++) {
                for (let j = i + 1; j < spheres.length; j++) {
                    const s1 = spheres[i];
                    const s2 = spheres[j];
                    const pos1 = s1.mesh.position;
                    const pos2 = s2.mesh.position;

                    const dir = new THREE.Vector3().subVectors(pos2, pos1);
                    const dist = dir.length();
                    if (dist === 0) continue;

                    const r1 = s1.mesh.geometry.parameters.radius;
                    const r2 = s2.mesh.geometry.parameters.radius;
                    const minDist = r1 + r2;

                    if (dist < minDist) {
                        dir.normalize();
                        const overlap = (minDist - dist) * 0.5;

                        pos1.addScaledVector(dir, -overlap);
                        pos2.addScaledVector(dir, overlap);

                        const v1 = s1.velocity;
                        const v2 = s2.velocity;
                        const relativeVelocity = new THREE.Vector3().subVectors(v1, v2);
                        const sepVel = relativeVelocity.dot(dir);

                        if (sepVel < 0) {
                            const impulse = dir.clone().multiplyScalar(sepVel * -0.5);
                            v1.add(impulse);
                            v2.addScaledVector(impulse, -1);
                        }
                    }
                }
            }

            renderer.render(scene, camera);
        },

        cleanup() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            window.removeEventListener('pointermove', this.onPointerMove, false);
            window.removeEventListener('resize', this.onResize, false);

            if (scene && spheres.length) {
                spheres.forEach(s => {
                    scene.remove(s.mesh);
                    if (s.mesh.geometry) s.mesh.geometry.dispose();
                    if (s.mesh.material) s.mesh.material.dispose();
                });
                spheres = [];
            }

            if (pmremGenerator) {
                pmremGenerator.dispose();
                pmremGenerator = null;
            }

            if (renderer) {
                renderer.dispose();
                if (container && renderer.domElement && container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
                renderer = null;
            }

            scene = null;
            camera = null;
            container = null;
        }
    }
};
</script>

<style scoped>
#MainThree {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}
</style>
