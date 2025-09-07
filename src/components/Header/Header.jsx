import React, { useState } from 'react';
import './Header.css';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const {cart} = useCart();


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  return (
    <header className="header">
      <div className="header-container">

        <div className="logo">
          <span className="logo-icon">🧉</span>
          <span className="logo-text">MateMarket</span>
        </div>

        <nav className="desktop-nav">
          <div 
            className="nav-item dropdown"
            onMouseEnter={() => setIsProductsDropdownOpen(true)}
            onMouseLeave={() => setIsProductsDropdownOpen(false)}
          >
            <span className="nav-link">Productos</span>
            {isProductsDropdownOpen && (
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item">Mates</a>
                <a href="#" className="dropdown-item">Bombillas</a>
                <a href="#" className="dropdown-item">Yerbas</a>
                <a href="#" className="dropdown-item">Accesorios</a>
                <a href="#" className="dropdown-item">Sets Completos</a>
              </div>
            )}
          </div>
          <a href="#" className="nav-link">Vendedores</a>
          <a href="#" className="nav-link">Vender</a>
        </nav>

        <div className="header-actions">
          <div className="cart">
            <span className="cart-icon"> <ShoppingCart /> </span>
            <span className="cart-text">Carrito ({cart.length})</span>
          </div>
          
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
                <a href="#" className="mobile-dropdown-item">Mates</a>
                <a href="#" className="mobile-dropdown-item">Bombillas</a>
                <a href="#" className="mobile-dropdown-item">Yerbas</a>
                <a href="#" className="mobile-dropdown-item">Accesorios</a>
                <a href="#" className="mobile-dropdown-item">Sets Completos</a>
              </div>
            )}
          </div>
          <a href="#" className="mobile-nav-link">Vendedores</a>
          <a href="#" className="mobile-nav-link">Vender</a>
        </div>
      </nav>
    </header>
  );
};
