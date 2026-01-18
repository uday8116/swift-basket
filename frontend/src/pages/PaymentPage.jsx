import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';

import './CheckoutPages.css';

const PaymentPage = () => {
    const { shippingAddress, savePaymentMethod } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('Credit Card');

    useEffect(() => {
        if (!user) navigate('/login');
        if (!shippingAddress.street) navigate('/shipping');
    }, [shippingAddress, user, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod(paymentMethod);
        navigate('/placeorder');
    };

    return (
        <div className="checkout-container">
            <CheckoutSteps step1 step2 step3 />
            <div className="checkout-header">
                <h1>Payment Method</h1>
            </div>

            <div className="checkout-layout">
                <div className="checkout-main">
                    <form onSubmit={submitHandler}>
                        <div className="checkout-section">
                            <h3>Choose Payment Mode</h3>
                            <div className="payment-methods">
                                <label className={`payment-method-item ${paymentMethod === 'Credit Card' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        id="CreditCard"
                                        name="paymentMethod"
                                        value="Credit Card"
                                        checked={paymentMethod === 'Credit Card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <label htmlFor="CreditCard">Credit Card / Debit Card</label>
                                </label>

                                <label className={`payment-method-item ${paymentMethod === 'UPI' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        id="UPI"
                                        name="paymentMethod"
                                        value="UPI"
                                        checked={paymentMethod === 'UPI'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <label htmlFor="UPI">UPI (Google Pay, PhonePe, Paytm)</label>
                                </label>

                                <label className={`payment-method-item ${paymentMethod === 'Cash on Delivery' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        id="COD"
                                        name="paymentMethod"
                                        value="Cash on Delivery"
                                        checked={paymentMethod === 'Cash on Delivery'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <label htmlFor="COD">Cash on Delivery</label>
                                </label>
                            </div>
                        </div>
                        <button type="submit" className="place-order-btn-large">
                            Continue to Place Order
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
