import React, { useEffect, useState, useRef } from "react";
import perlin from "../components/PerlinNoise";
import PerlinVisualizer from "../components/PerlingVisualizer";

function Noise() {
    const [currentAlgo, changeAlgo] = useState('Perlin')
    const [mapGrid, changeMap] = useState([])
    const [hasLines, changeLines] = useState(false)
    const [hasTerrain, changeTerrain] = useState(true)

    function randomNoise() {
        let newMap = []
        for (let i = 0; i < 150; i++) {
            let row = []
            for (let y = 0; y < 150; y++) {
                row.push({ noise: 0 })
            }
            newMap.push(row)
        }
        newMap.forEach((row, y) => {
            row.forEach((cell, x) => {
                let noiseValue = (Math.random()*2)-1
                newMap[y][x].noise = noiseValue
            })
        })
        changeMap(newMap)
    }

    function perlinNoise2D() {
        let newMap = []
        for (let i = 0; i < 150; i++) {
            let row = []
            for (let y = 0; y < 150; y++) {
                row.push({ noise: 0 })
            }
            newMap.push(row)
        }
        newMap.forEach((row, y) => {
            row.forEach((cell, x) => {
                // converter range do perlin noise {-sqrt(2)/2, sqrt(2)/2} para {-1,1}
                let noiseValue = perlin.get((x + 0.5) / 10, (y + 0.5) / 10) *1.414
                newMap[y][x].noise = noiseValue
            })
        })
        perlin.seed()
        changeMap(newMap)
    }

    function runAlgorithm() {
        switch (currentAlgo) {
            case 'Perlin':
                perlinNoise2D()
                break
            case 'Random':
                randomNoise()
                break
        }
    }

    return (
        <div className="sorting">
            <div className="titledisplay">
                <select className="algotitle" onChange={e => changeAlgo(e.target.value)}>
                    <option defaultValue value='Perlin'>Perlin</option>
                    <option value='Random'>Random</option>
                </select>
            </div>
            <PerlinVisualizer mapGrid={mapGrid} hasLines={hasLines} hasTerrain={hasTerrain}/>
            <div className="algobuttons">
                <button style={{background: hasLines ? '#0aa1dd':'#d2042d'}} onClick={() => changeLines(!hasLines)}>Lines</button>
                <button style={{background: hasTerrain ? '#0aa1dd':'#d2042d'}} onClick={() => changeTerrain(!hasTerrain)}>Terrain</button>
                <button onClick={runAlgorithm}>Generate noise</button>
            </div>
        </div>
    );
}

export default Noise;