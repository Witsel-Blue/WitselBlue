<template>
    <div id="mainvisual"></div>
</template>
  
<script>
    import * as THREE from 'three';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
    
    let camera, scene, renderer;
  
    export default {
        name: 'TheCanvas',
        data: function() {
            return {
            
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                const result = document.querySelector('#mainvisual');
                const mouse = new THREE.Vector2();
                const target = new THREE.Vector2();
                const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

                // 1. Scene: 화면에서 보여주려는 객체를 담는 공간
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xf7f7f7);

                // 2. Camera : Scene을 바라볼 시점
                camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );
                camera.position.z = 50;

                // 3. Renderer : Scene+Camera, 화면 그려주는 역할
                const renderer = new THREE.WebGLRenderer();
                renderer.setSize( window.innerWidth, window.innerHeight );
                result.appendChild( renderer.domElement );

                const light = new THREE.DirectionalLight(0xffffff);
                light.position.set(2, 4, 3);
                scene.add(light);

                // material
                const material = new THREE.MeshStandardMaterial({
                    color: 0x56779F,
                });
                const geometry = new THREE.DodecahedronGeometry(2, 1);
                const object = new THREE.Mesh(geometry, material);
                scene.add(object);

                for ( let i = 0; i < 150; i ++ ) {
                    const object = new THREE.Mesh( geometry, material );
                    object.position.x = Math.random() * 80 - 40;
                    object.position.y = Math.random() * 80 - 40;
                    object.position.z = Math.random() * 80 - 40;
                    object.rotation.x = Math.random() * 2 * Math.PI;
                    object.rotation.y = Math.random() * 2 * Math.PI;
                    object.rotation.z = Math.random() * 2 * Math.PI;
                    scene.add( object );    
                }

                renderer.render(scene, camera);

                // responsive
                window.addEventListener('resize', ()=> {
                    camera.aspect = window.innerWidth/window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                })

                // mousemove
                document.addEventListener( 'mousemove', onMouseMove, false );
                document.addEventListener( 'wheel', onMouseWheel, false );
                
                function onMouseMove( event ) {
                    mouse.x = ( event.clientX - windowHalf.x );
                    mouse.y = ( event.clientY - windowHalf.x );
                }

                function onMouseWheel( event ) {
                    camera.position.z += event.deltaY * 0.01;
                }

                function animate() {
                    target.x = ( 1 - mouse.x ) * 0.0002;
                    target.y = ( 1 - mouse.y ) * 0.0002;
                    camera.rotation.x += 0.05 * ( target.y - camera.rotation.x );
                    camera.rotation.y += 0.05 * ( target.x - camera.rotation.y );
                    requestAnimationFrame( animate );
                    renderer.render( scene, camera );
                }
                animate();

            },
            // main() {
            //     const result = document.querySelector('#mainvisual');

            //     // 1. Scene: 화면에서 보여주려는 객체를 담는 공간
            //     const scene = new THREE.Scene();
            //     scene.background = new THREE.Color(0xf7f7f7);

            //     // 2. Camera : Scene을 바라볼 시점
            //     const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 500);
            //     camera.position.set(5, 5, 5);
            //     camera.lookAt(0, 0, 0);

            //     // 3. Renderer : Scene+Camera, 화면 그려주는 역할
            //     const renderer = new THREE.WebGLRenderer();
            //     renderer.setSize( window.innerWidth, window.innerHeight );
            //     result.appendChild( renderer.domElement );

            //     const light = new THREE.DirectionalLight(0xffffff);
            //     light.position.set(2, 4, 3);
            //     scene.add(light);

            //     // material
            //     const material = new THREE.MeshStandardMaterial({
            //         color: 0x56779F,
            //     });
            //     const bottomGeometry = new THREE.DodecahedronGeometry(2, 1);
            //     const bottom = new THREE.Mesh(bottomGeometry, material);
            //     scene.add(bottom);

            //     renderer.render(scene, camera);

            //     // 화면 반응형
            //     window.addEventListener('resize', ()=> {
            //         camera.aspect = window.innerWidth/window.innerHeight;
            //         camera.updateProjectionMatrix();
            //         renderer.setSize(window.innerWidth, window.innerHeight);
            //     })

            //     // Orbit Controls
            //     const controls = new OrbitControls(camera, renderer.domElement);
            //     controls.enableDamping = true;

            //     // Animation
            //     function animate() {
            //         renderer.render(scene, camera);
            //         controls.update();
            //         requestAnimationFrame(animate);
            //     }
            //     animate();

            // },
        }
    }
  
</script>
  
<style lang="scss" scoped>
    #mainvisual {

    }
</style>