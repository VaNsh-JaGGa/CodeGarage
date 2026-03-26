import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/protectedRoute";
import AddBlog from "./components/AddBlog"
const router = createBrowserRouter(
  [
    {
      path:"/home",
      element:
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    },
    {
      path:"/",
      element:
      <>
        <Login />
      </>
    },
    {
      path:"/signup",
      element:
      <div>
        <Signup />
      </div>
    },
    {
      path: "/addblog",
      element:
        <ProtectedRoute>
          <AddBlog />
        </ProtectedRoute>
    }
  ]
)

const App = () => {
  return (
    <div>
      <RouterProvider router ={router}/>
    </div>
  )
};

export default App
