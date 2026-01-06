import axios from "axios";

const Api = axios.create({
  baseURL: "https://crm-backend-06cu.onrender.com/api",
  withCredentials: true,
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest || !status) {
      return Promise.reject(error);
    }
    if (status === 403) {
      return Promise.reject(error);
    }
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(Api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          "https://crm-backend-06cu.onrender.com/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes?.data?.data?.token;
        if (!newToken) throw new Error("No access token");

        localStorage.setItem("accessToken", newToken);
        Api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return Api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const callApi = async (url, method = "GET", body = null) => {
  try {
    const res = await Api({
      url,
      method,
      data: body,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export default Api;
