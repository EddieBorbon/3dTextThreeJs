import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

/** --- SETUP BASICO --- */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

const sizes = { width: window.innerWidth, height: window.innerHeight }
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(3, 3, 7)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/** --- POSTPROCESSING BLOOM --- */
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(sizes.width, sizes.height),
    1.5, 0.4, 0.85
)
composer.addPass(bloomPass)

/** --- CARGA DE TEXTURAS --- */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('./textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./textures/door/roughness.jpg')
const matcapTexture1 = textureLoader.load('./textures/matcaps/1.png')
const matcapTexture2 = textureLoader.load('./textures/matcaps/2.png')
const matcapTexture3 = textureLoader.load('./textures/matcaps/3.png')
const matcapTexture4 = textureLoader.load('./textures/matcaps/4.png')
const matcapTexture5 = textureLoader.load('./textures/matcaps/5.png')
const matcapTexture6 = textureLoader.load('./textures/matcaps/6.png')
const matcapTexture7 = textureLoader.load('./textures/matcaps/7.png')
const matcapTexture8 = textureLoader.load('./textures/matcaps/8.png')
const gradientTexture = textureLoader.load('./textures/gradients/5.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace
matcapTexture1.colorSpace = THREE.SRGBColorSpace
matcapTexture2.colorSpace = THREE.SRGBColorSpace
matcapTexture3.colorSpace = THREE.SRGBColorSpace
matcapTexture4.colorSpace = THREE.SRGBColorSpace
matcapTexture5.colorSpace = THREE.SRGBColorSpace
matcapTexture6.colorSpace = THREE.SRGBColorSpace
matcapTexture7.colorSpace = THREE.SRGBColorSpace
matcapTexture8.colorSpace = THREE.SRGBColorSpace

/** --- MAPA DE ENTORNO (HDR) --- */
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMap/2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = environmentMap
})

/** --- GEOMETRÍAS Y COLORES --- */
const geometries = [
    new THREE.TorusGeometry(0.4, 0.15, 16, 100),
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.SphereGeometry(0.4, 32, 32),
    new THREE.ConeGeometry(0.4, 0.8, 32),
    new THREE.TetrahedronGeometry(0.45),
    new THREE.OctahedronGeometry(0.45),
    new THREE.DodecahedronGeometry(0.45),
    new THREE.IcosahedronGeometry(0.45)
]

const neonColors = [0x00ffff, 0x0088ff, 0x00aaff, 0x55ffff]

/** --- PARÁMETROS CONTROLABLES --- */
const params = {
    metalness: 1,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    emissiveIntensity: 0.7,
    speedX: 0.4,
    speedY: 0.3,
    speedZ: 0.35,
    rotationSpeed: 0.003,
    scaleBase: 1,
    textMaterialType: 'Material',
    textColor: '#00ffff',
    shapeColor: '#00ffff',
    ambientLightColor: '#222222',
    ambientLightIntensity: 0.6,
}

/** --- INTERFAZ GUI --- */
const gui = new GUI()

/** --- VARIABLES GLOBALES --- */
let shapesMaterials = []
const shapes = []

let textMaterial = null
let textMeshes = []

/** --- FUNCIONES AUXILIARES --- */

function createTextMaterial(type) {
    const color = new THREE.Color(params.textColor)
    switch (type) {
        case 'Material 1':
            return new THREE.MeshMatcapMaterial({ matcap: matcapTexture1 })
        case 'Material 2':
            return new THREE.MeshMatcapMaterial({ matcap: matcapTexture2 })
        case 'Material 3':
            return new THREE.MeshMatcapMaterial({ matcap: matcapTexture3 })
        case 'Material 4':
            return new THREE.MeshMatcapMaterial({ matcap: matcapTexture4 })
        case 'Material 5':
            return new THREE.MeshMatcapMaterial({ matcap: matcapTexture5 })
        case 'Material 6':
            return new THREE.MeshMatcapMaterial({ matcap: matcapTexture6 })
        case 'Material 7':
            return new THREE.MeshMatcapMaterial({ matcap: matcapTexture7 })
        case 'Material 8':
            return new THREE.MeshMatcapMaterial({ matcap: matcapTexture8 })
        default:
            return new THREE.MeshMatcapMaterial({ matcap: matcapTexture3 })
    }
}

