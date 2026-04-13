import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import RealHome from "./components/RealHome"
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import AddBlog from "./components/AddBlog"
// import BlogDetails from "./components/BlogDetails";
const router = createBrowserRouter(
  [
    {
      path:"/",
      element:
      <ProtectedRoute type="guest">
        <div>
          <Home />
        </div>
      </ProtectedRoute>
    },
    {
      path: "/realhome",
      element:
        <ProtectedRoute type="private">
          <RealHome/>
        </ProtectedRoute>
    },
    {
      path:"/login",
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
    },
    // {
    //   path: "/blog/:id",
    //   element:
    //   <ProtectedRoute type="private">
    //     <BlogDetails />
    //   </ProtectedRoute>
    // }
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
