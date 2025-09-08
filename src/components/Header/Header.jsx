import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const { cart, toggleCart } = useCart();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  const handleLogoClick = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsProductsDropdownOpen(false);
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
          
          {/* Hamburger Menu Button */}
          <button 
            className="hamburger"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-nav-item">
            <button 
              className="mobile-nav-link dropdown-toggle"
              onClick={toggleProductsDropdown}
            >
              Productos
              <span className={`arrow ${isProductsDropdownOpen ? 'up' : 'down'}`}>▼</span>
            </button>
            {isProductsDropdownOpen && (
              <div className="mobile-dropdown">
                <Link to="/categoria/mates" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Mates
                </Link>
                <Link to="/categoria/bombillas" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Bombillas
                </Link>
                <Link to="/categoria/yerba" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Yerba
                </Link>
                <Link to="/categoria/accesorios" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Accesorios
                </Link>
                <Link to="/categoria/kits" className="mobile-dropdown-item" onClick={handleLinkClick}>
                  Kits
                </Link>
              </div>
            )}
          </div>
          <NavLink to="/vendedores" className="mobile-nav-link" onClick={handleLinkClick}>
            Vendedores
          </NavLink>
          <NavLink to="/vender" className="mobile-nav-link" onClick={handleLinkClick}>
            Vender
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
