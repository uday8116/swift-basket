import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import './WishlistPage.css';

const WishlistPage = () => {
    const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    const handleMoveToBag = (product) => {
        addToCart(product, 'M'); // Default size, could be improved
        removeFromWishlist(product._id);
        alert('Moved to Bag!');
    };

    return (
        <div className="wishlist-page container">
            <div className="wishlist-header">
                <h2>My Wishlist ({wishlistItems.length} items)</h2>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="empty-wishlist">
                    <h3>Your wishlist is empty!</h3>
                    <p>Save your favourite items here.</p>
                    <Link to="/products" className="btn btn-primary">EXPLORE PRODUCTS</Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map((item) => (
                        <div key={item._id} className="wishlist-item">
                            <Link to={`/product/${item._id}`}>
                                <div className="wishlist-item-img">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="wishlist-item-details">
                                    <h4 className="wishlist-item-brand">{item.brand}</h4>
                                    <h5 className="wishlist-item-name">{item.name}</h5>
                                    <div className="wishlist-item-price">
                                        <span className="price">Rs. {item.price}</span>
                                        <span className="original-price">Rs. {item.originalPrice}</span>
                                        <span className="discount">
                                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            <div className="wishlist-actions">
                                <button
                                    className="btn-move-bag"
                                    onClick={() => handleMoveToBag(item)}
                                >
                                    <FaShoppingBag /> MOVE TO BAG
                                </button>
                                <button
                                    className="btn-remove"
                                    onClick={() => removeFromWishlist(item._id)}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