function updateMaterials() {
    shapesMaterials.forEach(material => {
        material.metalness = params.metalness
        material.roughness = params.roughness
        material.clearcoat = params.clearcoat
        material.clearcoatRoughness = params.clearcoatRoughness
        material.emissiveIntensity = params.emissiveIntensity
    })

    if (textMaterial && (params.textMaterialType === 'MeshPhysicalMaterial' || params.textMaterialType === 'MeshStandardMaterial')) {
        textMaterial.metalness = params.metalness
        textMaterial.roughness = params.roughness
        textMaterial.clearcoat = params.clearcoat
        textMaterial.clearcoatRoughness = params.clearcoatRoughness
        textMaterial.needsUpdate = true
    }
}

function updateScale() {
    shapes.forEach(shape => {
        const s = shape.userData.originalScale * params.scaleBase
        shape.scale.set(s, s, s)
    })
}

function updateShapeColors() {
    shapesMaterials.forEach(material => {
        if (material.color) {
            material.color.set(params.shapeColor)
            material.emissive.set(params.shapeColor)
        }
    })
}

function updateTextMaterial() {
    const newMaterial = createTextMaterial(params.textMaterialType)
    textMeshes.forEach(mesh => {
        mesh.material.dispose()
        mesh.material = newMaterial
    })
    textMaterial = newMaterial
}

function updateAmbientLight() {
    ambientLight.color.set(params.ambientLightColor)
    ambientLight.intensity = params.ambientLightIntensity
}

/** --- CREACIÓN DE TEXTO Y FIGURAS --- */
const fontLoader = new FontLoader()
fontLoader.load('/fonts/helvetiker_regular.typeface.json', font => {
    const lines = [
        'Eddie Jonathan Garcia Borbon',
        'Digital Artist',
        'STEAM Educator',
        'Music Composer'
    ]

    textMaterial = createTextMaterial(params.textMaterialType)

    lines.forEach((line, i) => {
        const geometry = new TextGeometry(line, {
            font,
            size: 0.5,
            depth: 0.15,
            bevelEnabled: true,
            bevelThickness: 0.06,
            bevelSize: 0.04,
            bevelSegments: 5
        })
        geometry.center()

        const textMesh = new THREE.Mesh(geometry, textMaterial)
        textMesh.position.y = -i * 0.8
        scene.add(textMesh)
        textMeshes.push(textMesh)
    })

    for (let i = 0; i < 120; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)]
        const color = neonColors[Math.floor(Math.random() * neonColors.length)]

        const material = new THREE.MeshPhysicalMaterial({
            color,
            metalness: params.metalness,
            roughness: params.roughness,
            clearcoat: params.clearcoat,
            clearcoatRoughness: params.clearcoatRoughness,
            emissive: new THREE.Color(color),
            emissiveIntensity: params.emissiveIntensity,
            reflectivity: 1,
            transparent: false
        })

        const mesh = new THREE.Mesh(geometry, material)

        mesh.position.set(
            (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 12
        )
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        )
        const scale = 0.15 + Math.random() * 0.8
        mesh.scale.set(scale, scale, scale)
        mesh.userData.originalScale = scale

        shapesMaterials.push(material)
        shapes.push(mesh)
        scene.add(mesh)
    }
})

/** --- CONFIGURACIÓN GUI --- */

const folderMat = gui.addFolder('Material Parameters')
folderMat.add(params, 'metalness', 0, 1, 0.01).onChange(updateMaterials)
folderMat.add(params, 'roughness', 0, 1, 0.01).onChange(updateMaterials)
folderMat.add(params, 'clearcoat', 0, 1, 0.01).onChange(updateMaterials)
folderMat.add(params, 'clearcoatRoughness', 0, 1, 0.01).onChange(updateMaterials)
folderMat.add(params, 'emissiveIntensity', 0, 5, 0.01).onChange(updateMaterials)

