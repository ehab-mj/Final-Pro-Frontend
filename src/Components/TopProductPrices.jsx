import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../api/product-Api';
import '../styles/Components-css/TopProductPrices.css'

export default function TopProductPrices() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const data = await getProducts();
                const sortedProducts = (data.data || [])
                    .sort((a, b) => Number(b.price) - Number(a.price))
                    .slice(0, 8);

                setProducts(sortedProducts);
            } catch (error) {
                console.error('Failed to load top products:', error);
            }
        };

        fetchTopProducts();
    }, []);

    return (
        <section className="top-products">
            <div className="top-products__container">
                <div className="top-products__header">
                    <h2>Top Product Prices</h2>
                    <p>Premium parts with the highest performance value</p>
                </div>

                <div className="top-products__grid">
                    {products.map((product) => (
                        <button
                            key={product._id}
                            type="button"
                            className="top-product-card"
                            onClick={() => navigate(`/products/${product._id}`)}
                        >
                            <img
                                src={
                                    product.imageUrl ||
                                    'https://placehold.co/220x160/1b2029/ff101c?text=PC+Part'
                                }
                                alt={product.name}
                            />

                            <div>
                                <span>{product.category}</span>
                                <strong>${product.price}</strong>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}