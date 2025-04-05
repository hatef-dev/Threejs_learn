import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const gui = new GUI();
gui.hide();
window.addEventListener("keydown", (e) => {
  if (e.key == "h") {
    gui.show();
  }
});

const scene = new THREE.Scene();

const lightFolder = gui.addFolder("Lights");

const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.5);
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

const moonLight = new THREE.DirectionalLight("#b9d5ff", 1);
moonLight.position.set(1, 1, 1);
lightFolder
  .add(moonLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("moonLightIntensity");
lightFolder.add(moonLight.position, "x").min(-5).max(5).step(0.001).name("moonLightPositionX");
lightFolder.add(moonLight.position, "y").min(-5).max(5).step(0.001).name("moonLightPositionY");
lightFolder.add(moonLight.position, "z").min(-5).max(5).step(0.001).name("moonLightPositionZ");
scene.add(moonLight);

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

const geometry = new THREE.BoxGeometry(2, 1.5, 2);
const material = new THREE.MeshStandardMaterial();
const walls = new THREE.Mesh(geometry, material);
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
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1.5),
  new THREE.MeshStandardMaterial({ color: "brown" })
);
door.position.y = 0.5;
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

function animate() {
  window.requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}
animate();
