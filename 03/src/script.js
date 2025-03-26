import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'
/**
 * Base
 */
// Canvas

const canvas = document.querySelector('canvas.webgl')

const gui = new GUI()
// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */

const rgbeLoader = new RGBELoader()

rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
    scene.environment = environmentMap
})

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/***Geometry */
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const planeGeometry = new THREE.PlaneGeometry(1, 1)
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 60)

const material = new THREE.MeshPhysicalMaterial()
material.roughness = 0.5
material.metalness = 0.5
gui.add(material, 'roughness').min(0).max(1).step(0.001).name('roughness')
gui.add(material, 'metalness').min(0).max(1).step(0.001).name('metalness')
material.side = THREE.DoubleSide
material.thickness = 0.5
material.transmission = 1
// material.thickness = 0.5
// gui.add(material, 'thickness').min(0).max(1).step(0.001).name('thickness')

const sphere = new THREE.Mesh(sphereGeometry, material)
const plane = new THREE.Mesh(planeGeometry, material)
const torus = new THREE.Mesh(torusGeometry, material)

sphere.position.x = -1.5
plane.position.x = 0
torus.position.x = 1.5

scene.add(sphere)
scene.add(plane)
scene.add(torus)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()


    sphere.rotation.y = Math.PI * elapsedTime * 0.25
    plane.rotation.y = Math.PI * elapsedTime * 0.25
    torus.rotation.y = Math.PI * elapsedTime * 0.25    
    sphere.rotation.x = -Math.PI * elapsedTime * 0.25
    plane.rotation.x = -Math.PI * elapsedTime * 0.25
    torus.rotation.x = -Math.PI * elapsedTime * 0.25
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()