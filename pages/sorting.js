import React, {useEffect, useState, useRef} from "react";
import Router from 'next/router'

function Sorting() {
    const [currentAlgo, changeAlgo] = useState('Merge Sort')
    const [currentArray, changeArray] = useState([])
    const [animationRunning, startAnimation] = useState(false)
    const [animationBlock, stopAnimation] = useState(false)
    const stateRef = useRef([]);
    stateRef.current[0] = currentArray
    stateRef.current[1] = animationBlock

    useEffect(() => {
        let newArray = []
        for(let x=1; x<=256; x++){
            newArray.push({n:x, color:'blue'})
        }
        newArray = shuffleArray(newArray)
        changeArray(newArray)
    }, [])

    async function runAlgorithm(){
        if(animationRunning&&animationBlock){return}
        startAnimation(true)
        switch(currentAlgo){
            case 'Merge Sort':
                mergeSort(currentArray, true)
                break
            case 'Selection Sort':
                selectionSort(currentArray)
                break
            case 'Quick Sort':
                quickSort(currentArray, true)
                break
            case 'Bubble Sort':
                bubbleSort(currentArray)
                break
            case 'Insertion Sort':
                insertionSort(currentArray)
                break
        }
    }

    function returnString(){
        let newString = '1fr '
        for(let i=0; i<currentArray.length-1; i++){
            newString+='1fr '
        }
        return newString
    }

    function scaleArray(n){
        let newArray = []
        for(let z=1; z<=n; z++){
            newArray.push({n:z, color:'blue'})
        }
        newArray = shuffleArray(newArray)
        changeArray(newArray)
    }

    function shuffleArray(array){
        let shuffled = array
            .map(value => ({ n:value.n, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ n }) => ({n:n, color:'blue'}))
        return shuffled
    }

    function isSorted(array){
        if(array.length===1){return true}
        for(let y=0; y<array.length-1; y++){
            if(array[y].n>array[y+1].n){return false}
        }
        return true
    }

    function visualizeArray(indexes, swapmode, quickmode, quickright){
        let newArray = stateRef.current[0]
        newArray = newArray.map(({n}) => ({n:n, color:'blue'}))
        const index0 = newArray.findIndex(c => c.n === indexes[0])
        const index1 = newArray.findIndex(c => c.n === indexes[1])
        newArray[index0].color = 'red'
        newArray[index1].color = 'red'
        if(indexes[1]<indexes[0]){
            if(swapmode){
                newArray[index0].n = indexes[1]
                newArray[index1].n = indexes[0]
            }
            else if(quickmode){
                newArray.splice(index0, 1)
                newArray.splice(index1-1+quickright, 0, {n:indexes[0], color:'red'})
            }
            else{
                newArray.splice(index1, 1)
                newArray.splice(index0, 0, {n:indexes[1], color:'red'})
            }
        }
        changeArray(newArray)
    }

    async function insertionSort(array){
        if(array.length<=1){return array}
        let sortedArray = array
        let subArray = []
        for(let i=0; i<sortedArray.length-1; i++){
            if(stateRef.current[1]){return}
            if(sortedArray[i+1].n<sortedArray[i].n){
                visualizeArray([sortedArray[i].n, sortedArray[i+1].n], true)
                await new Promise(r => setTimeout(r, 20))
                let v = sortedArray[i]
                sortedArray[i] = sortedArray[i+1]
                sortedArray[i+1] = v
            }
            subArray.push(sortedArray[i])
            if(!isSorted(subArray)){
                loop:
                for(let y=subArray.length-1; y>0; y--){
                    if(stateRef.current[1]){return}
                    if(sortedArray[y].n<sortedArray[y-1].n){
                        let v = sortedArray[y-1]
                        sortedArray[y-1] = sortedArray[y]
                        sortedArray[y] = v
                        if(y===1){visualizeArray([sortedArray[y].n, sortedArray[y-1].n]);await new Promise(r => setTimeout(r,20))}
                    }
                    else{
                        if(y<subArray.length-1){visualizeArray([sortedArray[y+1].n, sortedArray[y].n])}
                        await new Promise(r => setTimeout(r, 20))
                        break loop
                    }
                }
            }
        }
        subArray.push(sortedArray[sortedArray.length-1])
        startAnimation(false)
        changeArray(sortedArray.map(({n}) => ({n:n, color:'blue'})))
    }

    async function bubbleSort(array){
        if(array.length<=1){return array}
        let sortedArray = array
        let arrayCap = sortedArray.length-1
        while(!isSorted(sortedArray)){
            for(let i=0; i<arrayCap; i++){
                if(stateRef.current[1]){return}
                visualizeArray([sortedArray[i].n, sortedArray[i+1].n])
                if(sortedArray[i+1].n<sortedArray[i].n){
                    visualizeArray([sortedArray[i].n, sortedArray[i+1].n])
                    await new Promise(r => setTimeout(r, 1))
                    let v = sortedArray[i+1].n
                    sortedArray[i+1].n = sortedArray[i].n
                    sortedArray[i].n = v
                }
            }
            arrayCap--
        }
        startAnimation(false)
        changeArray(sortedArray.map(({n}) => ({n:n, color:'blue'})))
    }

    async function selectionSort(array){
        if(array.length<=1){return array}
        let sortedArray = array
        for(let i=0; i<sortedArray.length-1; i++){
            if(stateRef.current[1]){return}
            await new Promise(r => setTimeout(r, 50))
            let lowestItem = sortedArray[i+1].n
            let lowestItemPosition = i+1
            for(let y=i+1; y<sortedArray.length; y++){
                if(stateRef.current[1]){return}
                if(sortedArray[y].n<lowestItem){
                    lowestItem = sortedArray[y].n
                    lowestItemPosition = y
                }
            }
            visualizeArray([sortedArray[i].n, lowestItem], true)
            if(lowestItem<sortedArray[i].n){
                sortedArray[lowestItemPosition].n = sortedArray[i].n
                sortedArray[i].n = lowestItem
            }
        }
        startAnimation(false)
        changeArray(sortedArray.map(({n}) => ({n:n, color:'blue'})))
    }

    async function quickSort(array, rootArray){
        if(array.length<=1){return array}
        let pivot = array[array.length-1]
        let leftSide = []
        let rightSide = []
        for(let i=0; i<array.length-1; i++){
            if(stateRef.current[1]){return}
            if(array[i].n<pivot.n){
                leftSide.push(array[i])
            }
            else{
                rightSide.push(array[i])
            }
            visualizeArray([array[i].n, pivot.n], false, true, rightSide.length)
            await new Promise(r => setTimeout(r, 1))
        }
        if(!isSorted(leftSide)){leftSide = await quickSort(leftSide)}
        if(!isSorted(rightSide)){rightSide = await quickSort(rightSide)}
        if(stateRef.current[1]){return}
        leftSide.push(pivot)
        let sortedArray = leftSide.concat(rightSide)
        if(rootArray){
            startAnimation(false)
            changeArray(sortedArray.map(({n}) => ({n:n, color:'blue'})))
        }
        return sortedArray
    }

    async function mergeSort(array, rootArray){
        if(array.length<=1){return array}
        if(stateRef.current[1]){return}
        let leftSide = array.slice(0, Math.ceil(array.length/2))
        let rightSide = array.slice(Math.ceil(array.length/2), array.length)
        if(!isSorted(leftSide)){leftSide = await mergeSort(leftSide)}
        if(!isSorted(rightSide)){rightSide = await mergeSort(rightSide)}
        if(stateRef.current[1]){return}
        let sortedArray = leftSide.concat(rightSide)
        let arrayCounter = 0
        let rightoverflow = false
        let rightcounter = 0
        let leftoverflow = false
        let leftcounter = 0
        while(arrayCounter<sortedArray.length){
            if(stateRef.current[1]){return}
            if(!leftoverflow&&!rightoverflow){visualizeArray([leftSide[leftcounter].n, rightSide[rightcounter].n])}
            if(rightoverflow||!leftoverflow&&leftSide[leftcounter].n<rightSide[rightcounter].n){
                sortedArray[arrayCounter] = leftSide[leftcounter]
                if(leftcounter===leftSide.length-1){leftoverflow=true}
                else{leftcounter++}
            }
            else{
                sortedArray[arrayCounter] = rightSide[rightcounter]
                if(rightcounter===rightSide.length-1){rightoverflow=true}
                else{rightcounter++}
            }
            await new Promise(r => setTimeout(r, 1))
            arrayCounter++
        }
        if(rootArray){
            startAnimation(false)
            changeArray(sortedArray.map(({n}) => ({n:n, color:'blue'})))
        }
        return sortedArray
    }
    
    return (
        <div className="sorting">
            <select onChange={e => changeAlgo(e.target.value)}>
                <option defaultValue value='Merge Sort'>Merge Sort</option>
                <option value='Selection Sort'>Selection Sort</option>
                <option value='Quick Sort'>Quick Sort</option>
                <option value='Bubble Sort'>Bubble Sort</option>
                <option value='Insertion Sort'>Insertion Sort</option>
            </select>
            <div className="algotitle">{currentAlgo}</div>
            <div className="algobars" style={{gridTemplateColumns:returnString()}}>
                {currentArray.map((counter,index) => <div key={index} style={{height:String(counter.n*100/currentArray.length)+'%', background:counter.color==='blue'?`rgb(${counter.color==='blue'?counter.n*256/currentArray.length:''}, 40, 240)`:'red'}}></div>)}
            </div>
            <div className="algobuttons">
                <button className={animationRunning||animationBlock?'disabledbutton':''} onClick={runAlgorithm}>Ordenar</button>
                <button className={animationRunning||animationBlock?'disabledbutton':''} onClick={() => {if(!animationRunning&&!animationBlock){changeArray(shuffleArray(currentArray))}}}>Embaralhar</button>
                <button onClick={() => {stopAnimation(true); scaleArray(currentArray.length); setTimeout(() => {startAnimation(false);stopAnimation(false)}, 500)}}>Resetar</button>
                <input placeholder="Length" type='number' value={currentArray.length?currentArray.length:''} onChange={e => {if(!animationRunning){scaleArray(e.target.value)}}}></input>
            </div>
        </div>
    );
}

export default Sorting;