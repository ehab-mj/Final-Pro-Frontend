import {
    Cpu,
    MemoryStick,
    HardDrive,
    Box,
    Shield,
    MonitorSmartphone,
} from 'lucide-react';
import '../styles/Components-css/CategoryFilter.css';
import { useNavigate } from 'react-router-dom';

const categories = [
    {
        id: 'GPU',
        label: 'GPUs',
        icon: MonitorSmartphone,
    },
    {
        id: 'CPU',
        label: 'CPUs',
        icon: Cpu,
    },
    {
        id: 'RAM',
        label: 'RAM',
        icon: MemoryStick,
    },
    {
        id: 'Storage',
        label: 'Storage',
        icon: HardDrive,
    },
    {
        id: 'Case',
        label: 'Cases',
        icon: Box,
    },
    {
        id: 'PSU',
        label: 'Power Supply',
        icon: Shield,
    },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {

    const navigate = useNavigate();

    return (
        <section className="category-filter">
            <div className="category-filter__container">
                {/* <h2 className="category-filter__title">Shop by Category</h2> */}

                <div className="category-filter__grid">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const isActive = selectedCategory === category.id;

                        return (
                            <button
                                key={category.id}
                                type="button"
                                className={`category-card ${isActive ? 'category-card--active' : ''}`}
                                onClick={() => {
                                    onSelectCategory(category.id);
                                    navigate(`/products?category=${category.id}`);
                                }}
                            >
                                <div className="category-card__icon-wrap">
                                    <Icon className="category-card__icon" strokeWidth={2.3} />
                                </div>

                                <span className="category-card__label">{category.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}