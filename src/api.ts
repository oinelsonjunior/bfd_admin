import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://bfd-api.onrender.com/api/v1';

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (email: string, senha: string) => api.post('/auth/login', { email, senha }),
};

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  diaristas: (aprovadas?: boolean) =>
    api.get('/admin/diaristas', { params: aprovadas !== undefined ? { aprovadas } : {} }),
  aprovar: (id: string) => api.patch(`/admin/diaristas/${id}/aprovar`),
  reprovar: (id: string) => api.patch(`/admin/diaristas/${id}/reprovar`),
  bloquear: (id: string) => api.patch(`/admin/usuarios/${id}/bloquear`),
  desbloquear: (id: string) => api.patch(`/admin/usuarios/${id}/desbloquear`),
  clientes: () => api.get('/admin/clientes'),
  servicos: () => api.get('/admin/servicos'),
};

export const tiposApi = {
  listar: () => api.get('/tipos-servico/todos'),
  criar: (data: any) => api.post('/tipos-servico', data),
  atualizar: (id: string, data: any) => api.patch(`/tipos-servico/${id}`, data),
  remover: (id: string) => api.delete(`/tipos-servico/${id}`),
};
