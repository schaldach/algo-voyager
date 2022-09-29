import React, {useEffect, useState} from "react";
import Router from 'next/router'

function PathFinding() {
    const [currentAlgo, changeAlgo] = useState('Dijkstra')
    const [mapGrid, changeMap] = useState([])
    const [animationRunning, startAnimation] = useState(false)
    const [error, changeStatus] = useState(false)
    const [targetPosition, changeTarget] = useState({y:3, x:7})
    const [startPosition, changeStart] = useState({y:7, x:21})
    const [currentObject, changeObject] = useState('barrier')
    const [allBarriers, changeBarriers] = useState([{x:14, y:3}, {x:14, y:4}, {x:14, y:5}, {x:14, y:6}, {x:14, y:7}])

    useEffect(() => {
        changeMap(drawMap)
    }, [targetPosition, startPosition, allBarriers])

    function drawMap(){
        startAnimation(false)
        let newMap = []
        for(let i=0; i<10; i++){
            let subMap = []
            for(let y=0; y<30; y++){
                subMap.push({state:'empty', active:false, shortestPath:[]})
            }
            newMap.push(subMap)
        }
        allBarriers.forEach(barrier => {
            newMap[barrier.y][barrier.x].state = 'blocked'
        })
        newMap[targetPosition.y][targetPosition.x] = {state:'empty', active:false, target:true, shortestPath:[]}
        newMap[startPosition.y][startPosition.x] = {state:'filled', active:true, shortestPath:[], start:true}
        return(newMap)
    }

    function runAlgorithm(){
        if(animationRunning){return}
        startAnimation(true)
        switch(currentAlgo){
            case 'Dijkstra':
                dijkstraPath()
                break
            case 'A*':
                aStar()
                break
        }
    }

    async function visualizeMap(newFilled){
        let newMap = [...mapGrid]
        for(let i=0; i<newFilled.length; i++){
            newMap[newFilled[i].y][newFilled[i].x].state = 'filled'
            newMap[newFilled[i].y][newFilled[i].x]['shortestPath'] = newFilled[i]['shortestPath']
        }
        changeMap(newMap)
    }

    function euclideanDistance(x1,y1,x2,y2){
        return(Math.sqrt((x2-x1)**2 + (y2-y1)**2))
    }

    async function aStar(){
        let newMap = [...mapGrid]
        let targetFound = false
        let pathFound = []
        while(!targetFound){
            let currentPath = [...pathFound]
            let newCells = []
            let closestSide = {x:-1}
            newMap.forEach((row,y) => {
                row.forEach((cell,x) => {
                    if(cell.active){
                        let closestSideDistance = Infinity
                        if(x>0&&newMap[y][x-1].state==='empty'){
                            if(newMap[y][x-1].target){targetFound = true}
                            let distance = euclideanDistance(x-1, y, targetPosition.x, targetPosition.y)
                            if(distance<closestSideDistance){
                                closestSideDistance=distance
                                closestSide.x = x-1
                                closestSide.y = y
                            }
                            newMap[y][x-1].state = 'filled'
                            newCells.push({x:x-1, y:y, shortestPath:currentPath})
                        }
                        if(y<9&&newMap[y+1][x].state==='empty'){
                            if(newMap[y+1][x].target){targetFound = true}
                            let distance = euclideanDistance(x, y+1, targetPosition.x, targetPosition.y)
                            if(distance<closestSideDistance){
                                closestSideDistance=distance
                                closestSide.x = x
                                closestSide.y = y+1
                            }
                            newMap[y+1][x].state = 'filled'
                            newCells.push({x:x, y:y+1, shortestPath:currentPath})
                        }
                        if(y>0&&newMap[y-1][x].state==='empty'){
                            if(newMap[y-1][x].target){targetFound = true}
                            let distance = euclideanDistance(x, y-1, targetPosition.x, targetPosition.y)
                            if(distance<closestSideDistance){
                                closestSideDistance=distance
                                closestSide.x = x
                                closestSide.y = y-1
                            }
                            newMap[y-1][x].state = 'filled'
                            newCells.push({x:x, y:y-1, shortestPath:currentPath})
                        }
                        if(x<29&&newMap[y][x+1].state==='empty'){
                            if(newMap[y][x+1].target){targetFound = true}
                            let distance = euclideanDistance(x+1, y, targetPosition.x, targetPosition.y)
                            if(distance<closestSideDistance){
                                closestSideDistance=distance
                                closestSide.x = x+1
                                closestSide.y = y
                            }
                            newMap[y][x+1].state = 'filled'
                            newCells.push({x:x+1, y:y, shortestPath:currentPath})
                        }
                        newMap[y][x].active = false
                        if(closestSide.x<0){targetFound = true; console.log('nao achado')}
                    }
                })
            })
            if(!targetFound){
                pathFound.push(closestSide)
                newMap[closestSide.y][closestSide.x].active = true
            }
            visualizeMap(newCells)
            await new Promise(r => setTimeout(r, 60))
        }
        newMap.forEach((row,y) => {
            row.forEach((cell,x) => {
                newMap[y][x].state = newMap[y][x].state==='blocked'?'blocked':'empty'
            })
        })
        for(let y=0; y<pathFound.length; y++){
            visualizePath(pathFound[y])
            await new Promise(r => setTimeout(r, 20))
        }
        changeMap(newMap)
    }

    async function dijkstraPath(){
        let newMap = [...mapGrid]
        let targetFound = false
        while(!targetFound){
            let newCells = []
            let moved = false
            newMap.forEach((row,y) => {
                row.forEach((cell,x) => {
                    if(cell.active){
                        if(y<9&&newMap[y+1][x].state==='empty'){
                            if(newMap[y+1][x].target){targetFound = true}
                            newMap[y+1][x].state = 'filled'
                            newMap[y+1][x].active = false
                            newMap[y+1][x]['shortestPath'] = newMap[y][x]['shortestPath'].concat([{x:x, y:y}])
                            newCells.push({x:x, y:y+1, shortestPath: newMap[y][x]['shortestPath'].concat([{x:x, y:y}])})
                            moved = true
                        }
                        if(y>0&&newMap[y-1][x].state==='empty'){
                            if(newMap[y-1][x].target){targetFound = true}
                            newMap[y-1][x].state = 'filled'
                            newMap[y-1][x].active = false
                            newMap[y-1][x]['shortestPath'] = newMap[y][x]['shortestPath'].concat([{x:x, y:y}])
                            newCells.push({x:x, y:y-1, shortestPath: newMap[y][x]['shortestPath'].concat([{x:x, y:y}])})
                            moved = true
                        }
                        if(x<29&&newMap[y][x+1].state==='empty'){
                            if(newMap[y][x+1].target){targetFound = true}
                            newMap[y][x+1].state = 'filled'
                            newMap[y][x+1].active = false
                            newMap[y][x+1]['shortestPath'] = newMap[y][x]['shortestPath'].concat([{x:x, y:y}])
                            newCells.push({x:x+1, y:y, shortestPath: newMap[y][x]['shortestPath'].concat([{x:x, y:y}])})
                            moved = true
                        }
                        if(x>0&&newMap[y][x-1].state==='empty'){
                            if(newMap[y][x-1].target){targetFound = true}
                            newMap[y][x-1].state = 'filled'
                            newMap[y][x-1].active = false
                            newMap[y][x-1]['shortestPath'] = newMap[y][x]['shortestPath'].concat([{x:x, y:y}])
                            newCells.push({x:x-1, y:y, shortestPath:newMap[y][x]['shortestPath'].concat([{x:x, y:y}])})
                            moved = true
                        }
                        newMap[y][x].active = false
                    }
                })
            })
            if(!moved){targetFound = true; console.log('nao achado')}
            newCells.forEach(newCell => {
                newMap[newCell.y][newCell.x].active = true
            })
            visualizeMap(newCells)
            await new Promise(r => setTimeout(r, 100))
        }
        newMap.forEach((row,y) => {
            row.forEach((cell,x) => {
                newMap[y][x].state = newMap[y][x].state==='blocked'?'blocked':'empty'
            })
        })
        console.log(targetPosition.x, targetPosition.y, newMap[targetPosition.y][targetPosition.x]['shortestPath'])
        for(let y=0; y<newMap[targetPosition.y][targetPosition.x]['shortestPath'].length; y++){
            visualizePath(newMap[targetPosition.y][targetPosition.x]['shortestPath'][y])
            await new Promise(r => setTimeout(r, 20))
        }
        changeMap(newMap)
    }

    async function visualizePath(pathCell){
        let newMap = [...mapGrid]
        newMap[pathCell.y][pathCell.x].state = 'filled'   
        changeMap(newMap)
    }

    function changeCell(cell){
        startAnimation(false)
        let newMap = [...mapGrid]
        switch(currentObject){
            case 'barrier':
                if(newMap[cell.y][cell.x].target||newMap[cell.y][cell.x].start){return}
                let newBarriers = [...allBarriers]
                const index = newBarriers.findIndex(innerCell => innerCell.x === cell.x && innerCell.y === cell.y)
                console.log(index)
                if(index===-1){newBarriers.push({x:cell.x, y:cell.y})}
                else{newBarriers.splice(index, 1)}
                console.log(newBarriers)
                changeBarriers(newBarriers)
                break
            case 'start':
                if(newMap[cell.y][cell.x].target||newMap[cell.y][cell.x].state==='blocked'){return}
                let newStart = {x:cell.x, y:cell.y}
                newMap[startPosition.y][startPosition.x].start = false
                newMap[cell.y][cell.x].start = true
                changeStart(newStart)
                break
            case 'target':
                if(newMap[cell.y][cell.x].state==='blocked'||newMap[cell.y][cell.x].start){return}
                let newTarget = {x:cell.x, y:cell.y}
                newMap[targetPosition.y][targetPosition.x].target = false
                newMap[cell.y][cell.x].target = true
                changeTarget(newTarget)
                break
        }
    }

    return (
        <div className="sorting">
            <select onChange={e => changeAlgo(e.target.value)}>
                <option defaultValue value='Dijkstra'>Dijkstra</option>
                <option value='A*'>A*</option>
            </select>
            <div className="algotitle">{currentAlgo}</div>
            <div className="algomap">
                {mapGrid.map((row,y) =>
                    <div key={y}>
                    {row.map((cell,x) => 
                        <div onClick={() => changeCell({y:y, x:x})} style={{backgroundColor:cell.target?'red':cell.start?'yellow':cell.state==='blocked'?'black':cell.state==='empty'?'white':`rgb(${Math.abs(Math.sin(cell['shortestPath'].length*Math.PI/20))*240},30,240)`}} key={x}></div>
                    )}
                    </div>
                )}
            </div>
            <div className="algobuttons">
                <button className={animationRunning?'disabledbutton':''} onClick={runAlgorithm}>Navegar</button>
                <button onClick={() => changeMap(drawMap)}>Limpar caminho</button>
                <button onClick={() => Router.reload()}>Resetar mapa</button>
                <select onChange={e => changeObject(e.target.value)}>
                    <option defaultValue value='barrier'>Barreira</option>
                    <option value='start'>Start</option>
                    <option value='target'>Target</option>
                </select>
            </div>
        </div>
    );
}

export default PathFinding;