import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaUser, FaTruck, FaCreditCard, FaClipboardList } from 'react-icons/fa';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    const steps = [
        { num: 1, label: 'Sign In', icon: FaUser, active: step1, path: '/login' },
        { num: 2, label: 'Shipping', icon: FaTruck, active: step2, path: '/shipping' },
        { num: 3, label: 'Payment', icon: FaCreditCard, active: step3, path: '/payment' },
        { num: 4, label: 'Place Order', icon: FaClipboardList, active: step4, path: '/placeorder' },
    ];

    const getStepStatus = (stepNum) => {
        if (step4 && stepNum < 4) return 'completed';
        if (step3 && stepNum < 3) return 'completed';
        if (step2 && stepNum < 2) return 'completed';

        if (stepNum === 4 && step4) return 'active';
        if (stepNum === 3 && step3 && !step4) return 'active';
        if (stepNum === 2 && step2 && !step3) return 'active';
        if (stepNum === 1 && step1 && !step2) return 'active';

        return 'pending';
    };

    return (
        <div className="checkout-steps">
            {steps.map((step, index) => {
                const status = getStepStatus(step.num);
                const Icon = step.icon;

                return (
                    <React.Fragment key={step.num}>
                        <div className={`checkout-step ${status}`}>
                            <div className="step-content">
                                <div className="step-number">
                                    {status === 'completed' ? (
                                        <FaCheck />
                                    ) : (
                                        <Icon />
                                    )}
                                </div>
                                {step.active ? (
                                    <Link to={step.path} className="step-label">
                                        {step.label}
                                    </Link>
                                ) : (
                                    <span className="step-label">{step.label}</span>
                                )}
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`step-connector ${status === 'completed' ? 'active' : ''}`} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default CheckoutSteps;
