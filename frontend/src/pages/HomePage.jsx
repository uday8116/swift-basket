import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import './HomePage.css';

const HomePage = () => {
    const [homeContent, setHomeContent] = useState({ brands: [], categories: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch home content (images for brands/categories) - this is what admin manages
                const contentResponse = await fetch('http://localhost:5001/api/home-content');
                const contentData = await contentResponse.json();
                setHomeContent({
                    brands: contentData.brands || [],
                    categories: contentData.categories || []
                });
            } catch (error) {
                console.error("Error fetching home data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <PageTransition>
            <div className="home-page animate-fade-in">
                <div className="hero-banner">
                    <div className="container">
                        <div className="hero-content">
                            <h1>WEAR THE TREND</h1>
                            <p>MIN 50% OFF</p>
                            <Link to="/products" className="btn btn-primary" style={{ display: 'inline-block', padding: '12px 30px', background: 'white', color: '#ff3f6c', fontWeight: 'bold', borderRadius: '4px', textDecoration: 'none' }}>
                                SHOP NOW
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container section">
                    <h2 className="section-title">MEDAL WORTHY BRANDS TO BAG</h2>
                    <div className="brand-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {loading ? (
                            <p>Loading brands...</p>
                        ) : homeContent.brands.length === 0 ? (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#535766' }}>
                                No brands configured yet. Admin can add brands in the dashboard.
                            </p>
                        ) : (
                            homeContent.brands.map((brand) => (
                                <Link to={`/products?brand=${brand.name}`} key={brand._id} className="brand-card card" style={{ textDecoration: 'none' }}>
                                    <div className="brand-img-placeholder">
                                        {brand.image ? (
                                            <img src={brand.image} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            brand.name
                                        )}
                                    </div>
                                    <div className="brand-info">
                                        <h4 style={{ color: '#282c3f', fontWeight: '700', marginTop: '10px' }}>{brand.name}</h4>
                                        <p style={{ color: '#ff3f6c', fontSize: '12px', fontWeight: '700' }}>
                                            {brand.discount}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="container section">
                    <h2 className="section-title">SHOP BY CATEGORY</h2>
                    <div className="category-grid-new">
                        {loading ? (
                            <p>Loading categories...</p>
                        ) : homeContent.categories.length === 0 ? (
                            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#535766' }}>
                                No categories configured yet. Admin can add categories in the dashboard.
                            </p>
                        ) : (
                            homeContent.categories.map((cat) => (
                                <Link to={`/products?category=${cat.name}`} key={cat._id} className="category-card-new">
                                    <div className="category-image-wrapper">
                                        {cat.image ? (
                                            <img src={cat.image} alt={cat.name} />
                                        ) : (
                                            <div className="category-placeholder">{cat.name[0]}</div>
                                        )}
                                        <div className="category-overlay">
                                            <h3 className="category-name">{cat.name}</h3>
                                            <p className="category-discount">{cat.discount}</p>
                                            <span className="shop-now-btn">Shop Now</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default HomePage;
