import React from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navi = useNavigate();
  function tonavgate(){
    navi('/')
  }
  return (
    <div>
      About Page
      <button onClick={tonavgate}>
        back to Home
      </button>
    </div>
  )
}

export default About
