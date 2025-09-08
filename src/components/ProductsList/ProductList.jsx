import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';
import { CardProduct } from '../CardProduct/CardProduct';


export default function ProductList({ category, showSellers = false }) {
    const[products, setProducts] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);

    useEffect(() => {
        let url = 'http://localhost:3000/productos';
       
        fetch(url)
        .then(response => response.json())
        .then(data => {
            let filteredData = data;
            
            // Filtrar por categoría si se especifica
            if (category) {
                filteredData = data.filter(product => product.category === category);
            }
            
            // Ordenar alfabéticamente
            filteredData = filteredData.sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
            
            setProducts(filteredData);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            setLoading(false);
            setError(error);
        });
    }, [category]);
    
    if(loading) {
        return <div>Cargando...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!loading && products.length === 0) {
        return <div>No se encontraron productos</div>;
    }

    const getTitle = () => {
        if (category) {
            return `Productos de ${category}`;
        }
        if (showSellers) {
            return "Vendedores";
        }
        return "Productos Destacados";
    };

    const getSubtitle = () => {
        if (category) {
            return `Explora todos los productos de la categoría ${category}`;
        }
        if (showSellers) {
            return "Conoce a nuestros vendedores";
        }
        return "Los favoritos de nuestros clientes con la mejor calidad";
    };

    return (
        <section className="featured-products">
            <div className="featured-container">
                <div className="featured-header">
                <h2 className="featured-title">{getTitle()}</h2>
                <p className="featured-subtitle">{getSubtitle()}</p>
                {category && (
                    <Link to="/" className="back-to-catalog">
                        ← Volver al Catálogo Completo
                    </Link>
                )}
                </div>
                <div className="products-grid">
                    {products.map(product => (
                        <CardProduct key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}