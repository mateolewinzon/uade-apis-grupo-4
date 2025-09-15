import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FormProduct.css";

const categories = ["Mates", "Bombillas", "Yerba", "Accesorios", "Kits"];

export const FormProduct = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the product ID from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const editProductId = searchParams.get('edit');
  const isEditing = !!editProductId;

  useEffect(() => {
    if (isEditing) {
      // Fetch the product data when editing
      fetch(`http://localhost:3000/productos/${editProductId}`)
        .then(response => response.json())
        .then(productData => {
          setForm(productData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching product:', error);
          setLoading(false);
        });
    } else {
      setForm({
        name: "",
        description: "",
        category: categories[0],
        price: "",
        image: "",
      });
      setLoading(false);
    }
  }, [isEditing, editProductId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      // Remove any existing $ and only allow numbers and one decimal point
      const numericValue = value.replace(/^\$/, '').replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const parts = numericValue.split('.');
      const cleanValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
      setForm({ ...form, [name]: cleanValue ? `$${cleanValue}` : '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const seller = {
        id: 1,
        username: "JP Mates",
      }; // Hardcoded seller for now

      const productData = {
        ...(isEditing ? { id: editProductId } : {}), // Use editProductId instead of product.id
        ...form,
        price: form.price ? (form.price.startsWith("$") ? form.price : `$${form.price}`) : "",
        seller
      };

      const url = isEditing
        ? `http://localhost:3000/productos/${editProductId}`
        : "http://localhost:3000/productos";
      const method = isEditing ? "PUT" : "POST";

      console.log('Sending request:', {
        url,
        method,
        data: productData
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      
      setSuccess(true);
      if (typeof onSave === "function") onSave();
      
      // Redirect back to seller dashboard after successful edit/create
      setTimeout(() => {
        setSuccess(false);
        navigate('/vender');
      }, 2000);
    } catch (err) {
      console.error("Error guardando producto:", err);
      alert("Error al guardar el producto. Por favor, intenta nuevamente.");
    }
  };
//formulario en modo edición
  return (
    <div className="form-product-container">
      <div className="form-header">
        <h2>{isEditing ? "Editar Producto" : "Agregar Producto"}</h2>
        <button
          type="button"
          className="close-button"
          onClick={() => {
            if (typeof onClose === 'function') onClose();
            navigate('/vender');
          }}
          aria-label="Cerrar"
        >
          <X />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {success && (
          <div className="success-message">
            {isEditing ? "Los cambios se realizaron correctamente!" : "Producto agregado exitosamente!"}
          </div>
        )}
        <div className="form-grid">
          <div className="form-group span-2">
            <label htmlFor="name" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group span-2">
            <label htmlFor="description" className="form-label">
              Descripción
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Categoría
            </label>
            <select
              className="form-control"
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Precio
            </label>
            <input
              type="text"
              className="form-control"
              id="price"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group span-2">
            <label htmlFor="image" className="form-label">
              URL de la Imagen
            </label>
            <input
              type="text"
              className="form-control"
              id="image"
              name="image"
              value={form.image}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <button type="submit" className="btn-primary submit-btn">
            {isEditing ? "Guardar Cambios" : "Agregar Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};
