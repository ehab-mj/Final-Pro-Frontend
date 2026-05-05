import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import '../../styles/Pages-css/Auth-Pages-css/Auth.css';
import { registerUser } from '../../api/auth-Api';

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError('');

            const data = await registerUser(form);

            localStorage.setItem('pc-store-token', data.token);
            localStorage.setItem('pc-store-user', JSON.stringify(data.data));

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Register failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <div className="auth-logo">
                    <Cpu />
                </div>

                <h1>Create Account</h1>
                <p>Register to save builds and place orders</p>

                {error && <div className="auth-error">{error}</div>}

                <label>
                    Full Name
                    <input
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />
                </label>

                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Minimum 6 characters"
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                </button>

                <span className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </span>
            </form>
        </div>
    );
}