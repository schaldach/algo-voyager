import React, {useEffect, useState} from "react";
import Router from 'next/router'

function PathFinding() {
    const [currentAlgo, changeAlgo] = useState('Dijkstra')
    const [mapGrid, changeMap] = useState([])
    const [animationRunning, startAnimation] = useState(false)
    const [targetPosition, changeTarget] = useState({y:3, x:7})
    const [startPosition, changeStart] = useState({y:7, x:21})
    const [currentObject, changeObject] = useState('barrier')
    const [allBarriers, changeBarriers] = useState([])

    useEffect(() => {
        drawMap()
    }, [targetPosition, startPosition, allBarriers])

    function drawMap(){
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
        changeMap(newMap)
        return(newMap)
    }

    function runAlgorithm(){
        let newMap = [...mapGrid]
        changeMap(newMap)
        dijkstraPath(newMap)
    }

    async function visualizeMap(newFilled){
        let newMap = [...mapGrid]
        newFilled.forEach(cell => {
            newMap[cell.y][cell.x].state = 'filled'
            newMap[cell.y][cell.x]['shortestPath'] = cell['shortestPath']
        })
        changeMap(newMap)
    }

    async function dijkstraPath(map){
        startAnimation(true)
        let newMap = [...map]
        let targetFound = false
        let targetPosition = {}
        while(!targetFound){
            let newCells = []
            newMap.forEach((row,y) => {
                row.forEach((cell,x) => {
                    if(cell.active){
                        if(y<9&&newMap[y+1][x].state==='empty'){
                            if(newMap[y+1][x].target){targetFound = true; targetPosition = {x:x, y:y+1}}
                            newMap[y+1][x].state = 'filled'
                            newMap[y+1][x].active = false
                            newMap[y+1][x]['shortestPath'] = [{x:x, y:y}].concat(newMap[y][x]['shortestPath'])
                            newCells.push({x:x, y:y+1, shortestPath: [{x:x, y:y}].concat(newMap[y][x]['shortestPath'])})
                        }
                        if(y>0&&newMap[y-1][x].state==='empty'){
                            if(newMap[y-1][x].target){targetFound = true; targetPosition = {x:x, y:y-1}}
                            newMap[y-1][x].state = 'filled'
                            newMap[y-1][x].active = false
                            newMap[y-1][x]['shortestPath'] = [{x:x, y:y}].concat(newMap[y][x]['shortestPath'])
                            newCells.push({x:x, y:y-1, shortestPath: [{x:x, y:y}].concat(newMap[y][x]['shortestPath'])})
                        }
                        if(x<29&&newMap[y][x+1].state==='empty'){
                            if(newMap[y][x+1].target){targetFound = true; targetPosition = {x:x+1, y:y}}
                            newMap[y][x+1].state = 'filled'
                            newMap[y][x+1].active = false
                            newMap[y][x+1]['shortestPath'] = [{x:x, y:y}].concat(newMap[y][x]['shortestPath'])
                            newCells.push({x:x+1, y:y, shortestPath: [{x:x, y:y}].concat(newMap[y][x]['shortestPath'])})
                        }
                        if(x>0&&newMap[y][x-1].state==='empty'){
                            if(newMap[y][x-1].target){targetFound = true; targetPosition = {x:x-1, y:y}}
                            newMap[y][x-1].state = 'filled'
                            newMap[y][x-1].active = false
                            newMap[y][x-1]['shortestPath'] = [{x:x, y:y}].concat(newMap[y][x]['shortestPath'])
                            newCells.push({x:x-1, y:y, shortestPath:[{x:x, y:y}].concat(newMap[y][x]['shortestPath'])})
                        }
                        newMap[y][x].active = false
                    }
                })
            })
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
        newMap[targetPosition.y][targetPosition.x]['shortestPath'].forEach(pathCell => {
            newMap[pathCell.y][pathCell.x].state = 'filled'
        })
        startAnimation(false)
        changeMap(newMap)
    }

    function changeCell(cell){
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
                <button className={animationRunning?'disabledbutton':''} onClick={() => {if(!animationRunning){runAlgorithm()}}}>Navegar</button>
                <button onClick={drawMap}>Limpar</button>
                <button onClick={() => Router.reload()}>Resetar</button>
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