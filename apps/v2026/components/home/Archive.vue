<template>
    <div id='archive'>
        <canvas ref='canvas' />
    </div>
</template>

<script>
    import nacreboxUrl from '@/assets/model/nacrebox.glb';

    export default {
        name: 'Archive',
        mounted() {
            this.initThree();
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.onResize);
            if (this.controls) this.controls.dispose();
            if (this.renderer) this.renderer.dispose();
        },
        methods: {
            async initThree() {
                const THREE = await import('three');
                const { GLTFLoader } = await import(
                    'three/examples/jsm/loaders/GLTFLoader.js'
                );
                const { OrbitControls } = await import(
                    'three/examples/jsm/controls/OrbitControls.js'
                );

                const canvas = this.$refs.canvas;
                if (!canvas) return;

                const w = canvas.clientWidth;
                const h = canvas.clientHeight;

                this.renderer = new THREE.WebGLRenderer({
                    canvas,
                    antialias: true,
                    alpha: true,
                });
                this.renderer.setSize(w, h);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                this.renderer.outputColorSpace = THREE.SRGBColorSpace;

                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(50, w / h, 0.05, 200);
                this.controls = new OrbitControls(this.camera, canvas);
                this.controls.enablePan = false;
                this.controls.enableZoom = false;
                this.controls.addEventListener('change', this.renderScene);

                const light = new THREE.DirectionalLight(0xffffff, 2);
                light.position.set(3, 4, 5);
                this.scene.add(light);
                this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));

                const loader = new GLTFLoader();
                loader.load(nacreboxUrl, (gltf) => {
                    const model = gltf.scene;
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    const size = box.getSize(new THREE.Vector3());

                    model.position.sub(center);
                    this.scene.add(model);

                    const maxDim = Math.max(size.x, size.y, size.z);
                    this.camera.position.set(0, 0, maxDim * 2.5);
                    this.camera.lookAt(0, 0, 0);
                    this.controls.update();
                    this.renderScene();
                });

                window.addEventListener('resize', this.onResize);
            },
            renderScene() {
                if (!this.renderer || !this.scene || !this.camera) return;
                this.renderer.render(this.scene, this.camera);
            },
            onResize() {
                const canvas = this.$refs.canvas;
                if (!canvas || !this.renderer || !this.camera) return;

                const w = canvas.clientWidth;
                const h = canvas.clientHeight;

                this.camera.aspect = w / h;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(w, h);
                this.renderScene();
            },
        },
    };
</script>

<style lang='scss' scoped>
    #archive {
        width: 100%;
        height: 100vh;

        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
</style>