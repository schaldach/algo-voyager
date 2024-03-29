import React, { useEffect, useState, useRef } from "react";
import PathFindingVisualizer from "../components/PathFindingVisualizer";

function PathFinding() {
    const [currentAlgo, changeAlgo] = useState('Dijkstra')
    const [mapGrid, changeMap] = useState([])
    const [animationRunning, startAnimation] = useState(false)
    const [blockAlgorithm, setAlgorithm] = useState(false)
    const [error, changeStatus] = useState(2)
    const [targetPosition, changeTarget] = useState({ y: 3, x: 7 })
    const [startPosition, changeStart] = useState({ y: 7, x: 21 })
    const [currentObject, changeObject] = useState('barrier')
    const [allBarriers, changeBarriers] = useState([{ x: 14, y: 3 }, { x: 14, y: 4 }, { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 }])
    const [mouseClicked, holdMouse] = useState(false)
    const [animationBlock, stopAnimation] = useState(false)
    const stateRef = useRef()
    stateRef.current = animationBlock

    useEffect(() => {
        window.addEventListener("mousedown", () => holdMouse(true))
        window.addEventListener("mouseup", () => holdMouse(false))
    }, [])

    useEffect(() => {
        drawMap()
    }, [targetPosition, startPosition, allBarriers])

    function drawMap(reset) {
        if (animationRunning) { return }
        if (!reset) { setAlgorithm(false) }
        changeStatus(2)
        let newMap = []
        for (let i = 0; i < 10; i++) {
            let subMap = []
            for (let y = 0; y < 30; y++) {
                subMap.push({ state: 'empty', active: false, shortestPath: [] })
            }
            newMap.push(subMap)
        }
        allBarriers.forEach(barrier => {
            newMap[barrier.y][barrier.x].state = 'blocked'
        })
        newMap[targetPosition.y][targetPosition.x] = { state: 'empty', active: false, target: true, shortestPath: [] }
        newMap[startPosition.y][startPosition.x] = { state: 'filled', active: true, shortestPath: [], start: true }
        changeMap(newMap)
    }

    function runAlgorithm() {
        if (blockAlgorithm) { return }
        startAnimation(true)
        setAlgorithm(true)
        switch (currentAlgo) {
            case 'Dijkstra':
                dijkstraPath()
                break
            case 'A*':
                aStar()
                break
        }
    }

    async function visualizeMap(newFilled) {
        let newMap = [...mapGrid]
        for (let i = 0; i < newFilled.length; i++) {
            newMap[newFilled[i].y][newFilled[i].x].state = 'filled'
            newMap[newFilled[i].y][newFilled[i].x]['shortestPath'] = newFilled[i]['shortestPath']
        }
        changeMap(newMap)
    }

    function manhattanDistance(x1, y1, x2, y2) {
        return (Math.abs(x2 - x1) + Math.abs(y2 - y1))
    }

    async function aStar() {
        let newMap = [...mapGrid]
        let targetFound = false
        let mapError = false
        let remainingCells = []
        while (!targetFound) {
            let newCells = []
            newMap.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (stateRef.current) { drawMap(true); return }
                    if (cell.active) {
                        if (x > 0 && newMap[y][x - 1].state === 'empty') {
                            if (newMap[y][x - 1].target) { targetFound = true }
                            newMap[y][x - 1].state = 'filled'
                            let distance = manhattanDistance(x - 1, y, targetPosition.x, targetPosition.y) + newMap[y][x]['shortestPath'].length
                            newCells.push({ x: x - 1, y: y, fcost: distance, shortestPath: newMap[y][x]['shortestPath'].concat([{ x: x, y: y }]) })
                            remainingCells.push({ x: x - 1, y: y, fcost: distance })
                        }
                        if (y < 9 && newMap[y + 1][x].state === 'empty') {
                            if (newMap[y + 1][x].target) { targetFound = true }
                            newMap[y + 1][x].state = 'filled'
                            let distance = manhattanDistance(x, y + 1, targetPosition.x, targetPosition.y) + newMap[y][x]['shortestPath'].length
                            newCells.push({ x: x, y: y + 1, fcost: distance, shortestPath: newMap[y][x]['shortestPath'].concat([{ x: x, y: y }]) })
                            remainingCells.push({ x: x, y: y + 1, fcost: distance })
                        }
                        if (y > 0 && newMap[y - 1][x].state === 'empty') {
                            if (newMap[y - 1][x].target) { targetFound = true }
                            newMap[y - 1][x].state = 'filled'
                            let distance = manhattanDistance(x, y - 1, targetPosition.x, targetPosition.y) + newMap[y][x]['shortestPath'].length
                            newCells.push({ x: x, y: y - 1, fcost: distance, shortestPath: newMap[y][x]['shortestPath'].concat([{ x: x, y: y }]) })
                            remainingCells.push({ x: x, y: y - 1, fcost: distance })
                        }
                        if (x < 29 && newMap[y][x + 1].state === 'empty') {
                            if (newMap[y][x + 1].target) { targetFound = true }
                            newMap[y][x + 1].state = 'filled'
                            let distance = manhattanDistance(x + 1, y, targetPosition.x, targetPosition.y) + newMap[y][x]['shortestPath'].length
                            newCells.push({ x: x + 1, y: y, fcost: distance, shortestPath: newMap[y][x]['shortestPath'].concat([{ x: x, y: y }]) })
                            remainingCells.push({ x: x + 1, y: y, fcost: distance })
                        }
                        newMap[y][x].active = false
                    }
                })
            })
            if (stateRef.current) { targetFound = true; return }
            if (!remainingCells.length) { targetFound = true; mapError = true; changeStatus(0) }
            else {
                remainingCells.sort((a, b) => a.fcost - b.fcost)
                console.log(remainingCells)
                let closestSide = remainingCells[0]
                remainingCells.shift()
                newMap[closestSide.y][closestSide.x].active = true
                console.log(closestSide)
                visualizeMap(newCells)
                await new Promise(r => setTimeout(r, 20))
            }
        }
        if (stateRef.current) { startAnimation(false); return }
        newMap.forEach((row, y) => {
            row.forEach((cell, x) => {
                newMap[y][x].state = newMap[y][x].state === 'blocked' ? 'blocked' : 'empty'
            })
        })
        if (!mapError) {
            changeStatus(1)
            for (let y = 0; y < newMap[targetPosition.y][targetPosition.x]['shortestPath'].length; y++) {
                visualizePath(newMap[targetPosition.y][targetPosition.x]['shortestPath'][y])
                await new Promise(r => setTimeout(r, 20))
            }
        }
        changeMap(newMap)
        startAnimation(false)
    }

    async function dijkstraPath() {
        let newMap = [...mapGrid]
        let targetFound = false
        let mapError = false
        while (!targetFound) {
            let newCells = []
            let moved = false
            newMap.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (stateRef.current) { drawMap(true); return }
                    if (cell.active) {
                        if (y < 9 && newMap[y + 1][x].state === 'empty') {
                            if (newMap[y + 1][x].target) { targetFound = true }
                            newMap[y + 1][x].state = 'filled'
                            newMap[y + 1][x].active = false
                            newMap[y + 1][x]['shortestPath'] = newMap[y][x]['shortestPath'].concat([{ x: x, y: y }])
                            newCells.push({ x: x, y: y + 1, shortestPath: newMap[y][x]['shortestPath'].concat([{ x: x, y: y }]) })
                            moved = true
                        }
                        if (y > 0 && newMap[y - 1][x].state === 'empty') {
                            if (newMap[y - 1][x].target) { targetFound = true }
                            newMap[y - 1][x].state = 'filled'
                            newMap[y - 1][x].active = false
                            newMap[y - 1][x]['shortestPath'] = newMap[y][x]['shortestPath'].concat([{ x: x, y: y }])
                            newCells.push({ x: x, y: y - 1, shortestPath: newMap[y][x]['shortestPath'].concat([{ x: x, y: y }]) })
                            moved = true
                        }
                        if (x < 29 && newMap[y][x + 1].state === 'empty') {
                            if (newMap[y][x + 1].target) { targetFound = true }
                            newMap[y][x + 1].state = 'filled'
                            newMap[y][x + 1].active = false
                            newMap[y][x + 1]['shortestPath'] = newMap[y][x]['shortestPath'].concat([{ x: x, y: y }])
                            newCells.push({ x: x + 1, y: y, shortestPath: newMap[y][x]['shortestPath'].concat([{ x: x, y: y }]) })
                            moved = true
                        }
                        if (x > 0 && newMap[y][x - 1].state === 'empty') {
                            if (newMap[y][x - 1].target) { targetFound = true }
                            newMap[y][x - 1].state = 'filled'
                            newMap[y][x - 1].active = false
                            newMap[y][x - 1]['shortestPath'] = newMap[y][x]['shortestPath'].concat([{ x: x, y: y }])
                            newCells.push({ x: x - 1, y: y, shortestPath: newMap[y][x]['shortestPath'].concat([{ x: x, y: y }]) })
                            moved = true
                        }
                        newMap[y][x].active = false
                    }
                })
            })
            if (stateRef.current) { targetFound = true; return }
            if (!moved) { targetFound = true; changeStatus(0); mapError = true }
            newCells.forEach(newCell => {
                newMap[newCell.y][newCell.x].active = true
            })
            visualizeMap(newCells)
            await new Promise(r => setTimeout(r, 120))
        }
        if (stateRef.current) { startAnimation(false); return }
        newMap.forEach((row, y) => {
            row.forEach((cell, x) => {
                newMap[y][x].state = newMap[y][x].state === 'blocked' ? 'blocked' : 'empty'
            })
        })
        if (!mapError) {
            changeStatus(1)
            for (let y = 0; y < newMap[targetPosition.y][targetPosition.x]['shortestPath'].length; y++) {
                visualizePath(newMap[targetPosition.y][targetPosition.x]['shortestPath'][y])
                await new Promise(r => setTimeout(r, 20))
            }
        }
        changeMap(newMap)
        startAnimation(false)
    }

    async function visualizePath(pathCell) {
        let newMap = [...mapGrid]
        newMap[pathCell.y][pathCell.x].state = 'filled'
        changeMap(newMap)
    }

    function changeCell(cell) {
        if (animationRunning) { return }
        let newMap = [...mapGrid]
        switch (currentObject) {
            case 'barrier':
                if (newMap[cell.y][cell.x].target || newMap[cell.y][cell.x].start) { return }
                let newBarriers = [...allBarriers]
                const index = newBarriers.findIndex(innerCell => innerCell.x === cell.x && innerCell.y === cell.y)
                console.log(index)
                if (index === -1) { newBarriers.push({ x: cell.x, y: cell.y }) }
                else { newBarriers.splice(index, 1) }
                console.log(newBarriers)
                changeBarriers(newBarriers)
                break
            case 'start':
                if (newMap[cell.y][cell.x].target || newMap[cell.y][cell.x].state === 'blocked') { return }
                let newStart = { x: cell.x, y: cell.y }
                newMap[startPosition.y][startPosition.x].start = false
                newMap[cell.y][cell.x].start = true
                changeStart(newStart)
                break
            case 'target':
                if (newMap[cell.y][cell.x].state === 'blocked' || newMap[cell.y][cell.x].start) { return }
                let newTarget = { x: cell.x, y: cell.y }
                newMap[targetPosition.y][targetPosition.x].target = false
                newMap[cell.y][cell.x].target = true
                changeTarget(newTarget)
                break
        }
    }

    return (
        <div className="sorting">
            <div className="titledisplay">
                <select className="algotitle" onChange={e => changeAlgo(e.target.value)}>
                    <option value='Dijkstra'>Dijkstra</option>
                    <option value='A*'>A*</option>
                </select>
            </div>
            <PathFindingVisualizer changeCell={changeCell} mapGrid={mapGrid} />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent:'end', gap: '10px', alignItems:'center' }}>
                <div className="algobuttons">
                    <button className={blockAlgorithm || animationBlock ? 'disabledbutton' : ''} onClick={runAlgorithm}>Find optimal path</button>
                    <button className={animationRunning || animationBlock ? 'disabledbutton' : ''} onClick={() => drawMap(false)}>Clear path</button>
                    <button className={!animationRunning || animationBlock ? 'disabledbutton' : ''} onClick={() => { if (animationRunning && !animationBlock) { stopAnimation(true); setTimeout(() => { startAnimation(false); stopAnimation(false) }, 500) } }}>Reset</button>
                    <select onChange={e => changeObject(e.target.value)}>
                        <option defaultValue value='barrier'>Barrier</option>
                        <option value='start'>Start</option>
                        <option value='target'>Target</option>
                    </select>
                    <br />
                </div>
                <div className={error === 0 ? "mapstatus maperror" : 'mapstatus'}>{error === 0 ? "The path wasn't found." : error === 1 ? 'Path found with success.' : ''}</div>
            </div>
        </div>
    );
}

export default PathFinding;