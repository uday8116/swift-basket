import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { WishlistContext } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
    const { cartItems } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { wishlistItems } = useContext(WishlistContext);

    return (
        <header className="navbar">
            <div className="container nav-container">
                <Link to="/" className="logo">
                    <span className="logo-text">SWIFTBASKET</span>
                </Link>

                <nav className="nav-links">
                    <Link to="/products?category=Men">MEN</Link>
                    <Link to="/products?category=Women">WOMEN</Link>
                    <Link to="/products?category=Kids">KIDS</Link>
                    <Link to="/products?category=Accessories">ACCESSORIES</Link>
                    {user && user.isAdmin && <Link to="/admin" style={{ color: '#ff3f6c' }}>ADMIN</Link>}
                </nav>

                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Search for products, brands and more" />
                </div>

                <div className="nav-icons">
                    <Link to={user ? "/profile" : "/login"} className="nav-item">
                        <FaUser />
                        <span>{user ? user.name.split(' ')[0] : 'Profile'}</span>
                    </Link>
                    <Link to="/wishlist" className="nav-item cart-icon-container">
                        <FaHeart />
                        <span>Wishlist</span>
                        {wishlistItems.length > 0 && <span className="cart-badge">{wishlistItems.length}</span>}
                    </Link>
                    <Link to="/cart" className="nav-item cart-icon-container">
                        <FaShoppingBag />
                        <span>Bag</span>
                        {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
