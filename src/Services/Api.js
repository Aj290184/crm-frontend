import axios from "axios";

const Api = axios.create({
  baseURL: "https:/crm-backend-ng24.onrender.com/api",
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

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;

    // handle auth errors
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // queue requests if refresh already running
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
        await axios.post("https:/crm-backend-ng24.onrender.com/api/refresh",
          {},
          { withCredentials: true }
        );
        const newToken = refreshRes?.data?.data?.token;

        if (!newToken) {
          throw new Error("No access token returned from refresh");
        }

        // store & set new token
        localStorage.setItem("accessToken", newToken);
        Api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        isRefreshing = false;

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return Api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // force logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("loginEmail");

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
    console.error("API Error:", err.response?.data || err.message);
    throw err;
  }
};

export default Api;
