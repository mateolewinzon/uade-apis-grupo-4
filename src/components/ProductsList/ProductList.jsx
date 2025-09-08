import { useState, useEffect } from 'react';
import './ProductList.css';
import { CardProduct } from '../CardProduct/CardProduct';


export default function ProductList() {
    const[products, setProducts] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);

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
    
    if(loading) {
        return <div>Cargando...</div>;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!loading && products.length === 0) {
        return <div>No se encontraron productos</div>;
    }

    return (
        <section className="featured-products">
            <div className="featured-container">
                <div className="featured-header">
                <h2 className="featured-title">Productos Destacados</h2>
                <p className="featured-subtitle">Los favoritos de nuestros clientes con la mejor calidad</p>
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