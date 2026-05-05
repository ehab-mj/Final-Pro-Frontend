import { useEffect, useState } from 'react';
import {
    User,
    Settings,
    Package,
    Cpu,
    Trash2,
    Pencil,
    Plus,
    Save,
    LogOut,
} from 'lucide-react';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../api/product-Api';
import '../styles/AdminProfile.css';
import { useNavigate } from 'react-router-dom';

const emptyForm = {
    name: '',
    category: 'CPU',
    brand: '',
    price: '',
    stockQuantity: '',
    description: '',
    imageUrl: '',
    performanceScore: 90,
};

const categories = ['CPU', 'GPU', 'RAM', 'Motherboard', 'Storage', 'Case', 'PSU', 'Cooling'];

export default function AdminProfile() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchProducts = async () => {
        const data = await getProducts();
        setProducts(data.data || []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const productData = {
                ...form,
                price: Number(form.price),
                stockQuantity: Number(form.stockQuantity),
                performanceScore: Number(form.performanceScore),
                specifications: {},
                isActive: true,
            };

            if (editingId) {
                await updateProduct(editingId, productData);
            } else {
                await createProduct(productData);
            }

            await fetchProducts();
            resetForm();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product._id);

        setForm({
            name: product.name || '',
            category: product.category || 'CPU',
            brand: product.brand || '',
            price: product.price || '',
            stockQuantity: product.stockQuantity || '',
            description: product.description || '',
            imageUrl: product.imageUrl || '',
            performanceScore: product.performanceScore || 90,
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Delete this product?');

        if (!confirmDelete) return;

        await deleteProduct(id);
        await fetchProducts();
    };


    const handleLogout = () => {
        localStorage.removeItem('pc-store-token');
        localStorage.removeItem('pc-store-user');

        navigate('/login');
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                <section className="admin-hero">
                    <div className="admin-user">
                        <div className="admin-avatar">
                            <User />
                        </div>

                        <div>
                            <h1>Admin Panel</h1>
                            <p>admin@pcstore.com</p>

                            <div className="admin-stats">
                                <div>
                                    <span>Total Products</span>
                                    <strong>{products.length}</strong>
                                </div>

                                <div>
                                    <span>In Stock</span>
                                    <strong className="cyan">
                                        {products.filter((p) => p.stockQuantity > 0).length}
                                    </strong>
                                </div>

                                <div>
                                    <span>Out of Stock</span>
                                    <strong>
                                        {products.filter((p) => p.stockQuantity <= 0).length}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        className="settings-btn" type="button"
                        onClick={handleLogout}
                    >
                        <LogOut />
                        Logout
                    </button>
                </section>

                <div className="admin-grid">
                    <main className="admin-main">
                        <section className="admin-card">
                            <div className="admin-card__header">
                                <div>
                                    <Package />
                                    <h2>Created Products</h2>
                                </div>
                            </div>

                            <div className="admin-products-list">
                                {products.map((product) => (
                                    <article key={product._id} className="admin-product-item">
                                        <div className="admin-product-left">
                                            <img
                                                src={
                                                    product.imageUrl ||
                                                    'https://placehold.co/120x90/1b2029/ff101c?text=PC'
                                                }
                                                alt={product.name}
                                            />

                                            <div>
                                                <h3>{product.name}</h3>
                                                <p>
                                                    {product.category} • {product.brand} • Stock:{' '}
                                                    {product.stockQuantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="admin-product-right">
                                            <strong>${product.price}</strong>

                                            <div className="admin-actions">
                                                <button type="button" onClick={() => handleEdit(product)}>
                                                    <Pencil />
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="danger"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    <Trash2 />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </main>

                    <aside className="admin-side">
                        <section className="admin-card">
                            <div className="admin-card__header">
                                <div>
                                    <Cpu />
                                    <h2>{editingId ? 'Edit Product' : 'Create Product'}</h2>
                                </div>
                            </div>

                            <form className="admin-form" onSubmit={handleSubmit}>
                                <label>
                                    Product Name
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="RTX 4090 Gaming OC"
                                        required
                                    />
                                </label>

                                <label>
                                    Category
                                    <select name="category" value={form.category} onChange={handleChange}>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label>
                                    Brand
                                    <input
                                        name="brand"
                                        value={form.brand}
                                        onChange={handleChange}
                                        placeholder="ASUS"
                                        required
                                    />
                                </label>

                                <div className="admin-form-row">
                                    <label>
                                        Price
                                        <input
                                            name="price"
                                            type="number"
                                            value={form.price}
                                            onChange={handleChange}
                                            placeholder="599"
                                            required
                                        />
                                    </label>

                                    <label>
                                        Stock
                                        <input
                                            name="stockQuantity"
                                            type="number"
                                            value={form.stockQuantity}
                                            onChange={handleChange}
                                            placeholder="5"
                                            required
                                        />
                                    </label>
                                </div>

                                <label>
                                    Image URL
                                    <input
                                        name="imageUrl"
                                        value={form.imageUrl}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />
                                </label>

                                <label>
                                    Description
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Product description..."
                                    />
                                </label>

                                <label>
                                    Performance Score
                                    <input
                                        name="performanceScore"
                                        type="number"
                                        value={form.performanceScore}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                    />
                                </label>

                                <button className="admin-submit" type="submit" disabled={loading}>
                                    {editingId ? <Save /> : <Plus />}
                                    {loading
                                        ? 'Saving...'
                                        : editingId
                                            ? 'Save Changes'
                                            : 'Create Product'}
                                </button>

                                {editingId && (
                                    <button
                                        className="admin-cancel"
                                        type="button"
                                        onClick={resetForm}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </form>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}