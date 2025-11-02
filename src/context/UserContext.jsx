import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

// Creamos el contexto para manejar el estado del usuario en toda la aplicación
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Estado para almacenar la información del usuario logueado
    const [user, setUser] = useState(null);
    // Estado para controlar si estamos cargando datos del usuario
    const [loading, setLoading] = useState(true);

    // useEffect para verificar si hay un usuario logueado al cargar la aplicación
    useEffect(() => {
        const loadUserData = async () => {
            // Verificamos si hay un token guardado
            const token = api.getToken();
            if (token) {
                // Verificar si hay datos de usuario guardados en localStorage
                const savedUser = localStorage.getItem('currentUser');
                if (savedUser) {
                    try {
                        const userData = JSON.parse(savedUser);
                        setUser(userData);
                        setLoading(false);
                        return;
                    } catch (err) {
                        console.error('Error parsing saved user data:', err);
                    }
                }
                
                // Si no hay datos guardados, intentar obtenerlos del API
                // Por ahora solo verificamos que el token existe
                // En una implementación completa, podrías decodificar el JWT para obtener el email
                // y luego hacer una petición al backend para obtener los datos del usuario
                // Para simplificar, marcamos que hay un usuario autenticado con valores mínimos
                setUser({ 
                    authenticated: true,
                    avatar: '/placeholder-user.jpg',
                    username: 'Usuario',
                    nombre: 'Usuario'
                });
            }
            setLoading(false);
        };
        
        loadUserData();
    }, []);

    // Función para obtener información del usuario desde el backend
    const fetchUserData = async () => {
        try {
            // Intentar obtener el usuario por email si tenemos el token
            // Por ahora retornamos null ya que necesitamos el email del usuario
            // En una implementación completa, podrías decodificar el JWT para obtener el email
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    };

    // Función para registrar un nuevo usuario
    const register = async (userData) => {
        try {
            // Preparar datos según la estructura esperada por el API
            const apiData = {
                nombre: userData.nombre,
                apellido: userData.apellido,
                email: userData.email,
                password: userData.password,
                direccion: userData.direccion || {
                    calle: '',
                    ciudad: '',
                    codigoPostal: '',
                    pais: 'Argentina'
                },
                role: userData.role || 'USER'
            };

            // Registrar usuario a través del API
            const token = await api.register(apiData);
            
            // Guardar token en localStorage (ya lo hace api.register)
            // El token JWT se almacena automáticamente por el servicio API
            
            // Intentar obtener datos del usuario
            try {
                const userEmail = userData.email;
                const userInfo = await api.getUserByEmail(userEmail);
                setUser(userInfo);
                localStorage.setItem('currentUser', JSON.stringify(userInfo));
                return userInfo;
            } catch (err) {
                console.log('Could not fetch user details, using minimal user object:', err);
                // Si no podemos obtener los datos del usuario, crear un objeto mínimo con los datos que tenemos
                const minimalUser = {
                    authenticated: true,
                    email: userData.email,
                    nombre: userData.nombre,
                    apellido: userData.apellido,
                    // Agregar propiedades por defecto para evitar errores en componentes
                    avatar: userData.avatar || '/placeholder-user.jpg',
                    username: userData.email.split('@')[0] // Usar parte del email como username
                };
                setUser(minimalUser);
                localStorage.setItem('currentUser', JSON.stringify(minimalUser));
                return minimalUser;
            }
        } catch (error) {
            console.error('Error en registro:', error);
            // Manejar diferentes tipos de errores del API
            if (error.status === 409) {
                throw new Error('Ya existe un usuario con este email');
            } else if (error.status === 400) {
                const errorMsg = error.data?.message || 'Datos inválidos';
                throw new Error(errorMsg);
            }
            throw new Error(error.message || 'Error al registrar usuario');
        }
    };

    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            // Llamar al API de login
            const token = await api.login({ email, password });
            
            // El token JWT se almacena automáticamente por el servicio API
            
            // Intentar obtener información del usuario
            try {
                const userInfo = await api.getUserByEmail(email);
                setUser(userInfo);
                localStorage.setItem('currentUser', JSON.stringify(userInfo));
                return userInfo;
            } catch (err) {
                console.log('Could not fetch user details, using minimal user object:', err);
                // Si no podemos obtener los datos del usuario, crear un objeto mínimo
                const minimalUser = {
                    authenticated: true,
                    email: email,
                    // Agregar propiedades por defecto para evitar errores en componentes
                    avatar: '/placeholder-user.jpg',
                    username: email.split('@')[0], // Usar parte del email como username
                    nombre: email.split('@')[0] // Usar como nombre temporal
                };
                setUser(minimalUser);
                localStorage.setItem('currentUser', JSON.stringify(minimalUser));
                return minimalUser;
            }
        } catch (error) {
            console.error('Error en login:', error);
            if (error.status === 401) {
                throw new Error('Credenciales incorrectas');
            }
            throw new Error(error.message || 'Error al iniciar sesión');
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        // Limpiar token y datos del usuario
        api.logout();
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    // Función para verificar si el usuario está logueado
    const isAuthenticated = () => {
        return api.getToken() !== null;
    };

    // Valor que se proveerá a todos los componentes hijos
    const value = {
        user,           // Información del usuario actual
        loading,        // Estado de carga
        register,       // Función para registrar usuario
        login,          // Función para iniciar sesión
        logout,         // Función para cerrar sesión
        isAuthenticated // Función para verificar autenticación
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto de usuario
export const useUser = () => {
    const context = useContext(UserContext);
    
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserProvider');
    }
    
    return context;
};