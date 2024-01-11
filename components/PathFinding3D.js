import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class PathFinding3D {
    constructor(canvasRef) {
        this.canvasRef = canvasRef.current
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvasRef,
            alpha: true,
            antialias: true,
            preserveDrawingBuffer: true,
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        
        this.redArray = []
        this.generateRedArray()

        this.linesMesh = []
        this.barriersMesh = []
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 1000)
        this.camera.position.set(10, 12.5, 0)

        this.targetMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff0000 }))
        this.startMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffff00 }))

        this.scene.add(this.targetMesh, this.startMesh)
        this.scene.background = new THREE.Color(0xffffff)
        this.scene.add(new THREE.AmbientLight(0xffffff, 10))
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.startAnimation()
    }
    getLineMesh(y,x){
        const lineMesh = new THREE.Group()
        lineMesh.position.y = -0.5
        const squareMesh = new THREE.Mesh(new THREE.BoxGeometry(0.975, 0.01, 0.975), new THREE.MeshStandardMaterial({ color: 0xffffff }))
        squareMesh.name = 'rect'
        squareMesh.x = x
        squareMesh.y = y
        lineMesh.add(squareMesh)
        const material = new THREE.LineBasicMaterial({ color: 0x000000 });
        const points = [new THREE.Vector3(0, 0, 0.5), new THREE.Vector3(0, 0, -0.5)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        const line1 = line.clone()
        line1.position.set(0.5, 0, 0)
        const line2 = line.clone()
        line2.position.set(-0.5, 0, 0)
        const line3 = line.clone()
        line3.rotateY(Math.PI / 2)
        line3.position.set(0, 0, 0.5)
        const line4 = line.clone()
        line4.rotateY(Math.PI / 2)
        line4.position.set(0, 0, -0.5)
        lineMesh.add(line1, line2, line3, line4)
        return lineMesh
    }
    getSelectedCell(mouseCoordinates){
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(new THREE.Vector2(mouseCoordinates.x, mouseCoordinates.y), this.camera)
        let intersects = raycaster.intersectObjects(this.linesMesh, true)
        intersects = intersects.filter(col => col.object.name === 'rect')
        if(intersects.length){
            return {x:intersects[0].object.x, y:intersects[0].object.y}
        }
        return null
    }
    startAnimation() {
        const animate = () => {
            window.requestAnimationFrame(animate);
            this.controls.update()
            this.renderer.render(this.scene, this.camera)
            this.barriersMesh.forEach(barrierMesh => {
                if(barrierMesh.wallMesh.position.y>-0.25){
                    barrierMesh.wallMesh.position.y -= 0.25
                }
            })
        }
        animate()
    }
    drawMap(mapGrid) {
        for (let i = 0; i < mapGrid.length; i++) {
            const row = mapGrid[i]
            for (let j = 0; j < row.length; j++) {
                const worldPosition = { x: i - mapGrid.length / 2, z: j - row.length / 2 }
                const line = this.getLineMesh(i, j)
                line.position.set(-worldPosition.x, -0.5, worldPosition.z)
                this.linesMesh.push(line)
            }
        }
        this.scene.add(...this.linesMesh)
    }
    barrierExists(y, x) {
        for (let i = 0; i < this.barriersMesh.length; i++) {
            const barrier = this.barriersMesh[i]
            if (x === barrier.x && y === barrier.y) return true
        }
        return false
    }
    generateRedArray(){
        let currentNumber = 0
        for(let i=0;i<9;i++){
            this.redArray.push(currentNumber)
            currentNumber+=25
        }
        for(let i=0;i<9;i++){
            this.redArray.push(currentNumber)
            currentNumber-=25
        }
    }
    calculateRedComponent(cell) {
        return this.redArray[cell['shortestPath'].length%this.redArray.length];
    }
      
    updateMap(mapGrid) {
        let newBarriers = []
        let allBarriersLength = 0
        for (let i = 0; i < mapGrid.length; i++) {
            const row = mapGrid[i]
            for (let j = 0; j < row.length; j++) {
                const cell = row[j]
                const worldPosition = { x: i - mapGrid.length / 2, z: j - row.length / 2 }
                const lineMesh = this.linesMesh[i*row.length+j].children[0]
                if(cell.state === 'filled' && lineMesh.material.color.getHexString() === 'ffffff'){
                    const color = new THREE.Color(`rgb(${this.calculateRedComponent(cell)},30,240)`)
                    const newMaterial = lineMesh.material.clone()
                    newMaterial.color.set(color)
                    lineMesh.material.copy(newMaterial)
                }
                else if(cell.state === 'empty'){
                    const color = new THREE.Color(0xffffff)
                    const newMaterial = lineMesh.material.clone()
                    newMaterial.color.set(color)
                    lineMesh.material.copy(newMaterial)
                }
                if (cell.target) this.targetMesh.position.set(-worldPosition.x, 0, worldPosition.z)
                if (cell.start) this.startMesh.position.set(-worldPosition.x, 0, worldPosition.z)
                if (cell.state === 'blocked') {
                    allBarriersLength++
                    if (!this.barrierExists(i, j)) {
                        const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), new THREE.MeshStandardMaterial({ color: 0x000000 }))
                        wallMesh.position.set(-worldPosition.x, 1, worldPosition.z)
                        newBarriers.push({ wallMesh, y: i, x: j })
                    }
                }
            }
        }
        if (newBarriers.length) {
            this.barriersMesh.push(...newBarriers)
            for (let i = 0; i < this.barriersMesh.length; i++) {
                this.scene.add(this.barriersMesh[i].wallMesh)
            }
        }
        else if (allBarriersLength !== this.barriersMesh.length) {
            for (let i = 0; i < mapGrid.length; i++) {
                const row = mapGrid[i]
                for (let j = 0; j < row.length; j++) {
                    const cell = row[j]
                    if (cell.state !== 'blocked' && this.barrierExists(i, j)) {
                        const index = this.barriersMesh.findIndex(obj => obj.y === i && obj.x === j)
                        this.scene.remove(this.barriersMesh[index].wallMesh)
                        this.barriersMesh.splice(index, 1)
                    }
                }
            }

        }
    }
}