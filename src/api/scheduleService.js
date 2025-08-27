import axios from "axios";

const BASE_URL = process.env.REACT_APP_SCHEDULE_SERVICE_URL || "http://localhost:5005";

class ScheduleService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `Making ${config.method.toUpperCase()} request to: ${config.url}`
        );
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || error);
      }
    );
  }

  // Health check
  async healthCheck() {
    return await this.api.get("/schedule/health");
  }

  // Mark days as unavailable
  async markUnavailable(userType, email, dates) {
    return await this.api.post(`/schedule/${userType}/mark-unavailable`, {
      email,
      dates,
    });
  }

  // Mark days as available (unmark)
  async unmarkAvailable(userType, email, dates) {
    return await this.api.post(`/schedule/${userType}/unmark-available`, {
      email,
      dates,
    });
  }

  // Lock days (with optional trip ID)
  async lockDays(userType, email, dates, tripId = null) {
    const payload = { email, dates };
    if (tripId) {
      payload.tripId = tripId;
    }
    return await this.api.post(`/schedule/${userType}/lock`, payload);
  }

  // Get available days for a month
  async getAvailableDays(userType, email, month) {
    return await this.api.get(`/schedule/${userType}/available`, {
      params: { email, month },
    });
  }
}

export default new ScheduleService();
