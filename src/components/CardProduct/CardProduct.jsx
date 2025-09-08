import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CardProduct.css";

export const CardProduct = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Evita que se ejecute el click del card
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (product.stock > 0) {
      addToCart(product);
      alert('Producto agregado al carrito');
    }
  };

  const handleCardClick = () => {
    navigate(`/producto/${product.id}`);
  };

  return (
    <div 
      key={product.id} 
      className="product-card"
      onClick={handleCardClick}
    >
      <div className="product-image">
        <img src={product.image || "/placeholder.svg"} alt={product.name} />
        <div className="product-badge">{product.badge}</div>
        <div className="product-actions">
          <button className="action-btn">❤️</button>
          <button className="action-btn">👁️</button>
        </div>
        {product.stock === 0 && (
          <div className="out-of-stock-overlay">
            <span>Sin Stock</span>
          </div>
        )}
      </div>

      <div className="product-content">
        <div className="product-rating">
          <div className="stars">
            {"★".repeat(Math.floor(product.rating))}
            {"☆".repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="rating-text">{product.reviews} reseñas</span>
        </div>

        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-category">
          <span className="category-tag">{product.category}</span>
        </div>

        <div className="product-pricing">
          <span className="current-price">{product.price}</span>
          {product.originalPrice && <span className="original-price">{product.originalPrice}</span>}
        </div>

        <div className="stock-info">
          {product.stock > 0 ? (
            <span className="stock-available">Stock: {product.stock}</span>
          ) : (
            <span className="stock-unavailable">Sin stock</span>
          )}
        </div>

        <button 
          className={`add-to-cart ${product.stock === 0 ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {product.stock > 0 
            ? (isAuthenticated ? 'Agregar al Carrito' : 'Iniciar Sesión para Comprar')
            : 'Sin Stock'
          }
        </button>
      </div>
    </div>
  )
}
