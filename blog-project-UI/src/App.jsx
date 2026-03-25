import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
const router = createBrowserRouter(
  [
    {
      path:"/home",
      element:
      <div>
        <Home />
      </div>
    },
    {
      path:"/",
      element:
      <div>
        <Login />
      </div>
    },
    {
      path:"/signup",
      element:
      <div>
        <Signup />
      </div>
    }
  ]
);

const App = () => {
  return (
    <div>
      <RouterProvider router ={router}/>
      app.jsx
    </div>
  )
}

export default App
