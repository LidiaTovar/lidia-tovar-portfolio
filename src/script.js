import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
// import firefliesVertexShader from './Shaders/fireflies/vertex.glsl'
// import firefliesFragmentShader from './Shaders/fireflies/fragment.glsl'
import { Mesh } from 'three'


/**
 * Spector JS
 */
//const SPECTOR = require('spectorjs')
//const spector = new SPECTOR.Spector()
//spector.displayUI()

/**
 * Base
 */
// // Debug
// const debugObject = {}
// const gui = new dat.GUI({
//     width: 400
// })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Textures
 */
const bakedTexture_hab = textureLoader.load('baked_hab.jpg')
bakedTexture_hab.flipY = false
bakedTexture_hab.encoding = THREE.sRGBEncoding

const bakedTexture_bordes = textureLoader.load('baked_bordes.jpg')
bakedTexture_bordes.flipY = false
bakedTexture_bordes.encoding = THREE.sRGBEncoding

const bakedTexture_props = textureLoader.load('baked_props.jpg')
bakedTexture_props.flipY = false
bakedTexture_props.encoding = THREE.sRGBEncoding
/**
 * Materials
 */
//Baked material
const bakedMaterial_hab = new THREE.MeshBasicMaterial({ map: bakedTexture_hab})
const bakedMaterial_bordes = new THREE.MeshBasicMaterial({ map : bakedTexture_bordes})
const bakedMaterial_props = new THREE.MeshBasicMaterial({ map: bakedTexture_props})

 /**
  * Model
  */
 gltfLoader.load(
    'habitacion_hab.glb',
    (gltf) =>
    {
        const bakedMesh_hab = gltf.scene.children.find(child => child.name === 'Hab')
        bakedMesh_hab.material = bakedMaterial_hab

        scene.add(gltf.scene)
    }
 )

 gltfLoader.load(
    'habitacion_bordes.glb',
    (gltf) =>
    {
        const bakedMesh_bordes = gltf.scene.children.find(child => child.name === 'bordes')
        bakedMesh_bordes.material = bakedMaterial_bordes
                      
        scene.add(gltf.scene)
    }
 )



 gltfLoader.load(
    'habitacion_props.glb',
    (gltf) =>
    {
        gltf.scene.traverseVisible((child) =>
        {
            child.material = bakedMaterial_props
        })
        const poster = gltf.scene.children.find(child => child.name === 'caballero')
        console.log(poster.position)
        scene.add(gltf.scene)
        
    }
 )



/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
let currentIntersect = null

//Create hitboxes
const hitBoxes = new THREE.Group()
const hitBoxMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true})
hitBoxMaterial.transparent = true
hitBoxMaterial.opacity = 0

const artstationHitbox = new THREE.Mesh(
    new THREE.PlaneGeometry(0.35, 0.41),
    hitBoxMaterial
)
artstationHitbox.position.set(-1.27, 1.3, 1.569)
artstationHitbox.rotation.y = 1.75

const gmailHitbox = new THREE.Mesh(
    new THREE.PlaneGeometry(0.48, 0.41),
    hitBoxMaterial
)
gmailHitbox.position.set(-1.4, 1.3, 0.847)
gmailHitbox.rotation.y = 1.75

const linkedinHitbox = new THREE.Mesh(
    new THREE.PlaneGeometry(0.35, 0.20),
    hitBoxMaterial
)
linkedinHitbox.position.set(-1.2, 1.2, 1.91)
linkedinHitbox.rotation.y = 1.75

const bailarinaHitbox = new THREE.Mesh(
    new THREE.PlaneGeometry(1.06, 1.42),
    hitBoxMaterial
)
bailarinaHitbox.position.set(0.91, 1.62, -1.569)
bailarinaHitbox.rotation.z = -0.055

const conceptHitbox = new THREE.Mesh(
    new THREE.PlaneGeometry(1.06, 0.67),
    hitBoxMaterial
)
conceptHitbox.position.set(0.05, 1.01, -1.569)
conceptHitbox.rotation.z = 0.035

const periodicoHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.03, 0.15),
    hitBoxMaterial
)
periodicoHitbox.position.set(1.1, 0.23, -0.116)
periodicoHitbox.rotation.y = 0.348

const dioramaHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.14, 0.14),
    hitBoxMaterial
)
dioramaHitbox.position.set(0.9, 0.3, -0.867)
dioramaHitbox.rotation.y = -0.473

const matteHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.21, 0.28, 0.23),
    hitBoxMaterial
)
matteHitbox.position.set(1.25, 0.23, -0.75)
matteHitbox.rotation.y = -0.395

const caballeroHitbox = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 2.1, 1),
    hitBoxMaterial
)
caballeroHitbox.position.set(-1.97, 1.4, -0.5)
caballeroHitbox.rotation.y = 0

// gui.add(caballeroHitbox.scale, 'x').min(0).max(1).step(0.001).name('x')
// gui.add(caballeroHitbox.scale, 'y').min(0).max(3).step(0.001).name('y')
// gui.add(caballeroHitbox.scale, 'z').min(0).max(1).step(0.001).name('z')
// gui.add(caballeroHitbox.rotation, 'x').min(-3).max(3).step(0.001).name('rotation x')
// gui.add(caballeroHitbox.rotation, 'y').min(-3).max(3).step(0.001).name('rotation y')
// gui.add(caballeroHitbox.rotation, 'z').min(-3).max(3).step(0.001).name('rotation z')



hitBoxes.add(artstationHitbox, gmailHitbox, linkedinHitbox, bailarinaHitbox, conceptHitbox, periodicoHitbox, dioramaHitbox, matteHitbox, caballeroHitbox)
scene.add(hitBoxes)


/**
 * Cursor
 */
 const mouse = new THREE.Vector2()

 window.addEventListener('mousemove', (event) =>
 {
     mouse.x = event.clientX / sizes.width * 2 - 1
     mouse.y = - (event.clientY / sizes.height) * 2 + 1
 })

 window.addEventListener('click', () =>
 {
    if(currentIntersect.object === artstationHitbox)
    {
        window.open('https://www.artstation.com/lidiatovar');  
    }
    else if(currentIntersect.object === gmailHitbox)
    {
        window.open('https://mail.google.com/mail/?view=cm&source=mailto&to=lidiatovarurbano@gmail.com')     

    }
    else if(currentIntersect.object === linkedinHitbox)
    {
        window.open('https://es.linkedin.com/in/lidia-tovar-urbano-0a2103182')     

    }
 })


// //  /**
// //  * Fireflies
// //  */
// // //Geometry
// const firefliesGeometry = new THREE.BufferGeometry()
// const firefliesCount = 30
// const positionArray = new Float32Array(firefliesCount * 3)
// const scaleArray = new Float32Array(firefliesCount)

// for(let i = 0; i < firefliesCount; i++)
// {
//     positionArray[i * 3 + 0] = (Math.random() * 1) * 3
//     positionArray[i * 3 + 1] = Math.random() * 3.5
//     positionArray[i * 3 + 2] = (Math.random() * 1) * 3

//     scaleArray[i] = Math.random()
// }

// firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
// firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

// //Material
// const firefliesMaterial = new THREE.ShaderMaterial({
//     uniforms:
//     {
//         uTime: { value: 0 },
//         uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
//         uSize: { value: 80 }
//     },
//     vertexShader: firefliesVertexShader,
//     fragmentShader: firefliesFragmentShader,
//     transparent: true,
//     blending: THREE.AdditiveBlending,
//     depthWrite:false
// })

// gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(200).step(1).name('firefliesSize')

// //Points
// const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
// scene.add(fireflies)

/**
 * Sizes
 */
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

    //Update fireflies
    //firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 5
camera.position.y = 3
camera.position.z = 5
scene.add(camera)



// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

// debugObject.clearColor = '#666e7f'
// renderer.setClearColor(debugObject.clearColor)
// gui
//     .addColor(debugObject, 'clearColor')
//     .onChange(() =>
//     {
//         renderer.setClearColor(debugObject.clearColor)
//     })
const loader = new THREE.TextureLoader();
scene.background = loader.load('background.jpg');


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update materials
    //firefliesMaterial.uniforms.uTime.value = elapsedTime

    

    //Cast a ray
    raycaster.setFromCamera(mouse, camera)
    const objectsToTest = hitBoxes
    const intersects = raycaster.intersectObject(objectsToTest)
    

     if(intersects.length)
     {
         if(!currentIntersect)
         {
             console.log('mouse enter')
         }

         currentIntersect = intersects[0]
     }
     else
     {
         if(currentIntersect)
         {
             console.log('mouse leave')
         }

         currentIntersect = null
     }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()