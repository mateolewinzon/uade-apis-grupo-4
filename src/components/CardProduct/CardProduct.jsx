import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CardProduct.css";

export const CardProduct = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleViewProduct = () => {
    console.log('Navigating to product:', product.id);
    console.log('Product object:', product);
    console.log('Product ID type:', typeof product.id);
    navigate(`/producto/${product.id}`);
  };

  return (
    <div key={product.id} className="product-card-v2">
      <div className="product-image-v2">
        <img 
          src={product.image || "/placeholder.svg"} 
          alt={product.name}
          onClick={handleViewProduct}
          style={{ cursor: 'pointer' }}
        />
        <div className="product-badge-v2">{product.badge}</div>
        <div className="product-actions-v2">
          <button className="action-btn-v2">❤️</button>
          <button className="action-btn-v2" onClick={handleViewProduct}>👁️</button>
        </div>
      </div>

      <div className="product-content-v2">
        <div className="product-rating-v2">
          <div className="stars-v2">
            {"★".repeat(Math.floor(product.rating))}
            {"☆".repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="rating-text-v2">{product.reviews} reseñas</span>
        </div>

        <h3 
          className="product-name-v2"
          onClick={handleViewProduct}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h3>

        <div className="product-pricing-v2">
          <span className="current-price-v2">{product.price}</span>
          {product.originalPrice && <span className="original-price-v2">{product.originalPrice}</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button 
            className="add-to-cart-v2" 
            onClick={() => addToCart(product)}
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};