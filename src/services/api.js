// Centralized API Client for KrishiMitra Backend
export function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }
  const customUrl = localStorage.getItem('km_api_url');
  if (customUrl) {
    return customUrl.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.location.hostname) {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.')) {
      return `http://${host}:8080/api`;
    }
  }
  // Production default for Vercel / deployed apps
  return 'https://ai-crop-backend-1.onrender.com/api';
}

export function getToken() {
  return localStorage.getItem('km_token');
}

export function getUser() {
  const u = localStorage.getItem('km_user');
  return u ? JSON.parse(u) : null;
}

export function setAuthData(token, user) {
  localStorage.setItem('km_token', token);
  localStorage.setItem('km_user', JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem('km_token');
  localStorage.removeItem('km_user');
}

export async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    clearAuthData();
    window.location.href = '/';
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const text = await response.text();
      if (text) {
        try {
          const errJson = JSON.parse(text);
          errorMsg = errJson.message || errJson.error || JSON.stringify(errJson);
        } catch {
          errorMsg = text;
        }
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg || `HTTP Error ${response.status}`);
  }

  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return text;
  }
}

// API Endpoints
export const authApi = {
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  health: () => request('/auth/health')
};

export const cropApi = {
  recommend: (soilData) => request('/crop/recommend', { method: 'POST', body: JSON.stringify(soilData) }),
  catalog: () => request('/crop/catalog')
};

export const assistantApi = {
  ask: (query, context = '', mode = 'detailed') => request('/assistant/ask', { method: 'POST', body: JSON.stringify({ query, context, mode }) })
};

export const diseaseApi = {
  getAll: () => request('/disease/all'),
  search: (q) => request(`/disease/search?q=${encodeURIComponent(q)}`),
  getByCrop: (crop) => request(`/disease/crop/${encodeURIComponent(crop)}`)
};

export const historyApi = {
  getAll: () => request('/history'),
  create: (data) => request('/history', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => request(`/history/${id}`, { method: 'DELETE' })
};

// Crop emoji helper
export const CROP_EMOJIS = {
  'Rice': '🌾', 'Wheat': '🌾', 'Maize': '🌽', 'Chickpea': '🌱', 'Kidney Beans': '🫘',
  'Pigeon Peas': '🌱', 'Moth Beans': '🌱', 'Mung Bean': '🫘', 'Black Gram': '🫘', 'Lentil': '🌱',
  'Pomegranate': '🍎', 'Banana': '🍌', 'Mango': '🥭', 'Grapes': '🍇', 'Watermelon': '🍉',
  'Muskmelon': '🍈', 'Apple': '🍎', 'Orange': '🍊', 'Papaya': '🍈', 'Coconut': '🥥',
  'Cotton': '☁️', 'Jute': '🌿', 'Coffee': '☕', 'Sugarcane': '🎋', 'Tobacco': '🍃',
  'Barley': '🌾', 'Sorghum': '🌾', 'Pearl Millet': '🌾', 'Finger Millet': '🌾',
  'Mustard': '🌼', 'Soybean': '🫘', 'Sunflower': '🌻', 'Sesame': '🌱', 'Tomato': '🍅', 'Potato': '🥔'
};

export function getCropEmoji(crop) {
  return CROP_EMOJIS[crop] || '🌱';
}
