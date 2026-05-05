import { useEffect, useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { parts } from '../data/BuilderParts';
import { checkCompat } from '../utils/checkCompat';
import '../styles/Builder.css';
import { getProducts } from '../api/product-Api';
import { getProductSpecs } from '../utils/getProductsSpecs';
import { useNavigate } from 'react-router-dom';
import { addBuildPackageToCart } from '../utils/cartStorage';
import { saveBuild } from '../utils/userStorage';
import { toast } from 'react-toastify';

export default function Builder() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedParts, setSelectedParts] = useState({});
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productsError, setProductsError] = useState('');

    const navigate = useNavigate();

    const activePart = parts[currentStep];

    useEffect(() => {
        const fetchStepProducts = async () => {
            try {
                setLoadingProducts(true);
                setProductsError('');

                const data = await getProducts({ category: activePart.category });

                setProducts(data.data || []);

            } catch (error) {
                console.error(error);
                setProductsError('Failed to load products');
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchStepProducts();
    }, [activePart.category]);

    const totalPrice = useMemo(() => {
        return Object.values(selectedParts).reduce((sum, product) => {
            return sum + Number(product.price || 0);
        }, 0);
    }, [selectedParts]);

    const compatibilityIssues = useMemo(() => {
        return checkCompat(selectedParts);
    }, [selectedParts]);

    console.log('selectedParts:', selectedParts);
    console.log('compatibilityIssues:', compatibilityIssues);

    const hasCompatibilityErrors = compatibilityIssues.some(
        (issue) => issue.severity === 'error'
    );

    const completedCount = Object.keys(selectedParts).length;
    const progressPercent = Math.round((completedCount / parts.length) * 100);

    const handleSelectPart = (product) => {
        setSelectedParts((prev) => ({
            ...prev,
            [activePart.key]: product,
        }));

        if (currentStep < parts.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };


    const handleProceedToCheckout = () => {
        addBuildPackageToCart(selectedParts);
        navigate('/cart');
    };


    const handleSaveBuild = () => {
        const buildParts = Object.values(selectedParts);

        const savedBuild = {
            id: `BUILD-${Date.now()}`,
            name: 'Custom PC Build',
            date: new Date().toLocaleDateString(),
            parts: buildParts,
            totalPrice,
        };

        saveBuild(savedBuild);
        toast.success('Build saved successfully!');
    };

    return (
        <div className="builder-page">
            <div className="builder-layout">
                <main className="builder-main">
                    <header className="builder-header">
                        <h1>PC Builder</h1>
                        <p>Build your custom PC step-by-step</p>
                    </header>

                    <section className="builder-progress-card">
                        <div className="builder-progress-card__top">
                            <span>
                                Step {currentStep + 1} of {parts.length}
                            </span>
                            <span>{progressPercent}% Complete</span>
                        </div>

                        <div className="builder-progress">
                            <div
                                className="builder-progress__bar"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </section>

                    {compatibilityIssues.length > 0 && (
                        <section className="compatibility-box">
                            {compatibilityIssues.map((issue, index) => (
                                <div
                                    key={index}
                                    className={`compatibility-box__item compatibility-box__item--${issue.severity}`}
                                >
                                    <strong>{issue.title}</strong>
                                    <p>{issue.message}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    <section className="builder-tabs">
                        {parts.map((part, index) => {
                            const Icon = part.icon;
                            const isActive = index === currentStep;
                            const isSelected = selectedParts[part.key];

                            return (
                                <button
                                    key={part.key}
                                    type="button"
                                    className={`builder-tab ${isActive ? 'builder-tab--active' : ''} ${isSelected ? 'builder-tab--selected' : ''
                                        }`}
                                    onClick={() => setCurrentStep(index)}
                                >
                                    <Icon className="builder-tab__icon" />
                                    <span>{part.label}</span>
                                </button>
                            );
                        })}
                    </section>

                    <section className="builder-selector">
                        <h2>Select {activePart.label}</h2>

                        <div className="builder-products">
                            {loadingProducts && (
                                <p className="builder-status">
                                    Loading {activePart.label} products...
                                </p>
                            )}

                            {productsError && (
                                <p className="builder-status builder-status--error">
                                    {productsError}
                                </p>
                            )}

                            {!loadingProducts && !productsError && products.length === 0 && (
                                <p className="builder-status">
                                    No {activePart.label} products found.
                                </p>
                            )}

                            {!loadingProducts &&
                                !productsError &&
                                products.map((product) => {
                                    const isSelected =
                                        selectedParts[activePart.key]?._id === product._id;

                                    return (
                                        <button
                                            key={product._id}
                                            type="button"
                                            className={`builder-product ${isSelected ? 'builder-product--active' : ''
                                                }`}
                                            onClick={() => handleSelectPart(product)}
                                        >
                                            <img
                                                className="builder-product__image"
                                                src={
                                                    product.imageUrl ||
                                                    'https://placehold.co/160x120/1b2029/ff101c?text=PC+Part'
                                                }
                                                alt={product.name}
                                            />

                                            <div className="builder-product__info">
                                                <h3>{product.name}</h3>
                                                <p>{getProductSpecs(product)}</p>
                                            </div>

                                            <strong>${product.price}</strong>
                                        </button>
                                    );
                                })}
                        </div>
                    </section>
                </main>

                <aside className="builder-summary">
                    <h2>Build Summary</h2>

                    <div className="builder-summary__list">
                        {parts.map((part) => {
                            const selected = selectedParts[part.key];

                            return (
                                <div key={part.key} className="builder-summary__item">
                                    <span>{part.label}</span>
                                    <p>{selected ? selected.name : 'Not selected'}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="builder-summary__total">
                        <span>Total Price</span>
                        <strong>${totalPrice}</strong>
                    </div>

                    <div className="builder-performance">
                        <h3>Performance Estimate</h3>

                        <div className="builder-performance__row">
                            <span>Gaming</span>
                            <div>
                                <i style={{ width: `${Math.min(progressPercent + 20, 100)}%` }} />
                            </div>
                        </div>

                        <div className="builder-performance__row">
                            <span>Streaming</span>
                            <div>
                                <i style={{ width: `${Math.min(progressPercent + 10, 100)}%` }} />
                            </div>
                        </div>

                        <div className="builder-performance__row">
                            <span>Productivity</span>
                            <div>
                                <i style={{ width: `${Math.min(progressPercent + 15, 100)}%` }} />
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="builder-checkout"
                        disabled={completedCount !== parts.length || hasCompatibilityErrors}
                        onClick={handleProceedToCheckout}
                    >
                        Proceed to Checkout
                        <ChevronRight className="builder-checkout__icon" />
                    </button>

                    <button
                        type="button"
                        className="builder-save-build"
                        disabled={completedCount === 0}
                        onClick={handleSaveBuild}
                    >
                        Save Build
                    </button>
                </aside>
            </div>
        </div>
    );
}