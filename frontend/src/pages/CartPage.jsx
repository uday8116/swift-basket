import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaTrash } from 'react-icons/fa';
import PageTransition from '../components/PageTransition';
import toast from 'react-hot-toast';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalOriginal = cartItems.reduce((acc, item) => acc + item.originalPrice * item.qty, 0);

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
        } else {
            navigate('/shipping');
        }
    };

    return (
        <PageTransition>
            <div className="cart-page container">
                <div className="cart-header">
                    <h2>Bag ({cartItems.length} items)</h2>
                </div>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <img src="https://constant.myntassets.com/checkout/assets/img/empty-bag.png" alt="Empty Bag" className="empty-cart-img" />
                        <h3>Hey, it feels so light!</h3>
                        <p>There is nothing in your bag. Let's add some items.</p>
                        <Link to="/products" className="btn btn-primary">ADD ITEMS FROM WISHLIST</Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={`${item._id}-${item.size}`} className="cart-item">
                                    <div className="cart-item-img">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <h4 className="cart-item-brand">{item.brand}</h4>
                                        <h5 className="cart-item-name">{item.name}</h5>
                                        <div className="cart-item-meta">
                                            <span>Size: {item.size}</span>
                                            <span>Qty: {item.qty}</span>
                                        </div>
                                        <div className="cart-item-price">
                                            <span className="price">Rs. {item.price}</span>
                                            <span className="original-price">Rs. {item.originalPrice}</span>
                                            <span className="discount">{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF</span>
                                        </div>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => {
                                            removeFromCart(item._id, item.size);
                                            toast.success('Item removed');
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-price-details">
                            <h4>PRICE DETAILS ({cartItems.length} Items)</h4>
                            <div className="price-row">
                                <span>Total MRP</span>
                                <span>Rs. {totalOriginal}</span>
                            </div>
                            <div className="price-row">
                                <span>Discount on MRP</span>
                                <span className="text-success">-Rs. {totalOriginal - total}</span>
                            </div>
                            <div className="price-row total-row">
                                <span>Total Amount</span>
                                <span>Rs. {total}</span>
                            </div>
                            <button
                                className="btn btn-primary place-order-btn"
                                onClick={handleCheckout}
                            >
                                PLACE ORDER
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </PageTransition>
    );
};

export default CartPage;
