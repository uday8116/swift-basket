import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import toast from 'react-hot-toast';
import './AdminHomeContentPage.css';

const AdminHomeContentPage = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('brand');
    const [content, setContent] = useState({ brands: [], categories: [] });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        discount: 'UP TO 60% OFF',
    });

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/');
        } else {
            fetchContent();
        }
    }, [user, navigate]);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5001/api/home-content');
            const data = await response.json();
            setContent({ brands: data.brands || [], categories: data.categories || [] });
        } catch (error) {
            console.error('Error fetching content:', error);
            toast.error('Error fetching content');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return formData.image;

        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);

        setUploading(true);
        try {
            const response = await fetch('http://localhost:5001/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formDataUpload,
            });

            const data = await response.json();
            if (response.ok) {
                return `http://localhost:5001${data.imagePath}`;
            } else {
                toast.error('Error uploading image');
                return null;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const imageUrl = await uploadImage();
        if (imageFile && !imageUrl) {
            return;
        }

        const contentData = {
            type: activeTab,
            name: formData.name,
            image: imageUrl || formData.image,
            discount: formData.discount,
        };

        const url = editingItem
            ? `http://localhost:5001/api/home-content/${editingItem._id}`
            : 'http://localhost:5001/api/home-content';
        const method = editingItem ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(contentData),
            });

            if (response.ok) {
                toast.success(editingItem ? 'Updated successfully!' : 'Created successfully!');
                resetForm();
                fetchContent();
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Error saving content');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error saving content');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            image: item.image,
            discount: item.discount,
        });
        setImagePreview(item.image);
        setImageFile(null);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;

        try {
            const response = await fetch(`http://localhost:5001/api/home-content/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.ok) {
                toast.success('Deleted successfully!');
                fetchContent();
            } else {
                toast.error('Error deleting content');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error deleting content');
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingItem(null);
        setImageFile(null);
        setImagePreview('');
        setFormData({
            name: '',
            image: '',
            discount: 'UP TO 60% OFF',
        });
    };

    if (!user || !user.isAdmin) {
        return <div className="container">Access Denied</div>;
    }

    const currentItems = activeTab === 'brand' ? content.brands : content.categories;

    return (
        <PageTransition>
            <div className="admin-home-content container">
                <div className="admin-header">
                    <h1>Manage Home Content</h1>
                    <div className="admin-actions">
                        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                            ← Back to Dashboard
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                if (showForm) {
                                    resetForm();
                                } else {
                                    setShowForm(true);
                                }
                            }}
                        >
                            {showForm ? 'Cancel' : `Add New ${activeTab === 'brand' ? 'Brand' : 'Category'}`}
                        </button>
                    </div>
                </div>

                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'brand' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('brand'); resetForm(); }}
                    >
                        Brands ({content.brands.length})
                    </button>
                    <button
                        className={`tab ${activeTab === 'category' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('category'); resetForm(); }}
                    >
                        Categories ({content.categories.length})
                    </button>
                </div>

                {showForm && (
                    <div className="content-form animate-fade-up">
                        <h2>{editingItem ? 'Edit' : 'Add New'} {activeTab === 'brand' ? 'Brand' : 'Category'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>{activeTab === 'brand' ? 'Brand' : 'Category'} Name</label>
                                    {activeTab === 'brand' ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter brand name"
                                            required
                                        />
                                    ) : (
                                        <select
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Kids">Kids</option>
                                            <option value="Accessories">Accessories</option>
                                        </select>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label>Discount Text</label>
                                    <input
                                        type="text"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleInputChange}
                                        placeholder="e.g., UP TO 60% OFF"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input"
                                />
                                {imagePreview && (
                                    <div className="image-preview-container">
                                        <img src={imagePreview} alt="Preview" className="image-preview" />
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={uploading}>
                                {uploading ? 'Uploading...' : editingItem ? 'Update' : 'Create'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="content-grid">
                    {loading ? (
                        <p className="loading-text">Loading...</p>
                    ) : currentItems.length === 0 ? (
                        <div className="empty-state">
                            <p>No {activeTab === 'brand' ? 'brands' : 'categories'} added yet.</p>
                            <p>Click "Add New" to get started!</p>
                        </div>
                    ) : (
                        currentItems.map((item) => (
                            <div key={item._id} className="content-card animate-fade-up">
                                <div className="content-image">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} />
                                    ) : (
                                        <div className="placeholder-image">
                                            {activeTab === 'brand' ? item.name : item.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="content-info">
                                    <h3>{item.name}</h3>
                                    <p className="discount-text">{item.discount}</p>
                                </div>
                                <div className="content-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(item)}>
                                        Edit
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(item._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminHomeContentPage;
