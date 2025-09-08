import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { FormProduct } from "../FormProduct/FormProduct";
import "./DashboardSeller.css";

export const DashboardSeller = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const sellerId = 1; // Hardcoded seller ID for now

  const fetchProducts = () => {
    fetch(`http://localhost:3000/productos?seller.id=${sellerId}`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
      });
  }

  useEffect(() => {
    fetchProducts();
  }, [sellerId]);

  useEffect(() => {
    const results = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:3000/productos/${productId}`, {
        method: "DELETE",
      }).then(() => {
        fetchProducts();
      });
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = () => {
    handleCloseModal();
    fetchProducts();
  }

  return (
    <div className="dashboard-seller-container">
      <div className="dashboard-header">
        <h1>Mis Productos</h1>
        <div className="actions-header">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products-message">
          <p>No publicaste ningún producto aún, ¿Desea agregar algún producto nuevo?</p>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            Publicar
          </button>
        </div>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
                <span className="product-status-badge">Activo</span>
              </div>
              <div className="product-card-body">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">{product.price}</p>
                <div className="product-actions">
                  <Link to={`/producto/${product.id}`} className="action-icon view-icon">
                    <Eye />
                  </Link>
                  <button onClick={() => handleOpenModal(product)} className="action-icon edit-icon">
                    <Edit />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="action-icon delete-icon">
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => handleOpenModal()} className="fab">
        <Plus />
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FormProduct product={editingProduct} onSave={handleSave} onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};
