import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <div className="flex justify-center mb-8 text-sm md:text-base">
            <div className={`mr-4 ${step1 ? 'text-black font-bold' : 'text-gray-400'}`}>
                {step1 ? <Link to="/login">Sign In</Link> : <span>Sign In</span>}
            </div>
            <div className={`mr-4 ${step2 ? 'text-black font-bold' : 'text-gray-400'}`}>
                {step2 ? <Link to="/shipping">Shipping</Link> : <span>Shipping</span>}
            </div>
            <div className={`mr-4 ${step3 ? 'text-black font-bold' : 'text-gray-400'}`}>
                {step3 ? <Link to="/payment">Payment</Link> : <span>Payment</span>}
            </div>
            <div className={`${step4 ? 'text-black font-bold' : 'text-gray-400'}`}>
                {step4 ? <Link to="/placeorder">Place Order</Link> : <span>Place Order</span>}
            </div>
        </div>
    );
};

export default CheckoutSteps;
