import React from 'react'
import { useParams } from 'react-router-dom'

const UseParams = () => {
    const {id} = useParams();
  return (
    <div>
      we can pass the key value at last to router path for an component for searching {id}
    </div>
  )
}

export default UseParams
