import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductsList/ProductList";
import Container from "./components/Container";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext"; // Importamos el UserProvider
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { DetailProduct } from "./components/DetailProduct/DetailProduct";
import { Cart } from "./components/Checkout/Cart";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { FormProduct } from "./components/FormProduct/FormProduct";
import CartPreview from "./components/Checkout/CartPreview";
import { VenderPage } from "./components/VenderPage";
import LandingPage from "./components/LandingPage/LandingPage";

// Configuración de rutas
const routes = [
  // Rutas principales
  {
    path: "/",
    element: <LandingPage />,
    name: "Home",
  },
  {
    path: "/producto/:id",
    element: <DetailProduct />,
    name: "Product Detail",
  },
  {
    path: "/carrito",
    element: <Cart />,
    name: "Shopping Cart",
  },

  // Autenticación
  {
    path: "/login",
    element: <Login />,
    name: "Login",
  },
  {
    path: "/register",
    element: <Register />,
    name: "Register",
  },

  // Vendedores
  {
    path: "/vender",
    element: <VenderPage />,
    name: "Vender",
  },
  // {
  //   path: "/vendedores",
  //   element: <ProductList showSellers={true} />,
  //   name: "Sellers",
  // },

  // Categorías
  {
    path: "/productos/mates",
    element: <ProductList category="Mates" />,
    name: "Mates Category",
  },
  {
    path: "/productos/bombillas",
    element: <ProductList category="Bombillas" />,
    name: "Bombillas Category",
  },
  {
    path: "/productos/yerba",
    element: <ProductList category="Yerba" />,
    name: "Yerba Category",
  },
  {
    path: "/productos/accesorios",
    element: <ProductList category="Accesorios" />,
    name: "Accesorios Category",
  },
  {
    path: "/productos/kits",
    element: <ProductList category="Kits" />,
    name: "Kits Category",
  },
  {
    path: "/productos",
    element: <ProductList />,
    name: "Productos Category",
  },
  {
    path: "/form-product",
    element: <FormProduct />,
    name: "Form Product",
  },

  // Página 404
  {
    path: "*",
    element: (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h2>Página no encontrada</h2>
        <p>La página que buscas no existe.</p>
      </div>
    ),
    name: "404 Not Found",
  },
];

function App() {
  return (
    // Envolvemos toda la aplicación con UserProvider y CartProvider
    // Esto permite que cualquier componente acceda al estado del usuario y del carrito
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <CartPreview />
          <Header />
          <Container>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </Container>
          <Footer />
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
