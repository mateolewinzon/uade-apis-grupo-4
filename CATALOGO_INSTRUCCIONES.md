# Catálogo de Productos - Instrucciones de Uso

## 🎯 Funcionalidades Implementadas

### ✅ Autenticación
- **Catálogo público**: El catálogo completo es accesible sin autenticación
- **Carrito protegido**: Solo usuarios autenticados pueden agregar productos al carrito
- **Demo simple**: Usa cualquier email y contraseña para acceder
- **Persistencia**: La sesión se mantiene al recargar la página
- **Logout**: Opción para cerrar sesión desde el header

### ✅ Home del Catálogo
- **Acceso público**: Visible para todos los usuarios (autenticados y no autenticados)
- **Mensaje dinámico**: Personalizado según el estado de autenticación
- **Prompt de login**: Invita a usuarios no autenticados a iniciar sesión
- **Sección de categorías**: Muestra todas las categorías disponibles con iconos y contadores
- **Listado de productos**: Ordenados alfabéticamente por nombre
- **Navegación por categorías**: Enlaces directos a cada categoría
- **Categorías ordenadas**: Las categorías se muestran en orden alfabético

### ✅ Detalle de Productos
- **Imagen ampliada**: Visualización clara del producto
- **Información completa**: Descripción, precio, vendedor, stock
- **Validación de stock**: No se puede agregar al carrito si no hay stock
- **Navegación**: Botón para volver al catálogo

### ✅ Gestión de Stock
- **Indicadores visuales**: 
  - Productos con stock: Botón dinámico según autenticación
  - Productos sin stock: Overlay rojo "Sin Stock" y botón deshabilitado
- **Validación de autenticación**: Solo usuarios autenticados pueden agregar al carrito
- **Validación de stock**: Solo productos con stock se pueden agregar
- **Información de stock**: Muestra cantidad disponible

### ✅ Carrito de Compras
- **Agregado de productos**: Solo productos con stock
- **Contador en header**: Muestra cantidad de items en el carrito
- **Persistencia**: Los items se mantienen durante la sesión

## 🚀 Cómo Usar la Aplicación

### 1. Iniciar el Servidor JSON
```bash
# Opción 1: Usar el script npm (recomendado)
npm run json-server

# Opción 2: Comando directo
json-server --watch db.json --port 3000
```

**⚠️ IMPORTANTE**: El servidor JSON debe estar ejecutándose en el puerto 3000 para que la aplicación funcione correctamente.

### 2. Iniciar la Aplicación React
```bash
# Instalar dependencias
npm install

# Iniciar la aplicación
npm run dev
```

### 3. Flujo de Usuario

1. **Acceso inicial**: Al visitar la página, verás el catálogo completo sin necesidad de login
2. **Explorar productos**: 
   - Haz clic en cualquier producto para ver el detalle
   - Navega por categorías usando los enlaces (todos los productos están ordenados alfabéticamente)
   - Usa el botón "Volver al Catálogo Completo" desde las páginas de categorías
3. **Para comprar**: 
   - Haz clic en "Iniciar Sesión para Comprar" en cualquier producto
   - Usa cualquier email y contraseña (ej: `test@test.com` / `123456`)
4. **Después del login**: 
   - Los botones cambian a "Agregar al Carrito"
   - Solo productos con stock se pueden agregar
   - El carrito aparece en el header
5. **Ver carrito**: Usa el enlace en el header para ver los productos agregados

## 📁 Estructura de Archivos Modificados

### Nuevos Componentes
- `src/components/Home/Home.jsx` - Página principal del catálogo
- `src/components/Home/Home.css` - Estilos del catálogo
- `src/context/AuthContext.jsx` - Contexto de autenticación

### Componentes Modificados
- `src/components/DetailProduct/DetailProduct.jsx` - Detalle completo del producto
- `src/components/DetailProduct/DetailProduct.css` - Estilos del detalle
- `src/components/CardProduct/CardProduct.jsx` - Tarjeta con validación de stock
- `src/components/CardProduct/CardProduct.css` - Estilos actualizados
- `src/components/Login/Login.jsx` - Login funcional
- `src/components/Login/Login.css` - Estilos del login
- `src/components/Header/Header.jsx` - Header con información de usuario
- `src/components/Header/Header.css` - Estilos del header actualizados
- `src/App.jsx` - Integración de autenticación y rutas

### Base de Datos
- `db.json` - Agregada propiedad `stock` a todos los productos

## 🎨 Características de Diseño

- **Responsive**: Funciona en desktop y móvil
- **Moderno**: Gradientes, sombras y transiciones suaves
- **Intuitivo**: Navegación clara y feedback visual
- **Accesible**: Indicadores claros de estado y acciones

## 🔧 Configuración Técnica

### Dependencias Utilizadas
- React Router DOM para navegación
- Context API para estado global
- CSS moderno con flexbox y grid
- Lucide React para iconos

### API Endpoints
- `GET /productos` - Lista todos los productos
- `GET /productos/:id` - Obtiene un producto específico

## 🐛 Casos de Prueba

### Productos con Stock
- Mate Imperial Calabaza Premium (Stock: 15)
- Bombilla Alpaca Cincelada (Stock: 8)
- Set Completo Principiante (Stock: 12)
- Yerba Mate Premium Orgánica (Stock: 25)
- Termo Acero Inoxidable 1L (Stock: 6)

### Productos sin Stock
- Mate Camionero Forrado (Stock: 0) - Para probar la funcionalidad de "sin stock"

## 📱 Responsive Design

La aplicación está optimizada para:
- **Desktop**: Layout de dos columnas en detalle de producto
- **Tablet**: Grid adaptativo en catálogo
- **Mobile**: Navegación colapsable y layout de una columna

## 🔧 Solución de Problemas

### ❌ "Producto no encontrado" o "Sin stock" en todos los productos

**Causa**: El servidor JSON no está ejecutándose o no está en el puerto correcto.

**Solución**:
1. Verifica que el servidor JSON esté ejecutándose:
   ```bash
   npm run json-server
   ```
2. Debe mostrar: `Resources: http://localhost:3000/productos`
3. Prueba la API directamente: `http://localhost:3000/productos`

### ❌ Error de CORS o conexión

**Solución**: Asegúrate de que ambos servidores estén ejecutándose:
- **Servidor JSON**: Puerto 3000 (`npm run json-server`)
- **Aplicación React**: Puerto 5000 (`npm run dev`)

### 🧪 Probar la API

Puedes usar el script de prueba incluido:
```bash
node test-api.js
```

¡La aplicación está lista para usar! 🎉
