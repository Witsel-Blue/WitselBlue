export const beadsSnippet = `
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xefefef);

const camera = new THREE.PerspectiveCamera(45, container.clientWidth/container.clientHeight, 0.1, 1000);
camera.position.set(0,0,60);

// Light
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.0));
const dir = new THREE.DirectionalLight(0xffffff, 1.5);
dir.position.set(10, 20, 30);
scene.add(dir);

// Env
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

const exrLoader = new EXRLoader();
exrLoader.load(envExr, function(texture){
    
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;

    texture.dispose();
    pmremGenerator.dispose();
});

// Sphere
const COUNT = 10;
const spheres = [];
const geo = new THREE.SphereGeometry(2, 32, 24);
const geo2 = new THREE.SphereGeometry(3.6, 32, 24);
const geo3 = new THREE.SphereGeometry(1, 32, 24);
const mat = new THREE.MeshStandardMaterial({
    color: 0x7c7878,
    metalness: 1.0,
    roughness: 0.3,
});
const mat2 = new THREE.MeshStandardMaterial({
    color: 0x7c7878,
    metalness: 1,
    roughness: 0.5,
});
const mat3 = new THREE.MeshStandardMaterial({
    color: 0x2C2A2A,
    metalness: 1,
    roughness: 0.1,
});

for (let i=0; i<COUNT; i++){
    const pos = new THREE.Vector3(
        (Math.random()-0.5)*20,
        (Math.random()-0.5)*20,
        (Math.random()-0.5)*20
    );

    let mesh;

    if ( i === 0 || i === 1 || i === 2 ) {
        // silver big shiny
        mesh = new THREE.Mesh(geo, mat.clone());
    } else if ( i === 3 ) {
        // black big shiny
        mesh = new THREE.Mesh(geo2, mat3.clone());
    } else if ( i === 4 || i === 5 ) {
        // black small shiny
        mesh = new THREE.Mesh(geo, mat3.clone());
    } else {
        // silver small matt
        mesh = new THREE.Mesh(geo3, mat2.clone());
    }

    mesh.position.copy(pos);
    scene.add(mesh);
    spheres.push({
        mesh,
        origin: pos.clone(),
        velocity: new THREE.Vector3()
    });
}

// Mouse
const mouse = new THREE.Vector2(0,0);
window.addEventListener('pointermove', (e)=>{
    mouse.x = (e.clientX / container.clientWidth) * 2 - 1;
    mouse.y = -(e.clientY / container.clientHeight) * 2 + 1;
});

const tmpV = new THREE.Vector3();
function getMouseWorld() {
    tmpV.set(mouse.x, mouse.y, 0.5);
    tmpV.unproject(camera);
    const dir = tmpV.sub(camera.position).normalize();
    const t = -camera.position.z / dir.z;
    return camera.position.clone().add(dir.multiplyScalar(t));
}

let angle = 0;
const radius = 60;
const height = 0;

// Animation
function animate(){
    requestAnimationFrame(animate);

    angle += 0.002;
    camera.position.x = Math.cos(angle) * radius;
    camera.position.z = Math.sin(angle) * radius;
    camera.position.y = height;
    camera.lookAt(0, 0, 0);

    const mouseWorld = getMouseWorld();

    spheres.forEach(s=>{
        const dir = new THREE.Vector3().subVectors(s.mesh.position, mouseWorld);
        const dist = dir.length();
        dir.normalize();

        const forceMag = Math.max(0, 20 - dist) * 0.02;
        const force = dir.multiplyScalar(forceMag);

        s.velocity.add(force);
        s.velocity.multiplyScalar(0.9);

        s.mesh.position.add(s.velocity);

        const back = new THREE.Vector3().subVectors(s.origin, s.mesh.position).multiplyScalar(0.02);
        s.velocity.add(back);
    });

    for (let i = 0; i < spheres.length; i++) {
        for (let j = i+1; j < spheres.length; j++) {
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
}
animate();

// Resize
window.addEventListener('resize', ()=>{
    camera.aspect = container.clientWidth/container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});
`;