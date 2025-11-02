import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext'; // Importamos el hook de usuario
import { ShoppingCart, User, LogOut } from 'lucide-react'; // Importamos iconos adicionales

export const Header = () => {
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para menú móvil
  const { cart, toggleCart } = useCart();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // Estado para dropdown de usuario
  const { user, logout, isAuthenticated } = useUser(); // Obtenemos datos del usuario del contexto
  const navigate = useNavigate();
  const userMenuRef = useRef(null); // Referencia para el menú de usuario

  // useEffect para cerrar el dropdown cuando se hace click fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    // Solo agregar el event listener si el dropdown está abierto
    if (isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Limpiar el event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  // Función para manejar el menú móvil
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Función para manejar el dropdown del usuario
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  // Función para manejar el logout
  const handleLogout = () => {
    logout(); // Llamamos a la función logout del contexto
    setIsUserDropdownOpen(false);
    navigate('/'); // Redirigimos al home
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLinkClick = () => {
    setIsProductsDropdownOpen(false);
    setIsUserDropdownOpen(false); // Cerramos también el dropdown de usuario
    setIsMobileMenuOpen(false); // Cerramos el menú móvil al hacer click en un enlace
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo - Navegable al home */}
        <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">🧉</span>
          <span className="logo-text">MateMarket</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setIsProductsDropdownOpen(true)}
            onMouseLeave={() => setIsProductsDropdownOpen(false)}
          >
            <Link to="/productos" className="nav-link">Productos</Link>
            {isProductsDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/productos/mates" className="dropdown-item" onClick={handleLinkClick}>
                  Mates
                </Link>
                <Link to="/productos/bombillas" className="dropdown-item" onClick={handleLinkClick}>
                  Bombillas
                </Link>
                <Link to="/productos/yerba" className="dropdown-item" onClick={handleLinkClick}>
                  Yerba
                </Link>
                <Link to="/productos/accesorios" className="dropdown-item" onClick={handleLinkClick}>
                  Accesorios
                </Link>
                <Link to="/productos/kits" className="dropdown-item" onClick={handleLinkClick}>
                  Kits
                </Link>
              </div>
            )}
          </div>
          {/* <NavLink to="/vendedores" className="nav-link" onClick={handleLinkClick}>
            Vendedores
          </NavLink> */}
          <NavLink to="/vender" className="nav-link" onClick={handleLinkClick}>
            Vender
          </NavLink>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          <button className="cart" onClick={toggleCart}>
            <span className="cart-icon">
              <ShoppingCart />
            </span>
            <span className="cart-text">Carrito ({cart.length})</span>
          </button>
          
          {/* Sección de usuario - Mostramos diferentes contenidos según si está logueado o no */}
          {isAuthenticated() && user ? (
            // Usuario logueado - Mostramos dropdown con opciones (controlado por click)
            <div 
              ref={userMenuRef}
              className="user-menu dropdown"
              onClick={toggleUserDropdown}
            >
              <div className="user-info">
                <img 
                  src={user.avatar || '/placeholder-user.jpg'} 
                  alt={user.username || user.email || 'User'} 
                  className="user-avatar"
                />
                <span className="user-name">Hola, {user.nombre || user.email || 'Usuario'}</span>
                <span className={`dropdown-arrow ${isUserDropdownOpen ? 'open' : ''}`}>▼</span>
              </div>
              {isUserDropdownOpen && (
                <div className="dropdown-menu user-dropdown">
                  <div className="dropdown-item user-details">
                    <strong>{user.nombre || ''} {user.apellido || ''}</strong>
                    <small>{user.email || ''}</small>
                  </div>
                  <hr />
                  <Link to="/dashboard" className="dropdown-item" onClick={handleLinkClick}>
                    <User size={16} />
                    Mi Dashboard
                  </Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Usuario no logueado - Mostramos enlaces de login y registro
            <div className="auth-links">
              <Link to="/login" className="auth-link login-link" onClick={handleLinkClick}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="auth-link register-link" onClick={handleLinkClick}>
                Registrarse
              </Link>
            </div>
          )}

          {/* Botón hamburguesa para móvil */}
          <button 
            className="hamburger-menu"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`hamburger-line ${isMobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Navegación móvil */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          {/* Productos con dropdown en móvil */}
          <div className="mobile-nav-item">
            <button 
              className="mobile-nav-link dropdown-toggle"
              onClick={toggleProductsDropdown}
            >
              Productos
              <span className={`mobile-arrow ${isProductsDropdownOpen ? 'open' : ''}`}>▼</span>
            </button>
            {isProductsDropdownOpen && (
              <div className="mobile-dropdown">
                <Link to="/productos/mates" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Mates
                </Link>
                <Link to="/productos/bombillas" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Bombillas
                </Link>
                <Link to="/productos/yerba" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Yerba
                </Link>
                <Link to="/productos/accesorios" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Accesorios
                </Link>
                <Link to="/productos/kits" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Kits
                </Link>
              </div>
            )}
          </div>

          <Link to="/vender" className="mobile-nav-link" onClick={handleLinkClick}>
            Vender
          </Link>

          {/* Sección de usuario en móvil */}
          {isAuthenticated() && user ? (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <img 
                  src={user.avatar || '/placeholder-user.jpg'} 
                  alt={user.username || user.email || 'User'} 
                  className="mobile-user-avatar" 
                />
                <span className="mobile-user-name">Hola, {user.nombre || user.email || 'Usuario'}</span>
              </div>
              <Link to="/dashboard" className="mobile-nav-link" onClick={handleLinkClick}>
                Mi Dashboard
              </Link>
              <button className="mobile-nav-link logout-mobile" onClick={handleLogout}>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="mobile-auth-section">
              <Link to="/login" className="mobile-auth-link" onClick={handleLinkClick}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="mobile-auth-link register" onClick={handleLinkClick}>
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
