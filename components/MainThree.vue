<template>
    <div id='MainThree'></div>
</template>
  
<script>
import * as THREE from 'three';
    
let camera, scene, renderer, spheres = [];
let mouseX = 0, mouseY = 0;
let windowHalfX = 0;
let windowHalfY = 0;
let deviceOrientationX = 0;
let deviceOrientationY = 0;
let isMobile = false;
  
export default {
    name: 'MainThree',
    data: function() {
        return {
            
        }
    },
    mounted() {
        this.init();
        this.animate();
    },
    beforeDestroy() {
        this.cleanup();
    },
    methods: {
        init() {
            // 클라이언트 사이드에서만 실행
            if (typeof window === 'undefined') return;
            
            // 모바일 디바이스 감지
            isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                      ('ontouchstart' in window) || 
                      (navigator.maxTouchPoints > 0);
            
            // 윈도우 크기 초기화
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            
            // 씬 생성
            scene = new THREE.Scene();
            
            // 카메라 생성
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
            camera.position.z = 500;
            
            // 렌더러 생성
            const container = document.getElementById('MainThree');
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0x000000, 0);
            container.appendChild(renderer.domElement);
            
            this.createSpheres();
            this.setupEventListeners();
        },
        
        createSpheres() {
            const geometry = new THREE.SphereGeometry(2, 16, 16);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.8
            });
            
            // 100개의 구체를 랜덤하게 배치
            for (let i = 0; i < 100; i++) {
                const sphere = new THREE.Mesh(geometry, material);
                
                // 랜덤 위치
                sphere.position.x = (Math.random() - 0.5) * 1000;
                sphere.position.y = (Math.random() - 0.5) * 1000;
                sphere.position.z = (Math.random() - 0.5) * 1000;
                
                // 랜덤 크기
                const scale = Math.random() * 0.5 + 0.5;
                sphere.scale.setScalar(scale);
                
                // 랜덤 회전 속도 저장
                sphere.userData = {
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    }
                };
                
                spheres.push(sphere);
                scene.add(sphere);
            }
        },
        
        setupEventListeners() {
            // 마우스 이벤트 (데스크톱)
            document.addEventListener('mousemove', this.onMouseMove, false);
            window.addEventListener('resize', this.onWindowResize, false);
            
            // 디바이스 오리엔테이션 이벤트 (모바일/태블릿)
            if (isMobile) {
                if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
                    const requestPermission = () => {
                        DeviceOrientationEvent.requestPermission()
                            .then(response => {
                                if (response === 'granted') {
                                    window.addEventListener('deviceorientation', this.onDeviceOrientation, false);
                                }
                            })
                            .catch(console.error);
                    };
                    document.addEventListener('touchstart', requestPermission, { once: true });
                } else {
                    // Android나 구형 iOS
                    window.addEventListener('deviceorientation', this.onDeviceOrientation, false);
                }
            }
        },
        
        onMouseMove(event) {
            if (!isMobile) {
                mouseX = (event.clientX - windowHalfX) * 0.1;
                mouseY = (event.clientY - windowHalfY) * 0.1;
            }
        },
        
        onDeviceOrientation(event) {
            if (isMobile) {
                deviceOrientationX = (event.beta || 0) * 0.1;
                deviceOrientationY = (event.gamma || 0) * 0.1;
            }
        },
        
        onWindowResize() {
            if (typeof window === 'undefined') return;
            
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            
            renderer.setSize(window.innerWidth, window.innerHeight);
        },
        
        animate() {
            requestAnimationFrame(this.animate);
            
            // 카메라 위치 조정 (마우스 또는 디바이스 기울기)
            let targetX, targetY;
            
            if (isMobile) {
                // 모바일: 디바이스 기울기 사용
                targetX = deviceOrientationX;
                targetY = deviceOrientationY;
            } else {
                // 데스크톱: 마우스 위치 사용
                targetX = mouseX;
                targetY = -mouseY;
            }
            
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (targetY - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            
            // 구체들 회전
            spheres.forEach(sphere => {
                sphere.rotation.x += sphere.userData.rotationSpeed.x;
                sphere.rotation.y += sphere.userData.rotationSpeed.y;
                sphere.rotation.z += sphere.userData.rotationSpeed.z;
            });
            
            renderer.render(scene, camera);
        },
        
        cleanup() {
            if (typeof window === 'undefined') return;
            
            document.removeEventListener('mousemove', this.onMouseMove, false);
            window.removeEventListener('resize', this.onWindowResize, false);
            window.removeEventListener('deviceorientation', this.onDeviceOrientation, false);
            document.removeEventListener('touchstart', this.requestPermission, false);
            
            if (renderer) {
                renderer.dispose();
                const container = document.getElementById('MainThree');
                if (container && container.contains(renderer.domElement)) {
                    container.removeChild(renderer.domElement);
                }
            }
            
            if (scene) {
                spheres.forEach(sphere => {
                    scene.remove(sphere);
                    if (sphere.geometry) sphere.geometry.dispose();
                    if (sphere.material) sphere.material.dispose();
                });
                spheres = [];
            }
        }
    }
}
</script>

<style scoped>
#MainThree {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
}
</style>