
const API_BASE_URL = 'http://localhost:5000/api';
const STRICT_BACKEND_MODE = true;


// Helper for fetch with authentication
async function request(endpoint: string, options?: RequestInit ) {
  
  const token = localStorage.getItem('rca_token');
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options?.headers,
      },
    });

    if (response.status === 401 || response.status === 403) {
      if (response.status === 401) {
        localStorage.removeItem('rca_token');
        window.location.reload(); 
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Access Denied');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status}`);
    }
    return await response.json();
    } catch (error) {
    if (STRICT_BACKEND_MODE) {
      console.error('API FAILURE:', endpoint, error);
      throw error;
    }
    throw error;
  }

}

export const api = {
  // Auth
  login: (credentials: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  signup: (data: any) => request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  // Stats
  getStats: () => request('/stats'),

  // Connection Test
  checkHealth: async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' }).catch(() => ({ ok: false }));
        return res.ok;
    } catch { return false; }
  },

  // Users
  getUsers: () => request('/users'),

  // Batches
  getBatches: () => request('/batches'),
  createBatch: (batch: any) => request('/batches', { method: 'POST', body: JSON.stringify(batch) }),
  updateBatch: (id: string, batch: any) => request(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(batch) }),
  deleteBatch: (id: string) => request(`/batches/${id}`, { method: 'DELETE' }),

  // Students
  getStudents: () => request('/students'),
  createStudent: (data: any) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id: string, data: any) => request(`/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id: string) => request(`/students/${id}`, { method: 'DELETE' }),
  
  // Matches
  getMatches: () => request('/matches'),
  createMatch: (match: any) => request('/matches', { method: 'POST', body: JSON.stringify(match) }),
  updateMatch: (id: string, match: any) => request(`/matches/${id}`, { method: 'PUT', body: JSON.stringify(match) }),
  deleteMatch: (id: string) => request(`/matches/${id}`, { method: 'DELETE' }),
  
  // Attendance
  saveAttendance: (date: string, presentIds: string[]) => 
    request('/attendance', { method: 'POST', body: JSON.stringify({ date, presentIds }) }),
  getAttendance: () => request('/attendance'),
  
  // Performance & Fitness
  savePerformance: (data: any) => request('/performance', { method: 'POST', body: JSON.stringify(data) }),
  saveFitness: (data: any) => request('/performance', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (studentId: string) => request(`/performance/history/${studentId}`),
};
