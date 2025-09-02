import { useCart } from '../context/CartContext';


export default function Product({ product }) {
    const { addToCart } = useCart();
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px' }}>
            <h2>{product.nombre}</h2>
            <p><strong>Precio:</strong> ${product.precio}</p>
            <p><strong>Categoría:</strong> {product.categoria}</p>
            <p><strong>Descripción:</strong> {product.descripcion}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <button onClick={() => addToCart(product)}>Agregar al carrito</button>
            {product.imagen && (
                <img 
                    src={product.imagen} 
                    alt={product.nombre} 
                    style={{ maxWidth: '200px', height: 'auto' }}
                />
            )}
        </div>
    )
}