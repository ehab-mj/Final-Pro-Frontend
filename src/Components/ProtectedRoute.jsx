import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({
    children,
    adminOnly = false
}) {

    const token = localStorage.getItem('pc-store-token');
    const savedUser = localStorage.getItem('pc-store-user');
    const user = savedUser ? JSON.parse(savedUser) : null;

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
}