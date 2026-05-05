import { Gamepad2, Video, Zap, BriefcaseBusiness } from 'lucide-react';
import '../styles/Components-css/FeaturedBuilds.css';

const builds = [
    {
        title: 'Gaming Beast',
        specs: 'RTX 4090 • i9-14900K • 64GB DDR5',
        price: 3999,
        performance: 98,
        icon: Gamepad2,
        color: 'red',
    },
    {
        title: 'Streaming Pro',
        specs: 'RTX 4070 Ti • Ryzen 9 7950X • 32GB DDR5',
        price: 2499,
        performance: 92,
        icon: Video,
        color: 'cyan',
    },
    {
        title: 'Budget Builder',
        specs: 'RTX 4060 • Ryzen 5 7600X • 16GB DDR5',
        price: 1199,
        performance: 75,
        icon: Zap,
        color: 'red',
    },
    {
        title: 'Workstation Elite',
        specs: 'RTX A6000 • Threadripper PRO • 128GB DDR5',
        price: 7999,
        performance: 100,
        icon: BriefcaseBusiness,
        color: 'cyan',
    },
];

export default function FeaturedBuilds() {
    return (
        <section className="featured-builds">
            <h2 className="featured-builds__title">Featured Builds</h2>

            <div className="featured-builds__grid">
                {builds.map((build) => {
                    const Icon = build.icon;

                    return (
                        <article key={build.title} className="featured-build-card">
                            <div className="featured-build-card__visual">
                                <Icon
                                    className={`featured-build-card__icon featured-build-card__icon--${build.color}`}
                                />
                            </div>

                            <div className="featured-build-card__body">
                                <h3>{build.title}</h3>
                                <p>{build.specs}</p>

                                <div className="featured-build-card__meta">
                                    <strong>${build.price.toLocaleString()}</strong>
                                    <span>Performance: {build.performance}%</span>
                                </div>

                                <div className="featured-build-card__bar">
                                    <i style={{ width: `${build.performance}%` }} />
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}