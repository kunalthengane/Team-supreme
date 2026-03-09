// API configuration and base URL
// In production (Render) set `VITE_API_URL` to the backend URL (e.g. https://my-backend.onrender.com)
// If `VITE_API_URL` is not set the client will use relative paths (same-origin).
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface ApiComplaint {
  _id: string;
  title: string;
  description: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  submittedBy: string;
  submittedAt: string;
  resolvedAt?: string;
  resolution?: string;
  attachments?: string[];
  supportCount?: number; // number of supports/upvotes
  sentimentScore?: number;
  sentimentLabel?: string;
}

export interface ApiUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: ApiUser;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage if available
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  logout() {
    this.clearToken();
  }

  // Complaint endpoints
  async getComplaints(): Promise<{ success: boolean; data: ApiComplaint[] }> {
    return this.request('/complaints', {
      method: 'GET',
    });
  }

  async getComplaint(id: string): Promise<{ success: boolean; data: ApiComplaint }> {
    return this.request(`/complaints/${id}`, {
      method: 'GET',
    });
  }

  async createComplaint(complaint: {
    title: string;
    description: string;
    category: string;
    severity: string;
    submittedBy: string;
  }): Promise<{ success: boolean; data: ApiComplaint }> {
    return this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaint),
    });
  }

  async updateComplaint(
    id: string,
    updates: Partial<ApiComplaint>
  ): Promise<{ success: boolean; data: ApiComplaint }> {
    return this.request(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async supportComplaint(id: string): Promise<{ success: boolean; data: ApiComplaint }> {
    return this.request(`/complaints/${id}/support`, {
      method: 'POST',
    });
  }

  async deleteComplaint(id: string): Promise<{ success: boolean }> {
    return this.request(`/complaints/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

export const apiService = new ApiService();
