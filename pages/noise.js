import React, { useEffect, useState, useRef } from "react";
import perlin from "../components/PerlinNoise";
import PerlinVisualizer from "../components/PerlingVisualizer";

function Noise() {
    const [currentAlgo, changeAlgo] = useState('Perlin')
    // const [currentRepresentation, changeRepresentation] = useState('Linha 1D')
    const [mapGrid, changeMap] = useState([])

    // useEffect(() => {
    //     let newMap = []
    //     for (let i = 0; i < 125; i++) {
    //         let row = []
    //         for (let y = 0; y < 375; y++) {
    //             row.push({ noise: 0 })
    //         }
    //         newMap.push(row)
    //     }
    //     changeMap(newMap)
    // }, [currentRepresentation])

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
                let noiseValue = Math.floor(Math.random() * 5)
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
                let noiseValue = perlin.get((x + 0.5) / 12, (y + 0.5) / 12) * 1.41
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
            <PerlinVisualizer mapGrid={mapGrid}/>
            <div className="algobuttons">
                {
                    // <select onChange={e => changeRepresentation(e.target.value)}>
                    //     <option value='Linha 1D'>Linha</option>
                    //     <option value='Estática'>Estática</option>
                    //     <option value='Mapa topográfico'>Mapa topográfico</option>
                    // </select>
                }
                <button onClick={runAlgorithm}>Gerar ruído</button>
            </div>
        </div>
    );
}

export default Noise;