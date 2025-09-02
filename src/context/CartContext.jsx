import { createContext, useState, useContext } from 'react';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart([...cart, product]);
    }
    const removeFromCart = (product) => {
        setCart(cart.filter(item => item.id !== product.id));
    }
   
    return <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>{children}</CartContext.Provider>
}

export const useCart = () => {
    const context = useContext(CartContext);
    
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
}