<template>
    <div id='three-bg' ref='container'></div>
</template>

<script>
let THREE = null;
let camera = null;
let scene = null;
let renderer = null;
let container = null;
let animationId = null;
let points = null;
let planeGroup = null;
let basePositions = null; // 웨이브 계산용 원본 좌표

export default {
    name: 'ThreeBg',
    data() {
        return {
            threeLoaded: false
        };
    },
    async mounted() {
        if (process.client) {
            try {
                THREE = await import('three');
                this.threeLoaded = true;
                this.$nextTick(() => {
                    this.init();
                    this.animate();
                });
            } catch (error) {
                console.error('[ThreeBg] Failed to load Three.js:', error);
            }
        }
    },
    beforeDestroy() {
        this.cleanup();
    },
    methods: {
        init() {
            if (typeof window === 'undefined' || !THREE) return;

            container = this.$refs.container;
            if (!container) return;

            // Renderer 설정
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            // Camera 설정
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera = new THREE.PerspectiveCamera(
                50,
                width / height,
                0.1,
                1600
            );
            camera.position.set(0, 0, 800);

            // Scene 설정
            scene = new THREE.Scene();

            // 점 생성
            const spacing = 10; // 점 사이 간격
            const pointsGeometry = new THREE.BufferGeometry();
            const positions = [];

            // 그리드 평면 생성 
            const gridSize = 1600;
            const cols = Math.ceil(gridSize / spacing);
            const rows = Math.ceil(gridSize / spacing);

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const x = (j * spacing) - (gridSize / 2);
                    const y = (i * spacing) - (gridSize / 2);
                    const z = 0;
                    positions.push(x, y, z);
                }
            }

            pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            basePositions = new Float32Array(positions);

            // 그리드 평면 기울이기
            planeGroup = new THREE.Group();
            planeGroup.rotation.x = -1;
            planeGroup.rotation.y = 0;

            // 원형 텍스처 생성
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const context = canvas.getContext('2d');

            const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            context.fillStyle = gradient;
            context.beginPath();
            context.arc(32, 32, 32, 0, Math.PI * 2);
            context.fill();

            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;

            const pointsMaterial = new THREE.PointsMaterial({
                color: 0xf7f7f7,
                size: 3,
                transparent: true,
                opacity: 1,
                map: texture,
                alphaTest: 0.1,
                sizeAttenuation: false
            });

            points = new THREE.Points(pointsGeometry, pointsMaterial);
            planeGroup.add(points);
            scene.add(planeGroup);

            window.addEventListener('resize', this.onWindowResize);
            window.addEventListener('scroll', this.onScroll);
            
            // 초기 스크롤 위치 반영
            this.$nextTick(() => {
                this.onScroll();
            });
        },

        onWindowResize() {
            if (!camera || !renderer || !container) return;

            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        },

        onScroll() {
            if (!planeGroup) return;

            // profile 섹션 찾기
            const profileSection = document.querySelector('section.profile');
            if (!profileSection) return;

            const scrollY = window.scrollY || window.pageYOffset;
            const windowHeight = window.innerHeight;
            const profileRect = profileSection.getBoundingClientRect();
            const profileTop = scrollY + profileRect.top;
            
            const targetScroll = profileTop - (windowHeight / 2);
            
            // 스크롤 범위 설정 
            const startScroll = 0;
            const endScroll = targetScroll;
            
            // 현재 스크롤 위치에 따른 rotation.x 계산 (-1에서 0으로)
            let rotationX = -1;
            let opacity = 1;
            
            if (scrollY >= startScroll && scrollY <= endScroll) {
                const progress = endScroll === startScroll
                    ? 1
                    : Math.min(1, (scrollY - startScroll) / (endScroll - startScroll));
                rotationX = -1 + (progress * 1); // -1에서 0으로
                opacity = 1 - progress; // 1에서 0으로
            } else if (scrollY > endScroll) {
                rotationX = 0;
                opacity = 0;
            }
            
            planeGroup.rotation.x = rotationX;
            if (points && points.material) {
                points.material.opacity = opacity;
            }
        },

        animate() {
            if (!THREE || !scene || !camera || !renderer) return;

            animationId = requestAnimationFrame(() => this.animate());

            const time = Date.now() * 0.001;

            // 웨이브 형태로 점 위치 업데이트
            if (points && basePositions) {
                const positions = points.geometry.attributes.position.array;
                const len = positions.length;
                const waveAmp = 20;
                const waveFreq = 0.01;
                const waveSpeed = 1;

                for (let i = 0; i < len; i += 3) {
                    const baseX = basePositions[i];
                    const baseY = basePositions[i + 1];
                    const phase = (baseX + baseY) * waveFreq;
                    const zOffset = Math.sin(phase + time * waveSpeed) * waveAmp;

                    positions[i] = baseX;
                    positions[i + 1] = baseY;
                    positions[i + 2] = zOffset;
                }
                points.geometry.attributes.position.needsUpdate = true;
            }

            renderer.render(scene, camera);
        },

        cleanup() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }

            window.removeEventListener('resize', this.onWindowResize);
            window.removeEventListener('scroll', this.onScroll);

            if (scene && planeGroup) {
                if (points) {
                    if (points.geometry) points.geometry.dispose();
                    if (points.material) {
                        if (points.material.map) points.material.map.dispose();
                        points.material.dispose();
                    }
                }
                scene.remove(planeGroup);
                points = null;
                planeGroup = null;
                basePositions = null;
            }

            if (renderer) {
                renderer.dispose();
                if (container && renderer.domElement && container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
                renderer = null;
            }

            camera = null;
            scene = null;
            container = null;
        }
    }
};
</script>

<style lang='scss' scoped>
#three-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
}
</style>
