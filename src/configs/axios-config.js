import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

instance.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    config.headers.token = user.token;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res.data,
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
