import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/Login"
import SignupPage from './components/Signup';

const router = createBrowserRouter(
  [
    {
      path:"/",
      element:
      <div>
        <LoginPage/>
      </div>
    },
    {
      path:"/signup",
      element:
      <div>
        <SignupPage/>
      </div>
    }
  ]
)

const App = () => {
  return (
    <div>
    {/* <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1> */}
      <RouterProvider router={router} />
    </div>
  )
}

export default App
