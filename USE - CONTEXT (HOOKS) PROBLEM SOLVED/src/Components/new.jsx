import React from 'react'
import { useContext } from 'react'
import { userContext } from '../App';

const New = () => {
    let user = useContext(userContext);
    console.log(user);
  return (
    <div>
      {user}
    </div>
  )
}

export default New
