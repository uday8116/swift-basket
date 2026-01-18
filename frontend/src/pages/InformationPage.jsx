import React from 'react';
import { useParams } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const contentMap = {
    'contact': {
        title: 'Contact Us',
        content: (
            <div>
                <p>We'd love to hear from you!</p>
                <p><strong>Email:</strong> support@swiftbasket.com</p>
                <p><strong>Phone:</strong> +91 12345 67890</p>
                <p><strong>Address:</strong> 123, E-commerce Lane, Tech City, Bangalore, India</p>
            </div>
        )
    },
    'faq': {
        title: 'Frequently Asked Questions',
        content: (
            <div>
                <details className="mb-4">
                    <summary className="font-bold cursor-pointer">How long does shipping take?</summary>
                    <p className="mt-2">Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days.</p>
                </details>
                <details className="mb-4">
                    <summary className="font-bold cursor-pointer">What is your return policy?</summary>
                    <p className="mt-2">You can return any item within 30 days of purchase if it is unused and in its original packaging.</p>
                </details>
                <details className="mb-4">
                    <summary className="font-bold cursor-pointer">How can I track my order?</summary>
                    <p className="mt-2">Go to the "Track Orders" link in the footer or visit your profile to see your order status.</p>
                </details>
            </div>
        )
    },
    'terms': {
        title: 'Terms & Conditions',
        content: (
            <div>
                <p>Welcome to Swift Basket. By using our website, you agree to the following terms...</p>
                <p className="mt-2">(Placeholder text for legal terms and conditions)</p>
            </div>
        )
    },
    'privacy': {
        title: 'Privacy Policy',
        content: (
            <div>
                <p>Your privacy is important to us. This policy outlines how we collect and use your data...</p>
                <p className="mt-2">(Placeholder text for privacy policy)</p>
            </div>
        )
    },
    'shipping': {
        title: 'Shipping Policy',
        content: (
            <div>
                <p>We ship to all major cities in India.</p>
                <ul className="list-disc pl-5 mt-2">
                    <li>Free shipping on orders above Rs. 999</li>
                    <li>Rs. 99 flat rate for orders below Rs. 999</li>
                    <li>Orders are processed within 24 hours</li>
                </ul>
            </div>
        )
    },
    'cancellation': {
        title: 'Cancellation & Returns',
        content: (
            <div>
                <p><strong>Cancellation:</strong> You can cancel your order any time before it is shipped.</p>
                <p className="mt-2"><strong>Returns:</strong> Easy returns within 30 days. No questions asked.</p>
            </div>
        )
    }
};

const InformationPage = () => {
    const { type } = useParams();
    const data = contentMap[type] || { title: 'Page Not Found', content: <p>The page you are looking for does not exist.</p> };

    return (
        <PageTransition>
            <div className="container mx-auto py-10 px-4 min-h-[60vh]">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">{data.title}</h1>
                <div className="prose max-w-none text-gray-600">
                    {data.content}
                </div>
            </div>
        </PageTransition>
    );
};

export default InformationPage;
