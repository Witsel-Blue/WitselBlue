<template>
    <div id='intro'>
        <canvas ref='canvas'></canvas>
    </div>
</template>

<script>
export default {
    data() {
        return {
            _renderer: null,
            _scene: null,
            _camera: null,
            _controls: null,
            _animId: null,
            _model: null,
        }
    },

    mounted() {
        this.initThree()
    },

    beforeDestroy() {
        if (this._animId) cancelAnimationFrame(this._animId)
        if (this._controls) this._controls.dispose()
        if (this._renderer) this._renderer.dispose()
        window.removeEventListener('resize', this.onResize)
    },

    methods: {
        async initThree() {
            const THREE = await import('three')
            const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')
            const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')

            const canvas = this.$refs.canvas
            const { clientWidth: w, clientHeight: h } = canvas

            // Renderer
            this._renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
            this._renderer.setSize(w, h)
            this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            this._renderer.outputEncoding = THREE.sRGBEncoding

            // Scene & Camera
            this._scene = new THREE.Scene()
            this._camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100)
            this._camera.position.set(0, 0, 6)

            // Lighting
            const ambient = new THREE.AmbientLight(0xfff5e6, 0.8)
            this._scene.add(ambient)

            const key = new THREE.DirectionalLight(0xffffff, 2.5)
            key.position.set(3, 5, 4)
            this._scene.add(key)

            const fill = new THREE.DirectionalLight(0xd0c8ff, 0.6)
            fill.position.set(-4, 1, 2)
            this._scene.add(fill)

            const rim = new THREE.DirectionalLight(0xffe0b0, 0.4)
            rim.position.set(0, -3, -4)
            this._scene.add(rim)

            // OrbitControls
            this._controls = new OrbitControls(this._camera, canvas)
            this._controls.enableDamping = true
            this._controls.dampingFactor = 0.08
            this._controls.enableZoom = false
            this._controls.enablePan = false

            // Load model
            const loader = new GLTFLoader()
            loader.load('/models/seashell.glb', (gltf) => {
                this._model = gltf.scene

                // 모델 중앙 정렬
                const box = new THREE.Box3().setFromObject(this._model)
                const center = box.getCenter(new THREE.Vector3())
                const size = box.getSize(new THREE.Vector3())
                this._model.position.sub(center)

                // 카메라 거리 자동 조정
                const maxDim = Math.max(size.x, size.y, size.z)
                this._camera.position.z = maxDim * 2.2

                this._scene.add(this._model)
                this.animate()
            })

            window.addEventListener('resize', this.onResize)
        },

        animate() {
            this._animId = requestAnimationFrame(this.animate)
            this._controls.update()
            this._renderer.render(this._scene, this._camera)
        },

        onResize() {
            const canvas = this.$refs.canvas
            if (!canvas) return
            const w = canvas.clientWidth
            const h = canvas.clientHeight
            this._camera.aspect = w / h
            this._camera.updateProjectionMatrix()
            this._renderer.setSize(w, h)
        },
    },
}
</script>

<style lang='scss' scoped>
@use '@/assets/scss/base/variables' as *;

#intro {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    canvas {
        width: 100%;
        height: 100%;
        display: block;
    }
}
</style>
