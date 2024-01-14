import { useEffect, useState, useRef } from "react";
import Perlin3D from "./Perlin3D";

function PerlinVisualizer({ mapGrid }) {
    const canvasRef = useRef()
    const [scene, setScene] = useState()

    useEffect(() => {
        const scene3D = new Perlin3D(canvasRef)
        setScene(scene3D)
    }, [])

    useEffect(() => {
        if (mapGrid.length) {
            scene.drawMap(mapGrid)
        }
    }, [mapGrid])

    return (
        <canvas className="screenCanvas" ref={canvasRef}></canvas>
    );
}

export default PerlinVisualizer;