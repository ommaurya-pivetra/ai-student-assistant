import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getToken = () => localStorage.getItem('auth_token');

if (import.meta.env.DEV) {
  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  });
} else {
  api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error Handler] Error received:', error);
    
    if (error.response) {
      console.error('[API Error Handler] Response data:', error.response.data);
      console.error('[API Error Handler] Status:', error.response.status);
      
      let errorMessage = "Server error occurred";
      
      if (error.response.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response.data?.error) {
        if (typeof error.response.data.error === 'string') {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = JSON.stringify(error.response.data.error);
        }
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
      
      const err = new Error(errorMessage);
      err.statusCode = error.response.status;
      throw err;
    } else if (error.request) {
      console.error('[API Error Handler] No response from server');
      throw new Error("No response from server. Check connection.");
    } else {
      console.error('[API Error Handler] Error creating request:', error.message);
      throw new Error(error.message || "Unexpected error");
    }
  }
);

export const generateAIResponse = async (prompt, mode) => {
  const response = await api.post("/ai/generate", {
    prompt,
    mode,
  });

  return response.data;
};

export const getModes = async () => {
  const res = await api.get("/ai/modes");
  return res.data;
};

export const healthCheck = async () => {
  const res = await api.get("/health");
  return res.data;
};

export const registerUser = async (email, password, username) => {
  const res = await api.post('/auth/register', { email, password, username });
  const token = res.data?.data?.token;
  if (token) {
    localStorage.setItem('auth_token', token);
  }
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  const token = res.data?.data?.token;
  if (token) {
    localStorage.setItem('auth_token', token);
  }
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem('auth_token');
};

export const getChatHistory = async () => {
  const res = await api.get('/chat/history');
  return res.data;
};

export const getChatById = async (chatId) => {
  const res = await api.get(`/chat/${chatId}`);
  return res.data;
};

export const saveChat = async (prompt, mode, response) => {
  const res = await api.post('/chat/save', {
    prompt,
    mode,
    response
  });
  return res.data;
};

export const deleteChat = async (chatId) => {
  const res = await api.delete(`/chat/${chatId}`);
  return res.data;
};

export const clearChatHistory = async () => {
  const res = await api.delete('/chat');
  return res.data;
};

export default api;
