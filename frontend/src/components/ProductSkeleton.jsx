import React from 'react';
import './ProductSkeleton.css';

const ProductSkeleton = () => {
    return (
        <div className="product-card skeleton-card">
            <div className="skeleton-image"></div>
            <div className="skeleton-text title"></div>
            <div className="skeleton-text price"></div>
            <div className="skeleton-text rating"></div>
        </div>
    );
};

export default ProductSkeleton;
