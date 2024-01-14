import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class Perlin3D {
    constructor(canvasRef) {
        this.canvasRef = canvasRef.current
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasRef,
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.terrainLines = []
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 1000)
        this.camera.position.set(10, 12.5, 0)

        this.scene.background = new THREE.Color(0xffffff)
        this.scene.add(new THREE.AmbientLight(0xffffff, 10))
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.startAnimation()
    }
    startAnimation() {
        const animate = () => {
            window.requestAnimationFrame(animate);
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
        }
        animate()
    }
    drawMap(mapGrid) {
        this.scene.remove(...this.terrainLines)
        this.terrainLines = []

        for (let i = 0; i < mapGrid.length; i++) {
            const row = mapGrid[i]
            const x = i - mapGrid.length / 2
            const points = []
            for (let j = 0; j < row.length; j++) {
                const cell = row[j]
                const z = j - row.length / 2
                const y = cell.noise*5
                points.push(new THREE.Vector3(x,y,z))
            }
            const material = new THREE.LineBasicMaterial({ color: 0x000000 });
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            this.terrainLines.push(line)
        }
        for (let i = 0; i < mapGrid[0].length; i++) {
            const z = i - mapGrid[0].length / 2
            const points = []
            for (let j = 0; j < mapGrid.length; j++) {
                const cell = mapGrid[j][i]
                const x = j - mapGrid.length / 2
                const y = cell.noise*5
                points.push(new THREE.Vector3(x,y,z))
            }
            const material = new THREE.LineBasicMaterial({ color: 0x000000 });
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            this.terrainLines.push(line)
        }
        this.scene.add(...this.terrainLines)
    }
}