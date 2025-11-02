import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Register.css";

export const Register = () => {
  // Hook para navegar programáticamente entre rutas
  const navigate = useNavigate();
  
  // Obtenemos la función register del contexto de usuario
  const { register } = useUser();
  
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    direccion: {
      calle: "",
      ciudad: "",
      codigoPostal: "",
      pais: "Argentina"
    }
  });
  
  // Estados para manejar la UI del formulario
  const [loading, setLoading] = useState(false); // Para mostrar estado de carga
  const [error, setError] = useState(""); // Para mostrar errores
  const [success, setSuccess] = useState(""); // Para mostrar mensaje de éxito

  // Función que se ejecuta cuando el usuario escribe en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si el campo es parte de direccion, actualizar el objeto direccion
    if (name.startsWith('direccion.')) {
      const direccionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [direccionField]: value
        }
      }));
    } else {
      // Actualizamos el estado del formulario manteniendo los valores anteriores
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpiamos los mensajes de error y éxito cuando el usuario empieza a escribir
    if (error) setError("");
    if (success) setSuccess("");
  };

  // Función para validar los datos del formulario antes de enviar
  const validateForm = () => {
    // Verificamos que todos los campos obligatorios estén completos
    if (!formData.nombre || !formData.apellido || 
        !formData.email || !formData.password || !formData.confirmPassword ||
        !formData.direccion.calle || !formData.direccion.ciudad || !formData.direccion.codigoPostal) {
      return "Todos los campos son obligatorios";
    }

    // Validamos el formato del email usando una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Por favor ingresa un email válido";
    }

    // Verificamos que la contraseña tenga al menos 6 caracteres
    if (formData.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }

    // Verificamos que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      return "Las contraseñas no coinciden";
    }

    return null; // Si no hay errores, retornamos null
  };

  // Función que se ejecuta cuando el usuario envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitamos que la página se recargue
    
    // Validamos el formulario
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true); // Activamos el estado de carga
    setError(""); // Limpiamos errores previos

    try {
      // Preparamos los datos del usuario para enviar (sin confirmPassword)
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        direccion: formData.direccion,
        role: 'USER' // Por defecto USER, se puede cambiar a ADMIN si es necesario
      };

      // Llamamos a la función register del contexto
      await register(userData);
      
      // Si el registro es exitoso, mostramos mensaje y redirigimos
      setSuccess("¡Registro exitoso! Redirigiendo...");
      setTimeout(() => {
        navigate("/"); // Redirigimos al home después de 2 segundos
      }, 2000);
      
    } catch (error) {
      // Si hay un error, lo mostramos al usuario
      setError(error.message || "Error al registrar usuario");
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Encabezado del formulario */}
        <div className="register-header">
          <h2>Crear Cuenta</h2>
          <p>Únete a MateMarket y descubre los mejores mates</p>
        </div>

        {/* Formulario de registro */}
        <form onSubmit={handleSubmit} className="register-form">
          {/* Fila para nombre y apellido */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="form-input"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Campo para email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Fila para dirección */}
          <div className="form-group">
            <label htmlFor="direccion.calle">Dirección (Calle)</label>
            <input
              type="text"
              id="direccion.calle"
              name="direccion.calle"
              value={formData.direccion.calle}
              onChange={handleChange}
              placeholder="Calle y número"
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="direccion.ciudad">Ciudad</label>
              <input
                type="text"
                id="direccion.ciudad"
                name="direccion.ciudad"
                value={formData.direccion.ciudad}
                onChange={handleChange}
                placeholder="Ciudad"
                className="form-input"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="direccion.codigoPostal">Código Postal</label>
              <input
                type="text"
                id="direccion.codigoPostal"
                name="direccion.codigoPostal"
                value={formData.direccion.codigoPostal}
                onChange={handleChange}
                placeholder="Código postal"
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="direccion.pais">País</label>
            <input
              type="text"
              id="direccion.pais"
              name="direccion.pais"
              value={formData.direccion.pais}
              onChange={handleChange}
              placeholder="País"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Fila para contraseñas */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="form-input"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className="form-input"
                disabled={loading}
              />
            </div>
          </div>

          {/* Mensajes de error y éxito */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Botón de envío */}
          <button 
            type="submit" 
            className="register-button"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        {/* Enlace para ir al login */}
        <div className="register-footer">
          <p>
            ¿Ya tienes cuenta? 
            <Link to="/login" className="login-link"> Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
