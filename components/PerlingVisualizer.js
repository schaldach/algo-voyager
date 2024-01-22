import { useEffect, useState, useRef } from "react";
import Perlin3D from "./Perlin3D";

function PerlinVisualizer({ mapGrid, hasTerrain, hasLines }) {
    const canvasRef = useRef()
    const [scene, setScene] = useState()

    useEffect(() => {
        let scene3D = new Perlin3D(canvasRef)
        setScene(scene3D)

        return () => {
            scene3D.clearScene()
            scene3D = {}
        };
    }, [])

    useEffect(() => {
        if (mapGrid.length) {
            scene.drawMap(mapGrid, hasTerrain, hasLines)
        }
    }, [mapGrid, hasTerrain, hasLines])

    return (
        <canvas className="screenCanvas" ref={canvasRef}></canvas>
    );
}

export default PerlinVisualizer;