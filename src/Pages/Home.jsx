import { useEffect, useState } from 'react';
import ProductCard from '../Components/ProductCard';
import '../styles/Home.css';
import { getProducts } from '../api/product-Api';
import CategoryFilter from '../Components/CategoryFilter';
import { useMemo } from 'react';
import BuildPc from '../Components/BuildPc';
import FeaturedBuilds from '../Components/FeaturedBuilds';
import TopProductPrices from '../Components/TopProductPrices';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const data = await getProducts({ category: selectedCategory });
                console.log('API DATA:', data);

                setProducts(data.data || []);


            } catch (err) {
                console.error(err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);


    useEffect(() => {
        const slides = document.querySelectorAll('.slide');
        let current = 0;

        const interval = setInterval(() => {
            slides[current].classList.remove('active');

            current = (current + 1) % slides.length;

            slides[current].classList.add('active');
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="home">
            <header className="home__hero">
                <div className="home__slider">
                    <div className="slide active" />
                    <div className="slide" />
                    <div className="slide" />
                    <div className="slide" />
                    <div className="slide" />
                </div>

                <div className="home__overlay">
                    <h1 className="home__title">
                        PC Hardware Store
                    </h1>

                    <p className="home__subtitle">
                        Browse components and build your dream PC
                    </p>
                </div>
            </header>

            <TopProductPrices />

            <CategoryFilter
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <main className="home__container">

                {loading && <p className="home__status">Loading products...</p>}
                {error && <p className="home__status home__status--error">{error}</p>}

                {!loading && !error && products.length === 0 && (
                    <p className="home__status">No products found.</p>
                )}

                <FeaturedBuilds />
            </main>

            <BuildPc />
        </div>
    );
}