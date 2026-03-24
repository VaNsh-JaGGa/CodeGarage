import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
const NavBar = () => {
  return (
    <div>
      <ul>
        <li>
            <NavLink to="/">Home</NavLink>
        </li>
        <li>
            <NavLink to="/About" className={({isActive})=>isActive?"is_active":""}>About</NavLink>
        </li>
        <li> 
            <NavLink to="/Dashboard">Dashboard</NavLink>
        </li>
        {/* <li>
            <li><NavLink to="/jagga/:id">Dashboard</NavLink></li>
        </li> */}
      </ul>
    </div>
  )
}

export default NavBar
