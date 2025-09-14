import React from 'react';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import AboutSection from './AboutSection';
import TestimonialsSection from './TestimonialsSection';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <HeroSection />
      <FeaturedProducts />
      <AboutSection />
      <TestimonialsSection />
      
      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para comenzar tu aventura con el mate?</h2>
            <p>Únete a nuestra comunidad y descubre la tradición argentina del mate</p>
            <div className="cta-buttons">
              <a href="/productos" className="btn btn-primary">
                Explorar Productos
              </a>
              <a href="/vender" className="btn btn-secondary">
                Vender Productos
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
