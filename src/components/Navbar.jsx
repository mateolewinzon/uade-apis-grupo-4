import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cart } = useCart();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <h1>Mi Tienda</h1>
                </div>
                <div className="navbar-cart">
                    <div className="cart-icon">
                        🛒
                        {cart.length > 0 && (
                            <span className="cart-count">{cart.length}</span>
                        )}
                    </div>
                    <div className="cart-info">
                        <span className="cart-items">
                            {cart.length === 0 
                                ? 'Carrito vacío' 
                                : `${cart.length} item${cart.length !== 1 ? 's' : ''} en el carrito`
                            }
                        </span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
