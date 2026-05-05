import { useMemo, useState } from 'react';
import {
    Trash2,
    Truck,
    Store,
    CreditCard,
    Wallet,
    Banknote,
    Lock,
    ChevronRight,
} from 'lucide-react';
import { getCart, removeFromCart, clearCart } from '../utils/cartStorage';
import '../styles/Cart.css';
import { useNavigate } from 'react-router-dom';
import { saveUserOrder } from '../utils/userStorage';

export default function Cart() {
    const [cart, setCart] = useState(getCart());
    const [showCheckout, setShowCheckout] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('pc-store-token');

    const [deliveryMethod, setDeliveryMethod] = useState('delivery');
    const [paymentMethod, setPaymentMethod] = useState('card');

    const subtotal = useMemo(() => {
        return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    }, [cart]);

    const deliveryFee =
        cart.length > 0 && deliveryMethod === 'delivery' ? 49 : 0;

    const total = subtotal + deliveryFee;

    const savedUser = localStorage.getItem('pc-store-user');
    const user = savedUser ? JSON.parse(savedUser) : null;



    const handleRemove = (id) => {
        const updated = removeFromCart(id);
        setCart(updated);
    };

    const handlePlaceOrder = () => {
        const order = {
            id: `ORD-${Date.now().toString().slice(-8)}`,
            date: new Date().toLocaleDateString(),
            items: cart,
            total,
            deliveryMethod,
            paymentMethod,
            status: 'Processing',
            userName: user?.fullName || 'Guest User',
            userEmail: user?.email || '',
        };

        saveUserOrder(order);

        clearCart();
        setCart([]);
        setShowCheckout(false);
        navigate('/order-success');
    };

    return (
        <div className="cart-page">
            <div className="cart-container">
                <header className="cart-header">
                    <h1>{showCheckout ? 'Checkout' : 'Cart'}</h1>
                    <p>{showCheckout ? 'Complete your order' : 'Review your selected PC parts'}</p>
                </header>

                {!showCheckout ? (
                    <div className="cart-layout">
                        <main className="cart-main">
                            <section className="cart-card">
                                <h2>Your Build Cart</h2>

                                {cart.length === 0 && (
                                    <p className="cart-empty">Your cart is empty.</p>
                                )}

                                <div className="cart-list">
                                    {cart.map((item) => (
                                        <article
                                            key={item._id}
                                            className="cart-item"
                                            onClick={() => {
                                                if (!token) {
                                                    navigate('/login');
                                                } else {
                                                    setShowCheckout(true);
                                                }
                                            }}
                                        >
                                            <img
                                                src={
                                                    item.imageUrl ||
                                                    'https://placehold.co/140x100/1b2029/ff101c?text=PC'
                                                }
                                                alt={item.name}
                                            />

                                            <div className="cart-item__info">
                                                <h3>{item.name}</h3>

                                                <p>{item.category} • {item.brand}</p>

                                                {item.type === 'build-package' && item.parts ? (
                                                    <span>
                                                        {item.parts.map((part) => part.name).join(' • ')}
                                                    </span>
                                                ) : (
                                                    <span>Quantity: {item.quantity}</span>
                                                )}
                                            </div>

                                            <div className="cart-item__right">
                                                <strong>${item.price}</strong>

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemove(item._id);
                                                    }}
                                                >
                                                    <Trash2 />
                                                </button>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </main>

                        <aside className="cart-summary">
                            <h2>Build Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <strong>${subtotal}</strong>
                            </div>

                            <div className="summary-row">
                                <span>Delivery</span>
                                <strong>${deliveryFee}</strong>
                            </div>

                            <div className="summary-total">
                                <span>Total</span>
                                <strong>${total}</strong>
                            </div>

                            <button
                                type="button"
                                disabled={cart.length === 0}
                                onClick={() => {
                                    if (!token) {
                                        navigate('/login');
                                    } else {
                                        setShowCheckout(true);
                                    }
                                }}
                            >
                                Continue to Checkout
                                <ChevronRight />
                            </button>
                        </aside>
                    </div>
                ) : (
                    <div className="checkout-layout">
                        <main className="checkout-main">
                            <section className="checkout-card">
                                <h2>Delivery Method</h2>

                                <div className="method-grid">
                                    <button
                                        type="button"
                                        className={deliveryMethod === 'delivery' ? 'active' : ''}
                                        onClick={() => setDeliveryMethod('delivery')}
                                    >
                                        <Truck />
                                        <strong>Home Delivery</strong>
                                        <span>Delivered to your doorstep</span>
                                        <b>$49.00</b>
                                        <small>3-5 business days</small>
                                    </button>

                                    <button
                                        type="button"
                                        className={deliveryMethod === 'pickup' ? 'active' : ''}
                                        onClick={() => setDeliveryMethod('pickup')}
                                    >
                                        <Store />
                                        <strong>Store Pickup</strong>
                                        <span>Pick up from our store</span>
                                        <b>FREE</b>
                                        <small>Ready in 2-3 days</small>
                                    </button>
                                </div>
                            </section>

                            <section className="checkout-card">
                                <h2>Contact Information</h2>

                                <div className="checkout-form">
                                    <label>
                                        Email
                                        <input placeholder="your@email.com" />
                                    </label>

                                    <label>
                                        Full Name
                                        <input placeholder="John Doe" />
                                    </label>

                                    {deliveryMethod === 'delivery' && (
                                        <>
                                            <label>
                                                Address
                                                <input placeholder="123 Main St" />
                                            </label>

                                            <div className="form-row">
                                                <label>
                                                    City
                                                    <input placeholder="San Francisco" />
                                                </label>

                                                <label>
                                                    ZIP Code
                                                    <input placeholder="94102" />
                                                </label>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </section>

                            <section className="checkout-card">
                                <h2>Payment Method</h2>

                                <div className="method-grid method-grid--payment">
                                    <button
                                        type="button"
                                        className={paymentMethod === 'card' ? 'active' : ''}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <CreditCard />
                                        <strong>Credit Card</strong>
                                    </button>

                                    <button
                                        type="button"
                                        className={paymentMethod === 'paypal' ? 'active' : ''}
                                        onClick={() => setPaymentMethod('paypal')}
                                    >
                                        <Wallet />
                                        <strong>PayPal</strong>
                                    </button>

                                    <button
                                        type="button"
                                        className={paymentMethod === 'cash' ? 'active' : ''}
                                        onClick={() => setPaymentMethod('cash')}
                                    >
                                        <Banknote />
                                        <strong>
                                            {deliveryMethod === 'delivery'
                                                ? 'Cash on Delivery'
                                                : 'Cash on Pickup'}
                                        </strong>
                                    </button>
                                </div>

                                {paymentMethod === 'card' && (
                                    <div className="checkout-form payment-fields">
                                        <label>
                                            Card Number
                                            <input placeholder="1234 5678 9012 3456" />
                                        </label>

                                        <div className="form-row">
                                            <label>
                                                Expiry Date
                                                <input placeholder="MM/YY" />
                                            </label>

                                            <label>
                                                CVV
                                                <input placeholder="123" />
                                            </label>
                                        </div>
                                    </div>
                                )}

                                <div className="secure-box">
                                    <Lock />
                                    <div>
                                        <strong>Secure Payment</strong>
                                        <p>Your payment information is encrypted and secure</p>
                                    </div>
                                </div>
                            </section>
                        </main>

                        <aside className="checkout-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <strong>${subtotal}</strong>
                            </div>

                            {cart.length > 0 && (
                                <div className="summary-row">
                                    <span>Delivery</span>
                                    <strong>${deliveryFee}</strong>
                                </div>
                            )}

                            <div className="summary-total">
                                <span>Total</span>
                                <strong>${total}</strong>
                            </div>

                            <button type="button" onClick={handlePlaceOrder}>
                                Place Order
                                <ChevronRight />
                            </button>

                            <p>By placing your order, you agree to our terms and conditions</p>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
}