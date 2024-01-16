import { useEffect, useState, useRef } from "react";
import PathFinding3D from "./PathFinding3D";

function PathFindingVisualizer({ mapGrid, changeCell }) {
    const canvasRef = useRef()
    const [scene, setScene] = useState()
    const [firstDraw, setFirstDraw] = useState(false)

    useEffect(() => {
        let scene3D = new PathFinding3D(canvasRef)
        setScene(scene3D)

        return () => {
            scene3D.clearScene()
            scene3D = {}
        };
    }, [])

    useEffect(() => {
        if (mapGrid.length) {
            if (!firstDraw) {
                scene.drawMap(mapGrid)
            }
            scene.updateMap(mapGrid)
            setFirstDraw(true)
        }
    }, [mapGrid])

    function handleClick(e) {
        let rect = e.target.getBoundingClientRect();
        let ndcX = (e.clientX - rect.left)/(rect.width/2)-1;
        let ndcY = -((e.clientY - rect.top)/(rect.height/2)-1);
        let cell = scene.getSelectedCell({x:ndcX, y:ndcY})
        if(cell !== null){
            changeCell(cell)
        }
    }

    return (
        <canvas className="screenCanvas" onClick={handleClick} ref={canvasRef}></canvas>
    );
}

export default PathFindingVisualizer;