import { useState, useEffect } from 'react';
import './DashboardSeller.css';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { mapProductsFromAPI } from '../../services/productMapper';

export const DashboardSeller = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                // Usar el endpoint correcto para obtener los productos del vendedor actual
                const apiProducts = await api.getMyProducts();
                // Mapear productos del formato API al formato del componente
                const mappedProducts = mapProductsFromAPI(apiProducts);
                setProducts(mappedProducts);
                setError(null);
            } catch (error) {
                console.error('Error fetching products:', error);
                // Si no está autenticado o hay error, mostrar mensaje apropiado
                if (error.status === 401) {
                    setError('Debes iniciar sesión para ver tus productos');
                } else {
                    setError(error.message || 'Error al cargar los productos');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = products;
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProducts(filtered);
    }, [products, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const handleDelete = async (productId) => {
        if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
            try {
                await api.deleteProduct(productId);
                // Actualizar la lista de productos después de eliminar
                setProducts(products.filter(product => product.id !== productId));
            } catch (error) {
                console.error('Error:', error);
                let errorMessage = 'Error al eliminar el producto';
                if (error.status === 403) {
                    errorMessage = 'No tienes permiso para eliminar este producto';
                } else if (error.status === 404) {
                    errorMessage = 'Producto no encontrado';
                } else if (error.message) {
                    errorMessage = error.message;
                }
                alert(errorMessage);
            }
        }
    };

    const handleEdit = (productId) => {
        navigate(`/form-product?edit=${productId}`);
    };

    const handleAddProduct = () => {
        navigate(`/form-product`);
    };

    if (loading) return <div className="dashboard-container"><div>Cargando productos...</div></div>;
    if (error) {
        return (
            <div className="dashboard-container">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{typeof error === 'string' ? error : error.message || 'Error al cargar los productos'}</p>
                    {typeof error === 'object' && error.status === 401 && (
                        <p>Por favor, inicia sesión para ver tus productos.</p>
                    )}
                </div>
            </div>
        );
    }

    const productsToShow = searchTerm ? filteredProducts : products;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Panel de Vendedor</h1>
                <button className="btn-primary" onClick={handleAddProduct}>Agregar Producto</button>
            </div>

            <div className="search-container">
                <div className="search-input-wrapper">
                    <div className="search-icon">
                        🔍
                    </div>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Buscar productos por nombre..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
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
                {searchTerm && (
                    <div className="search-results-info">
                        Mostrando {productsToShow.length} resultado{productsToShow.length !== 1 ? 's' : ''} para "{searchTerm}"
                    </div>
                )}
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
                        {productsToShow.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        style={{ width: '50px', height: '50px' }}
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
