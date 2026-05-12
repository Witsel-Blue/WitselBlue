<template>
    <div id='title' ref='titleContainer'></div>
</template>

<script>
let THREE = null;
let camera = null;
let scene = null;
let renderer = null;
let textMesh = null;
let container = null;
let animationId = null;
let dropletData = [];

export default {
    name: 'Title',
    data() {
        return {
            threeLoaded: false,
            scrollY: 0,
            mouseX: 0,
            mouseY: 0
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
                console.error('[Title] Failed to load Three.js:', error);
            }
        }
    },
    beforeDestroy() {
        this.cleanup();
    },
    methods: {
        init() {
            if (typeof window === 'undefined' || !THREE) return;

            container = this.$refs.titleContainer;
            if (!container) return;

            // Canvas로 텍스트 텍스처 생성
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const text = 'Witsel Blue';
            
            // 화면 크기에 따른 폰트 크기 계산 (화면 너비의 약 15%)
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const isMobile = containerWidth < 768;
            const fontSize = isMobile ? containerWidth * 0.12 : containerWidth * 0.08;
            
            // 텍스트 스타일 설정
            context.font = `bold ${fontSize}px 'TanPearl', 'YUniverse', sans-serif`;
            context.fillStyle = '#ffffff';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            
            // Canvas 크기 설정
            const metrics = context.measureText(text);
            const textWidth = metrics.width;
            const textHeight = fontSize;
            canvas.width = textWidth + 100;
            canvas.height = textHeight + 100;
            
            // 배경 투명
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // 텍스트 다시 그리기
            context.font = `bold ${fontSize}px 'TanPearl', 'YUniverse', sans-serif`;
            context.fillStyle = '#ffffff';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, canvas.width / 2, canvas.height / 2);

            // 텍스처 생성
            const texture = new THREE.CanvasTexture(canvas);
            texture.needsUpdate = true;

            // Renderer 설정
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(containerWidth, containerHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);

            // Camera 설정
            const fov = 50;
            camera = new THREE.PerspectiveCamera(
                fov,
                containerWidth / containerHeight,
                0.1,
                1000
            );
            
            // 화면에 맞게 카메라 거리 계산
            const planeWidth = canvas.width * 0.5;
            const planeHeight = canvas.height * 0.5;
            const maxDimension = Math.max(planeWidth, planeHeight);
            const cameraDistance = maxDimension / (2 * Math.tan((fov * Math.PI) / 360));
            camera.position.z = cameraDistance * 1.2; // 약간 여유 공간

            // Scene 설정
            scene = new THREE.Scene();

            // Plane Geometry로 텍스트 메시 생성 (세그먼트 증가로 부드러운 변형)
            const geometry = new THREE.PlaneGeometry(
                planeWidth,
                planeHeight,
                64,
                64
            );
            
            // 물방울 중심점 정의
            const dropletCount = 5;
            dropletData = [];
            for (let i = 0; i < dropletCount; i++) {
                dropletData.push({
                    baseX: Math.random() * 0.5 + 0.25,
                    baseY: Math.random() * 0.5 + 0.25,
                    baseRadius: Math.random() * 0.15 + 0.1,
                    moveSpeed: Math.random() * 0.3 + 0.2,
                    moveRange: Math.random() * 0.08 + 0.05,
                    sizeSpeed: Math.random() * 0.5 + 0.3,
                    sizeRange: Math.random() * 0.04 + 0.03,
                    phase: Math.random() * Math.PI * 2
                });
            }
            
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTexture: { value: texture },
                    uTime: { value: 0 },
                    uDroplet1: { value: new THREE.Vector3(dropletData[0].baseX, dropletData[0].baseY, dropletData[0].baseRadius) },
                    uDroplet2: { value: new THREE.Vector3(dropletData[1].baseX, dropletData[1].baseY, dropletData[1].baseRadius) },
                    uDroplet3: { value: new THREE.Vector3(dropletData[2].baseX, dropletData[2].baseY, dropletData[2].baseRadius) },
                    uDroplet4: { value: new THREE.Vector3(dropletData[3].baseX, dropletData[3].baseY, dropletData[3].baseRadius) },
                    uDroplet5: { value: new THREE.Vector3(dropletData[4].baseX, dropletData[4].baseY, dropletData[4].baseRadius) },
                    uDistortionStrength: { value: 5.0 }
                },
                vertexShader: `
                    uniform vec3 uDroplet1;
                    uniform vec3 uDroplet2;
                    uniform vec3 uDroplet3;
                    uniform vec3 uDroplet4;
                    uniform vec3 uDroplet5;
                    uniform float uDistortionStrength;
                    
                    varying vec2 vUv;
                    
                    void main() {
                        vUv = uv;
                        vec3 pos = position;
                        
                        // 물방울 효과로 vertex 위치 변형
                        vec3 droplets[5];
                        droplets[0] = uDroplet1;
                        droplets[1] = uDroplet2;
                        droplets[2] = uDroplet3;
                        droplets[3] = uDroplet4;
                        droplets[4] = uDroplet5;
                        
                        for (int i = 0; i < 5; i++) {
                            vec3 droplet = droplets[i];
                            vec2 center = droplet.xy;
                            float radius = droplet.z;
                            
                            // UV에서 물방울 중심까지의 거리
                            vec2 toCenter = uv - center;
                            float dist = length(toCenter);
                            
                            // 물방울 영역 내에서만 변형
                            if (dist < radius && dist > 0.0001) {
                                float normalizedDist = dist / radius;
                                // 중심에서 멀수록 작아지는 팩터
                                float factor = 1.0 - normalizedDist;
                                factor = factor * factor * factor; // 더 부드러운 감쇠
                                
                                // 물방울 효과: 중심에서 밖으로 늘어나는 효과
                                vec2 direction = toCenter / dist;
                                float distortionAmount = uDistortionStrength * factor;
                                
                                // vertex 위치를 변형 (늘어나는 효과)
                                pos.xy += direction * distortionAmount;
                            }
                        }
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform sampler2D uTexture;
                    varying vec2 vUv;
                    
                    void main() {
                        vec4 color = texture2D(uTexture, vUv);
                        gl_FragColor = color;
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            textMesh = new THREE.Mesh(geometry, material);
            scene.add(textMesh);

            window.addEventListener('resize', this.onWindowResize);
            window.addEventListener('scroll', this.onScroll);
            window.addEventListener('mousemove', this.onMouseMove);
        },

        onWindowResize() {
            if (!camera || !renderer || !container) return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        },

        onScroll() {
            this.scrollY = window.scrollY || window.pageYOffset;
        },

        onMouseMove(event) {
            // 마우스 위치를 -1 ~ 1 범위로 정규화
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        },

        animate() {
            if (!THREE || !scene || !camera || !renderer || !textMesh) return;

            animationId = requestAnimationFrame(() => this.animate());

            const time = Date.now() * 0.001;

            // 스크롤이 최상단(0)일 때만 웨이브 및 마우스 반응 활성화
            const isTopOfPage = this.scrollY < 50; // 50px 이하면 최상단으로 간주

            if (isTopOfPage) {
                // 웨이브 애니메이션 (부드러운 좌우 움직임)
                const waveX = Math.sin(time * 0.5) * 3; // 좌우로 3픽셀 움직임
                const waveY = Math.cos(time * 0.7) * 2; // 상하로 2픽셀 움직임
                
                // 마우스 위치에 따른 parallax 효과 (부드럽게)
                const targetX = waveX + this.mouseX * 15;
                const targetY = waveY + this.mouseY * 10;
                
                // 현재 위치에서 목표 위치로 부드럽게 이동
                textMesh.position.x += (targetX - textMesh.position.x) * 0.05;
                textMesh.position.y += (targetY - textMesh.position.y) * 0.05;
            } else {
                // 스크롤 시 원래 위치로 부드럽게 복귀
                textMesh.position.x += (0 - textMesh.position.x) * 0.1;
                textMesh.position.y += (0 - textMesh.position.y) * 0.1;
            }

            // 물방울 위치/크기 애니메이션
            if (textMesh.material && textMesh.material.uniforms && dropletData.length > 0) {
                textMesh.material.uniforms.uTime.value = time;
                
                for (let i = 0; i < dropletData.length; i++) {
                    const droplet = dropletData[i];
                    
                    // 위치 애니메이션
                    const moveX = Math.sin(time * droplet.moveSpeed + droplet.phase) * droplet.moveRange;
                    const moveY = Math.cos(time * droplet.moveSpeed * 1.3 + droplet.phase) * droplet.moveRange;
                    const animatedX = droplet.baseX + moveX;
                    const animatedY = droplet.baseY + moveY;
                    
                    // 크기 애니메이션
                    const sizePulse = Math.sin(time * droplet.sizeSpeed + droplet.phase * 2.0) * droplet.sizeRange;
                    const animatedRadius = droplet.baseRadius + sizePulse;
                    
                    const uniformName = `uDroplet${i + 1}`;
                    if (textMesh.material.uniforms[uniformName]) {
                        textMesh.material.uniforms[uniformName].value.set(
                            animatedX,
                            animatedY,
                            animatedRadius
                        );
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

            window.removeEventListener('resize', this.onWindowResize);
            window.removeEventListener('scroll', this.onScroll);
            window.removeEventListener('mousemove', this.onMouseMove);

            if (scene && textMesh) {
                if (textMesh.geometry) textMesh.geometry.dispose();
                if (textMesh.material) {
                    if (textMesh.material.map) textMesh.material.map.dispose();
                    textMesh.material.dispose();
                }
                scene.clear();
                textMesh = null;
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

<style lang='scss' scoped>
#title {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    z-index: 3;
}

// mobile
@media all and (max-width: 768px) {
    #title {
        canvas {
            max-width: 90vw;
            height: auto;
        }
    }
}
</style>
