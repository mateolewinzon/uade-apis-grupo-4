const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';

class ApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}${API_PREFIX}`;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ 
          error: 'Unknown error',
          message: response.statusText 
        }));
        throw new ApiError(error.message || error.error, response.status, error);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      // Handle plain text responses (like JWT token)
      return await response.text();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, error);
    }
  }

  // Authentication
  async register(data) {
    const token = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(token);
    return token;
  }

  async login(data) {
    const token = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(token);
    return token;
  }

  logout() {
    this.removeToken();
  }

  // Products
  async getProducts() {
    return this.request('/productos');
  }

  async getProduct(id) {
    return this.request(`/productos/${id}`);
  }

  async getMyProducts() {
    return this.request('/productos/mis-productos');
  }

  async createProduct(data) {
    return this.request('/productos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id, data) {
    return this.request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id) {
    return this.request(`/productos/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories() {
    return this.request('/categorias');
  }

  async getCategory(id) {
    return this.request(`/categorias/${id}`);
  }

  async createCategory(data) {
    return this.request('/categorias', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id, data) {
    return this.request(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id) {
    return this.request(`/categorias/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    return this.request('/pedidos');
  }

  async getOrder(id) {
    return this.request(`/pedidos/${id}`);
  }

  async getUserOrders(userId) {
    return this.request(`/pedidos/usuario/${userId}`);
  }

  async getOrdersByState(estado) {
    return this.request(`/pedidos/estado/${estado}`);
  }

  async getUserOrdersByState(userId, estado) {
    return this.request(`/pedidos/usuario/${userId}/estado/${estado}`);
  }

  async createOrder(data) {
    return this.request('/pedidos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrder(id, data) {
    return this.request(`/pedidos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async partialUpdateOrder(id, data) {
    return this.request(`/pedidos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async cancelOrder(id) {
    return this.request(`/pedidos/${id}/cancel`, {
      method: 'PATCH',
    });
  }

  async deleteOrder(id) {
    return this.request(`/pedidos/${id}`, {
      method: 'DELETE',
    });
  }

  // Reviews
  async getReviews() {
    return this.request('/reviews');
  }

  async getReview(id) {
    return this.request(`/reviews/${id}`);
  }

  async getProductReviews(productId) {
    return this.request(`/reviews/producto/${productId}`);
  }

  async getUserReviews(userId) {
    return this.request(`/reviews/usuario/${userId}`);
  }

  async getProductReviewStats(productId) {
    return this.request(`/reviews/producto/${productId}/estadisticas`);
  }

  async getReviewsByRating(valoracion) {
    return this.request(`/reviews/valoracion/mayor/${valoracion}`);
  }

  async createReview(data) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteReview(id) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUsers() {
    return this.request('/usuarios');
  }

  async getUser(id) {
    return this.request(`/usuarios/${id}`);
  }

  async getUserByEmail(email) {
    return this.request(`/usuarios/email/${email}`);
  }

  async updateUser(id, data) {
    return this.request(`/usuarios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id) {
    return this.request(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export default new ApiService();
export { ApiError };

