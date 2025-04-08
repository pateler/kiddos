
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests that need it
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  createAdmin: async (username: string, email: string, password: string, adminKey: string) => {
    const response = await api.post('/auth/create-admin', { 
      username, 
      email, 
      password,
      adminKey
    });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },
  
  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },
  
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'admin';
  }
};

export const videoService = {
  getAllVideos: async () => {
    const response = await api.get('/videos');
    return response.data;
  },
  
  getVideo: async (id: string) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },
  
  uploadVideo: async (videoData: FormData) => {
    const response = await api.post('/videos', videoData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  updateVideo: async (id: string, videoData: any) => {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data;
  },
  
  deleteVideo: async (id: string) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },
  
  getStreamUrl: (id: string) => {
    return `${API_URL}/videos/${id}/stream`;
  }
};

export default api;
