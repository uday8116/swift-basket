import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';
import PageTransition from '../components/PageTransition';
import toast from 'react-hot-toast';
import './CheckoutPages.css';

const PlaceOrderPage = () => {
    const { cartItems, shippingAddress, paymentMethod, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    // Calculate Prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(
        cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 500 ? 0 : 100);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2))); // 15% tax
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (!user) navigate('/login');
        if (!shippingAddress || !shippingAddress.street) navigate('/shipping');
    }, [user, shippingAddress, navigate]);

    const placeOrderHandler = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    orderItems: cartItems.map((item) => ({
                        name: item.name,
                        qty: item.qty,
                        image: item.image,
                        price: item.price,
                        product: item._id, // Required by Order model
                    })),
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                clearCart();
                toast.success('Order Placed Successfully!');
                navigate('/');
            } else {
                toast.error(data.message || 'Failed to place order');
            }
        } catch (error) {
            toast.error('Error placing order');
        }
    };

    return (
        <PageTransition>
            <div className="checkout-container">
                <CheckoutSteps step1 step2 step3 step4 />

                <div className="checkout-layout">
                    <div className="checkout-main">
                        <div className="checkout-section">
                            <h2>Shipping</h2>
                            <p><strong>Address:</strong> {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
                        </div>

                        <div className="checkout-section">
                            <h2>Payment Method</h2>
                            <p><strong>Method:</strong> {paymentMethod}</p>
                        </div>

                        <div className="checkout-section">
                            <h2>Order Items</h2>
                            {cartItems.length === 0 ? <p>Your cart is empty</p> : (
                                <div className="order-items-list">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <img src={item.image} alt={item.name} className="order-item-img" />
                                            <div className="order-item-info">
                                                <h4>{item.name}</h4>
                                                <p>{item.qty} x Rs. {item.price} = <strong>Rs. {item.qty * item.price}</strong></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="checkout-sidebar">
                        <div className="order-summary-card">
                            <h2>Order Summary</h2>
                            <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eaeaec' }} />
                            <div className="summary-row">
                                <span>Items</span>
                                <span>Rs. {itemsPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Rs. {shippingPrice}</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax</span>
                                <span>Rs. {taxPrice}</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>Rs. {totalPrice}</span>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <button
                                className="place-order-btn-large"
                                onClick={placeOrderHandler}
                                disabled={cartItems.length === 0}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PlaceOrderPage;
