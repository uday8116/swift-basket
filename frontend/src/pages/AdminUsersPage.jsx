import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import toast from 'react-hot-toast';
import './AdminPage.css'; // Reuse premium styles

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: userInfo } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'superAdmin') {
            navigate('/login');
            return;
        }
        fetchUsers();
    }, [userInfo, navigate]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/users', {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            const data = await response.json();
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users');
            setLoading(false);
        }
    };

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:5001/api/users/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                });
                if (response.ok) {
                    toast.success('User deleted');
                    fetchUsers();
                } else {
                    toast.error('Error deleting user');
                }
            } catch (error) {
                toast.error('Error deleting user');
            }
        }
    };

    const updateRoleHandler = async (id, newRole) => {
        try {
            const response = await fetch(`http://localhost:5001/api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });

            if (response.ok) {
                toast.success(`User updated to ${newRole}`);
                fetchUsers();
            } else {
                toast.error('Error updating role');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating role');
        }
    };

    if (loading) return <div className="container py-10">Loading users...</div>;

    return (
        <PageTransition>
            <div className="admin-page container">
                <div className="admin-header">
                    <h1>Manage Users</h1>
                    <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ROLE</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id.substring(0, 10)}...</td>
                                    <td>{user.name}</td>
                                    <td>
                                        <a href={`mailto:${user.email}`} style={{ color: '#ff3f6c' }}>
                                            {user.email}
                                        </a>
                                    </td>
                                    <td>
                                        {/* Dropdown for instant role update */}
                                        <select
                                            value={user.role || (user.isAdmin ? 'superAdmin' : 'user')}
                                            onChange={(e) => updateRoleHandler(user._id, e.target.value)}
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: '4px',
                                                border: '1px solid #d4d5d9',
                                                background: user.role === 'superAdmin' ? '#e6f7f3' : '#fff'
                                            }}
                                            disabled={user._id === userInfo._id} // can't demote self
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Retailer (Admin)</option>
                                            <option value="superAdmin">Super Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-delete"
                                            onClick={() => deleteHandler(user._id)}
                                            disabled={user._id === userInfo._id}
                                            style={{ opacity: user._id === userInfo._id ? 0.5 : 1 }}
                                        >
                                            <FaTrash />
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

export default AdminUsersPage;
