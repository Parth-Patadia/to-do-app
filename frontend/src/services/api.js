import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  console.log('API Response:', response.data);
  return response;
}, (error) => {
  console.error('API Error:', error.response?.data);
  return Promise.reject(error);
});

export const authService = {
  async register(userData) {
    const response = await api.post('/users/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async login(userData) {
    const response = await api.post('/users/login', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const todoService = {
  async getTodos() {
    const response = await api.get('/todos');
    return response.data;
  },

  async createTodo(todoData) {
    try {
      console.log('Sending todo data:', todoData);
      const response = await api.post('/todos', {
        text: todoData.text,
        priority: todoData.priority,
        dueDate: todoData.dueDate
      });
      return response.data;
    } catch (error) {
      console.error('Create Todo Error:', error);
      throw error;
    }
  },

  async updateTodo(id, todoData) {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },

  async deleteTodo(id) {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  },

  async toggleTodo(id) {
    const response = await api.put(`/todos/${id}/toggle`);
    return response.data;
  },
};

export default api; 