import { useNavigate } from 'react-router-dom';
import '../styles/Components-css/Footer.css';

const categories = [
    'CPU',
    'GPU',
    'Motherboard',
    'RAM',
    'Storage',
    'Case',
    'PSU',
];

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            <div className="footer__container">

                {/* Categories */}
                <div className="footer__section">
                    <h3>Categories</h3>

                    <ul>
                        {categories.map((cat) => (
                            <li key={cat}>
                                <button onClick={() => navigate(`/products?category=${cat}`)}>
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="footer__section">
                    <h3>Contact</h3>

                    <p>Email: buildcore@gmail.com</p>
                    <p>Phone: +972 50 644 0515</p>
                    <p>Location: North, LS</p>
                </div>

                {/* Best Prices */}
                {/* <div className="footer__section">
                    <h3>Top Prices</h3>

                    <ul>
                        <li>$1499 RTX 4080</li>
                        <li>$899 Ryzen 9</li>
                        <li>$499 DDR5 RAM</li>
                        <li>$299 NVMe SSD</li>
                    </ul>
                </div> */}

                {/* Social */}
                <div className="footer__section">
                </div>
            </div>

            <div className="footer__bottom">
                <p>© 2026 BuildCore. All rights reserved.</p>
            </div>
        </footer>
    );
}