import React, { createContext } from 'react'
import { useState } from 'react';
import { useContext } from 'react'
import New from './Components/new';

export let userContext = createContext();

const App = () => {

  const [first, setfirst] = useState("jagga");
  return (

    <userContext.Provider value={first}>
    <div className='h'>
      HELLO
      {first}
      <New/>
    </div>
    </userContext.Provider>
    
  )
}

export default App
