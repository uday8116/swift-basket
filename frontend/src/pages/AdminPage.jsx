import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import toast from 'react-hot-toast';
import './AdminPage.css';

const AdminPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [availableBrands, setAvailableBrands] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        images: [],
        description: '',
        brand: '',
        category: '',
        price: '',
        originalPrice: '',
        countInStock: '',
    });

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
        } else {
            fetchProducts();
            fetchAvailableBrands();
        }
    }, [user, navigate]);

    const fetchAvailableBrands = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/home-content');
            const data = await response.json();
            setAvailableBrands(data.brands || []);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/products?param=admin');
            const data = await response.json();
            // Backend returns { products, page, pages, count }
            setProducts(data.products || data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Error fetching products');
            setProducts([]);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setImageFiles(files);

            const previews = [];
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    previews.push(reader.result);
                    if (previews.length === files.length) {
                        setImagePreviews(previews);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0) return formData.images.length > 0 ? formData.images : (formData.image ? [formData.image] : []);

        const formDataUpload = new FormData();
        imageFiles.forEach(file => {
            formDataUpload.append('images', file);
        });

        setUploading(true);
        try {
            const response = await fetch('http://localhost:5001/api/upload/multiple', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formDataUpload,
            });

            const data = await response.json();
            if (response.ok) {
                return data.imagePaths.map(path => `http://localhost:5001${path}`);
            } else {
                toast.error('Error uploading images');
                return null;
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            toast.error('Error uploading images');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Upload images first if new ones were selected
        const uploadedImageUrls = await uploadImages();
        if (imageFiles.length > 0 && !uploadedImageUrls) {
            return; // Upload failed
        }

        const productData = {
            ...formData,
            images: uploadedImageUrls || formData.images,
            image: (uploadedImageUrls && uploadedImageUrls[0]) || formData.image,
        };

        const url = editingProduct
            ? `http://localhost:5001/api/products/${editingProduct._id}`
            : 'http://localhost:5001/api/products';
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(productData),
            });

            if (response.ok) {
                toast.success(editingProduct ? 'Product updated!' : 'Product created!');
                setShowForm(false);
                setEditingProduct(null);
                setImageFiles([]);
                setImagePreviews([]);
                setFormData({
                    name: '',
                    image: '',
                    images: [],
                    description: '',
                    brand: '',
                    category: '',
                    price: '',
                    originalPrice: '',
                    countInStock: '',
                });
                fetchProducts();
            } else {
                toast.error('Error saving product');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error saving product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            image: product.image,
            images: product.images || [product.image],
            description: product.description,
            brand: product.brand,
            category: product.category,
            price: product.price,
            originalPrice: product.originalPrice,
            countInStock: product.countInStock,
        });
        setImagePreviews(product.images || [product.image]);
        setImageFiles([]);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`http://localhost:5001/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.ok) {
                toast.success('Product deleted!');
                fetchProducts();
            } else {
                toast.error('Error deleting product');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error deleting product');
        }
    };

    if (!user || !user.isAdmin) {
        return <div className="container">Access Denied</div>;
    }

    return (
        <PageTransition>
            <div className="admin-page container">
                <div className="admin-header">
                    <h1>Dashboard</h1>
                    <div className="admin-actions">
                        <button className="btn btn-secondary" onClick={() => navigate('/admin/orders')} style={{ marginRight: '10px' }}>
                            Manage Orders
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate('/admin/home-content')} style={{ marginRight: '10px' }}>
                            Manage Home Content
                        </button>
                        {(user && user.role === 'superAdmin') && (
                            <button className="btn btn-secondary" onClick={() => navigate('/admin/users')} style={{ marginRight: '10px' }}>
                                Manage Users
                            </button>
                        )}
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditingProduct(null);
                                setEditingProduct(null);
                                setImageFiles([]);
                                setImagePreviews([]);
                                setFormData({
                                    name: '',
                                    image: '',
                                    images: [],
                                    description: '',
                                    brand: '',
                                    category: '',
                                    price: '',
                                    originalPrice: '',
                                    countInStock: '',
                                });
                            }}
                        >
                            {showForm ? 'Cancel' : 'Add New Product'}
                        </button>
                    </div>
                </div>

                {showForm && (
                    <div className="product-form">
                        <h2>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Brand</label>
                                    <select
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Brand</option>
                                        {availableBrands.map((b) => (
                                            <option key={b._id} value={b.name}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Kids">Kids</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Product Images</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="file-input"
                                        multiple
                                    />
                                    <div className="image-previews-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                                        {imagePreviews.map((src, index) => (
                                            <img
                                                key={index}
                                                src={src}
                                                alt={`Preview ${index}`}
                                                className="image-preview"
                                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (Rs.)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Original Price (Rs.)</label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Count</label>
                                    <input
                                        type="number"
                                        name="countInStock"
                                        value={formData.countInStock}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={uploading}>
                                {uploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="products-table">
                    <h2>All Products ({products.length})</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Brand</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img src={product.image} alt={product.name} className="product-thumb" />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.category}</td>
                                    <td>Rs. {product.price}</td>
                                    <td>{product.countInStock}</td>
                                    <td className="actions">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminPage;
