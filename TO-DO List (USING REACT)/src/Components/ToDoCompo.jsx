import logo from "../assets/logo.jpg";
import { useState } from "react";
import { Trash2 } from "lucide-react";

const ToDoCompo = () => {
    const [text, setText] = useState("");
    const [list, makeList] = useState([]);

    function ChangeText(e) {
        setText(e.target.value)
        console.log(e.target.value);
        // setText()
    }

    function addButton() {
        if (text.trim() === "") return;
        makeList([...list, text]);
        setText("");
    }

    function DeleteButton(index){
        console.log("runn");
        const newList = [...list];
        console.log(newList);
        newList.splice(index,1);
        // console.log(list);
        // list.splice(index,1);
        makeList(newList);
        // makeList(list);
        // console.log(list);
    }

    return (
        <div className="Container">

            <div className="titleHeader">
                <img src={logo} alt="" className="logo" />
                <div className="titleLogo"> <b>To-Do List</b></div>
            </div>

            <div className="inputHeader">
                <input type="text" className="input" placeholder="Enter Your Text" value={text} onChange={ChangeText} />
                {/* <div className="ab">{text}</div> */}
                <button className="addButton" onClick={() => { addButton() }}>ADD</button>
            </div>

            <div className="itemHolder">
                {list.map((item, index) => (
                    <div className="Item" key={index}>
                        <div className="twoHolder">
                            <input type="checkbox" className="Check" />
                            <div className="ff">{item}</div>
                        </div>

                        <button className="Btn" onClick={()=>{DeleteButton(index)}}><Trash2/></button>
                    </div>
                ))}
            </div>


        </div>
    )
}

export default ToDoCompo
