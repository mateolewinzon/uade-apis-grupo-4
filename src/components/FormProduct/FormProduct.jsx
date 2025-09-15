import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./FormProduct.css";

const categories = ["Mates", "Bombillas", "Yerba", "Accesorios", "Kits"];

export const FormProduct = ({ product, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    image: "",
  });

  const [success, setSuccess] = useState(false);

  const isEditing = !!product;

  useEffect(() => {
    if (isEditing) {
      setForm(product);
    } else {
      setForm({
        name: "",
        description: "",
  category: categories[0],
        price: "",
        image: "",
      });
    }
  }, [product, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      const numericValue = value.replace(/[^0-9.]/g, "");
      setForm({ ...form, [name]: `$${numericValue}` });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const seller = {
      id: 1,
      username: "JP Mates",
    }; // Hardcoded seller for now

    const productData = {
      ...form,
      price: form.price.startsWith("$") ? form.price : `$${form.price}`,
    };

    const url = isEditing
      ? `http://localhost:3000/productos/${product.id}`
      : "http://localhost:3000/productos";
    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => response.json())
      .then(() => {
        if (typeof onSave === "function") onSave();
        // Si no es edición, limpiar solo el formulario para permitir agregar otro producto
        if (!isEditing) {
          setForm({ name: "", description: "", category: categories[0], price: "", image: "" });
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      })
      .catch((err) => {
        console.error("Error guardando producto:", err);
      });
  };

  return (
    <div className="form-product-container">
      <div className="form-header">
        <h2>{isEditing ? "Editar Producto" : "Agregar Producto"}</h2>
        <button
          type="button"
          className="close-button"
          onClick={() => {
            if (typeof onClose === 'function') onClose();
            window.location.href = 'http://localhost:5001/vender';
          }}
          aria-label="Cerrar"
        >
          <X />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {success && (
          <div className="success-message">Producto agregado exitosamente!</div>
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
