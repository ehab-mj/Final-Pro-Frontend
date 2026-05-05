import '../styles/Components-css/ProductCard.css';

export default function ProductCard({ product }) {
    return (
        <div className="product-card">
            <div className="product-card__image-wrap">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/300x200?text=PC+Part'}
                    alt={product.name}
                    className="product-card__image"
                />
            </div>

            <div className="product-card__content">
                <p className="product-card__category">{product.category}</p>
                <h3 className="product-card__title">{product.name}</h3>
                <p className="product-card__brand">{product.brand}</p>
                <p className="product-card__description">
                    {product.description || 'No description available'}
                </p>

                <div className="product-card__footer">
                    <span className="product-card__price">${product.price}</span>
                    <span className="product-card__stock">
                        Stock: {product.stockQuantity}
                    </span>
                </div>
            </div>
        </div>
    );
}