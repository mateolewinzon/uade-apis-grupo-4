/**
 * Utility functions to map API product data structure to component format
 */

/**
 * Maps API product structure to component format
 * API: { id, nombre, descripcion, precio, stock, imagenUrls[], categorias[], reviews[], vendedor }
 * Component: { id, name, description, price, stock, image, images[], category, categories[], reviews[], seller }
 */
export const mapProductFromAPI = (apiProduct) => {
  // Calcular rating promedio y total de reviews si hay reviews
  let rating = 0;
  let reviewsCount = 0;
  const reviews = apiProduct.reviews || [];
  
  if (reviews.length > 0) {
    const sumRating = reviews.reduce((sum, review) => sum + (review.valoracion || 0), 0);
    rating = sumRating / reviews.length;
    reviewsCount = reviews.length;
  }
  
  return {
    id: apiProduct.id,
    name: apiProduct.nombre,
    description: apiProduct.descripcion,
    price: formatPrice(apiProduct.precio),
    originalPrice: null, // API doesn't provide original price
    stock: apiProduct.stock,
    image: apiProduct.imagenUrls && apiProduct.imagenUrls.length > 0 
      ? apiProduct.imagenUrls[0] 
      : '/placeholder.svg',
    images: apiProduct.imagenUrls || [],
    category: apiProduct.categorias && apiProduct.categorias.length > 0
      ? apiProduct.categorias[0].nombre
      : null,
    categories: apiProduct.categorias || [],
    badge: null, // Not provided by API
    rating: rating, // Calculado desde reviews incluidas
    reviews: reviewsCount, // Total de reviews
    reviewsData: reviews, // Datos completos de reviews
    seller: apiProduct.vendedor || null,
  };
};

/**
 * Maps multiple API products
 */
export const mapProductsFromAPI = (apiProducts) => {
  return apiProducts.map(mapProductFromAPI);
};

/**
 * Maps component product format to API format for creating/updating
 */
export const mapProductToAPI = (componentProduct) => {
  return {
    nombre: componentProduct.name,
    descripcion: componentProduct.description,
    precio: parseFloat(componentProduct.price.replace(/[^0-9.]/g, '')) || componentProduct.price,
    stock: componentProduct.stock,
    imagenUrls: componentProduct.images || (componentProduct.image ? [componentProduct.image] : []),
    categoriaIds: componentProduct.categories?.map(cat => 
      typeof cat === 'object' ? cat.id : cat
    ) || [],
  };
};

/**
 * Formats price as currency
 */
export const formatPrice = (price) => {
  if (typeof price === 'string') {
    return price;
  }
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(price);
};

/**
 * Parses price string to number
 */
export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') {
    return priceString;
  }
  return parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
};

