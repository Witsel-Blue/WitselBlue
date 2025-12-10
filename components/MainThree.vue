<template>
    <div id='MainThree'></div>
</template>
  
<script>
let THREE = null;
let EffectComposer = null;
let RenderPass = null;
let ShaderPass = null;
let RGBShiftShader = null;
let DotScreenShader = null;
let OutputPass = null;

let camera = null;
let renderer = null;
let composer = null;
let object = null;
let scene = null;
let container = null;
let animationId = null;
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let isProfileSection = false;
let meshes = [];
let effect1 = null;
let effect2 = null;
let effect3 = null;

export default {
    name: 'MainThree',
    data() {
        return {
            threeLoaded: false
        };
    },
    async mounted() {
        if (process.client) {
            try {
                THREE = await import('three');
                ({ EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js'));
                ({ RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js'));
                ({ ShaderPass } = await import('three/examples/jsm/postprocessing/ShaderPass.js'));
                ({ RGBShiftShader } = await import('three/examples/jsm/shaders/RGBShiftShader.js'));
                ({ DotScreenShader } = await import('three/examples/jsm/shaders/DotScreenShader.js'));
                ({ OutputPass } = await import('three/examples/jsm/postprocessing/OutputPass.js'));
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
        init() {
            if (typeof window === 'undefined' || !THREE) return;

            container = document.getElementById('MainThree');
            if (!container) return;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            camera = new THREE.PerspectiveCamera(
                70,
                container.clientWidth / container.clientHeight,
                1,
                1000
            );
            camera.position.z = 400;

            scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x000000, 1, 1000);
            scene.background = null;

            object = new THREE.Object3D();
            scene.add(object);

            const geometry = new THREE.SphereGeometry(1, 4, 4);
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                flatShading: true
            });

            meshes = [];
            for (let i = 0; i < 100; i++) {
                const mesh = new THREE.Mesh(geometry, material.clone());
                mesh.position.set(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).normalize();
                mesh.position.multiplyScalar(Math.random() * 800 + 200);
                mesh.rotation.set(
                    Math.random() * 2,
                    Math.random() * 2,
                    Math.random() * 2
                );
                mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 12 + 4;
                object.add(mesh);
                meshes.push(mesh);
            }

            scene.add(new THREE.AmbientLight(0xcccccc));

            const light = new THREE.DirectionalLight(0xffffff, 3);
            light.position.set(1, 1, 1);
            scene.add(light);

            // postprocessing
            composer = new EffectComposer(renderer);
            composer.addPass(new RenderPass(scene, camera));

            effect1 = new ShaderPass(DotScreenShader);
            effect1.uniforms['scale'].value = 4;
            composer.addPass(effect1);

            // RGBShiftShader는 제거 (DotScreenShader만 사용)
            effect2 = null;

            effect3 = new OutputPass();
            composer.addPass(effect3);

            // 초기에는 postprocessing 효과 비활성화 (흰색)
            this.updateEffects(false);

            window.addEventListener('resize', this.onWindowResize);
            window.addEventListener('pointermove', this.onPointerMove, false);
            window.addEventListener('scroll', this.onScroll, false);
            
            // 초기 체크
            this.$nextTick(() => {
                this.checkProfileSection();
            });
        },

        checkProfileSection() {
            if (typeof window === 'undefined') return;
            
            const profileSection = document.querySelector('section.profile');
            if (!profileSection) return;

            const rect = profileSection.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const profileTop = scrollY + rect.top;
            const currentScroll = scrollY + window.innerHeight;
            
            // profile 섹션의 top 위치보다 아래에 있으면 DotScreenShader 활성화
            const shouldEnableDotScreen = currentScroll >= profileTop;
            
            if (shouldEnableDotScreen !== isProfileSection) {
                isProfileSection = shouldEnableDotScreen;
                this.updateEffects(isProfileSection);
            }
        },

        onScroll() {
            this.checkProfileSection();
        },

        updateEffects(enable) {
            if (!composer || !effect1) return;

            // DotScreenShader만 활성화/비활성화
            effect1.enabled = enable;
            
            // 재질 색상은 항상 흰색 유지
            meshes.forEach(mesh => {
                if (mesh.material) {
                    mesh.material.color.setHex(0xffffff);
                }
            });
        },

        onPointerMove(event) {
            if (!container) return;
            const width = container.clientWidth || window.innerWidth;
            const height = container.clientHeight || window.innerHeight;
            mouse.x = (event.clientX / width) * 2 - 1;
            mouse.y = -(event.clientY / height) * 2 + 1;
            
            // 마우스 위치에 따라 회전 목표값 설정
            targetRotation.y = mouse.x * Math.PI * 0.5;
            targetRotation.x = mouse.y * Math.PI * 0.5;
        },

        onWindowResize() {
            if (!camera || !renderer || !container || !composer) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
            composer.setSize(container.clientWidth, container.clientHeight);
        },

        animate() {
            if (!THREE || !composer || !object) return;

            animationId = requestAnimationFrame(() => this.animate());

            // 마우스 위치에 따라 부드럽게 회전
            object.rotation.x += (targetRotation.x - object.rotation.x) * 0.004;
            object.rotation.y += (targetRotation.y - object.rotation.y) * 0.004;

            composer.render();
        },

        cleanup() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            window.removeEventListener('resize', this.onWindowResize);
            window.removeEventListener('pointermove', this.onPointerMove, false);
            window.removeEventListener('scroll', this.onScroll, false);

            if (composer) {
                composer.dispose();
                composer = null;
            }

            if (scene && object) {
                object.children.forEach(child => {
                    if (child.geometry) child.geometry.dispose();
                    if (child.material) child.material.dispose();
                });
                scene.clear();
                object = null;
                scene = null;
            }

            if (renderer) {
                renderer.dispose();
                if (container && renderer.domElement && container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
                renderer = null;
            }

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
