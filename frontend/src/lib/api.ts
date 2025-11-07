import axios from 'axios';

// Base URL for your backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API functions for your backend routes
export const diagnosisAPI = {
  create: (data: unknown) => api.post('/diagnosis', data),
  getAll: () => api.get('/diagnosis'),
  getById: (id: string) => api.get(`/diagnosis/${id}`),
};

export const reportAPI = {
  create: (data: unknown) => api.post('/report', data),
  getAll: () => api.get('/report'),
  getById: (id: string) => api.get(`/report/${id}`),
};

export type ChatMessage = {
  sessionId: string;
  message: string;
};

export type ChatStartResponse = {
  sessionId: string;
};

export type ChatSendResponse = {
  reply: string;
};

export const chatAPI = {
  startSession: (): Promise<{ data: ChatStartResponse }> => api.post('/chat/start'),
  sendMessage: (data: ChatMessage): Promise<{ data: ChatSendResponse }> => api.post('/chat/send', data),
};

export type DiagnosisRequest = {
  symptoms: string;
};

export type DiagnosisResponse = {
  diagnosis: string;
  medications: Array<{
    name: string;
    description: string;
  }>;
  prescription: string[];
  specialist: string;
  dietary_suggestions: string[];
  disclaimer: string;
};

export const diagnosisAPINew = {
  getDiagnosis: (data: DiagnosisRequest): Promise<{ data: DiagnosisResponse }> => 
    api.post('/diagnosis', data),
};

export const reportAPINew = {
  uploadReport: (file: File): Promise<{ data: DiagnosisResponse }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/report', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const medicineAPI = {
  search: (query: string) => api.get(`/medicine?q=${query}`),
  getAll: () => api.get('/medicine'),
  getById: (id: string) => api.get(`/medicine/${id}`),
};

export type StudentCreate = {
  firstName: string;
  lastName?: string;
  email?: string;
  age?: number;
  [key: string]: unknown;
};

export const studentAPI = {
  create: (data: StudentCreate) => api.post('/student', data),
  getAll: () => api.get('/student'),
  getById: (id: string) => api.get(`/student/${id}`),
};

export const dataAPI = {
  getStats: () => api.get('/data'),
};

export const cacheAPI = {
  get: (key: string) => api.get(`/cache/${key}`),
  set: (data: unknown) => api.post('/cache', data),
};

export default api;
