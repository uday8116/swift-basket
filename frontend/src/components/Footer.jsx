import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Footer.css';

const Footer = () => {
    const handleAppClick = () => {
        toast.success("Mobile App coming soon!", {
            icon: '📱',
            style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
            },
        });
    };

    return (
        <footer className="footer">
            <div className="container grid grid-cols-4">
                <div className="footer-col">
                    <h3>ONLINE SHOPPING</h3>
                    <ul>
                        <li><Link to="/products?category=Men">Men</Link></li>
                        <li><Link to="/products?category=Women">Women</Link></li>
                        <li><Link to="/products?category=Kids">Kids</Link></li>
                        <li><Link to="/products?category=Home">Home & Living</Link></li>
                        <li><Link to="/products?category=Beauty">Beauty</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h3>CUSTOMER POLICIES</h3>
                    <ul>
                        <li><Link to="/info/contact">Contact Us</Link></li>
                        <li><Link to="/info/faq">FAQ</Link></li>
                        <li><Link to="/info/terms">T&C</Link></li>
                        <li><Link to="/info/terms">Terms Of Use</Link></li>
                        <li><Link to="/info/faq">Track Orders</Link></li>
                        <li><Link to="/info/shipping">Shipping</Link></li>
                        <li><Link to="/info/cancellation">Cancellation</Link></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h3>EXPERIENCE MOBILE APP</h3>
                    <div className="app-links">
                        <button onClick={handleAppClick} className="btn-app">Google Play</button>
                        <button onClick={handleAppClick} className="btn-app">App Store</button>
                    </div>
                </div>
                <div className="footer-col">
                    <h3>KEEP IN TOUCH</h3>
                    <p>100% ORIGINAL guarantee for all products at swift-basket.com</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
