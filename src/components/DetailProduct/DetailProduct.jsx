import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import "./DetailProduct.css";

export const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/productos?id=${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        return response.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setProduct(data[0]);
        } else {
          throw new Error('Producto no encontrado');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (product.stock > 0) {
      addToCart(product);
      // Opcional: mostrar mensaje de éxito
      alert('Producto agregado al carrito');
    }
  };

  if (loading) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe o ha sido eliminado.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="detail-container">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={product.image || "/placeholder.svg"} 
              alt={product.name}
              className="product-image-large"
            />
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-badge">{product.badge}</div>
          </div>

          <div className="product-rating">
            <div className="stars">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="rating-text">{product.rating} ({product.reviews} reseñas)</span>
          </div>

          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-details">
            <div className="detail-item">
              <span className="detail-label">Categoría:</span>
              <span className="detail-value">{product.category}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Vendedor:</span>
              <span className="detail-value">{product.seller.username}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Stock disponible:</span>
              <span className={`detail-value ${product.stock === 0 ? 'out-of-stock' : 'in-stock'}`}>
                {product.stock === 0 ? 'Sin stock' : `${product.stock} unidades`}
              </span>
            </div>
          </div>

          <div className="product-pricing">
            <span className="current-price">{product.price}</span>
            {product.originalPrice && (
              <span className="original-price">{product.originalPrice}</span>
            )}
          </div>

          <div className="product-actions">
            {product.stock > 0 ? (
              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                {isAuthenticated ? 'Agregar al Carrito' : 'Iniciar Sesión para Comprar'}
              </button>
            ) : (
              <div className="out-of-stock-message">
                <p>❌ Producto sin stock</p>
                <p>No se puede agregar al carrito en este momento</p>
              </div>
            )}
            
            <button 
              className="back-to-products"
              onClick={() => navigate('/')}
            >
              Volver al Catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
