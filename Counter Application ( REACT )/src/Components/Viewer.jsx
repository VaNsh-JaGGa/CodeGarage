import React from 'react'
export let show = 0;
const Viewer = () => {

  function Add() {
    show = show + 1;
    console.log(show);
  }

    function subtract(){
        show = show - 1;
        console.log(show);
    }

  return (
    <>
      <div className="shower">
        {show}
      </div>
      <div className="add">
        <button className='Btn' onClick={Add}>+</button>
      </div>
      <div className='subtract'>
        <button className='Btn' onClick={subtract}>-</button>
    </div>


    </>
  )
}

export default Viewer
