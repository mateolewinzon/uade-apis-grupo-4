import "./Footer.css"
import { MapPin, Phone, Mail, Send } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <h3>MateMarket</h3>
              <p>Tradición Argentina</p>
            </div>
            <p className="footer-description">
              Tu tienda de confianza para los mejores mates, bombillas y accesorios tradicionales argentinos. Calidad
              premium desde 2008.
            </p>
          </div>
          <div className="footer-section">
            <h4 className="footer-title">Ayuda</h4>
            <ul className="footer-links">
              <li>
                <a href="#ayuda">Cómo Comprar</a>
              </li>
              <li>
                <a href="#envios">Envíos</a>
              </li>
              <li>
                <a href="#cambios">Cambios y Devoluciones</a>
              </li>
              <li>
                <a href="#faq">Preguntas Frecuentes</a>
              </li>
              <li>
                <a href="#contacto">Contacto</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contacto</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">
                  <MapPin size={16} />
                </span>
                <span>Buenos Aires, Argentina</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">
                  <Phone size={16} />
                </span>
                <span>+54 11 1234-5678</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">
                  <Mail size={16} />
                </span>
                <span>info@matemarket.com.ar</span>
              </div>
            </div>
            <div className="newsletter">
              <h5>Newsletter</h5>
              <div className="newsletter-form">
                <input type="email" placeholder="Tu email" className="newsletter-input" />
                <button className="newsletter-btn">
                  <Send size={16} />
                  <span>Suscribirse</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 MateMarket. Todos los derechos reservados.</p>
            <div className="footer-bottom-links">
              <a href="#privacidad">Política de Privacidad</a>
              <a href="#terminos">Términos y Condiciones</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
 