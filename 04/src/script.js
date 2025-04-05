import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const gui = new GUI({
  closeFolders: true,
});
gui.hide();
window.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    if (gui._hidden) {
      gui.show();
    } else {
      gui.hide();
    }
  }
});

const scene = new THREE.Scene();
scene.background = new THREE.Color("#262738");

const fog = new THREE.Fog(0x262738, 1, 15);
scene.fog = fog;

const lightFolder = gui.addFolder("Lights");

const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
lightFolder
  .add(ambientLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("ambientLightIntensity");
lightFolder
  .add(ambientLight.position, "x")
  .name("ambientLightPositionX")
  .min(-5)
  .max(5)
  .step(0.001);
lightFolder
  .add(ambientLight.position, "y")
  .name("ambientLightPositionY")
  .min(-5)
  .max(5)
  .step(0.001);
lightFolder
  .add(ambientLight.position, "z")
  .name("ambientLightPositionZ")
  .min(-5)
  .max(5)
  .step(0.001);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(1, 1, 1);
lightFolder
  .add(moonLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("moonLightIntensity");
lightFolder
  .add(moonLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("moonLightPositionX");
lightFolder
  .add(moonLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("moonLightPositionY");
lightFolder
  .add(moonLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("moonLightPositionZ");
scene.add(moonLight);

const doorLights = gui.addFolder("Door Lights");
const doorLight = new THREE.PointLight("#ff7d46", 1);
doorLights
  .add(doorLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("doorLightIntensity");
doorLight.position.set(0, 1.35, 1.25);
scene.add(doorLight);

const ghostLights = gui.addFolder("Ghost Lights");

const ghost1Light = new THREE.PointLight("#ff00ff", 2, 3);
ghostLights
  .add(ghost1Light, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("ghost1LightIntensity");
scene.add(ghost1Light);

const ghost2Light = new THREE.PointLight("#00ffff", 2, 3);
ghostLights
  .add(ghost2Light, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("ghost2LightIntensity");
scene.add(ghost2Light);

const ghost3Light = new THREE.PointLight("#ffff00", 2, 3);
ghostLights
  .add(ghost3Light, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("ghost3LightIntensity");
scene.add(ghost3Light);
// texture
const textureLoader = new THREE.TextureLoader();
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const wallColorTexture = textureLoader.load("./textures/bricks/color.jpg");
const wallAoTexture = textureLoader.load(
  "./textures/bricks/ambientOcclusion.jpg"
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

const wallNormalTexture = textureLoader.load("./textures/bricks/normal.jpg");
const wallRoughnessTexture = textureLoader.load(
  "./textures/bricks/roughness.jpg"
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;
const grassColorTexture = textureLoader.load("./textures/grass/color.jpg");
const grassNormalTexture = textureLoader.load("./textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "./textures/grass/roughness.jpg"
);
const grassAoTexture = textureLoader.load(
  "./textures/grass/ambientOcclusion.jpg"
);

grassColorTexture.colorSpace = THREE.SRGBColorSpace;
grassColorTexture.repeat.set(8, 8);
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassColorTexture.wrapT = THREE.RepeatWrapping;

grassNormalTexture.repeat.set(8, 8);
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;

grassRoughnessTexture.repeat.set(8, 8);
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

grassAoTexture.repeat.set(8, 8);
grassAoTexture.wrapS = THREE.RepeatWrapping;
grassAoTexture.wrapT = THREE.RepeatWrapping;

const canvas = document.querySelector(".webgl");
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 7;
camera.position.y = 2;
camera.position.x = 3;

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(2, 1.5, 2),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallAoTexture,
    normalMap: wallNormalTexture,
    roughnessMap: wallRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 0.75;
house.add(walls);

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(1.75, 1, 4),
  new THREE.MeshStandardMaterial({ color: "brown" })
);
roof.position.y = 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAoTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    // displacementBias: -0.03,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    aoMap: doorAmbientOcclusionTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 0.65;
door.position.z = 1 + 0.01;
scene.add(door);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  const angle = Math.PI * 2 * Math.random();
  const radius = 3 + Math.random() * 5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  grave.position.set(x, 0.3, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  scene.add(grave);
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);













window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const clock = new THREE.Clock();
function animate() {
  const elapsedTime = clock.getElapsedTime();
  const ghost1Angle = elapsedTime * 0.5;
  const ghost2Angle = elapsedTime * 0.3;
  const ghost3Angle = elapsedTime * 0.18;

  ghost1Light.position.x = Math.cos(ghost1Angle) * 4;
  ghost1Light.position.z = Math.sin(ghost1Angle) * 4;
  ghost2Light.position.x = Math.cos(ghost2Angle) * 5;
  ghost2Light.position.z = Math.sin(ghost2Angle) * 5;
  ghost3Light.position.x =
    Math.cos(ghost3Angle) * (5 + Math.sin(elapsedTime * 0.32));
  ghost3Light.position.z =
    Math.sin(ghost3Angle) * (5 + Math.sin(elapsedTime * 0.32));

//   ghost1Light.position.y = Math.sin(elapsedTime * 0.5);
  ghost2Light.position.y =
    Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  ghost3Light.position.y =
    Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
animate();
