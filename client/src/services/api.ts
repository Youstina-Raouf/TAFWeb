import axios, { AxiosResponse } from 'axios';
import { AuthResponse, Product, ProductsResponse, Order, OrdersResponse, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: any;
  }): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/register', userData),

  login: (credentials: {
    email: string;
    password: string;
  }): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/auth/login', credentials),

  getMe: (): Promise<AxiosResponse<{ user: User }>> =>
    api.get('/auth/me'),

  updateProfile: (userData: {
    name?: string;
    phone?: string;
    address?: any;
  }): Promise<AxiosResponse<{ message: string; user: User }>> =>
    api.put('/auth/profile', userData),
};

// Products API
export const productsAPI = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<AxiosResponse<ProductsResponse>> =>
    api.get('/products', { params }),

  getProduct: (id: string): Promise<AxiosResponse<Product>> =>
    api.get(`/products/${id}`),

  getProductsByCategory: (category: string, limit?: number): Promise<AxiosResponse<Product[]>> =>
    api.get(`/products/category/${category}`, { params: { limit } }),

  getFeaturedProducts: (limit?: number): Promise<AxiosResponse<Product[]>> =>
    api.get('/products/featured', { params: { limit } }),

  searchProducts: (query: string, limit?: number): Promise<AxiosResponse<Product[]>> =>
    api.get('/products/search', { params: { q: query, limit } }),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData: {
    items: Array<{
      product: string;
      quantity: number;
    }>;
    shippingAddress: any;
    billingAddress?: any;
    paymentMethod: string;
    notes?: string;
  }): Promise<AxiosResponse<{ message: string; order: Order }>> =>
    api.post('/orders', orderData),

  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<AxiosResponse<OrdersResponse>> =>
    api.get('/orders', { params }),

  getOrder: (id: string): Promise<AxiosResponse<Order>> =>
    api.get(`/orders/${id}`),

  cancelOrder: (id: string): Promise<AxiosResponse<{ message: string; order: Order }>> =>
    api.put(`/orders/${id}/cancel`),

  processPayment: (id: string): Promise<AxiosResponse<{ message: string; paymentId: string }>> =>
    api.post(`/orders/${id}/payment`),
};

// Admin API
export const adminAPI = {
  getDashboard: (): Promise<AxiosResponse<any>> =>
    api.get('/admin/dashboard'),

  // Products
  createProduct: (productData: Partial<Product>): Promise<AxiosResponse<{ message: string; product: Product }>> =>
    api.post('/admin/products', productData),

  updateProduct: (id: string, productData: Partial<Product>): Promise<AxiosResponse<{ message: string; product: Product }>> =>
    api.put(`/admin/products/${id}`, productData),

  deleteProduct: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/admin/products/${id}`),

  getProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<AxiosResponse<ProductsResponse>> =>
    api.get('/admin/products', { params }),

  // Orders
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
  }): Promise<AxiosResponse<OrdersResponse>> =>
    api.get('/admin/orders', { params }),

  updateOrderStatus: (id: string, status: string): Promise<AxiosResponse<{ message: string; order: Order }>> =>
    api.put(`/admin/orders/${id}/status`, { status }),

  // Users
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AxiosResponse<{ users: User[]; pagination: any }>> =>
    api.get('/admin/users', { params }),

  updateUserStatus: (id: string, isActive: boolean): Promise<AxiosResponse<{ message: string; user: User }>> =>
    api.put(`/admin/users/${id}/status`, { isActive }),
};

export default api;
