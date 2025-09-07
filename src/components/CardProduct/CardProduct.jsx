import { useCart } from "../../context/CartContext";
import "./CardProduct.css";

export const CardProduct = ({ product }) => {

  const {addToCart} = useCart();

  return (
    <div key={product.id} className="product-card">
              <div className="product-image">
                <img src={product.image || "/placeholder.svg"} alt={product.name} />
                <div className="product-badge">{product.badge}</div>
                <div className="product-actions">
                  <button className="action-btn">❤️</button>
                  <button className="action-btn">👁️</button>
                </div>
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

                <div className="product-pricing">
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && <span className="original-price">{product.originalPrice}</span>}
                </div>

                <button 
                  className="add-to-cart" 
                  onClick={() => addToCart(product)}
                >Agregar al Carrito</button>
              </div>
    </div>
  )
}
