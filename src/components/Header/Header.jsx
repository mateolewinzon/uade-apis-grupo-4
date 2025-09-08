import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext'; // Importamos el hook de usuario
import { ShoppingCart, User, LogOut } from 'lucide-react'; // Importamos iconos adicionales

export const Header = () => {
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
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
            <span className="nav-link">Productos</span>
            {isProductsDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/categoria/mates" className="dropdown-item" onClick={handleLinkClick}>
                  Mates
                </Link>
                <Link to="/categoria/bombillas" className="dropdown-item" onClick={handleLinkClick}>
                  Bombillas
                </Link>
                <Link to="/categoria/yerba" className="dropdown-item" onClick={handleLinkClick}>
                  Yerba
                </Link>
                <Link to="/categoria/accesorios" className="dropdown-item" onClick={handleLinkClick}>
                  Accesorios
                </Link>
                <Link to="/categoria/kits" className="dropdown-item" onClick={handleLinkClick}>
                  Kits
                </Link>
              </div>
            )}
          </div>
          <NavLink to="/vendedores" className="nav-link" onClick={handleLinkClick}>
            Vendedores
          </NavLink>
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
          {isAuthenticated() ? (
            // Usuario logueado - Mostramos dropdown con opciones (controlado por click)
            <div 
              ref={userMenuRef}
              className="user-menu dropdown"
              onClick={toggleUserDropdown}
            >
              <div className="user-info">
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="user-avatar"
                />
                <span className="user-name">Hola, {user.nombre}</span>
                <span className={`dropdown-arrow ${isUserDropdownOpen ? 'open' : ''}`}>▼</span>
              </div>
              {isUserDropdownOpen && (
                <div className="dropdown-menu user-dropdown">
                  <div className="dropdown-item user-details">
                    <strong>{user.nombre} {user.apellido}</strong>
                    <small>{user.email}</small>
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
        </div>
      </div>
    </header>
  );
};
