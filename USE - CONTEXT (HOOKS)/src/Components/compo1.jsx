import React from 'react'
import Compo2 from "./compo2"

const Compo1 = (props) => {
    console.log(props);
  return (
    <div>
      HELLO
      { props . hellno  }
      <Compo2 name = {props} />
    </div>
  )
}

export default Compo1
