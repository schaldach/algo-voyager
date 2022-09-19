import React, {useState} from "react";

function Algo() {
    const [sortedArray, changeArray] = useState([1,2,3,4,5,6,7,8,9,10])

    function returnString(){
        let newString = ''
        for(let i=0; i<sortedArray.length; i++){
            newString+='1fr '
        }
        return newString
    }
    
    return (
        <div className="algorithm">
            <div className="algotitle"></div>
            <div className="algobars" style={{gridTemplateColumns:returnString()}}>
                {sortedArray.map(counter => <div><div style={{height:String(counter*10)+'%'}}/></div>)}
            </div>
        </div>
    );
}

export default Algo;