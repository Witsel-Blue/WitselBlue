<template>
    <div class="container" style="position:absolute">
    </div>
  </template>
  
  <script>
  import * as THREE from 'three';
  
  let camera, scene, renderer;
  
  export default {
      name: 'TheCanvas',
      data: function() {
  
        return {
          
        }
      },
      mounted: function() {
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer();
        
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
  
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
        camera.position.set( 0, 0, 100 );
        camera.lookAt( 0, 0, 0 );
  
        var material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
        var points = [];
        points.push( new THREE.Vector3( - 10, 0, 0 ) );
        points.push( new THREE.Vector3( 0, 10, 0 ) );
        points.push( new THREE.Vector3( 10, 0, 0 ) );
  
        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( geometry, material );
        scene.add( line );
        renderer.render( scene, camera );
      }
  }
  
  </script>
  
  <style>
  </style>