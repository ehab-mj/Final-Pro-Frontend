import { Package, User, Truck, CreditCard } from 'lucide-react';
import '../styles/AdminOrders.css';
import { useState } from 'react';
import { updateOrderStatus } from '../utils/userStorage';

function getAllUserOrders() {
    const allOrders = [];

    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('pc-store-orders-')) {
            const orders = JSON.parse(localStorage.getItem(key)) || [];

            orders.forEach((order) => {
                allOrders.push({
                    ...order,
                    userKey: key.replace('pc-store-orders-', ''),
                });
            });
        }
    });

    return allOrders.sort((a, b) => b.id.localeCompare(a.id));
}

export default function AdminOrders() {
    // const orders = getAllUserOrders();
    const [orders, setOrders] = useState(getAllUserOrders());

    const handleMarkReady = (orderId) => {
        updateOrderStatus(orderId, 'Completed');

        // refresh UI
        setOrders(getAllUserOrders());
    };
    return (
        <div className="admin-orders-page">
            <div className="admin-orders-container">
                <header className="admin-orders-header">
                    <h1>Orders</h1>
                    <p>View customer product orders and custom PC build packages</p>
                </header>

                <section className="admin-orders-card">
                    <div className="admin-orders-card__title">
                        <Package />
                        <h2>Customer Orders</h2>
                    </div>

                    {orders.length === 0 && (
                        <p className="admin-orders-empty">No orders yet.</p>
                    )}

                    <div className="admin-orders-list">
                        {orders.map((order) => (
                            <article key={order.id} className="admin-order-item">
                                <div className="admin-order-item__top">
                                    <div>
                                        <h3>{order.id}</h3>
                                        <p>
                                            <User /> User: {order.userName}
                                        </p>

                                        {order.userEmail && (
                                            <span className="admin-order-email">
                                                {order.userEmail}
                                            </span>
                                        )}
                                    </div>

                                    <div className="admin-order-total">
                                        <strong>${order.total}</strong>

                                        <div className="admin-order-status">
                                            <span
                                                className={
                                                    order.status === 'Completed'
                                                        ? 'order-status order-status--completed'
                                                        : 'order-status order-status--processing'
                                                }
                                            >
                                                {order.status}
                                            </span>

                                            {order.status !== 'Completed' && (
                                                <button
                                                    type="button"
                                                    className="ready-btn"
                                                    onClick={() => handleMarkReady(order.id)}
                                                >
                                                    Ready
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="admin-order-meta">
                                    <span>
                                        <Truck /> {order.deliveryMethod}
                                    </span>

                                    <span>
                                        <CreditCard /> {order.paymentMethod}
                                    </span>

                                    <span>{order.date}</span>
                                </div>

                                <div className="admin-order-products">
                                    {order.items?.map((item) => (
                                        <div key={item._id} className="admin-order-product">
                                            <img
                                                src={
                                                    item.imageUrl ||
                                                    'https://placehold.co/120x90/1b2029/ff101c?text=PC'
                                                }
                                                alt={item.name}
                                            />

                                            <div>
                                                <h4>{item.name}</h4>
                                                <p>
                                                    {item.type === 'build-package'
                                                        ? 'Custom PC Build Package'
                                                        : `${item.category} • ${item.brand}`}
                                                </p>

                                                {item.type === 'build-package' && item.parts && (
                                                    <small>
                                                        {item.parts.map((part) => part.name).join(' • ')}
                                                    </small>
                                                )}
                                            </div>

                                            <strong>${item.price}</strong>
                                        </div>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}