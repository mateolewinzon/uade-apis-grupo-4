import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./Login.css";

export const Login = () => {
  // Hook para navegar programáticamente entre rutas
  const navigate = useNavigate();
  
  // Obtenemos la función login del contexto de usuario
  const { login } = useUser();
  
  // Estado para manejar los datos del formulario de login
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  // Estados para manejar la UI del formulario
  const [loading, setLoading] = useState(false); // Para mostrar estado de carga
  const [error, setError] = useState(""); // Para mostrar errores
  const [success, setSuccess] = useState(""); // Para mostrar mensaje de éxito

  // Función que se ejecuta cuando el usuario escribe en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualizamos el estado del formulario manteniendo los valores anteriores
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiamos los mensajes de error cuando el usuario empieza a escribir
    if (error) setError("");
    if (success) setSuccess("");
  };

  // Función para validar los datos del formulario antes de enviar
  const validateForm = () => {
    // Verificamos que ambos campos estén completos
    if (!formData.email || !formData.password) {
      return "Todos los campos son obligatorios";
    }

    // Validamos el formato del email usando una expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Por favor ingresa un email válido";
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
      // Llamamos a la función login del contexto
      await login(formData.email, formData.password);
      
      // Si el login es exitoso, mostramos mensaje y redirigimos
      setSuccess("¡Inicio de sesión exitoso! Redirigiendo...");
      setTimeout(() => {
        navigate("/"); // Redirigimos al home después de 2 segundos
      }, 2000);
      
    } catch (error) {
      // Si hay un error, lo mostramos al usuario
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false); // Desactivamos el estado de carga
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Encabezado del formulario */}
        <div className="login-header">
          <div className="login-icon">🧉</div>
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido de vuelta a MateMarket</p>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="login-form">
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

          {/* Campo para contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* Mensajes de error y éxito */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Botón de envío */}
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Pie del formulario con enlace al registro */}
        <div className="login-footer">
          <p>
            ¿No tienes cuenta? 
            <Link to="/register" className="register-link"> Registrarse</Link>
          </p>
        </div>

        {/* Sección de demostración con usuarios de prueba */}
        <div className="demo-section">
          <h3>Usuarios de prueba:</h3>
          <div className="demo-users">
            <div className="demo-user">
              <strong>Email:</strong> juan.perez@email.com <br />
              <strong>Contraseña:</strong> 123456
            </div>
            <div className="demo-user">
              <strong>Email:</strong> maria.garcia@email.com <br />
              <strong>Contraseña:</strong> 123456
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
