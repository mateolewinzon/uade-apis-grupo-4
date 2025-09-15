import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Truck, Star } from 'lucide-react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Descubre la <span className="highlight">Tradición</span> del Mate
          </h1>
          <p className="hero-subtitle">
            Conecta con artesanos locales y encuentra los mejores mates, bombillas y accesorios 
            para vivir la auténtica experiencia argentina del mate.
          </p>
          <div className="hero-buttons">
            <Link to="/productos" className="btn btn-primary">
              Explorar Productos
            </Link>
            <Link to="/vender" className="btn btn-secondary">
              Vender Productos
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Productos</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Artesanos</span>
            </div>
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Clientes</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-container">
            <img 
              src="/group-of-friends-sharing-mate-in-traditional-argen.jpg" 
              alt="Grupo de amigos compartiendo mate tradicional argentino"
              className="hero-main-image"
            />
            <div className="floating-card card-1">
              <div className="card-content">
                <span className="card-icon">
                  <Trophy size={20} color="#FFD700"/>
                </span>
                <span className="card-text">Calidad Premium</span>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-content">
                <span className="card-icon">
                  <Truck size={20} color="#4A7C2F" />
                </span>
                <span className="card-text">Envío Gratis</span>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-content">
                <span className="card-icon">
                  <Star size={20} color="#FFD700" fill="#FFD700" />
                </span>
                <span className="card-text">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
