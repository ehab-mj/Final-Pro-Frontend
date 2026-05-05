import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AppLayout from "../Layout/AppLayout"
import Home from "../Pages/Home"
import Builder from "../Pages/Builder"
import Products from "../Pages/Products"
import Profile from "../Pages/Profile"
import AdminProfile from "../Pages/AdminProfile"
import Cart from "../Pages/Cart"
import Register from "../Pages/Auth-Pages/Register"
import Login from "../Pages/Auth-Pages/Login"
import ProtectedRoute from "../Components/ProtectedRoute"
import OrderSuccess from "../Pages/OrderSuccess"
import AdminOrders from "../Pages/AdminOrders"
import ProductDetails from "../Pages/ProductDetails"

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/builder',
                element: <Builder />,
            },
            {
                path: '/products',
                element: <Products />,
            },
            {
                path: '/products/:id',
                element: <ProductDetails />,
            },
            {
                path: '/profile',
                element:
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
            },
            {
                path: '/admin',
                element:
                    <ProtectedRoute adminOnly={true}>
                        <AdminProfile />
                    </ProtectedRoute>
            },
            {
                path: '/orders',
                element:
                    <ProtectedRoute adminOnly={true}>
                        <AdminOrders />
                    </ProtectedRoute>
            },
            {
                path: '/cart',
                element: <Cart />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/order-success',
                element: <OrderSuccess />,
            },
        ],
    },
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}