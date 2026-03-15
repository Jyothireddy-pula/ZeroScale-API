export interface ZeroScaleAPIOptions {
  baseURL?: string;
  apiKey?: string;
  timeout?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface HostFilters extends PaginationOptions {
  state?: string;
  rating?: number;
  search?: string;
  minRating?: number;
  maxRating?: number;
}

export interface CreateHostData {
  name: string;
  state: string;
  description: string;
  rating: number;
}

export interface CreateReviewData {
  hostId: string;
  comment: string;
  rating: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ZeroScaleAPI {
  private baseURL: string;
  private apiKey: string;
  private timeout: number;

  constructor(options: ZeroScaleAPIOptions = {}) {
    this.baseURL = options.baseURL || 'https://api.zeroscale.dev/api/v1';
    this.apiKey = options.apiKey || '';
    this.timeout = options.timeout || 10000;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { Authorization: `Bearer ${this.apiKey}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: (data as any)?.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }

      return {
        success: true,
        data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Network error'
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<APIResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async signup(userData: any): Promise<APIResponse<any>> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getProfile(): Promise<APIResponse<any>> {
    return this.request('/auth/profile', {
      method: 'GET'
    });
  }

  // Host methods
  async getHosts(filters: HostFilters = {}): Promise<APIResponse<any[]>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.state) params.append('state', filters.state);
    if (filters.rating) params.append('rating', filters.rating.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.maxRating) params.append('maxRating', filters.maxRating.toString());

    return this.request<any[]>(`/hosts?${params}`);
  }

  async getHost(id: string): Promise<APIResponse<any>> {
    return this.request<any>(`/hosts/${id}`);
  }

  async createHost(hostData: CreateHostData): Promise<APIResponse<any>> {
    return this.request<any>('/hosts', {
      method: 'POST',
      body: JSON.stringify(hostData)
    });
  }

  async updateHost(id: string, hostData: Partial<CreateHostData>): Promise<APIResponse<any>> {
    return this.request<any>(`/hosts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hostData)
    });
  }

  async deleteHost(id: string): Promise<APIResponse<any>> {
    return this.request<any>(`/hosts/${id}`, {
      method: 'DELETE'
    });
  }

  async getHostsByState(state: string, filters: HostFilters = {}): Promise<APIResponse<any[]>> {
    return this.getHosts({ ...filters, state });
  }

  // Review methods
  async getReviews(hostId: string, filters: PaginationOptions = {}): Promise<APIResponse<any[]>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    return this.request<any[]>(`/reviews/${hostId}?${params}`);
  }

  async createReview(reviewData: CreateReviewData): Promise<APIResponse<any>> {
    return this.request<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async updateReview(id: string, reviewData: Partial<CreateReviewData>): Promise<APIResponse<any>> {
    return this.request<any>(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  }

  async deleteReview(id: string): Promise<APIResponse<any>> {
    return this.request<any>(`/reviews/${id}`, {
      method: 'DELETE'
    });
  }

  // Utility methods
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }
}

export default ZeroScaleAPI;
