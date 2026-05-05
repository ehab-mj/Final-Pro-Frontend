import { Outlet } from 'react-router-dom'
import Header from '../Pages/Header/Header'
import Nav from '../Pages/Header/Nav'
import Footer from '../Components/Footer'

export default function AppLayout() {
    return (
        <>
            <Nav />
            <Outlet />
            <Footer />
        </>
    )
}