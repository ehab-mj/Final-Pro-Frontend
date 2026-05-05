import { Monitor } from 'lucide-react';
import '../styles/Components-css/BuildPc.css';
import { Link } from 'react-router-dom';

export default function BuildPc() {
    return (
        <section className="build-cta">
            <div className="build-cta__card">
                <Monitor className="build-cta__icon" strokeWidth={2.6} />

                <h2 className="build-cta__title">Ready to Build?</h2>

                <p className="build-cta__text">
                    Our interactive PC builder guides you through every step with real-time
                    compatibility checks.
                </p>

                <Link to="/builder" className="build-cta__button">
                    Launch PC Builder
                </Link>
            </div>
        </section>
    );
}