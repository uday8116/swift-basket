import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './OrdersPage.css';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/orders/myorders', {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setOrders(data);
                } else {
                    setError(data.message || 'Failed to fetch orders');
                }
            } catch (err) {
                setError('Error fetching orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate]);

    if (loading) return <div className="container py-10">Loading orders...</div>;
    if (error) return <div className="container py-10 text-red-500">{error}</div>;

    return (
        <div className="orders-page container">
            <h1>My Orders</h1>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                </div>
            ) : (
                <div className="orders-table-container">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td data-label="ID">{order._id.substring(0, 10)}...</td>
                                    <td data-label="DATE">{order.createdAt.substring(0, 10)}</td>
                                    <td data-label="TOTAL">Rs. {order.totalPrice}</td>
                                    <td data-label="PAID">
                                        <span className={`status-badge ${order.isPaid ? 'status-paid' : 'status-not-paid'}`}>
                                            {order.isPaid ? order.paidAt.substring(0, 10) : 'No'}
                                        </span>
                                    </td>
                                    <td data-label="DELIVERED">
                                        <span className={`status-badge ${order.isDelivered ? 'status-delivered' : 'status-not-delivered'}`}>
                                            {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-details"
                                            onClick={() => navigate(`/order/${order._id}`)}
                                        >
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
