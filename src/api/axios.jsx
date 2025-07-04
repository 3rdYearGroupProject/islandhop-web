import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL_USER_SERVICES,
  withCredentials: true, 
});

export default api;