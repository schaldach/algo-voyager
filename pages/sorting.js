import React, {useEffect, useState, useRef} from "react";
import Router from 'next/router'

function Sorting() {
    const [currentAlgo, changeAlgo] = useState('Merge Sort')
    const [currentArray, changeArray] = useState([])
    const [animationRunning, startAnimation] = useState(false)
    const stateRef = useRef();
    stateRef.current = currentArray

    useEffect(() => {
        let newArray = []
        for(let x=1; x<=128; x++){
            newArray.push({n:x, color:'blue'})
        }
        newArray = shuffleArray(newArray)
        changeArray(newArray)
    }, [])

    async function runAlgorithm(){
        startAnimation(true)
        switch(currentAlgo){
            case 'Merge Sort':
                mergeSort(currentArray, true)
                break
            case 'Selection Sort':
                selectionSort(currentArray)
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
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        return shuffled
    }

    function isSorted(array){
        if(array.length===1){return true}
        for(let y=0; y<array.length-1; y++){
            if(array[y].n>array[y+1].n){return false}
        }
        return true
    }

    function visualizeArray(indexes, swapmode){
        let newArray = stateRef.current
        newArray = newArray.map(({n}) => ({n:n, color:'blue'}))
        const index0 = newArray.findIndex(c => c.n === indexes[0])
        const index1 = newArray.findIndex(c => c.n === indexes[1])
        newArray[index0].color = 'red'
        newArray[index1].color = 'red'
        if(indexes[1]<indexes[0]){
            if(swapmode){
                newArray[index0].n = indexes[1]
                newArray[index1].n = indexes[0]
                console.log('oi', indexes[0], indexes[1])
            }
            else{
                newArray.splice(index1, 1)
                newArray.splice(index0, 0, {n:indexes[1], color:'red'})
            }
        }
        changeArray(newArray)
    }

    async function selectionSort(array){
        if(array.length<=1){return array}
        let sortedArray = array
        for(let i=0; i<sortedArray.length-1; i++){
            let lowestItem = sortedArray[i+1].n
            let lowestItemPosition = i+1
            for(let y=i+1; y<sortedArray.length; y++){
                if(sortedArray[y].n<lowestItem){
                    lowestItem = sortedArray[y].n
                    lowestItemPosition = y
                }
                await new Promise(r => setTimeout(r, 1))
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

    async function mergeSort(array, rootArray){
        if(array.length<=1){return array}
        let leftSide = array.slice(0, Math.ceil(array.length/2))
        let rightSide = array.slice(Math.ceil(array.length/2), array.length)
        if(!isSorted(leftSide)){leftSide = await mergeSort(leftSide)}
        if(!isSorted(rightSide)){rightSide = await mergeSort(rightSide)}
        let sortedArray = leftSide.concat(rightSide)
        let arrayCounter = 0
        let rightoverflow = false
        let rightcounter = 0
        let leftoverflow = false
        let leftcounter = 0
        while(arrayCounter<sortedArray.length){
            if(!leftoverflow&&!rightoverflow){visualizeArray([leftSide[leftcounter].n, rightSide[rightcounter].n], false)}
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
            </select>
            <div className="algotitle">{currentAlgo}</div>
            <div className="algobars" style={{gridTemplateColumns:returnString()}}>
                {currentArray.map((counter,index) => <div key={index} style={{height:String(counter.n*100/currentArray.length)+'%', backgroundColor:counter.color==='blue'?'var(--color4)':'var(--color6)'}}></div>)}
            </div>
            <div className="algobuttons">
                <button className={animationRunning?'disabledbutton':''} onClick={runAlgorithm}>Ordenar</button>
                <button className={animationRunning?'disabledbutton':''} onClick={() => {if(!animationRunning){changeArray(shuffleArray(currentArray))}}}>Embaralhar</button>
                <button onClick={() => Router.reload()}>Resetar</button>
                <input placeholder="Length" type='number' value={currentArray.length?currentArray.length:''} onChange={e => scaleArray(e.target.value)}></input>
            </div>
        </div>
    );
}

export default Sorting;