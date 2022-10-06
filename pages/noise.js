import React, {useState} from "react";

function Noise() {
    const [currentAlgo, changeAlgo] = useState('Perlin')
    const [currentRepresentation, changeRepresentation] = useState('Terreno')
    const [map2D, changeMap] = useState([])
    const [line1D, changeLine] = useState([])

    function runAlgorithm(){

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
            <div className="noisedrawing"></div>
            <div className="algobuttons">
                <select onChange={e => changeRepresentation(e.target.value)}>
                    <option defaultValue value='Terreno'>Terreno</option>
                    <option value='Mapa topográfico'>Mapa topográfico</option>
                    <option value='Linha 1D'>Linha</option>
                </select>
                <button onClick={runAlgorithm}>Gerar ruído</button>
            </div>
        </div>
    );
}

export default Noise;