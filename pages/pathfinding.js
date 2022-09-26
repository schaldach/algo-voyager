import React, {useEffect, useState} from "react";
import Router from 'next/router'

function PathFinding() {
    const [currentAlgo, changeAlgo] = useState('A*')
    const [mapGrid, changeMap] = useState([])
    const [animationRunning, startAnimation] = useState(false)

    useEffect(() => {
        let newMap = []
        for(let i=0; i<10; i++){
            let subMap = []
            for(let y=0; y<30; y++){
                subMap.push('empty')
            }
            newMap.push(subMap)
        }
        newMap[2][5] = 'target'
        newMap[8][1] = 'start'
        changeMap(newMap)
    }, [])

    function runAlgorithm(){}

    return (
        <div className="sorting">
            <select onChange={e => changeAlgo(e.target.value)}>
                <option defaultValue value='A*'>A*</option>
            </select>
            <div className="algotitle">{currentAlgo}</div>
            <div className="algomap">
                {mapGrid.map(row =>
                    <div>
                    {row.map(cell => 
                        <div className={cell}></div>
                    )}
                    </div>
                )}
            </div>
            <div className="algobuttons">
            <button className={animationRunning?'disabledbutton':''} onClick={runAlgorithm}>Navegar</button>
                <button onClick={() => Router.reload()}>Resetar</button>
            </div>
        </div>
    );
}

export default PathFinding;