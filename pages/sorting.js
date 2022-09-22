import React, {useEffect, useState, useRef} from "react";

function Sorting() {
    const [currentAlgo, changeAlgo] = useState('mergesort')
    const [sortedArray, changeArray] = useState([])
    const stateRef = useRef();
    stateRef.current = sortedArray

    useEffect(() => {
        let newArray = []
        for(let x=1; x<=1024; x++){
            newArray.push({n:x, color:'blue'})
        }
        newArray = shuffleArray(newArray)
        changeArray(newArray)
    }, [])

    function returnString(){
        let newString = '1fr '
        for(let i=0; i<sortedArray.length-1; i++){
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

    function visualizeArray(indexes){
        let newArray = stateRef.current
        newArray = newArray.map(({n}) => ({n:n, color:'blue'}))
        const index0 = newArray.findIndex(c => c.n === indexes[0])
        const index1 = newArray.findIndex(c => c.n === indexes[1])
        newArray[index0].color = 'red'
        newArray[index1].color = 'red'
        if(indexes[1]<indexes[0]){
            newArray.splice(index1, 1)
            newArray.splice(index0, 0, {n:indexes[1], color:'red'})
        }
        changeArray(newArray)
    }

    function mergeSort(array){
        if(array.length<=1){return array}
        let leftSide = array.slice(0, Math.ceil(array.length/2))
        let rightSide = array.slice(Math.ceil(array.length/2), array.length)
        if(!isSorted(leftSide)){leftSide = mergeSort(leftSide)}
        if(!isSorted(rightSide)){rightSide = mergeSort(rightSide)}
        let newArray = leftSide.concat(rightSide)
        let arrayCounter = 0
        let rightoverflow = false
        let rightcounter = 0
        let leftoverflow = false
        let leftcounter = 0
        while(arrayCounter<newArray.length){
            if(!leftoverflow&&!rightoverflow){visualizeArray([leftSide[leftcounter].n, rightSide[rightcounter].n])}
            if(rightoverflow||!leftoverflow&&leftSide[leftcounter].n<rightSide[rightcounter].n){
                newArray[arrayCounter] = leftSide[leftcounter]
                if(leftcounter===leftSide.length-1){leftoverflow=true}
                else{leftcounter++}
            }
            else{
                newArray[arrayCounter] = rightSide[rightcounter]
                if(rightcounter===rightSide.length-1){rightoverflow=true}
                else{rightcounter++}
            }
            arrayCounter++
        }
        return newArray
    }
    
    return (
        <div className="sorting">
            <div className="algotitle">Merge Sort</div>
            <div className="algobars" style={{gridTemplateColumns:returnString()}}>
                {sortedArray.map((counter,index) => <div key={index} style={{height:String(counter.n*100/sortedArray.length)+'%', backgroundColor:counter.color==='blue'?'var(--color4)':'var(--color6)'}}></div>)}
            </div>
            <div className="algobuttons">
                <button onClick={() => changeArray(mergeSort(sortedArray))}>Ordenar</button>
                <button onClick={() => changeArray(shuffleArray(sortedArray))}>Embaralhar</button>
            </div>
            <input placeholder="Length" type='number' value={sortedArray.length?sortedArray.length:''} onChange={e => scaleArray(e.target.value)}></input>
        </div>
    );
}

export default Sorting;