import "./App.css";
import ProductList from "./components/ProductsList/ProductList";
import Container from "./components/Container";
import { CartProvider } from "./context/CartContext";
import {Footer}  from "./components/Footer/Footer";
import {Header} from "./components/Header/Header";

function App() {

  return (
    <CartProvider>
      <Header />
      <Container>
        <ProductList />
      </Container>
      <Footer />
    </CartProvider>
  );
}

export default App;
