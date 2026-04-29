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
import MyProducts from './components/MyProducts';
import ProductDetails from './components/ProductDetails';

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
      <ProtectedRoute allowedRoles={["buyer"]}>
        <Home/>
      </ProtectedRoute>
    },
    {
      path:"/seller",
      element:
      <ProtectedRoute allowedRoles={["seller"]}>
        <SellerDashboard/>
      </ProtectedRoute>
    },
    {
      path:"/seller/products",
      element:
      <ProtectedRoute allowedRoles={["seller"]}>
        <MyProducts/>
      </ProtectedRoute>
    },
    {
      path:"/products/:id",
      element:
      <ProtectedRoute>
        <ProductDetails/>
      </ProtectedRoute>
    },
    {
      path:"/admin",
      element:
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard/>
      </ProtectedRoute>
    },
    {
      path:"/cart",
      element:
      <ProtectedRoute allowedRoles={["buyer"]}>
        <CartPage/>
      </ProtectedRoute>
    },
    {
      path:"/orders",
      element:
      <ProtectedRoute allowedRoles={["buyer"]}>
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
