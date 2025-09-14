import React from 'react';
import { Link } from 'react-router-dom';
import './AboutSection.css';

const AboutSection = () => {
  const features = [
    {
      icon: '🤝',
      title: 'Conectamos Artesanos',
      description: 'Conectamos artesanos locales con amantes del mate, promoviendo el comercio justo y la tradición argentina.'
    },
    {
      icon: '🏆',
      title: 'Calidad Premium',
      description: 'Todos nuestros productos son seleccionados por su calidad excepcional y autenticidad artesanal.'
    },
    {
      icon: '🚚',
      title: 'Envío Seguro',
      description: 'Enviamos a todo el país con embalaje especializado para proteger tus mates y accesorios.'
    },
    {
      icon: '💬',
      title: 'Comunidad Activa',
      description: 'Únete a una comunidad de amantes del mate que comparten experiencias y consejos.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Productos Únicos' },
    { number: '50+', label: 'Artesanos Verificados' },
    { number: '1000+', label: 'Clientes Satisfechos' },
    { number: '4.9/5', label: 'Rating Promedio' }
  ];

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <div className="section-badge">
              <span className="badge-icon">🍃</span>
              <span className="badge-text">Sobre Nosotros</span>
            </div>
            
            <h2 className="section-title">
              Más que una tienda, una <span className="highlight">comunidad</span>
            </h2>
            
            <p className="section-description">
              Somos una plataforma que conecta artesanos tradicionales con amantes del mate. 
              Nuestra misión es preservar y promover la rica tradición argentina del mate, 
              ofreciendo productos auténticos de la más alta calidad.
            </p>
            
            <p className="section-description">
              Cada mate, bombilla y accesorio en nuestra plataforma cuenta una historia. 
              Trabajamos directamente con artesanos locales para asegurar que cada producto 
              mantenga la autenticidad y calidad que merece esta tradición centenaria.
            </p>

            <div className="about-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="about-actions">
              <Link to="/vendedores" className="btn btn-primary">
                Explorar Productos
              </Link>
              <Link to="/vender" className="btn btn-outline">
                Únete como Artesano
              </Link>
            </div>
          </div>

          <div className="about-image">
            <div className="image-container">
              <img 
                src="/traditional-argentine-mate-gourd-with-bombilla-in-.jpg" 
                alt="Mate tradicional argentino con bombilla"
                className="main-image"
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <span className="overlay-icon">⭐</span>
                  <span className="overlay-text">Tradición Auténtica</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <span className="icon">{feature.icon}</span>
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
