import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./components/Login"
import SignupPage from './components/Signup';
import Home from "./components/Home";
import ProtectedRoute from './components/ProtectedRoute';
import SellerDashboard from './components/SellerDashboard';
import AdminDashboard from './components/AdminDashboard';
import CartPage from './components/CartPage';
import OrdersPage from './components/OrdersPage';

const router = createBrowserRouter(
  [
    {
      path:"/",
      element:
      <ProtectedRoute requireAuth={false}>
        <LoginPage/>
      </ProtectedRoute>
    },
    {
      path:"/signup",
      element:
      <ProtectedRoute requireAuth={false}>
        <SignupPage/>
      </ProtectedRoute>
    },
    {
      path:"/home",
      element:
      <ProtectedRoute>
        <Home/>
      </ProtectedRoute>
    },
    {
      path:"/seller",
      element:
      <ProtectedRoute>
        <SellerDashboard/>
      </ProtectedRoute>
    },
    {
      path:"/admin",
      element:
      <ProtectedRoute>
        <AdminDashboard/>
      </ProtectedRoute>
    },
    {
      path:"/cart",
      element:
      <ProtectedRoute>
        <CartPage/>
      </ProtectedRoute>
    },
    {
      path:"/orders",
      element:
      <ProtectedRoute>
        <OrdersPage/>
      </ProtectedRoute>
    }
  ]
)

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
