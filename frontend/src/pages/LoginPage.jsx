import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import toast from 'react-hot-toast';
import './LoginPage.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.state?.from ? location.state.from : '/';

    useEffect(() => {
        if (user) {
            navigate(redirect);
        }
    }, [navigate, user, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            toast.success('Login Successful');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <PageTransition>
            <div className="login-container">
                <div className="login-card">
                    <h1>Login</h1>
                    <p className="login-subtitle">Get access to your Orders, Wishlist and Recommendations</p>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="login-btn">LOG IN</button>
                    </form>
                    <div className="login-footer">
                        New to Swift Basket? <Link to="/register">Create an account</Link>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default LoginPage;
