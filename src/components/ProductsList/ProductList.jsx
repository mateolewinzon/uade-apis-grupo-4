import { useState, useEffect } from 'react';
import './ProductList.css';
import { CardProduct } from '../CardProduct/CardProduct';


export default function ProductList({ category, showSellers = false }) {
    const[products, setProducts] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);
    const[filteredProducts, setFilteredProducts] = useState([]);
    const[searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    // useEffect para cargar productos desde la API
    useEffect(() => {

        let url = 'http://localhost:3000/productos';
       
        fetch(url)
        .then(response => response.json())
        .then(data => {
            setProducts(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            setLoading(false);
            setError(error);
        });
    }, []);

    // useEffect para filtrar productos cuando cambia la categoría o el término de búsqueda
    useEffect(() => {
        let filtered = products;

        // Filtrar por categoría si existe
        if (category) {
            filtered = filtered.filter(product => 
                product.category && product.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Filtrar por término de búsqueda si existe
        // Busca en nombre, descripción y categoría del producto
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        setFilteredProducts(filtered);
    }, [products, category, searchTerm]);

    // Función para manejar el cambio en el input de búsqueda
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Función para limpiar la búsqueda
    const clearSearch = () => {
        setSearchTerm('');
    };

    // Determinar qué productos mostrar
    const productsToShow = filteredProducts;

    // Estados de carga y error
    if(loading) {
        return <div>Cargando...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    
    return (
        <section className="featured-products">
            <div className="featured-container">
                <div className="featured-header">
                    <h2 className="featured-title">Productos Destacados</h2>
                    <p className="featured-subtitle">Los favoritos de nuestros clientes con la mejor calidad</p>
                </div>

                {/* Buscador de productos */}
                <div className="search-container">
                    <div className="search-input-wrapper">
                        {/* Icono de lupa */}
                        <div className="search-icon">
                            🔍
                        </div>
                        {/* Input de búsqueda */}
                        <input 
                            type="text"
                            className="search-input"
                            placeholder="Buscar productos por nombre, descripción o categoría..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {/* Botón para limpiar búsqueda (solo visible si hay texto) */}
                        {searchTerm && (
                            <button 
                                className="clear-search-btn"
                                onClick={clearSearch}
                                aria-label="Limpiar búsqueda"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {/* Información de resultados de búsqueda */}
                    {searchTerm && (
                        <div className="search-results-info">
                            Mostrando {productsToShow.length} resultado{productsToShow.length !== 1 ? 's' : ''} para "{searchTerm}"
                        </div>
                    )}
                </div>

                <div className="products-grid">
                    {productsToShow.length > 0 ? (
                        productsToShow.map(product => (
                            <CardProduct key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="no-products">
                            <h2>No se encontraron productos</h2>
                            {category && <p>No hay productos en la categoría "{category}"</p>}
                            {searchTerm && <p>Intenta con otros términos de búsqueda</p>}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}