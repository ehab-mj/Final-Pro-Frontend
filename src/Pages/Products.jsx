import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';

import '../styles/Products.css';
import { getProducts } from '../api/product-Api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addToCart } from '../utils/cartStorage';
import { Heart } from 'lucide-react';
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} from '../utils/userStorage';

const categories = ['ALL', 'Wishlist', 'GPU', 'CPU', 'RAM', 'Storage', 'Case', 'PSU'];

const brands = ['ALL', 'ASUS', 'MSI', 'Intel', 'AMD', 'Corsair', 'Samsung', 'NZXT', 'Seasonic'];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('ALL');
    const [brand, setBrand] = useState('ALL');
    const [maxPrice, setMaxPrice] = useState(2000);
    const [inStockOnly, setInStockOnly] = useState(false);

    const [searchParams] = useSearchParams();

    const [wishlistProducts, setWishlistProducts] = useState(getWishlist());
    const showWishlistOnly = searchParams.get('wishlist') === 'true';
    const visibleProducts = category === 'Wishlist' ? wishlistProducts : products;

    const navigate = useNavigate();


    const filters = useMemo(() => {
        return {
            search,
            category: category === 'Wishlist' ? 'ALL' : category,
            brand,
            minPrice: 0,
            maxPrice,
            inStock: inStockOnly,
        };
    }, [search, category, brand, maxPrice, inStockOnly]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getProducts(filters);
                // const data = await getProducts(category);
                setProducts(data.data || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [filters]);

    const resetFilters = () => {
        setSearch('');
        setCategory('ALL');
        setBrand('ALL');
        setMaxPrice(2000);
        setInStockOnly(false);
    };

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');

        if (categoryFromUrl) {
            setCategory(categoryFromUrl);
        }
    }, [searchParams]);


    const handleAddToBuild = (product) => {
        addToCart(product);
        navigate('/cart');
    };

    useEffect(() => {
        if (showWishlistOnly) {
            setWishlistProducts(getWishlist());
        }
    }, [showWishlistOnly]);


    const isInWishlist = (productId) => {
        return wishlistProducts.some((item) => item._id === productId);
    };

    const handleWishlistClick = (product) => {
        const alreadyInWishlist = wishlistProducts.some(
            (item) => item._id === product._id
        );

        let updatedWishlist;

        if (alreadyInWishlist) {
            updatedWishlist = removeFromWishlist(product._id);
        } else {
            updatedWishlist = addToWishlist(product);
        }

        setWishlistProducts(updatedWishlist);
    };

    return (
        <div className="products-page">
            <div className="products-layout">
                <header className="products-header">
                    <h1>Products</h1>
                    <p>Browse our selection of premium PC components</p>
                </header>

                <div className="products-content">
                    <aside className="products-filter">
                        <div className="products-filter__title">
                            <SlidersHorizontal />
                            <h2>Filters</h2>
                        </div>

                        <div className="filter-group">
                            <label>Search</label>
                            <div className="search-box">
                                <Search />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Category</label>

                            <div className="category-buttons">
                                {categories.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        className={category === item ? 'active' : ''}
                                        onClick={() => setCategory(item)}
                                    >
                                        {item === 'ALL' ? 'All' : item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Brand</label>

                            <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                                {brands.map((item) => (
                                    <option key={item} value={item}>
                                        {item === 'ALL' ? 'All' : item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Price Range: $0 - ${maxPrice}</label>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                step="50"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                            />
                        </div>

                        <label className="stock-check">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                            />
                            <span>In Stock Only</span>
                        </label>

                        <button className="reset-btn" type="button" onClick={resetFilters}>
                            Reset Filters
                        </button>
                    </aside>

                    <main className="products-main">
                        <p className="products-count">
                            {loading
                                ? 'Loading products...'
                                : category === 'Wishlist'
                                    ? `Showing ${visibleProducts.length} wishlist products`
                                    : `Showing ${visibleProducts.length} products`}
                        </p>

                        <div className="products-grid">
                            {visibleProducts.map((product) => (
                                <article key={product._id} className="store-card">
                                    <div className="store-card__image">
                                        <img
                                            src={product.imageUrl || 'https://placehold.co/600x400/1b2029/2e3542?text=CPU'}
                                            alt={product.name}
                                            onClick={() => navigate(`/products/${product._id}`)}
                                        />

                                        <span
                                            className={`stock-badge ${product.stockQuantity > 0 ? 'stock-badge--in' : 'stock-badge--out'
                                                }`}
                                        >
                                            {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                                        </span>

                                        <button
                                            type="button"
                                            className={`wishlist-heart ${isInWishlist(product._id) ? 'wishlist-heart--active' : ''
                                                }`}
                                            onClick={() => handleWishlistClick(product)}
                                        >
                                            <Heart />
                                        </button>
                                    </div>

                                    <div className="store-card__body">
                                        <p className="store-card__brand">{product.brand}</p>
                                        <h3>{product.name}</h3>
                                        <p className="store-card__specs">
                                            {formatSpecs(product)}
                                        </p>

                                        <div className="store-card__meta">
                                            <div>
                                                <strong>${product.price}</strong>
                                                <span>{product.stockQuantity} in stock</span>
                                            </div>

                                            <div className="performance">
                                                <span>Performance</span>
                                                <b>{product.performanceScore || 90}%</b>
                                            </div>
                                        </div>

                                        <button
                                            className="add-build-btn"
                                            type="button"
                                            disabled={product.stockQuantity <= 0}
                                            onClick={() => handleAddToBuild(product)}
                                        >
                                            {product.stockQuantity > 0 ? 'Add to Build' : 'Out of Stock'}
                                        </button>

                                    </div>
                                </article>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

function formatSpecs(product) {
    const specs = product.specifications || {};
    const values = [];

    if (specs.vram) values.push(`${specs.vram}GB ${specs.vramType || ''}`);
    if (specs.cores) values.push(`${specs.cores} Cores`);
    if (specs.boostClock) values.push(specs.boostClock);
    if (specs.socket) values.push(specs.socket);
    if (specs.capacityGb) values.push(`${specs.capacityGb}GB`);
    if (specs.speedMhz) values.push(`${specs.speedMhz}MHz`);
    if (specs.wattage) values.push(`${specs.wattage}W`);
    if (specs.formFactor) values.push(specs.formFactor);

    return values.join(' • ') || product.description || 'Premium PC component';
}