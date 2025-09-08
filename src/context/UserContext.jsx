import { createContext, useState, useContext, useEffect } from 'react';

// Creamos el contexto para manejar el estado del usuario en toda la aplicación
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Estado para almacenar la información del usuario logueado
    const [user, setUser] = useState(null);
    // Estado para controlar si estamos cargando datos del usuario
    const [loading, setLoading] = useState(true);

    // useEffect para verificar si hay un usuario logueado al cargar la aplicación
    useEffect(() => {
        // Verificamos si hay datos de usuario guardados en localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            // Si hay datos guardados, los parseamos y los establecemos como usuario actual
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // Función para registrar un nuevo usuario
    const register = async (userData) => {
        try {
            // Obtenemos los usuarios existentes de la base de datos
            const response = await fetch('http://localhost:3000/usuarios');
            const users = await response.json();

            // Verificamos si ya existe un usuario con el mismo email
            const existingUser = users.find(user => user.email === userData.email);
            if (existingUser) {
                throw new Error('Ya existe un usuario con este email');
            }

            // Verificamos si ya existe un usuario con el mismo username
            const existingUsername = users.find(user => user.username === userData.username);
            if (existingUsername) {
                throw new Error('Ya existe un usuario con este nombre de usuario');
            }

            // Creamos el nuevo usuario con un ID único
            const newUser = {
                ...userData,
                id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
                // Generamos un avatar aleatorio usando el servicio DiceBear
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`
            };

            // Guardamos el nuevo usuario en la base de datos
            const createResponse = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!createResponse.ok) {
                throw new Error('Error al crear el usuario');
            }

            const createdUser = await createResponse.json();

            // Establecemos el nuevo usuario como el usuario actual
            setUser(createdUser);
            // Guardamos los datos del usuario en localStorage para persistencia
            localStorage.setItem('currentUser', JSON.stringify(createdUser));

            return createdUser;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    };

    // Función para iniciar sesión
    const login = async (email, password) => {
        try {
            // Obtenemos todos los usuarios de la base de datos
            const response = await fetch('http://localhost:3000/usuarios');
            const users = await response.json();

            // Buscamos un usuario que coincida con el email y contraseña proporcionados
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                throw new Error('Credenciales incorrectas');
            }

            // Si las credenciales son correctas, establecemos el usuario como logueado
            setUser(user);
            // Guardamos los datos del usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        // Limpiamos el estado del usuario
        setUser(null);
        // Eliminamos los datos del usuario de localStorage
        localStorage.removeItem('currentUser');
    };

    // Función para verificar si el usuario está logueado
    const isAuthenticated = () => {
        return user !== null;
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