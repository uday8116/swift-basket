import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaTimes, FaCheck, FaInfoCircle } from 'react-icons/fa';
import PageTransition from '../components/PageTransition'; // Add transition
import './AdminPage.css'; // Use unified admin styles

const AdminOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.isAdmin) {
            navigate('/login');
            return;
        }

        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/orders', {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    };

    const deliverHandler = async (id) => {
        if (!window.confirm('Mark this order as delivered?')) return;
        try {
            const response = await fetch(`http://localhost:5001/api/orders/${id}/deliver`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (response.ok) {
                alert('Order marked as delivered');
                fetchOrders();
            }
        } catch (error) {
            alert('Error updating order');
        }
    };

    if (loading) return <div className="container py-10">Loading orders...</div>;

    return (
        <PageTransition>
            <div className="admin-page container">
                <div className="admin-header">
                    <h1>Manage Orders</h1>
                    <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="products-table"> {/* Reuse premium table style */}
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>USER</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id.substring(0, 10)}...</td>
                                    <td>{order.user && order.user.name}</td>
                                    <td>{order.createdAt.substring(0, 10)}</td>
                                    <td>Rs. {order.totalPrice}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>{order.paidAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes style={{ color: 'red' }} />
                                        )}
                                    </td>
                                    <td>
                                        {order.isDelivered ? (
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>{order.deliveredAt.substring(0, 10)}</span>
                                        ) : (
                                            <FaTimes style={{ color: 'red' }} />
                                        )}
                                    </td>
                                    <td>
                                        <div className="actions">
                                            <button
                                                className="btn-edit" // Reuse edit style for details
                                                onClick={() => navigate(`/order/${order._id}`)}
                                                title="View Details"
                                                style={{ border: '1px solid #535766', color: '#535766' }}
                                            >
                                                Details
                                            </button>
                                            {!order.isDelivered && (
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => deliverHandler(order._id)}
                                                    title="Mark as Delivered"
                                                    style={{ border: '1px solid #03a685', color: '#03a685' }}
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                        </div>
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

export default AdminOrdersPage;
