import { useState, useEffect } from 'react';
import './ProductList.css';
import { CardProduct } from '../CardProduct/CardProduct';
import api from '../../services/api';
import { mapProductsFromAPI, formatRating } from '../../services/productMapper';


export default function ProductList({ category, showSellers = false }) {
    const[products, setProducts] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);
    const[filteredProducts, setFilteredProducts] = useState([]);
    const[searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    // useEffect para cargar productos desde la API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const apiProducts = await api.getProducts();
                // Mapear productos del formato API al formato del componente
                const mappedProducts = mapProductsFromAPI(apiProducts);
                
                // Obtener estadísticas de reviews para cada producto (opcional, para mejorar rendimiento)
                // Nota: Esto hace una llamada por producto. Para mejor rendimiento, considera hacer esto de forma lazy
                const productsWithReviews = await Promise.all(
                    mappedProducts.map(async (product) => {
                        try {
                            const stats = await api.getProductReviewStats(product.id);
                            return {
                                ...product,
                                rating: formatRating(stats.promedioValoracion || 0),
                                reviews: stats.totalReviews || 0
                            };
                        } catch (err) {
                            // Si no hay reviews o hay error, mantener valores por defecto
                            return product;
                        }
                    })
                );
                
                setProducts(productsWithReviews);
                setError(null);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // useEffect para filtrar productos cuando cambia la categoría o el término de búsqueda
    useEffect(() => {
        let filtered = products;

        // Filtrar por categoría si existe
        if (category) {
            filtered = filtered.filter(product => {
                // Verificar si la categoría coincide con el nombre de la categoría
                if (product.category && product.category.toLowerCase() === category.toLowerCase()) {
                    return true;
                }
                // También verificar en el array de categorías
                if (product.categories && product.categories.length > 0) {
                    return product.categories.some(cat => {
                        const catName = typeof cat === 'object' ? cat.nombre : cat;
                        return catName && catName.toLowerCase() === category.toLowerCase();
                    });
                }
                return false;
            });
        }

        // Filtrar por término de búsqueda si existe
        // Busca en nombre, descripción y categoría del producto
        if (searchTerm) {
            filtered = filtered.filter(product => {
                const matchesName = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesDescription = product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategoriesArray = product.categories && product.categories.some(cat => {
                    const catName = typeof cat === 'object' ? cat.nombre : cat;
                    return catName && catName.toLowerCase().includes(searchTerm.toLowerCase());
                });
                return matchesName || matchesDescription || matchesCategory || matchesCategoriesArray;
            });
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

                <div className="products-list">
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