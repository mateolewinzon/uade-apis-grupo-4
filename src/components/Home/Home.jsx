import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CardProduct } from '../CardProduct/CardProduct';
import { useAuth } from '../../context/AuthContext';
import './Home.css';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/productos')
      .then(response => response.json())
      .then(data => {
        // Ordenar productos alfabéticamente por nombre
        const sortedProducts = data.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
        setProducts(sortedProducts);
        
        // Extraer categorías únicas y ordenarlas alfabéticamente
        const uniqueCategories = [...new Set(data.map(product => product.category))]
          .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
        setCategories(uniqueCategories);
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
        setError(error);
      });
  }, []);

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div className="home-container">
      {/* Mensaje de bienvenida */}
      <div className="welcome-section">
        {isAuthenticated ? (
          <>
            <h1>¡Bienvenido, {user?.name || 'Usuario'}!</h1>
            <p>Explora nuestro catálogo de productos de mate</p>
          </>
        ) : (
          <>
            <h1>Catálogo de Productos de Mate</h1>
            <p>Descubre nuestra amplia variedad de productos para disfrutar del mate</p>
            <div className="auth-prompt">
              <p>¿Quieres agregar productos al carrito?</p>
              <Link to="/login" className="login-prompt-btn">
                Iniciar Sesión
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Sección de Categorías */}
      <section className="categories-section">
        <div className="categories-container">
          <h2 className="section-title">Categorías de Productos</h2>
          <p className="section-subtitle">Explora nuestros productos por categoría</p>
          <div className="categories-grid">
            {categories.map(category => (
              <Link 
                key={category} 
                to={`/categoria/${category.toLowerCase()}`}
                className="category-card"
              >
                <div className="category-icon">
                  {category === 'Mates' && '🏺'}
                  {category === 'Bombillas' && '🥤'}
                  {category === 'Yerba' && '🍃'}
                  {category === 'Accesorios' && '🎒'}
                  {category === 'Kits' && '📦'}
                </div>
                <h3 className="category-name">{category}</h3>
                <p className="category-count">
                  {products.filter(p => p.category === category).length} productos
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Productos */}
      <section className="products-section">
        <div className="products-container">
          <h2 className="section-title">Catálogo de Productos</h2>
          <p className="section-subtitle">Todos nuestros productos ordenados alfabéticamente</p>
          <div className="products-grid">
            {products.map(product => (
              <CardProduct key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
