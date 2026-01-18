import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import PageTransition from '../components/PageTransition';
import './HomePage.css';

const HomePage = () => {
    const [data, setData] = useState({ categories: [], brands: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/products/filters');
                const result = await response.json();
                setData(result);
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
                    <div className="brand-grid grid grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {loading ? <p>Loading brands...</p> : data.brands.map((brand) => (
                            <Link to={`/products?brand=${brand}`} key={brand} className="brand-card card" style={{ textDecoration: 'none' }}>
                                <div className="brand-img-placeholder">{brand}</div>
                                <div className="brand-info">
                                    <h4 style={{ color: '#282c3f', fontWeight: '700', marginTop: '10px' }}>{brand}</h4>
                                    <p style={{ color: '#ff3f6c', fontSize: '12px', fontWeight: '700' }}>UP TO 60% OFF</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="container section">
                    <h2 className="section-title">CATEGORIES TO BAG</h2>
                    <div className="category-grid grid grid-cols-4 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
                        {loading ? <p>Loading categories...</p> : data.categories.map((cat) => (
                            <Link to={`/products?category=${cat}`} key={cat} className="category-card card" style={{ textDecoration: 'none' }}>
                                <div className="cat-img-placeholder">{cat[0]}</div>
                                <p style={{ color: '#282c3f', fontWeight: '600', marginTop: '10px' }}>{cat}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default HomePage;
