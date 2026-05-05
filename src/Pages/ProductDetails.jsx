import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, CheckCircle2, XCircle } from 'lucide-react';
import { getProductById } from '../api/product-Api';
import { addToCart } from '../utils/cartStorage';
import '../styles/ProductDetails.css';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(id);
                setProduct(data.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToBuild = () => {
        addToCart(product);
        navigate('/cart');
    };

    if (loading) {
        return <div className="product-details-page">Loading product...</div>;
    }

    if (error || !product) {
        return <div className="product-details-page">{error || 'Product not found'}</div>;
    }

    const inStock = product.stockQuantity > 0;
    const specs = product.specifications || {};

    return (
        <div className="product-details-page">
            <div className="product-details-container">
                <button className="product-back-btn" type="button" onClick={() => navigate(-1)}>
                    <ArrowLeft />
                    Back
                </button>

                <section className="product-details-card">
                    <div className="product-details-image">
                        <img
                            src={
                                product.imageUrl ||
                                'https://placehold.co/900x650/1b2029/ff101c?text=PC+Part'
                            }
                            alt={product.name}
                        />
                    </div>

                    <div className="product-details-info">
                        <span className="product-details-category">{product.category}</span>

                        <h1>{product.name}</h1>

                        <p className="product-details-brand">{product.brand}</p>

                        <p className="product-details-description">
                            {product.description || 'No description available.'}
                        </p>

                        <div className="product-details-price-row">
                            <strong>${product.price}</strong>

                            <span className={inStock ? 'details-stock in' : 'details-stock out'}>
                                {inStock ? <CheckCircle2 /> : <XCircle />}
                                {inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                            </span>
                        </div>

                        <div className="product-details-specs">
                            <h2>Specifications</h2>

                            <div className="specs-grid">
                                {Object.keys(specs).length === 0 && (
                                    <p className="no-specs">No specifications available.</p>
                                )}

                                {Object.entries(specs).map(([key, value]) => (
                                    <div key={key} className="spec-item">
                                        <span>{formatKey(key)}</span>
                                        <strong>{String(value)}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="details-add-btn"
                            type="button"
                            disabled={!inStock}
                            onClick={handleAddToBuild}
                        >
                            <ShoppingCart />
                            {inStock ? 'Add to Build' : 'Out of Stock'}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

function formatKey(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, (str) => str.toUpperCase());
}