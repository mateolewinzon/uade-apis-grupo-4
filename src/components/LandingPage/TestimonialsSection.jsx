import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import './TestimonialsSection.css';

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Simular carga de testimonios
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        
        // Tomar las primeras 6 reseñas como testimonios
        const testimonialsData = data.reseñas.slice(0, 6).map(review => ({
          id: review.id,
          name: review.userName,
          rating: review.rating,
          comment: review.comment,
          product: data.productos.find(p => p.id === review.productId.toString())?.name || 'Producto',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.userName}`
        }));
        
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Error loading testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  if (testimonials.length === 0) {
    return (
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Lo que dicen nuestros clientes</h2>
            <p>Testimonios reales de nuestra comunidad</p>
          </div>
          <div className="loading-testimonial">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-content">
              <div className="skeleton-name"></div>
              <div className="skeleton-rating"></div>
              <div className="skeleton-comment"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2>Lo que dicen nuestros clientes</h2>
          <p>Testimonios reales de nuestra comunidad de amantes del mate</p>
          <div className="section-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-icon">{<MessageCircle size={20} /> }</div>
            <div className="decoration-line"></div>
          </div>
        </div>

        <div className="testimonials-container">
          <div className="testimonial-main">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="user-info">
                  <img 
                    src={testimonials[currentIndex]?.avatar} 
                    alt={testimonials[currentIndex]?.name}
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <h4 className="user-name">{testimonials[currentIndex]?.name}</h4>
                    <p className="user-product">Sobre: {testimonials[currentIndex]?.product}</p>
                  </div>
                </div>
                <div className="rating">
                  {[...Array(5)].map((_, index) => (
                    <span 
                      key={index} 
                      className={`star ${index < testimonials[currentIndex]?.rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <blockquote className="testimonial-text">
                "{testimonials[currentIndex]?.comment}"
              </blockquote>
            </div>
          </div>

          <div className="testimonial-navigation">
            <button 
              className="nav-btn prev-btn" 
              onClick={prevTestimonial}
              aria-label="Testimonio anterior"
            >
              ←
            </button>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>
            <button 
              className="nav-btn next-btn" 
              onClick={nextTestimonial}
              aria-label="Siguiente testimonio"
            >
              →
            </button>
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div key={testimonial.id} className="testimonial-mini">
              <div className="mini-header">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="mini-avatar"
                />
                <div className="mini-rating">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`mini-star ${i < testimonial.rating ? 'filled' : ''}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="mini-comment">
                "{testimonial.comment.length > 100 
                  ? testimonial.comment.substring(0, 100) + '...' 
                  : testimonial.comment}"
              </p>
              <div className="mini-footer">
                <span className="mini-name">{testimonial.name}</span>
                <span className="mini-product">{testimonial.product}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
