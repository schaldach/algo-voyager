import React, {useState} from "react";

function Sorting() {
    const [currentAlgo, changeAlgo] = useState('mergesort')
    const [sortedArray, changeArray] = useState([1,2,3,4,5,6,7,8])

    function returnString(){
        let newString = ''
        for(let i=0; i<sortedArray.length; i++){
            newString+='1fr '
        }
        return newString
    }

    function scaleArray(n){
        let newArray = []
        for(let z=1; z<=n; z++){
            newArray.push(z)
        }
        changeArray(newArray)
    }

    function shuffleArray(){
        let newArray = [...sortedArray]
        let shuffled = newArray
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        changeArray(shuffled)
    }

    function isSorted(array){
        if(array.length===1){return true}
        for(let y=0; y<array.length-1; y++){
            if(array[y]>array[y+1]){return false}
        }
        return true
    }

    function mergeSort(array){
        if(array.length===1){return array}
        let leftSide = array.slice(0, Math.ceil(array.length/2))
        let rightSide = array.slice(Math.ceil(array.length/2), array.length)
        if(!isSorted(leftSide)){leftSide = mergeSort(leftSide)}
        if(!isSorted(rightSide)){rightSide = mergeSort(rightSide)}
        let newArray = []
        let rightoverflow = false
        let rightcounter = 0
        let leftoverflow = false
        let leftcounter = 0
        while(newArray.length<leftSide.length+rightSide.length){
            if(rightoverflow||leftSide[leftcounter]<rightSide[rightcounter]&&!leftoverflow){
                newArray.push(leftSide[leftcounter])
                if(leftcounter<leftSide.length-1){leftcounter++}
                else{leftoverflow=true}
            }
            else{
                newArray.push(rightSide[rightcounter])
                if(rightcounter<rightSide.length-1){rightcounter++}
                else{rightoverflow=true}
            }
        }
        return newArray
    }

    console.log(mergeSort(sortedArray))
    
    return (
        <div className="sorting">
            <div className="algotitle"></div>
            <div className="algobars" style={{gridTemplateColumns:returnString()}}>
                {sortedArray.map((counter,index) => <div key={index} style={{height:String(counter*100/sortedArray.length)+'%'}}></div>)}
            </div>
            <button onClick={() => changeArray(mergeSort(sortedArray))}>Ordenar</button>
            <button onClick={shuffleArray}>Embaralhar</button>
            <input placeholder="numero de elementos" value={sortedArray.length} type='number' onChange={e => scaleArray(e.target.value)}></input>
        </div>
    );
}

export default Sorting;