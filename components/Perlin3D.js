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
        this.stopAnimation = false

        this.terrainLines = []
        this.terrainMesh = []
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000)
        this.camera.position.set(40, 60, 10)

        this.scene.background = new THREE.Color(0xffffff)
        this.scene.add(new THREE.AmbientLight(0xffffff, 10))
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.startAnimation()
    }
    clearScene() {
        this.terrainLines = []
        this.stopAnimation = true
    }
    startAnimation() {
        const animate = () => {
            if (!this.stopAnimation) {
                window.requestAnimationFrame(animate);
            }
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
        }
        animate()
    }
    drawMap(mapGrid, hasTerrain, hasLines) {
        this.scene.remove(...this.terrainLines, this.terrainMesh)
        this.terrainLines = []
        this.terrainMesh = null
        const mapSize = 150

        if (hasTerrain) {
            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array(mapSize * mapSize * 3);
            const colors = new Float32Array(mapSize * mapSize * 3);
            const indices = [];

            for (let i = 0; i < mapSize; i++) {
                const row = mapGrid[i]
                const x = i - mapSize / 2
                for (let j = 0; j < mapSize; j++) {
                    const cell = row[j]
                    const z = j - mapSize / 2
                    const y = cell.noise * 12
                    const index = (i * mapSize + j) * 3

                    vertices[index] = x;
                    vertices[index + 1] = y;
                    vertices[index + 2] = z;

                    const color = new THREE.Color();
                    color.setRGB(Math.max(cell.noise,0), 1-Math.abs(cell.noise), Math.max(cell.noise*-1,0));
                    colors[index] = color.r;
                    colors[index + 1] = color.g;
                    colors[index + 2] = color.b;

                    if (i < mapSize - 1 && j < mapSize - 1) {
                        indices.push(
                            i * mapSize + j,
                            (i + 1) * mapSize + j,
                            i * mapSize + j + 1
                        );

                        indices.push(
                            i * mapSize + j + 1,
                            (i + 1) * mapSize + j,
                            (i + 1) * mapSize + j + 1
                        );
                    }
                }
            }
            geometry.setIndex(indices);
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide });
            this.terrainMesh = new THREE.Mesh(geometry, material);
            this.scene.add(this.terrainMesh)
        }

        if (hasLines) {
            for (let i = 0; i < mapSize; i++) {
                const points = []
                const row = mapGrid[i]
                const x = i - mapSize / 2
                for (let j = 0; j < mapSize; j++) {
                    const cell = row[j]
                    const z = j - mapSize / 2
                    const y = cell.noise * 12
                    points.push(new THREE.Vector3(x, y, z))
                }
                const material = new THREE.LineBasicMaterial({ color: hasTerrain ? 0xffffff : 0x000000 });
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                this.terrainLines.push(line)
            }
            for (let i = 0; i < mapSize; i++) {
                const z = i - mapSize / 2
                const points = []
                for (let j = 0; j < mapSize; j++) {
                    const cell = mapGrid[j][i]
                    const x = j - mapSize / 2
                    const y = cell.noise * 12
                    points.push(new THREE.Vector3(x, y, z))
                }
                const material = new THREE.LineBasicMaterial({ color: hasTerrain ? 0xffffff : 0x000000 });
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                this.terrainLines.push(line)
            }
            this.scene.add(...this.terrainLines)
        }

    }
}