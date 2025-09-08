import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductsList/ProductList";
import Container from "./components/Container";
import { CartProvider } from "./context/CartContext";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { DetailProduct } from "./components/DetailProduct/DetailProduct";
import { Cart } from "./components/Checkout/Cart";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { DashboardSeller } from "./components/DashboardSeller/DashboardSeller";
import { FormProduct } from "./components/FormProduct/FormProduct";
import CartPreview from "./components/Checkout/CartPreview";

// Configuración de rutas
const routes = [
  // Rutas principales
  {
    path: "/",
    element: <ProductList />,
    name: "Home"
  },
  {
    path: "/producto/:id",
    element: <DetailProduct />,
    name: "Product Detail"
  },
  {
    path: "/carrito",
    element: <Cart />,
    name: "Shopping Cart"
  },
  
  // Autenticación
  {
    path: "/login",
    element: <Login />,
    name: "Login"
  },
  {
    path: "/register",
    element: <Register />,
    name: "Register"
  },
  
  // Vendedores
  {
    path: "/dashboard",
    element: <DashboardSeller />,
    name: "Seller Dashboard"
  },
  {
    path: "/vender",
    element: <FormProduct />,
    name: "Add Product"
  },
  {
    path: "/producto/editar/:id",
    element: <FormProduct />,
    name: "Edit Product"
  },
  {
    path: "/vendedores",
    element: <ProductList showSellers={true} />,
    name: "Sellers"
  },
  
  // Categorías
  {
    path: "/categoria/mates",
    element: <ProductList category="Mates" />,
    name: "Mates Category"
  },
  {
    path: "/categoria/bombillas",
    element: <ProductList category="Bombillas" />,
    name: "Bombillas Category"
  },
  {
    path: "/categoria/yerba",
    element: <ProductList category="Yerba" />,
    name: "Yerba Category"
  },
  {
    path: "/categoria/accesorios",
    element: <ProductList category="Accesorios" />,
    name: "Accesorios Category"
  },
  {
    path: "/categoria/kits",
    element: <ProductList category="Kits" />,
    name: "Kits Category"
  },
  
  // Página 404
  {
    path: "*",
    element: (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Página no encontrada</h2>
        <p>La página que buscas no existe.</p>
      </div>
    ),
    name: "404 Not Found"
  }
];

function App() {
  return (
    <CartProvider>
      <Router>
        <CartPreview />
        <Header />
        <Container>
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Container>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App;
