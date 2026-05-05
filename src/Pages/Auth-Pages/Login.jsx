import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import '../../styles/Pages-css/Auth-Pages-css/Auth.css';
import { loginUser } from '../../api/auth-Api';

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
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

            const data = await loginUser(form);

            localStorage.setItem('pc-store-token', data.token);
            localStorage.setItem('pc-store-user', JSON.stringify(data.data));

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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

                <h1>Welcome Back</h1>
                <p>Login to continue building your PC</p>

                {error && <div className="auth-error">{error}</div>}

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
                        placeholder="••••••••"
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <span className="auth-link">
                    Don&apos;t have an account? <Link to="/register">Create account</Link>
                </span>
            </form>
        </div>
    );
}