import axios from "axios";

const backend_url = "http://localhost:8080/api";

const api = axios.create({
  baseURL: backend_url,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