const folderMove = gui.addFolder('Animation Speed')
folderMove.add(params, 'speedX', 0, 10, 0.01)
folderMove.add(params, 'speedY', 0, 10, 0.01)
folderMove.add(params, 'speedZ', 0, 10, 0.01)
folderMove.add(params, 'rotationSpeed', 0, 0.05, 0.0001)

gui.add(params, 'scaleBase', 0.1, 3, 0.01).name('Base Scale').onChange(updateScale)

gui.add(params, 'textMaterialType', [
    'Material 1',
    'Material 2',
    'Material 3',
    'Material 4',
    'Material 5',
    'Material 6',
    'Material 7',
    'Material 8',

]).name('Text Material').onChange(updateTextMaterial)

gui.addColor(params, 'textColor').name('Text Color').onChange(() => {
    if (textMaterial && textMaterial.color) {
        textMaterial.color.set(params.textColor)
        textMaterial.needsUpdate = true
    }
})

gui.addColor(params, 'shapeColor').name('Shapes Color').onChange(updateShapeColors)

/** --- EVENTOS VENTANA --- */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    composer.setSize(sizes.width, sizes.height)
})

/** --- ANIMACIÓN --- */
const clock = new THREE.Clock()

function tick() {
    const elapsedTime = clock.getElapsedTime()

    shapes.forEach((shape, i) => {
        shape.position.x += Math.sin(elapsedTime * params.speedX + i) * 0.005
        shape.position.y += Math.cos(elapsedTime * params.speedY + i * 0.7) * 0.005
        shape.position.z += Math.sin(elapsedTime * params.speedZ + i * 0.5) * 0.005

        shape.rotation.x += params.rotationSpeed
        shape.rotation.y += params.rotationSpeed
    })

    controls.update()
    composer.render()
    window.requestAnimationFrame(tick)
}

const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
let selectedObject = null
let plane = new THREE.Plane()
let intersection = new THREE.Vector3()
let offset = new THREE.Vector3()

// Evento para actualizar puntero en NDC (Normalized Device Coordinates)
function onPointerMove(event) {
    pointer.x = (event.clientX / sizes.width) * 2 - 1
    pointer.y = -(event.clientY / sizes.height) * 2 + 1

    if (selectedObject) {
        // Actualizar el rayo con la nueva posición del puntero
        raycaster.setFromCamera(pointer, camera)

        // Intersectar el plano para saber dónde colocar el objeto
        raycaster.ray.intersectPlane(plane, intersection)

        // Mover el objeto con el offset calculado para que no salte al agarrarlo
        selectedObject.position.copy(intersection.sub(offset))
    }
}

function onPointerDown(event) {
    pointer.x = (event.clientX / sizes.width) * 2 - 1
    pointer.y = -(event.clientY / sizes.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)

    // Revisar intersección con objetos "shapes" (puedes incluir textMeshes si quieres)
    const intersects = raycaster.intersectObjects(shapes, false)

    if (intersects.length > 0) {
        selectedObject = intersects[0].object

        // Crear un plano perpendicular a la cámara que pase por el objeto para calcular movimiento en 3D
        plane.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(plane.normal),
            selectedObject.position
        )

        // Calcular offset entre punto de intersección y la posición del objeto para evitar "salto"
        raycaster.ray.intersectPlane(plane, intersection)
        offset.copy(intersection).sub(selectedObject.position)

        // Desactivar controles para que no interfieran mientras mueves el objeto
        controls.enabled = false
    }
}

function onPointerUp() {
    if (selectedObject) {
        selectedObject = null
        controls.enabled = true
    }
}

window.addEventListener('pointermove', onPointerMove)
window.addEventListener('pointerdown', onPointerDown)
window.addEventListener('pointerup', onPointerUp)
tick()
