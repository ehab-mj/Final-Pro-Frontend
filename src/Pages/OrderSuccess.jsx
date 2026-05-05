import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/OrderSuccess.css';

export default function OrderSuccess() {
    return (
        <div className="order-success-page">
            <div className="order-success-card">
                <CheckCircle2 className="order-success-icon" />

                <h1>Your Order Completed</h1>

                <p>
                    Thank you for your order. We will be in touch soon with updates about
                    your PC build.
                </p>

                <div className="order-success-actions">
                    <Link to="/" className="success-btn success-btn--primary">
                        Back Home
                    </Link>

                    <Link to="/profile" className="success-btn success-btn--secondary">
                        View Profile
                    </Link>
                </div>
            </div>
        </div>
    );
}