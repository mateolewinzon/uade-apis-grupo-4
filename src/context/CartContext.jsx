import { createContext, useState, useContext } from 'react';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);

    const addToCart = (product) => {
        setCart([...cart, product]);
        setIsCartVisible(true);
    }
    const removeFromCart = (product) => {
        setCart(cart.filter(item => item.id !== product.id));
    }

    const toggleCart = () => {
        setIsCartVisible(!isCartVisible);
    }

    const hideCart = () => {
        setIsCartVisible(false);
    }
   
    return <CartContext.Provider value={{ 
        cart, 
        setCart, 
        addToCart, 
        removeFromCart,
        isCartVisible,
        setIsCartVisible,
        toggleCart,
        hideCart
    }}>{children}</CartContext.Provider>
}

export const useCart = () => {
    const context = useContext(CartContext);
    
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartProvider');
    }
    return context;
}