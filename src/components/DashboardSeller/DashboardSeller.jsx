import { useState, useEffect } from 'react';
import './DashboardSeller.css';
import { useNavigate } from 'react-router-dom';

export const DashboardSeller = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


        const mockProducts = [
        {
            id: 1,
            name: "Producto de prueba",
            price: 999,
            image: "https://via.placeholder.com/150"
        }
    ];

    useEffect(() => {

        // Usamos la misma URL que ProductList
        fetch('http://localhost:3000/productos')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
                setError(error);
            });
    }, []);

    const handleDelete = async (productId) => {  // Agregar async aquí
        if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
            try {
                const response = await fetch(`http://localhost:3000/productos/${productId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setProducts(products.filter(product => product.id !== productId));
                } else {
                    alert('Error al eliminar el producto');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al eliminar el producto');
            }
        }
    };

    const handleEdit = (productId) => {
        // Redirigir a la página de edición
        navigate(`/form-product?edit=${productId}`);
    };

    const handleAddProduct = () => {
        navigate(`/form-product`);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
            <h1>Panel de Vendedor</h1>
            <button  className="btn-primary" onClick={handleAddProduct}>Agregar Producto</button>
            </div>
            <div className="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        style={{width: '50px', height: '50px'}}
                                    />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>
                                    <button className="edit-btn"
                                        onClick={() => handleEdit(product.id)}>
                                      
                                        Editar
                                    </button>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
