export const gallerySnippet = `
let WIDTH = window.innerWidth;
let HEIGHT = window.innerHeight;

const totalNum = 5;
const distance = 100;

let scene, camera, renderer, controls;
let galleryGroup = new THREE.Group();
let pageNum = 0;
let targetNum = 0;
let moveX = 0;

const init = () => {
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000'); 
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
    camera.position.set(0, 0, 35);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    document.body.appendChild(renderer.domElement);

    // 조명
    var light = new THREE.HemisphereLight(0xffffff, 0x080820, 0.8);
    light.position.set(0, 80, 10);
    scene.add(light);

    {
        // 가벽
        const imageMap = new THREE.TextureLoader().load(
            new URL('../assets/wall.jpg', import.meta.url).href
        );

        imageMap.wrapS = THREE.RepeatWrapping;
        imageMap.wrapT = THREE.RepeatWrapping;
        imageMap.repeat.set(10, 4);

        const wallWidth = distance * totalNum + distance;
        const geometry = new THREE.BoxGeometry(wallWidth, 100, 2);
        const material = new THREE.MeshPhongMaterial({
            map: imageMap,
        });
        const wallMesh = new THREE.Mesh(geometry, material);

        wallMesh.position.set(wallWidth / 2 - distance, 0, -1.5);
        wallMesh.receiveShadow = true;
        galleryGroup.add(wallMesh);
        scene.add(galleryGroup);
    }

    for (let i = 0; i < totalNum; i++) {
        addBox(i);
    }
};

// 액자
const addBox = (i) => {
    const imageMap = new THREE.TextureLoader().load(
        new URL('../assets/img[i].png', import.meta.url).href
    );
    const geometry = new THREE.BoxGeometry(30, 30, 1);
    const material = new THREE.MeshPhongMaterial({
        map: imageMap,
    });
    const boxMesh = new THREE.Mesh(geometry, material);
    boxMesh.castShadow = true;
    let x = i * distance;
    let y = -2;
    let z = 0;
    boxMesh.position.set(x, y, z);
    galleryGroup.add(boxMesh);

    // 조명
    const spotLight = new THREE.SpotLight(0xffffff, 1.2);
    spotLight.position.set(x, 40, 30);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.1;
    spotLight.decay = 1;
    spotLight.distance = 80;
    spotLight.target = boxMesh;
    spotLight.castShadow = true;

    galleryGroup.add(spotLight);
};

const animate = () => {
    moveX += (targetNum - moveX) * 0.05;
    galleryGroup.position.x = moveX;

    camera.lookAt(scene.position);
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

const stageResize = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
};

const clickFunc = (event) => {
    if (event.pageX < WIDTH / 2) {
        if (pageNum > 0) {
            pageNum -= 1;
        }
    } else {
        if (pageNum < totalNum - 1) {
            pageNum += 1;
        }
    }
    targetNum = -(pageNum * distance);
};

init();
animate();
window.addEventListener('resize', stageResize);
document.addEventListener('click', clickFunc);
`;