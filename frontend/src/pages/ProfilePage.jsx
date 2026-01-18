import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaSignOutAlt, FaCog, FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', email: '' });

    // Address State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState({
        street: '', city: '', state: '', postalCode: '', country: ''
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setProfileData({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        await updateProfile(profileData);
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const updatedAddresses = [...(user.addresses || []), addressForm];
        const success = await updateProfile({ addresses: updatedAddresses });
        if (success) {
            setShowAddressForm(false);
            setAddressForm({ street: '', city: '', state: '', postalCode: '', country: '' });
        }
    };

    const handleDeleteAddress = async (index) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const updatedAddresses = user.addresses.filter((_, i) => i !== index);
            await updateProfile({ addresses: updatedAddresses });
        }
    };

    const updateProfile = async (dataToUpdate) => {
        setMessage('');
        try {
            const response = await fetch('http://localhost:5001/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify(dataToUpdate),
            });

            const data = await response.json();

            if (response.ok) {
                const updatedUser = { ...user, ...data };
                localStorage.setItem('userInfo', JSON.stringify(updatedUser)); // Update local storage
                // Force reload or update context (Context should listen to storage or we trigger a reload)
                // specific implementation: generic reload for mvp
                window.location.reload();
                return true;
            } else {
                setMessage(data.message || 'Failed to update profile');
                return false;
            }
        } catch (error) {
            setMessage('Error updating profile');
            console.error('Error:', error);
            return false;
        }
    };

    if (!user) return <div className="container">Loading...</div>;

    return (
        <div className="profile-page container">
            <div className="profile-header">
                <div className="profile-avatar"><FaUser /></div>
                <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    {user.isAdmin && <span className="admin-badge">Admin</span>}
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-menu">
                    <Link to="/orders" className="menu-item">
                        <FaShoppingBag />
                        <div><h4>Orders</h4><p>Track, return or buy again</p></div>
                    </Link>
                    <Link to="/wishlist" className="menu-item">
                        <FaHeart />
                        <div><h4>Wishlist</h4><p>View your saved items</p></div>
                    </Link>
                    {user.isAdmin && (
                        <Link to="/admin" className="menu-item">
                            <FaCog />
                            <div><h4>Admin Dashboard</h4><p>Manage products and orders</p></div>
                        </Link>
                    )}
                    <div className="menu-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        <FaSignOutAlt />
                        <div><h4>Logout</h4><p>Sign out of your account</p></div>
                    </div>
                </div>

                <div className="profile-details-section">
                    {message && <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</div>}

                    {/* Basic Info */}
                    <div className="details-card">
                        <div className="card-header">
                            <h3>Account Information</h3>
                            <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                                <FaEdit /> {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>
                        {isEditing ? (
                            <form onSubmit={handleProfileUpdate} className="edit-form">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </form>
                        ) : (
                            <div className="info-display">
                                <p><strong>Name:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Address Book */}
                    <div className="details-card">
                        <div className="card-header">
                            <h3>Address Book</h3>
                            <button className="edit-btn" onClick={() => setShowAddressForm(!showAddressForm)}>
                                <FaPlus /> Add New
                            </button>
                        </div>

                        {showAddressForm && (
                            <form onSubmit={handleAddAddress} className="address-form">
                                <div className="form-row">
                                    <input type="text" placeholder="Street Address" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} required />
                                    <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <input type="text" placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} required />
                                    <input type="text" placeholder="Postal Code" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} required />
                                </div>
                                <div className="form-row">
                                    <input type="text" placeholder="Country" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} required />
                                </div>
                                <button type="submit" className="save-btn">Save Address</button>
                            </form>
                        )}

                        <div className="addresses-list">
                            {user.addresses && user.addresses.length > 0 ? (
                                user.addresses.map((addr, index) => (
                                    <div key={index} className="address-item">
                                        <div className="address-info">
                                            <p className="street">{addr.street}</p>
                                            <p className="city-state">{addr.city}, {addr.state} {addr.postalCode}</p>
                                            <p className="country">{addr.country}</p>
                                            {addr.isDefault && <span className="default-badge">Default</span>}
                                        </div>
                                        <button onClick={() => handleDeleteAddress(index)} className="delete-btn"><FaTrash /></button>
                                    </div>
                                ))
                            ) : (
                                <p className="no-address">No saved addresses.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
