import React, { useContext } from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToWishlist, isInWishlist } = useContext(WishlistContext);

    const handleWishlist = (e) => {
        e.preventDefault(); // Prevent Link navigation
        addToWishlist(product);
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product._id}`} className="product-link">
                <div className="product-image-container">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="rating-container">
                        {product.rating} <span className="star">★</span> | {product.numReviews}
                    </div>
                </div>

                <div className="product-details">
                    <h3 className="brand-name">{product.brand}</h3>
                    <h4 className="product-name">{product.name}</h4>
                    <div className="price-row">
                        <span className="price">Rs. {product.price}</span>
                        <span className="original-price">Rs. {product.originalPrice}</span>
                        <span className="discount">({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)</span>
                    </div>
                </div>
            </Link>
            <div className="wishlist-action">
                <button
                    className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
                    onClick={handleWishlist}
                >
                    <FaHeart /> WISHLIST
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
