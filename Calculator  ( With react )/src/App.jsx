import { useState, useRef } from "react"

const App = () => {
    // const [first, setFirstValue] = useState(null);
    // const [cal, calChange] = useState(null)
    // const [operator, setOperator] = useState(null);
    const [result, setResult] = useState(0);   // result display
    const [firstValue, setFirstValue] = useState(null);
    const [cal, calChange] = useState(""); 
    const [operator, setOperator] = useState(null);
    
    let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // let shower = document.querySelector(".shower");

    function AllHandler(op){
         if(cal === ""){
            setFirstValue(0);
        }
        else{
            setFirstValue(cal);
        }
        setOperator(op);
        calChange("");
    }

    function resetLast() {
        calChange("");
    }

    function push(value) {
        calChange((prev) => prev + value);
    }

    function EqualToo() {
        let secondValue = parseInt(cal);
        let firstNum = parseInt(firstValue);
        let res = 0;

        if (operator === "+") res = firstNum + secondValue;
        else if (operator === "-") res = firstNum - secondValue;
        else if (operator === "*") res = firstNum * secondValue;
        else if (operator === "/") res = firstNum / secondValue;
        else if (operator === "%") res = firstNum % secondValue;

        setResult(res);
    }

    function Empty(){
        calChange("");
        setFirstValue(null);
        setOperator(null);
        setResult(0);
    }

    return (<>
        <div className="Container">

            <div className="cal">23
                <button className="add hw aaaa" onClick={()=>AllHandler("+")}>+</button>
                <button className="subtract hw aaaa" onClick={()=>AllHandler("-")}>-</button>
                <button className="multiply hw aaaa" onClick={()=>AllHandler("*")}>*</button>
                <button className="Devide hw aaaa" onClick={()=>AllHandler("/")}>/</button>
                <button className="Remainder hw aaaa" onClick={()=>AllHandler("%")}>%</button>
                <button className="Reset hw aaaa" onClick={()=>resetLast()}>CE</button>
                <button className="Equalto hw aaaa" onClick={()=>EqualToo()}>=</button>
                <button className="hw aaaa" onClick={Empty}>C</button>
            </div>

            <div className="show hw shower">

                {arr.map((item) => (
                    <button key={item} className="hw" onClick={() => push(item)}>{item}</button>
                ))}

            </div>

            <div className="lastst">

                <div className="hh">
                    {firstValue !== null ? `${firstValue} ${operator} ${cal}` : cal}
                </div>

                <div className="hh">
                    {result}
                </div>

            </div>

        </div>
    </>
    )
}

export default App
