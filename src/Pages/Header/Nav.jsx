import { NavLink, useNavigate } from 'react-router-dom';
import {
    Cpu,
    Home,
    ShoppingBag,
    User,
    ShoppingCart,
    ClipboardList,
} from 'lucide-react';
import '../../styles/Pages-css/Header-css/Nav.css';
import logo from '../../assets/logo.png'

export default function Nav() {
    const navigate = useNavigate();

    const token = localStorage.getItem('pc-store-token');
    const savedUser = localStorage.getItem('pc-store-user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    const isAdmin = user?.role === 'admin';

    const navLinks = [
        { label: 'Home', to: '/', icon: Home },
        { label: 'Products', to: '/products', icon: ShoppingBag },
        { label: 'PC Builder', to: '/builder', icon: Cpu },
        {
            label: 'Profile',
            to: isAdmin ? '/admin' : '/profile',
            icon: User,
            protected: true,
        },
        {
            label: isAdmin ? 'Orders' : 'Cart',
            to: isAdmin ? '/orders' : '/cart',
            icon: isAdmin ? ClipboardList : ShoppingCart,
        },
    ];

    const handleProfileClick = () => {
        if (!token) {
            navigate('/login');
            return;
        }

        navigate(isAdmin ? '/admin' : '/profile');
    };

    const handleCartClick = () => {
        navigate(isAdmin ? '/orders' : '/cart');
    };

    return (
        <>
            <header className="desktop-nav">
                <nav className="desktop-nav__inner">
                    <NavLink to="/" className="desktop-nav__brand">

                        <div className="desktop-nav__brand-text">
                            <img src={logo} alt="logo" />
                        </div>
                    </NavLink>

                    <div className="desktop-nav__links">
                        <NavLink to="/products">Products</NavLink>

                        <NavLink to="/builder">PC Builder</NavLink>

                        <button
                            type="button"
                            className="desktop-nav__icon-btn"
                            onClick={handleProfileClick}
                            aria-label="Profile"
                        >
                            <User />
                        </button>

                        <button
                            type="button"
                            className="desktop-nav__icon-btn"
                            onClick={handleCartClick}
                            aria-label={isAdmin ? 'Orders' : 'Cart'}
                        >
                            {isAdmin ? <ClipboardList /> : <ShoppingCart />}
                        </button>
                    </div>
                </nav>
            </header>

            <nav className="mobile-nav">
                {navLinks.map((item) => {
                    const Icon = item.icon;

                    if (item.label === 'Profile') {
                        return (
                            <button
                                key={item.label}
                                type="button"
                                className="mobile-nav__item mobile-nav__button"
                                onClick={handleProfileClick}
                            >
                                <Icon />
                                <span>{item.label}</span>
                            </button>
                        );
                    }

                    return (
                        <NavLink key={item.to} to={item.to} className="mobile-nav__item">
                            <Icon />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </>
    );
}