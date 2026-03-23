import { useState } from "react";
import Compo1 from "./Components/compo1";


const App = () => {
  const [first, setfirst] = useState("aaaa");

  // function first(){
  //   console.log("Helloooo jeee");
  // }

  // useEffect(()=>{
  //   console.log("helllloooo jeeeee");
  // });

  return (
    <div className="h">
        HELLO  <br />
        {first}
        <Compo1 hellno = {first} />
    </div>
  )
}

export default App
