import React, {useEffect, useState} from "react";
import perlin from "../components/PerlinNoise";

function Noise() {
    const [currentAlgo, changeAlgo] = useState('Perlin')
    const [currentRepresentation, changeRepresentation] = useState('Estática')
    const [map2D, changeMap] = useState([])
    const [line1D, changeLine] = useState([])

    useEffect(() => {
        let newMap = []
        for(let i=0; i<30; i++){
            let row = []
            for(let y=0; y<90; y++){
                row.push({noise:0})
            }
            newMap.push(row)
        }
        changeMap(newMap)
    }, [])

    function perlinNoise(){
        let newMap = []
        for(let i=0; i<30; i++){
            let row = []
            for(let y=0; y<90; y++){
                row.push({noise:0})
            }
            newMap.push(row)
        }
        newMap.forEach((row,y) => {
            row.forEach((cell,x) => {
                let noiseValue = (perlin.get((x+0.5)/7, (y+0.5)/7)+1)/2
                newMap[y][x].noise = noiseValue
            })
        })
        perlin.seed()
        changeMap(newMap)
    }

    function runAlgorithm(){
        perlinNoise()
    }

    return (
        <div className="sorting">
            <div className="titledisplay">
                <select onChange={e => changeAlgo(e.target.value)}>
                    <option defaultValue value='Perlin'>Perlin</option>
                    <option value='Random'>Random</option>
                </select>
                <div className="algotitle">{currentAlgo}</div>
            </div>
            <div className="perlinmap">
                {map2D.map((row,y) =>
                    <div key={y}>
                    {row.map((cell,x) => 
                        <div key={x}>
                            <div style={{backgroundColor:'black', filter:`invert(${cell.noise})`}} className="inner-circle"/>
                        </div>
                    )}
                    </div>
                )}
            </div>
            <div className="algobuttons">
                <select onChange={e => changeRepresentation(e.target.value)}>
                    <option defaultValue value='Estática'>Estática</option>
                    <option value='Terreno'>Terreno</option>
                    <option value='Mapa topográfico'>Mapa topográfico</option>
                    <option value='Linha 1D'>Linha</option>
                </select>
                <button onClick={runAlgorithm}>Gerar ruído</button>
            </div>
        </div>
    );
}

export default Noise;