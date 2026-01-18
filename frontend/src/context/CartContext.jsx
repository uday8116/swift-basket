import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const items = localStorage.getItem('cartItems');
        return items ? JSON.parse(items) : [];
    });
    const [shippingAddress, setShippingAddress] = useState(() => {
        const shipping = localStorage.getItem('shippingAddress');
        return shipping ? JSON.parse(shipping) : {};
    });
    const [paymentMethod, setPaymentMethod] = useState(() => {
        const payment = localStorage.getItem('paymentMethod');
        return payment ? JSON.parse(payment) : 'PayPal';
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const saveShippingAddress = (data) => {
        setShippingAddress(data);
        localStorage.setItem('shippingAddress', JSON.stringify(data));
    };

    const savePaymentMethod = (data) => {
        setPaymentMethod(data);
        localStorage.setItem('paymentMethod', JSON.stringify(data));
    };

    const addToCart = (product, size) => {
        const existItem = cartItems.find((x) => x._id === product._id && x.size === size);

        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x._id === existItem._id && x.size === size
                        ? { ...x, qty: x.qty + 1 }
                        : x
                )
            );
        } else {
            setCartItems([...cartItems, { ...product, size, qty: 1 }]);
        }
    };

    const removeFromCart = (id, size) => {
        setCartItems(cartItems.filter((x) => !(x._id === id && x.size === size)));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            shippingAddress,
            saveShippingAddress,
            paymentMethod,
            savePaymentMethod,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
