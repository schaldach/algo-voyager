import React, {useEffect, useState} from "react";
import perlin from "../components/PerlinNoise";

function Noise() {
    const [currentAlgo, changeAlgo] = useState('Perlin')
    const [currentRepresentation, changeRepresentation] = useState('Estática')
    const [map2D, changeMap] = useState([])

    useEffect(() => {
        let newMap = []
        for(let i=0; i<40; i++){
            let row = []
            for(let y=0; y<120; y++){
                row.push({noise:0})
            }
            newMap.push(row)
        }
        changeMap(newMap)
    }, [])

    function randomNoise(){
        let newMap = []
        for(let i=0; i<40; i++){
            let row = []
            for(let y=0; y<120; y++){
                row.push({noise:0})
            }
            newMap.push(row)
        }
        newMap.forEach((row,y) => {
            row.forEach((cell,x) => {
                let noiseValue = Math.random()
                newMap[y][x].noise = noiseValue
            })
        })
        changeMap(newMap)
    }

    function perlinNoise(){
        let newMap = []
        for(let i=0; i<40; i++){
            let row = []
            for(let y=0; y<120; y++){
                row.push({noise:0})
            }
            newMap.push(row)
        }
        newMap.forEach((row,y) => {
            row.forEach((cell,x) => {
                // converter range do perlin noise {-sqrt(2)/2, sqrt(2)/2} para {-1,1}
                let noiseValue = perlin.get((x+0.5)/7, (y+0.5)/7)*1.41
                let actualValue = noiseValue
                if(noiseValue<1){actualValue = 1}
                if(noiseValue<0.6){actualValue = 0.75}
                if(noiseValue<0.2){actualValue = 0.5}
                if(noiseValue<-0.2){actualValue = 0.25}
                if(noiseValue<-0.6){actualValue = 0}
                newMap[y][x].noise = actualValue
                if(currentRepresentation==='Linha 1D'){
                    noiseValue = (noiseValue+1)/2
                    newMap[y][x].noise = noiseValue
                }
            })
        })
        perlin.seed()
        changeMap(newMap)
    }

    function runAlgorithm(){
        switch(currentAlgo){
            case 'Perlin':
                perlinNoise()
                break
            case 'Random':
                randomNoise()
                break
        }
    }

    function returnString(){
        let className = ''
        for(let i=0; i<120; i++){
            className+= '1fr '
        }
        return className
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
            {currentRepresentation!=='Linha 1D'?
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
            </div>:
            <div className="algobars" style={{gridTemplateColumns:returnString()}}>
                {map2D[0].map(vertex =>
                    <div style={{height:String(vertex.noise*100)+'%', backgroundColor:'black'}}></div>
                )}
            </div>
            }
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