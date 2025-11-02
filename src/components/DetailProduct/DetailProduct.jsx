import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {  
  ShoppingCart, 
  X, 
  Check, 
  AlertTriangle, 
  Truck, 
  CheckCircle, 
  ArrowLeft 
} from 'lucide-react';
import api from '../../services/api';
import { mapProductFromAPI, formatRating } from '../../services/productMapper';
import "./DetailProduct.css";

export const DetailProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  console.log('DetailProduct component rendered with id:', id);
  console.log('ID type:', typeof id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        
        // Fetch product data from API
        let productData = null;
        try {
          const apiProduct = await api.getProduct(id);
          console.log('Product data received from API:', apiProduct);
          // Map API product to component format
          productData = mapProductFromAPI(apiProduct);
          console.log('Mapped product data:', productData);
          setProduct(productData);
          
          // Si las reviews vienen en la respuesta del producto, usarlas directamente
          if (productData.reviewsData && productData.reviewsData.length > 0) {
            console.log('Using reviews from product response:', productData.reviewsData);
            setReviews(productData.reviewsData);
          } else {
            // Si no vienen reviews, intentar obtenerlas por separado (fallback)
            try {
              const reviewsData = await api.getProductReviews(id);
              console.log('Reviews data received from separate call:', reviewsData);
              setReviews(reviewsData);
            } catch (reviewError) {
              console.log('Reviews not available:', reviewError);
              setReviews([]);
            }
          }
        } catch (serverError) {
          console.error('Error fetching product:', serverError);
          if (serverError.status === 404) {
            setError('Producto no encontrado');
          } else {
            setError('Error al cargar el producto: ' + serverError.message);
          }
          return;
        }

        // Fetch related products (products from same category)
        if (productData && productData.categories && productData.categories.length > 0) {
          try {
            const allProducts = await api.getProducts();
            const mappedProducts = allProducts.map(mapProductFromAPI);
            const categoryName = productData.categories[0].nombre || productData.category;
            
            const related = mappedProducts
              .filter(p => {
                if (p.id === parseInt(id)) return false;
                if (p.category === categoryName) return true;
                return p.categories && p.categories.some(cat => {
                  const catName = typeof cat === 'object' ? cat.nombre : cat;
                  return catName === categoryName;
                });
              })
              .slice(0, 4);
            
            setRelatedProducts(related);
          } catch (relatedError) {
            console.log('Related products not available:', relatedError);
            setRelatedProducts([]);
          }
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleAddToCart = () => {
    console.log('Add to cart clicked for product:', product);
    if (!product) return;
    addToCart(product);
    setToast({ visible: true, message: `${product.name} se agregó al carrito`, type: 'success' });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 2500);
  };

  const handleBackToProducts = () => {
    navigate('/');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting new review:', newReview);
      const reviewData = {
        productoId: parseInt(id),
        valoracion: newReview.rating,
        comentario: newReview.comment
      };
      
      await api.createReview(reviewData);
      
      // Refresh product data (incluyendo reviews) en lugar de solo reviews
      try {
        const apiProduct = await api.getProduct(id);
        const updatedProduct = mapProductFromAPI(apiProduct);
        setProduct(updatedProduct);
        
        // Si las reviews vienen en la respuesta, actualizarlas
        if (updatedProduct.reviewsData && updatedProduct.reviewsData.length > 0) {
          setReviews(updatedProduct.reviewsData);
        } else {
          // Fallback: obtener reviews por separado
          const reviewsData = await api.getProductReviews(id);
          setReviews(reviewsData);
        }
      } catch (refreshError) {
        console.error('Error refreshing product:', refreshError);
        // Si falla, intentar solo obtener reviews
        try {
          const reviewsData = await api.getProductReviews(id);
          setReviews(reviewsData);
        } catch (reviewError) {
          console.error('Error refreshing reviews:', reviewError);
        }
      }
      
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: '' });
      setToast({ visible: true, message: 'Reseña agregada exitosamente', type: 'success' });
      setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 2500);
    } catch (error) {
      console.error('Error submitting review:', error);
      setToast({ visible: true, message: 'Error al agregar la reseña: ' + (error.message || 'Error desconocido'), type: 'error' });
      setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner"></div>
        <p>Cargando producto...</p>
        <p>ID: {id}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-error">
        <h2>Error</h2>
        <p>{error}</p>
        <p>ID del producto: {id}</p>
        <button onClick={handleBackToProducts} className="back-btn">
          Volver a Productos
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-error">
        <h2>Producto no encontrado</h2>
        <p>El producto que buscas no existe.</p>
        <p>ID del producto: {id}</p>
        <button onClick={handleBackToProducts} className="back-btn">
          Volver a Productos
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="detail-container">
        {toast.visible && (
          <div className={`toast ${toast.type}`}>
            <div className="toast-icon">
              <CheckCircle size={20} color="green" />
            </div>
            <div className="toast-content">
              <strong>Agregado al carrito</strong>
              <span>{toast.message}</span>
            </div>
            <button className="toast-close" onClick={() => setToast({ visible: false, message: "", type: "success" })}>
              <X size={16} />
            </button>
          </div>
        )}
        <button onClick={handleBackToProducts} className="back-btn">
          <ArrowLeft size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Volver a Productos
        </button>
        
        {/* Main Product Section */}
        <div className="detail-main">
          <div className="detail-left">
            {/* Image Gallery */}
            <div className="image-gallery">
              <div className="main-image">
                <img 
                  src={product.gallery ? product.gallery[selectedImage] : product.image} 
                  alt={product.name}
                  className="product-detail-image"
                />
                <div className="product-badge">{product.badge}</div>
              </div>
              
              {product.gallery && product.gallery.length > 1 && (
                <div className="thumbnail-gallery">
                  {product.gallery.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="detail-right">
            {/* Product Info */}
            <div className="product-header">
              <div className="product-rating">
                <div className="stars">
                  {
                    product.rating && ( 
                        <>
                          {"★".repeat(Math.floor(product.rating))}
                          {"☆".repeat(5 - Math.floor(product.rating))}
                        </>
                      ) || (
                        <>
                          {"No hay calificaciones aún"}
                      </>
                    )
                  }
                  
                </div>
                <span className="rating-text">{formatRating(product.rating)}/5 ({product.reviews} reseñas)</span>
              </div>

              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-category">
                <span className="category-badge">{product.category}</span>
              </div>
            </div>

            {/* Pricing */}
            <div className="product-pricing">
              <span className="current-price">{product.price}</span>
              {product.originalPrice && (
                <span className="original-price">{product.originalPrice}</span>
              )}
            </div>

            {/* Add to Cart Button */}
            <div style={{ margin: '2rem 0' }}>
              <button className='add-to-cart-btn'
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                //</div>style={{
                  //width: '100%',
                  //padding: '1.5rem',
                 // fontSize: '1.3rem',
                  //fontWeight: 'bold',
                 // backgroundColor: '#4A7C2F',
                  //color: 'white',
                  //border: 'none',
                  //borderRadius: '10px',
                 // cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  //opacity: product.stock === 0 ? 0.6 : 1,
                  //boxShadow: '0 4px 15px rgba(74, 124, 47, 0.3)',
                  //transition: 'all 0.3s ease'
                //}}
                onMouseEnter={(e) => {
                  if (product.stock > 0) {
                    e.target.style.backgroundColor = '#3a6b25';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.stock > 0) {
                    e.target.style.backgroundColor = '#4A7C2F';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {product.stock === 0 ? (
                  <>
                    <X size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    Sin Stock
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    AGREGAR AL CARRITO
                  </>
                )}
              </button>
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.stock > 10 ? (
                <span className="in-stock">
                  <Check size={16} style={{ marginRight: '4px', color: 'green', verticalAlign: 'middle' }} />
                  En stock ({product.stock} disponibles)
                </span>
              ) : product.stock > 0 ? (
                <span className="low-stock">
                  <AlertTriangle size={16} style={{ marginRight: '4px', color: 'orange', verticalAlign: 'middle' }} />
                  Pocas unidades ({product.stock} disponibles)
                </span>
              ) : (
                <span className="out-of-stock">
                  <X size={16} style={{ marginRight: '4px', color: 'red', verticalAlign: 'middle' }} />
                  Sin stock
                </span>
              )}
            </div>

            {/* Shipping Info */}
            {product.shipping && (
              <div className="shipping-info">
                <h4>Envío</h4>
                <p>
                  <Truck size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  {product.shipping.freeShipping ? 'Envío gratis' : 'Envío con costo'} - 
                  {product.shipping.estimatedDays}
                </p>
                {product.shipping.methods && (
                  <div className="shipping-methods">
                    {product.shipping.methods.map((method, index) => (
                      <span key={index} className="shipping-method">{method}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payment Methods */}
            {product.paymentMethods && (
              <div className="payment-methods">
                <h4>Métodos de pago</h4>
                <div className="payment-list">
                  {product.paymentMethods.map((method, index) => (
                    <span key={index} className="payment-method">{method}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Info */}
            {product.seller && (
              <div className="seller-info">
                <h4>Vendedor</h4>
                <div className="seller-details">
                  <div className="seller-avatar">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.seller.username}`}
                      alt={product.seller.username}
                    />
                  </div>
                  <div className="seller-info-text">
                    <span className="seller-name">{product.seller.username}</span>
                    {product.seller.reputation && (
                      <div className="seller-stats">
                        <span className="seller-reputation">⭐ {product.seller.reputation}/5</span>
                        <span className="seller-sales">{product.seller.totalSales} ventas</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        {product.detailedDescription && (
          <div className="detail-description">
            <h3>Descripción del producto</h3>
            <p>{product.detailedDescription}</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="reviews-header">
            <h3>Reseñas y calificaciones</h3>
            <div className="reviews-summary">
              <div className="average-rating">
                <span className="rating-number">{formatRating(product.rating)}</span>
                <div className="stars">
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="total-reviews">({product.reviews} reseñas)</span>
              </div>
            </div>
            <button 
              className="add-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Escribir reseña
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="review-form">
              <h4>Escribe tu reseña</h4>
              <form onSubmit={handleSubmitReview}>
                <div className="rating-input">
                  <label>Calificación:</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= newReview.rating ? 'active' : ''}`}
                        onClick={() => setNewReview({...newReview, rating: star})}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="comment-input">
                  <label>Comentario:</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Comparte tu experiencia con este producto..."
                    rows="4"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-review-btn">Enviar reseña</button>
                  <button type="button" onClick={() => setShowReviewForm(false)} className="cancel-btn">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 && (
            <div className="reviews-list">
              {reviews.map((review) => {
                // Mapear campos del API a nombres del componente
                const userName = review.usuarioNombre || review.userName || 'Usuario';
                const rating = review.valoracion || review.rating || 0;
                const comment = review.comentario || review.comment || '';
                const date = review.fechaCreacion || review.date || new Date().toISOString();
                
                return (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`}
                          alt={userName}
                          className="reviewer-avatar"
                        />
                        <div className="reviewer-details">
                          <span className="reviewer-name">{userName}</span>
                          <div className="review-rating">
                            {"★".repeat(rating)}
                            {"☆".repeat(5 - rating)}
                          </div>
                        </div>
                      </div>
                      <div className="review-meta">
                        <span className="review-date">{formatDate(date)}</span>
                        {review.verified && <span className="verified-badge">✓ Verificado</span>}
                      </div>
                    </div>
                    <p className="review-comment">{comment}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h3>Productos relacionados</h3>
            <div className="related-grid">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="related-product-card">
                  <img 
                    src={relatedProduct.image} 
                    alt={relatedProduct.name}
                    onClick={() => navigate(`/producto/${relatedProduct.id}`)}
                  />
                  <h4 onClick={() => navigate(`/producto/${relatedProduct.id}`)}>
                    {relatedProduct.name}
                  </h4>
                  <div className="related-price">{relatedProduct.price}</div>
                  <div className="related-rating">
                    {
                      relatedProduct.rating && (
                        <>
                        {"★".repeat(Math.floor(relatedProduct.rating))}
                        {"☆".repeat(5 - Math.floor(relatedProduct.rating))}
                        <span>({relatedProduct.reviews})</span>
                        </>
                      ) || (
                        <>
                          <p style={{ color: 'gray' }}>No hay calificaciones aún</p>
                        </>
                      )
                    } 
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};