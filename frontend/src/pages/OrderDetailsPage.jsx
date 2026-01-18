import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './OrderDetailsPage.css';

const OrderDetailsPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/orders/${id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setOrder(data);
                } else {
                    setError(data.message || 'Failed to fetch order');
                }
            } catch (err) {
                setError('Error fetching order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, user, navigate]);

    if (loading) return <div className="container py-10">Loading order details...</div>;
    if (error) return <div className="container py-10 text-red-500">{error}</div>;
    if (!order) return <div className="container py-10">Order not found</div>;

    return (
        <div className="order-details-page container">
            <h1>Order #{order._id.substring(0, 10).toUpperCase()}</h1>

            <div className="order-grid">
                <div className="order-main">
                    <div className="order-card">
                        <h2>Shipping</h2>
                        <p><strong>Name:</strong> {order.user.name}</p>
                        <p><strong>Email:</strong> {order.user.email}</p>
                        <p>
                            <strong>Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                            {order.shippingAddress.state} {order.shippingAddress.postalCode},{' '}
                            {order.shippingAddress.country}
                        </p>
                        <div className={`status-alert ${order.isDelivered ? 'success' : 'warning'}`}>
                            {order.isDelivered ? `Delivered on ${order.deliveredAt.substring(0, 10)}` : 'Not Delivered'}
                        </div>
                    </div>

                    <div className="order-card">
                        <h2>Payment Method</h2>
                        <p><strong>Method:</strong> {order.paymentMethod}</p>
                        <div className={`status-alert ${order.isPaid ? 'success' : 'warning'}`}>
                            {order.isPaid ? `Paid on ${order.paidAt.substring(0, 10)}` : 'Not Paid'}
                        </div>
                    </div>

                    <div className="order-card">
                        <h2>Order Items</h2>
                        <div className="order-items">
                            {order.orderItems.map((item, index) => (
                                <div key={index} className="order-item">
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                        <p>{item.qty} x Rs. {item.price} = <strong>Rs. {item.qty * item.price}</strong></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="order-sidebar">
                    <div className="order-summary-card">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Items</span>
                            <span>Rs. {order.itemsPrice}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>Rs. {order.shippingPrice}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax</span>
                            <span>Rs. {order.taxPrice}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>Rs. {order.totalPrice}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
