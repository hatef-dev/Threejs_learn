import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

const gui = new GUI();
const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.querySelector(".webgl");

const textureLoader = new THREE.TextureLoader();
const bakedTexture = textureLoader.load("./textures/simpleShadow.jpg");
// bakedTexture.colorSpace = THREE.SRGBColorSpace;

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const geometry = new THREE.SphereGeometry(1, 16, 16);
const material = new THREE.MeshStandardMaterial();
material.side = THREE.DoubleSide;
const sphere = new THREE.Mesh(geometry, material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
const bakeMaterial = new THREE.MeshBasicMaterial({
  color: "black",
  transparent: true,
  alphaMap: bakedTexture,
  opacity: 0.5,
});
gui.add(bakeMaterial, "opacity").min(0).max(1).step(0.001).name("opacity");

const bakePlane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bakeMaterial);

bakePlane.position.set(0, -1 + 0.01, 0);
bakePlane.rotation.x = -Math.PI / 2;
scene.add(bakePlane);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
sphere.position.set(0, 0, 0);
sphere.castShadow = true;
// plane.receiveShadow = true;
scene.add(sphere);
scene.add(plane);

/*** Lights ***/
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("ambientLightIntensity");
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("directionalLightIntensity");
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const directionalLightHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
scene.add(directionalLightHelper);
// const spotLight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 4, 0.1, 1);
// spotLight.position.set(0, 2, 3);
// gui
//   .add(spotLight, "intensity")
//   .min(0)
//   .max(10)
//   .step(1)
//   .name("spotLightIntensity");
// // spotLight.target.position.x = -2;
// scene.add(spotLight);
// spotLight.castShadow = true;
// spotLight.distance = 10;
// spotLight.angle = Math.PI / 4;

// gui.add(spotLight, "angle").min(0).max(Math.PI / 2).step(0.001).name("spotLightAngle")
// spotLight.penumbra = 10;
// // spotLight.shadow.camera.fov = 10
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;
// spotLight.shadow.camera.near = 1;
// spotLight.shadow.camera.far = 6;
// spotLight.shadow.camera.left = -1;
// spotLight.shadow.camera.right = 1;
// scene.add(spotLight.target);

// const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLightHelper);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  sphere.position.z = Math.sin(elapsedTime) * 4;
  sphere.position.x = Math.cos(elapsedTime) * 4;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3)) * 4;
  bakePlane.position.x = sphere.position.x;
  bakePlane.position.z = sphere.position.z;

  bakeMaterial.opacity = (1 - Math.abs(sphere.position.y)) * 0.5;
  controls.update();
  renderer.render(scene, camera);
}
animate();
