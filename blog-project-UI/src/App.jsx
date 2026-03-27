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
        <ProtectedRoute type="private">
          <Home />
        </ProtectedRoute>
    },
    {
      path:"/",
      element:
        <ProtectedRoute type="auth">
        <Login />
        </ProtectedRoute>
    },
    {
      path:"/signup",
      element:
        <ProtectedRoute type="auth">
        <Signup />
        </ProtectedRoute>
    },
    {
      path: "/addblog",
      element:
        <ProtectedRoute type="private">
          <AddBlog />
        </ProtectedRoute>
    },
    {
      path:"/addblog/:id",
      element:
      <ProtectedRoute type="private">
        <AddBlog/> 
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
