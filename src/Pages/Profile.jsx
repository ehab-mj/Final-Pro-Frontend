import {
    User,
    Settings,
    Package,
    Heart,
    Cpu,
    Clock,
    ShoppingBag,
    LogOut,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Profile.css';
import { deleteSavedBuild, getSavedBuilds, getUserOrders, getWishlist } from '../utils/userStorage';
import { addBuildPackageToCart, addSavedBuildToCart } from '../utils/cartStorage';
import { useState } from 'react';

export default function Profile() {
    const savedUser = localStorage.getItem('pc-store-user');
    const user = savedUser ? JSON.parse(savedUser) : null;

    const orders = getUserOrders();
    const wishlist = getWishlist();
    const [savedBuilds, setSavedBuilds] = useState(getSavedBuilds());

    const navigate = useNavigate();

    const totalOrders = orders.length;

    const handleLogout = () => {
        localStorage.removeItem('pc-store-token');
        localStorage.removeItem('pc-store-user');

        navigate('/login');
    };

    const handleOrderSavedBuild = (build) => {
        addSavedBuildToCart(build);
        navigate('/cart');
    };


    const handleDeleteSavedBuild = (buildId) => {
        const updatedBuilds = deleteSavedBuild(buildId);
        setSavedBuilds(updatedBuilds);
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <section className="profile-hero">
                    <div className="profile-user">
                        <div className="profile-avatar">
                            <User />
                        </div>

                        <div>
                            <h1>{user?.fullName || 'Guest User'}</h1>

                            <p>{user?.email || 'No email found'}</p>

                            <div className="profile-stats">
                                <div>
                                    <span>Total Orders</span>
                                    <strong className="cyan">{orders.length}</strong>
                                </div>

                                <div>
                                    <span>Saved Builds</span>
                                    <strong className="cyan">{savedBuilds.length}</strong>
                                </div>

                                <div>
                                    <span>Wishlist Items</span>
                                    <strong>{wishlist.length}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="settings-btn" type="button"
                        onClick={handleLogout}
                    >
                        <LogOut />
                        Logout
                    </button>
                </section>

                <div className="profile-grid">
                    <main className="profile-main">
                        <section className="profile-card">
                            <div className="profile-card__header">
                                <div>
                                    <Package />
                                    <h2>Order History</h2>
                                </div>
                            </div>

                            <div className="orders-list">
                                {orders.length === 0 && (
                                    <p className="profile-empty">No orders yet.</p>
                                )}
                                {orders.map((order) => (
                                    <article key={order.id} className="order-item">
                                        <div>
                                            <h3>{order.id}</h3>

                                            <p>
                                                <Clock /> {order.date} • {order.items.length} items
                                            </p>

                                            <div className="order-products">
                                                {order.items.map((item) => (
                                                    <span key={item._id}>
                                                        {item.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="order-item__right">
                                            <strong>${order.total}</strong>

                                            <span className="status status--progress">
                                                {order.status}
                                            </span>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        <section className="profile-card">
                            <div className="profile-card__header">
                                <div>
                                    <Cpu />
                                    <h2>Saved Builds</h2>
                                </div>

                                <Link to="/builder">Create New Build →</Link>
                            </div>

                            <div className="saved-builds">
                                {savedBuilds.length === 0 && (
                                    <p className="profile-empty">No saved builds yet.</p>
                                )}

                                {savedBuilds.map((build) => (
                                    <article key={build.id} className="saved-build">
                                        <h3>{build.name}</h3>

                                        <p>
                                            {build.parts.map((part) => part.name).join(' • ')}
                                        </p>

                                        <div className="saved-build__footer">
                                            <strong>${build.totalPrice}</strong>

                                            <div>
                                                <button
                                                    type="button"
                                                    className="small-btn small-btn--red"
                                                    onClick={() => handleOrderSavedBuild(build)}
                                                >
                                                    Order
                                                </button>

                                                <button
                                                    type="button"
                                                    className="small-btn"
                                                    onClick={() => handleDeleteSavedBuild(build.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </main>

                    <aside className="profile-side">
                        <section className="profile-card">
                            <div className="profile-card__header">
                                <div>
                                    <Heart />
                                    <h2>Wishlist</h2>
                                </div>
                            </div>

                            <div className="wishlist-list">
                                {wishlist.length === 0 && (
                                    <p className="profile-empty">No wishlist products yet.</p>
                                )}

                                {wishlist.map((item) => (
                                    <article key={item._id} className="wishlist-item">
                                        <div>
                                            <h3>{item.name}</h3>
                                            <strong>${item.price}</strong>
                                        </div>

                                        <span
                                            className={
                                                item.stockQuantity > 0
                                                    ? 'wishlist-stock wishlist-stock--in'
                                                    : 'wishlist-stock wishlist-stock--out'
                                            }
                                        >
                                            {item.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </article>
                                ))}
                            </div>

                            <Link to="/products?category=Wishlist" className="browse-btn">
                                <ShoppingBag />
                                Browse Wishlist
                            </Link>
                        </section>

                        <section className="quick-actions">
                            <h2>Quick Actions</h2>

                            <Link to="/builder" className="quick-actions__primary">
                                Start New Build
                            </Link>

                            <Link to="/products" className="quick-actions__secondary">
                                Browse Parts
                            </Link>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}