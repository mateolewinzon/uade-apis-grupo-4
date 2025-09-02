import "./App.css";
import ProductList from "./components/ProductList";
import Container from "./components/Container";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <CartProvider>
      <Container>
        <Navbar />
        <ProductList />
      </Container>
    </CartProvider>
  );
}

export default App;
