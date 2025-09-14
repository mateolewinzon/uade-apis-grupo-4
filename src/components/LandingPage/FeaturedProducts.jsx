import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CardProduct } from '../CardProduct/CardProduct';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de productos destacados
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        
        // Tomar los primeros 4 productos como destacados
        const featuredProducts = data.productos.slice(0, 4);
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Productos Destacados</h2>
            <p>Descubre nuestra selección de los mejores mates y accesorios</p>
          </div>
          <div className="loading-grid">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="product-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-price"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products">
      <div className="container">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <p>Descubre nuestra selección de los mejores mates y accesorios artesanales</p>
          <div className="section-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-icon">🍃</div>
            <div className="decoration-line"></div>
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="featured-product-card">
              <CardProduct product={product} />
            </div>
          ))}
        </div>

        <div className="section-footer">
          <Link to="/productos" className="view-all-btn">
            Ver Todos los Productos
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
