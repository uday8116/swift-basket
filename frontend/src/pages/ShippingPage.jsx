import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';

import './CheckoutPages.css';

const ShippingPage = () => {
    const { saveShippingAddress } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
    const [customAddress, setCustomAddress] = useState({
        street: '', city: '', state: '', postalCode: '', country: ''
    });
    const [useCustomAddress, setUseCustomAddress] = useState(false);

    useEffect(() => {
        if (!user) navigate('/login?redirect=shipping');
    }, [user, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        let addressToSave = {};

        if (useCustomAddress) {
            addressToSave = customAddress;
        } else if (selectedAddressIndex !== null && user.addresses[selectedAddressIndex]) {
            addressToSave = user.addresses[selectedAddressIndex];
        } else {
            alert('Please select or enter an address');
            return;
        }

        saveShippingAddress(addressToSave);
        navigate('/payment');
    };

    return (
        <div className="checkout-container">
            <CheckoutSteps step1 step2 />
            <div className="checkout-header">
                <h1>Shipping Address</h1>
            </div>

            <div className="checkout-layout">
                <div className="checkout-main">
                    <form onSubmit={submitHandler}>
                        <div className="checkout-section">
                            {user && user.addresses && user.addresses.length > 0 && (
                                <div className="address-list-container">
                                    <h3>Select a delivery address</h3>
                                    <div className="address-list">
                                        {user.addresses.map((addr, index) => (
                                            <div
                                                key={index}
                                                className={`address-item ${selectedAddressIndex === index && !useCustomAddress ? 'active' : ''}`}
                                                onClick={() => { setSelectedAddressIndex(index); setUseCustomAddress(false); }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={selectedAddressIndex === index && !useCustomAddress}
                                                    onChange={() => { setSelectedAddressIndex(index); setUseCustomAddress(false); }}
                                                />
                                                <div className="address-details">
                                                    <p><strong>{user.name}</strong></p>
                                                    <p>{addr.street}</p>
                                                    <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                                                    <p>{addr.country}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="custom-address-toggle" style={{ marginTop: '20px' }}>
                                <label className="payment-method-item">
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={useCustomAddress}
                                        onChange={() => setUseCustomAddress(true)}
                                    />
                                    <label>Add a new address</label>
                                </label>
                            </div>

                            {useCustomAddress && (
                                <div className="custom-address-form">
                                    <input type="text" placeholder="Street Address" value={customAddress.street} onChange={(e) => setCustomAddress({ ...customAddress, street: e.target.value })} className="form-control" required />
                                    <div className="form-group-row">
                                        <input type="text" placeholder="City" value={customAddress.city} onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })} className="form-control" required />
                                        <input type="text" placeholder="State" value={customAddress.state} onChange={(e) => setCustomAddress({ ...customAddress, state: e.target.value })} className="form-control" required />
                                    </div>
                                    <div className="form-group-row">
                                        <input type="text" placeholder="Postal Code" value={customAddress.postalCode} onChange={(e) => setCustomAddress({ ...customAddress, postalCode: e.target.value })} className="form-control" required />
                                        <input type="text" placeholder="Country" value={customAddress.country} onChange={(e) => setCustomAddress({ ...customAddress, country: e.target.value })} className="form-control" required />
                                    </div>
                                </div>
                            )}
                        </div>
                        <button type="submit" className="place-order-btn-large">
                            Continue to Payment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ShippingPage;
