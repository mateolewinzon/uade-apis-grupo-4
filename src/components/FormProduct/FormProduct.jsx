import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { mapProductFromAPI, mapProductToAPI, parsePrice } from "../../services/productMapper";
import "./FormProduct.css";

export const FormProduct = ({ onSave, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "", // Cambiar a categoryId para guardar el ID de la categoría
    price: "",
    image: "",
    stock: "",
  });
  const [categories, setCategories] = useState([]); // Categorías desde el API
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the product ID from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const editProductId = searchParams.get('edit');
  const isEditing = !!editProductId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar categorías desde el API
        let apiCategories = [];
        try {
          apiCategories = await api.getCategories();
          console.log('Categorías cargadas:', apiCategories);
          
          // Validar que las categorías tengan el formato correcto
          if (!Array.isArray(apiCategories)) {
            console.error('Las categorías no son un array:', apiCategories);
            throw new Error('Formato de categorías inválido');
          }
          
          if (apiCategories.length === 0) {
            console.warn('No se encontraron categorías');
          }
          
          setCategories(apiCategories);
        } catch (catError) {
          console.error('Error cargando categorías:', catError);
          setError(`Error al cargar las categorías: ${catError.message || 'Error desconocido'}`);
          setCategories([]); // Establecer array vacío para evitar errores
        }
        
        if (isEditing && editProductId) {
          try {
            // Fetch the product data when editing
            const apiProduct = await api.getProduct(editProductId);
            const mappedProduct = mapProductFromAPI(apiProduct);
            
            // Obtener el ID de la primera categoría
            let categoryId = "";
            if (mappedProduct.categories && mappedProduct.categories.length > 0) {
              const firstCategory = mappedProduct.categories[0];
              categoryId = typeof firstCategory === 'object' ? String(firstCategory.id) : String(firstCategory);
            } else if (apiCategories.length > 0) {
              categoryId = String(apiCategories[0].id);
            }
            
            setForm({
              name: mappedProduct.name || "",
              description: mappedProduct.description || "",
              categoryId: categoryId,
              price: mappedProduct.price || "",
              image: mappedProduct.image || "",
              stock: mappedProduct.stock?.toString() || "",
            });
          } catch (productError) {
            console.error('Error cargando producto:', productError);
            setError(`Error al cargar el producto: ${productError.message || 'Error desconocido'}`);
          }
        } else {
          // Valores por defecto para nuevo producto
          const defaultCategoryId = apiCategories.length > 0 ? String(apiCategories[0].id) : "";
          setForm({
            name: "",
            description: "",
            categoryId: defaultCategoryId,
            price: "",
            image: "",
            stock: "",
          });
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Error al cargar los datos: ${error.message || 'Error desconocido'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      setSubmitting(true);
      setError(null);
      
      // Validar campos requeridos
      if (!form.name || !form.description || !form.categoryId || !form.price || !form.image || !form.stock) {
        setError('Por favor completa todos los campos');
        setSubmitting(false);
        return;
      }
      
      // Validar que categoryId sea válido
      if (!form.categoryId || form.categoryId === "") {
        setError('Por favor selecciona una categoría');
        setSubmitting(false);
        return;
      }
      
      // Convertir el formato del componente al formato del API
      const componentProduct = {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: parseInt(form.stock) || 0,
        image: form.image,
        images: [form.image], // Convertir imagen única a array
        categories: [parseInt(form.categoryId)], // Convertir categoryId (string) a número para el array de IDs
      };
      
      console.log('Component product before mapping:', componentProduct);
      const apiData = mapProductToAPI(componentProduct);
      console.log('API data after mapping:', apiData);
      
      console.log('Sending request:', {
        isEditing,
        editProductId,
        apiData
      });

      let result;
      if (isEditing && editProductId) {
        // Actualizar producto existente
        result = await api.updateProduct(editProductId, apiData);
      } else {
        // Crear nuevo producto
        result = await api.createProduct(apiData);
      }
      
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
      let errorMessage = "Error al guardar el producto. Por favor, intenta nuevamente.";
      
      if (err.status === 401) {
        errorMessage = "Debes iniciar sesión para guardar productos";
      } else if (err.status === 403) {
        errorMessage = "No tienes permiso para realizar esta acción";
      } else if (err.status === 400) {
        errorMessage = err.message || "Datos inválidos. Por favor verifica los campos";
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setSubmitting(false);
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
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>
            {error}
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
            <label htmlFor="categoryId" className="form-label">
              Categoría
            </label>
            <select
              className="form-control"
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              required
              disabled={loading || categories.length === 0}
            >
              {loading ? (
                <option value="">Cargando categorías...</option>
              ) : categories.length === 0 ? (
                <option value="">No hay categorías disponibles</option>
              ) : (
                categories.map((cat) => {
                  // Manejar diferentes formatos de categoría
                  const categoryId = String(cat.id || cat);
                  const categoryName = cat.nombre || cat.name || String(cat);
                  return (
                    <option key={categoryId} value={categoryId}>
                      {categoryName}
                    </option>
                  );
                })
              )}
            </select>
            {categories.length === 0 && !loading && (
              <small style={{ color: 'red', display: 'block', marginTop: '0.25rem' }}>
                No se pudieron cargar las categorías. Por favor, recarga la página.
              </small>
            )}
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
              placeholder="$0.00"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock" className="form-label">
              Stock
            </label>
            <input
              type="number"
              className="form-control"
              id="stock"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
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
              placeholder="https://ejemplo.com/imagen.jpg"
              required
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <button 
            type="submit" 
            className="btn-primary submit-btn"
            disabled={loading || submitting}
          >
            {submitting 
              ? (isEditing ? "Guardando..." : "Agregando...") 
              : (isEditing ? "Guardar Cambios" : "Agregar Producto")
            }
          </button>
        </div>
      </form>
    </div>
  );
};
