require('dotenv').config();
const axios = require('axios');

class ZeroScaleAPI {
  constructor(options = {}) {
    this.baseURL = options.baseURL || process.env.ZEROSCALE_API_URL || 'https://api.zeroscale.dev/api/v1';
    this.token = options.token || process.env.ZEROSCALE_TOKEN;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  setToken(token) {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async login(email, password) {
    try {
      const response = await this.client.post('/auth/login', {
        email,
        password
      });
      
      const token = response.data.data.token;
      this.setToken(token);
      
      return {
        success: true,
        token,
        user: response.data.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  }

  async getHosts(options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);
      if (options.state) params.append('state', options.state);
      if (options.rating) params.append('rating', options.rating);
      if (options.search) params.append('search', options.search);

      const response = await this.client.get(`/hosts?${params}`);
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch hosts'
      };
    }
  }

  async getHost(id) {
    try {
      const response = await this.client.get(`/hosts/${id}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch host'
      };
    }
  }

  async createHost(hostData) {
    try {
      const response = await this.client.post('/hosts', hostData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create host'
      };
    }
  }

  async getReviews(hostId, options = {}) {
    try {
      const params = new URLSearchParams();
      
      if (options.page) params.append('page', options.page);
      if (options.limit) params.append('limit', options.limit);

      const response = await this.client.get(`/reviews/${hostId}?${params}`);
      return {
        success: true,
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch reviews'
      };
    }
  }

  async createReview(reviewData) {
    try {
      const response = await this.client.post('/reviews', reviewData);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create review'
      };
    }
  }

  async getUserProfile() {
    try {
      const response = await this.client.get('/auth/profile');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  }
}

module.exports = ZeroScaleAPI;
