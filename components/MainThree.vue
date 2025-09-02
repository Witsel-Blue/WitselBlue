<template>
    <div id='MainThree'></div>
</template>
  
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    
let camera, scene, renderer;
  
export default {
    name: 'MainThree',
    data: function() {
        return {
            
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            const result = document.querySelector('#MainThree');
            const mouse = new THREE.Vector2();
            const target = new THREE.Vector2();
            const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

            // 1. Scene: 화면에서 보여주려는 객체를 담는 공간
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xf7f7f7);

            // 2. Camera : Scene을 바라볼 시점
            camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 500 );
            camera.position.z = 10;

            // 3. Renderer : Scene+Camera, 화면 그려주는 역할
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize( window.innerWidth, window.innerHeight );
            result.appendChild( renderer.domElement );

            // light
            const light = new THREE.DirectionalLight(0xffffff);
            light.position.set(-5, 10, 50);
            scene.add(light);

            // material
            const material = new THREE.MeshPhongMaterial({
                color: 0x9FB1C8,
            });
            material.shininess = 100;
            material.specular = new THREE.Color(0xffffff);

            // object
            const geometry1 = new THREE.TorusKnotGeometry( 1, 0.4, 128, 128, 1, 3 );
            const torus = new THREE.Mesh(geometry1, material);
            torus.position.set(1.6, -0.2, 1);
            scene.add(torus);

            const geometry2 = new THREE.SphereGeometry( 0.6, 64, 32 );
            const sphere = new THREE.Mesh(geometry2, material);
            sphere.position.set(-1.8, 0.6, 1);
            scene.add(sphere);

            renderer.render(scene, camera);

            // responsive
            window.addEventListener('resize', ()=> {
                camera.aspect = window.innerWidth/window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            })

            // mousemove
            document.addEventListener( 'mousemove', onMouseMove, false );
            // document.addEventListener( 'wheel', onMouseWheel, false );
                
            function onMouseMove( event ) {
                mouse.x = ( event.clientX - windowHalf.x );
                mouse.y = ( event.clientY - windowHalf.x );
            }

            // function onMouseWheel( event ) {
            //     camera.position.z += event.deltaY * 0.01;
            // }

            function animate() {
                const time = Date.now() * 0.0001;
                torus.rotation.x = time;
                torus.rotation.y = time;
                sphere.rotation.x = time;
                sphere.rotation.y = time;

                target.x = ( 1 - mouse.x ) * 0.0002;
                target.y = ( 1 - mouse.y ) * 0.0002;
                camera.rotation.x += 0.05 * ( target.y - camera.rotation.x );
                camera.rotation.y += 0.05 * ( target.x - camera.rotation.y );
                requestAnimationFrame( animate );
                renderer.render( scene, camera );
            }
            animate();

        },
    }
}
  
</script>
  
<style lang='scss' scoped>
</style>