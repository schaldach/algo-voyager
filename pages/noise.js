import React, {useEffect, useState, useRef} from "react";
import perlin from "../components/PerlinNoise";

function Noise() {
    const [currentAlgo, changeAlgo] = useState('Perlin')
    const [currentRepresentation, changeRepresentation] = useState('Linha 1D')
    const [map2D, changeMap] = useState([])
    const [line1D, changeLine] = useState([])
    const canvasRef = useRef(null)
    const staticColors = ['#000000','#444444','#888888','#bbbbbb','#ffffff']

    useEffect(() => {
        let newMap = []
        for(let i=0; i<75; i++){
            let row = []
            for(let y=0; y<225; y++){
                row.push({noise:0})
            }
            newMap.push(row)
        }
        changeMap(newMap)
    }, [currentRepresentation])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        for(let y=0; y<map2D.length; y++){
            for(let x=0; x<map2D[y].length; x++){
                context.fillStyle = staticColors[map2D[y][x].noise]
                context.fillRect(x*5, y*5, 5, 5)
            }
        }
    }, [map2D])

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.fillStyle = '#000000'
        context.fillRect(0,0,1125,375)
        context.strokeStyle = '#ffffff'
        context.lineWidth = 2
        for(let x=0; x<line1D.length; x++){
            if(x){
                context.lineTo(x*3, line1D[x].height)
                context.stroke()
            }
            context.beginPath()
            context.moveTo(x*3, line1D[x].height)
        }
    }, [line1D])

    function randomNoise(){
        let newMap = []
        for(let i=0; i<75; i++){
            let row = []
            for(let y=0; y<225; y++){
                row.push({noise:0})
            }
            newMap.push(row)
        }
        newMap.forEach((row,y) => {
            row.forEach((cell,x) => {
                let noiseValue = Math.floor(Math.random()*5)
                newMap[y][x].noise = noiseValue
            })
        })
        changeMap(newMap)
    }

    function perlinNoise2D(){
        let newMap = []
        for(let i=0; i<75; i++){
            let row = []
            for(let y=0; y<225; y++){
                row.push({noise:0})
            }
            newMap.push(row)
        }
        newMap.forEach((row,y) => {
            row.forEach((cell,x) => {
                // converter range do perlin noise {-sqrt(2)/2, sqrt(2)/2} para {-1,1}
                let noiseValue = perlin.get((x+0.5)/7, (y+0.5)/7)*1.41
                let actualValue = noiseValue
                if(noiseValue<1){actualValue = 4}
                if(noiseValue<0.6){actualValue = 3}
                if(noiseValue<0.2){actualValue = 2}
                if(noiseValue<-0.2){actualValue = 1}
                if(noiseValue<-0.6){actualValue = 0}
                newMap[y][x].noise = actualValue
            })
        })
        perlin.seed()
        changeMap(newMap)
    }

    function perlinNoise1D(){
        let newLine = []
        for(let i=0; i<375; i++){
            newLine.push({height:0})
        }
        newLine.forEach((vertex, x) => {
            let noiseValue = perlin.get((x+0.5)/15, 0.5/15)*1.41
            let yPosition = (noiseValue+1)*375/2
            newLine[x].height = yPosition
        })
        perlin.seed()
        changeLine(newLine)
    }

    function random1D(){
        let newLine = []
        for(let i=0; i<375; i++){
            newLine.push({height:0})
        }
        newLine.forEach((vertex, x) => {
            let noiseValue = Math.random()
            let yPosition = noiseValue*375
            newLine[x].height = yPosition
        })
        perlin.seed()
        changeLine(newLine)
    }

    function runAlgorithm(){
        if(currentRepresentation==='Linha 1D'){
            switch(currentAlgo){
                case 'Perlin':
                    perlinNoise1D()
                    break
                case 'Random':
                    random1D()
                    break
            }
        }
        else{
            switch(currentAlgo){
                case 'Perlin':
                    perlinNoise2D()
                    break
                case 'Random':
                    randomNoise()
                    break
            }
        }
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
            <canvas width='1125' height='375' className="noisecanvas" ref={canvasRef}></canvas>
            <div className="algobuttons">
                <select onChange={e => changeRepresentation(e.target.value)}>
                    <option value='Linha 1D'>Linha</option>
                    <option value='Estática'>Estática</option>
                    <option value='Terreno'>Terreno</option>
                    <option value='Mapa topográfico'>Mapa topográfico</option>
                </select>
                <button onClick={runAlgorithm}>Gerar ruído</button>
            </div>
        </div>
    );
}

export default Noise;