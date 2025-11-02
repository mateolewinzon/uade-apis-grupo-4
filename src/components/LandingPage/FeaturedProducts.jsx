import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CardProduct } from '../CardProduct/CardProduct';
import api from '../../services/api';
import { mapProductsFromAPI, formatRating } from '../../services/productMapper';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar productos destacados desde el API
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const apiProducts = await api.getProducts();
        
        // Mapear productos del formato API al formato del componente
        const mappedProducts = mapProductsFromAPI(apiProducts);
        
        // Obtener estadísticas de reviews para cada producto
        const productsWithReviews = await Promise.all(
          mappedProducts.slice(0, 4).map(async (product) => {
            try {
              const stats = await api.getProductReviewStats(product.id);
              return {
                ...product,
                rating: formatRating(stats.promedioValoracion || 0),
                reviews: stats.totalReviews || 0
              };
            } catch (err) {
              return product;
            }
          })
        );
        
        // Tomar los primeros 4 productos como destacados
        setProducts(productsWithReviews);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]); // En caso de error, mostrar array vacío
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
        </div>

        <div className="products-grid">
          {products.map((product) => (
              <CardProduct product={product} key={product.id} />

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
