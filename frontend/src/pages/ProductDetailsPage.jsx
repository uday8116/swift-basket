import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingBag, FaHeart } from 'react-icons/fa';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './ProductDetailsPage.css';

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const { addToWishlist, isInWishlist } = useContext(WishlistContext);
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/products/${id}`);
                const data = await response.json();
                setProduct({
                    ...data,
                    // Mock additional data not in DB schema yet for UI completeness
                    discount: data.originalPrice ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100) : 0,
                    images: (data.images && data.images.length > 0) ? data.images : [data.image],
                    sizes: ['S', 'M', 'L', 'XL'] // Mock sizes
                });
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div className="container">Loading...</div>;



    return (
        <div className="product-details-page container">
            <div className="pd-breadcrumbs">
                Home / Clothing / Men's T-Shirts / {product.name}
            </div>

            <div className="pd-layout">
                <div className="pd-gallery">
                    {product.images.map((img, idx) => (
                        <div key={idx} className="pd-image-container">
                            <img src={img} alt={`View ${idx}`} />
                        </div>
                    ))}
                </div>

                <div className="pd-info">
                    <h1 className="pd-brand">{product.brand}</h1>
                    <h2 className="pd-name">{product.name}</h2>

                    <div className="pd-rating-box">
                        {product.rating} <FaStar className="pd-star" /> | {product.numReviews} Ratings
                    </div>

                    <hr className="pd-divider" />

                    <div className="pd-price-row">
                        <span className="pd-price">Rs. {product.price}</span>
                        <span className="pd-original-price">Rs. {product.originalPrice}</span>
                        <span className="pd-discount">({product.discount}% OFF)</span>
                    </div>
                    <p className="pd-tax">inclusive of all taxes</p>

                    <div className="pd-sizes">
                        <h4>SELECT SIZE</h4>
                        <div className="size-buttons">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pd-actions">
                        <button className="pd-btn pd-add-bag" onClick={() => {
                            if (!selectedSize) { alert('Please select a size'); return; }
                            addToCart(product, selectedSize);
                            alert('Added to Bag');
                        }}>
                            <FaShoppingBag /> ADD TO BAG
                        </button>
                        <button className="pd-btn pd-wishlist" onClick={() => {
                            addToWishlist(product);
                            alert(isInWishlist(product._id) ? 'Already in Wishlist' : 'Added to Wishlist!');
                        }}>
                            <FaHeart /> WISHLIST
                        </button>
                    </div>

                    <hr className="pd-divider" />

                    <div className="pd-description">
                        <h4>PRODUCT DETAILS</h4>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
