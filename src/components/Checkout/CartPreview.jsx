import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './CartPreview.css';

const CartPreview = () => {
  const { cart, removeFromCart, addToCart, setCart, isCartVisible, hideCart } = useCart();
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [postalCode, setPostalCode] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState({ type: '', text: '' });

  const removeOneUnit = (productToRemove) => {
    const cartCopy = [...cart];
    const productIndex = cartCopy.findIndex(item => item.id === productToRemove.id);
    if (productIndex !== -1) {
      cartCopy.splice(productIndex, 1);
      setCart(cartCopy);
    }
  };

  const handleCheckout = async () => {
    // Verificar que el usuario esté autenticado
    if (!isAuthenticated() || !user) {
      setCheckoutMessage({ 
        type: 'error', 
        text: 'Debes iniciar sesión para realizar una compra' 
      });
      setTimeout(() => {
        setCheckoutMessage({ type: '', text: '' });
        hideCart();
        navigate('/login');
      }, 2000);
      return;
    }

    // Verificar que el carrito no esté vacío
    if (cart.length === 0) {
      setCheckoutMessage({ 
        type: 'error', 
        text: 'El carrito está vacío' 
      });
      setTimeout(() => setCheckoutMessage({ type: '', text: '' }), 3000);
      return;
    }

    try {
      setIsProcessing(true);
      setCheckoutMessage({ type: '', text: '' });

      // Agrupar productos del carrito para obtener cantidades
      const groupedCart = cart.reduce((acc, product) => {
        const existingProduct = acc.find(item => item.id === product.id);
        if (existingProduct) {
          existingProduct.quantity += 1;
        } else {
          acc.push({ ...product, quantity: 1 });
        }
        return acc;
      }, []);

      // Crear un array de productoIds con repeticiones según la cantidad
      const productIds = [];
      groupedCart.forEach(item => {
        // Repetir el ID según la cantidad en el carrito
        for (let i = 0; i < item.quantity; i++) {
          productIds.push(item.id);
        }
      });

      // Obtener el ID del usuario
      let usuarioId = user.id;
      if (!usuarioId && user.email) {
        usuarioId = await getUserIdByEmail(user.email);
      }

      if (!usuarioId) {
        throw new Error('No se pudo obtener el ID del usuario');
      }

      // Crear el pedido usando el API
      const orderData = {
        usuarioId: usuarioId,
        estado: 'PENDIENTE',
        productoIds: productIds
      };

      console.log('Creating order:', orderData);
      const createdOrder = await api.createOrder(orderData);
      console.log('Order created:', createdOrder);

      // Limpiar el carrito después de crear el pedido exitosamente
      setCart([]);
      
      // Mostrar mensaje de éxito
      setCheckoutMessage({ 
        type: 'success', 
        text: '¡Pedido creado exitosamente! Redirigiendo...' 
      });

      // Cerrar el carrito y redirigir después de un momento
      setTimeout(() => {
        hideCart();
        navigate('/'); // Redirigir a home o página de confirmación
        setCheckoutMessage({ type: '', text: '' });
      }, 2000);

    } catch (error) {
      console.error('Error creating order:', error);
      let errorMessage = 'Error al crear el pedido. Por favor, intenta nuevamente.';
      
      if (error.status === 401) {
        errorMessage = 'Debes iniciar sesión para realizar una compra';
        setTimeout(() => {
          hideCart();
          navigate('/login');
        }, 2000);
      } else if (error.status === 400) {
        errorMessage = error.message || 'Datos inválidos. Verifica tu carrito.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setCheckoutMessage({ type: 'error', text: errorMessage });
      setTimeout(() => setCheckoutMessage({ type: '', text: '' }), 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función auxiliar para obtener el ID del usuario por email si no está en el objeto user
  const getUserIdByEmail = async (email) => {
    try {
      const userData = await api.getUserByEmail(email);
      return userData.id;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  const calculateInstallments = (total) => {
    const installmentAmount = (total / 6);
    return `O hasta 6 cuotas de $${formatTotalPrice(installmentAmount)}`;
  };

  const calculateShipping = () => {
    // Mock de cálculo de envío basado en código postal
    if (postalCode.length === 4) {
      const mockCost = Math.floor(Math.random() * 5000) + 1000;
      setShippingCost(mockCost);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 0;
    // Remueve el símbolo $ y espacios
    const cleanPrice = price.toString().replace(/[$\s]/g, '');
    // Remueve los puntos (son separadores de miles) y convierte a número
    return parseInt(cleanPrice.replace(/\./g, '')) || 0;
  };

  const formatTotalPrice = (price) => {
    // Formatea el número con puntos como separadores de miles
    return new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const groupedCart = cart.reduce((acc, product) => {
    const existingProduct = acc.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
      existingProduct.totalPrice = formatPrice(product.price) * existingProduct.quantity;
      if (product.originalPrice) {
        existingProduct.totalOriginalPrice = formatPrice(product.originalPrice) * existingProduct.quantity;
        existingProduct.totalDiscount = existingProduct.totalOriginalPrice - existingProduct.totalPrice;
      }
    } else {
      const totalPrice = formatPrice(product.price);
      const totalOriginalPrice = product.originalPrice ? formatPrice(product.originalPrice) : null;
      const totalDiscount = totalOriginalPrice ? totalOriginalPrice - totalPrice : 0;
      
      acc.push({
        ...product,
        quantity: 1,
        totalPrice: totalPrice,
        totalOriginalPrice: totalOriginalPrice,
        totalDiscount: totalDiscount
      });
    }
    return acc;
  }, []);

  const total = groupedCart.reduce((acc, product) => acc + product.totalPrice, 0);

  return (
    <div className="cart-preview-container" style={{ display: isCartVisible ? 'flex' : 'none' }}>
      <div className="cart-section">
        <h2 className="cart-preview-title">Carrito de compras</h2>
        {cart.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <>
            <div className="cart-preview-list">
              {groupedCart.map(product => (
                <div key={product.id} className="cart-preview-item">
                  <img 
                    src={product.image || '/placeholder.jpg'} 
                    alt={product.name} 
                    className="product-image"
                  />
                  <div className="product-details">
                    <span className="product-name">{product.name}</span>
                    <div className="unit-price">
                      <span>Precio unitario: ${formatTotalPrice(formatPrice(product.price))}</span>
                      {product.originalPrice && (
                        <span className="unit-discount">
                          <span className="original-unit-price">${formatTotalPrice(formatPrice(product.originalPrice))}</span>
                          <span className="discount-percentage">
                            {Math.round((1 - formatPrice(product.price) / formatPrice(product.originalPrice)) * 100)}% OFF
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="quantity-controls">
                                        <button 
                      className="quantity-button"
                      onClick={() => removeOneUnit(product)}
                      disabled={product.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{product.quantity}</span>
                    <button 
                      className="quantity-button"
                      onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>
                  <span className="price-info">${formatTotalPrice(product.totalPrice)}</span>
                  <button 
                    className="cart-preview-remove"
                    onClick={() => {
                      for (let i = 0; i < product.quantity; i++) {
                        removeFromCart(product);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="shipping-section">
              <h3>Calcular envío</h3>
              <div>
                <input
                  type="text"
                  className="postal-code-input"
                  placeholder="Código postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  maxLength="4"
                />
                <button 
                  className="calculate-shipping"
                  onClick={calculateShipping}
                >
                  Calcular
                </button>
              </div>
            </div>

            <div className="summary-section">
              {groupedCart.some(product => product.totalDiscount > 0) && (
                <div className="summary-row original-price-row">
                  <span>Precio original:</span>
                  <span className="strikethrough">
                    ${formatTotalPrice(groupedCart.reduce((acc, product) => 
                      acc + (product.totalOriginalPrice || product.totalPrice), 0))}
                  </span>
                </div>
              )}
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${formatTotalPrice(total)}</span>
              </div>
              {groupedCart.some(product => product.totalDiscount > 0) && (
                <div className="summary-row discount-row">
                  <span>Descuento total:</span>
                  <span className="discount-amount">
                    -${formatTotalPrice(groupedCart.reduce((acc, product) => 
                      acc + (product.totalDiscount || 0), 0))}
                  </span>
                </div>
              )}
              {shippingCost > 0 && (
                <div className="summary-row">
                  <span>Envío:</span>
                  <span>${formatTotalPrice(shippingCost)}</span>
                </div>
              )}
              <div className="summary-row total-row">
                <strong>Total:</strong>
                <strong>${formatTotalPrice(total + shippingCost)}</strong>
              </div>
              <div className="installments-info">
                {calculateInstallments(total + shippingCost)}
              </div>
              
              {/* Mensajes de checkout */}
              {checkoutMessage.text && (
                <div 
                  className={`checkout-message ${checkoutMessage.type === 'success' ? 'success' : 'error'}`}
                  style={{
                    padding: '0.75rem',
                    marginBottom: '1rem',
                    borderRadius: '4px',
                    backgroundColor: checkoutMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: checkoutMessage.type === 'success' ? '#155724' : '#721c24',
                    border: `1px solid ${checkoutMessage.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                  }}
                >
                  {checkoutMessage.text}
                </div>
              )}
              
              <button 
                className="checkout-button" 
                onClick={handleCheckout}
                disabled={isProcessing || cart.length === 0}
              >
                {isProcessing ? 'Procesando...' : 'Iniciar compra'}
              </button>
              
              {!isAuthenticated() && (
                <p style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.875rem', 
                  color: '#666',
                  textAlign: 'center' 
                }}>
                  <Link to="/login" onClick={hideCart}>
                    Inicia sesión
                  </Link> para continuar
                </p>
              )}
            </div>
          </>
        )}
      </div>
      <Link to="/productos" className="continue-shopping" onClick={hideCart}>
        Ver más productos
      </Link>
    </div>
  );
};

export default CartPreview;
