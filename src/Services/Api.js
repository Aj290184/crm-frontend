import axios from "axios";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

//rfresh handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

//respone inspector
Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest || !status) {
      return Promise.reject(error);
    }

    //If unauthorized and not already retried
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
        //Correct endpoint + same axios instance
        const refreshRes = await Api.post("/refresh-token");

        const newToken = refreshRes?.data?.data?.token;

        if (!newToken) {
          throw new Error("No new access token received");
        }

        //Save new token
        localStorage.setItem("accessToken", newToken);

        //Update default header
        Api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return Api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem("accessToken");
        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

//genric api call
export const callApi = async (url, method = "GET", body = null) => {
  const res = await Api({
    url,
    method,
    data: body,
  });

  return res.data;
};

export default Api;