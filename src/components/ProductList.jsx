import { useState, useEffect } from 'react';
import Product from './Product';

const CATEGORIES = [
    'Todos',
    'Fotografía',
    'Tecnología',
    'Deportes',
    'Accesorios',
]

export default function ProductList() {
    const[products, setProducts] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState(null);

    const [category, setCategory] = useState('Todos');

    useEffect(() => {

        let url = 'http://localhost:3000/productos';
        if(category !== 'Todos') {
            url += `?categoria=${category}`;
        }
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

    return (
        <div>
            <h1>Listado de productos</h1>
            <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {products.map(product => (
                    <li key={product.id} style={{ listStyle: 'none' }}>
                        <Product product={product} />
                    </li>
                ))}
            </ul>
        </div>
    )
}