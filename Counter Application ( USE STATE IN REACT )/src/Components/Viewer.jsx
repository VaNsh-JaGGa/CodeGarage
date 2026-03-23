import React from 'react'
export let show = 0;
import { useState } from 'react';

const Viewer = () => {

  const [first, setfirst] = useState(0);

  function Reset() {
    setfirst(0);
  }

  function Add() {
    setfirst(first + 1);
    console.log(first);
  }

  function subtract() {
    setfirst(first - 1);
    console.log(first);
  }

  return (
    <>
      <div className='lastClass'>
        <div className="shower">
          {first}
        </div>
      </div>
      <div className='Resee'>

        <div className="add">
          <button className='Btn' onClick={Add}>+</button>
        </div>
        <div className='subtract'>
          <button className='Btn' onClick={subtract}>-</button>
        </div>
        <div className="Reset">
          <button className='Btn' onClick={Reset}>Reset</button>
        </div>
      </div>


    </>
  )
}

export default Viewer
