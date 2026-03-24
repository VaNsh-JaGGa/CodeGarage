
import {createBrowserRouter , RouterProvider} from "react-router-dom"
import UseParams from "./components/UseParams";
import Dashboard from "./components/Dashboard";
import About from "./components/About"; 
import Home from "./components/Home"
import NavBar from "./components/NavBar";
const router = createBrowserRouter(
  [
    {
      path:"/",
      element:
      <div>
        <NavBar/>
        <Home />
      </div>
    },
    {
      path:"/about",
      element:
      <div>
        <NavBar/>
        <About />
      </div>
    },
    {
      path:"/Dashboard",
      element:
      <div>
        <NavBar/>
        <Dashboard />
      </div>
    },
    {
      path:"/jagga/:id",
      element:
      <div>
        <NavBar/>
        <UseParams />
      </div>
    }
  ]  
);
const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
