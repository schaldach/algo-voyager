import React, {useState} from "react";

function Sorting() {
    const [currentAlgo, changeAlgo] = useState('binarysort')
    const [sortedArray, changeArray] = useState([1,2,3,4,5,6,7,8,9,10])

    function returnString(){
        let newString = ''
        for(let i=0; i<sortedArray.length; i++){
            newString+='1fr '
        }
        return newString
    }
    
    return (
        <div className="Sortingalgorithm">
            <div className="Sortingtitle"></div>
            <div className="Sortingbars" style={{gridTemplateColumns:returnString()}}>
                {sortedArray.map((counter,index) => <div key={index}><div style={{height:String(counter*100/sortedArray.length)+'%'}}/></div>)}
            </div>
        </div>
    );
}

export default Sorting;