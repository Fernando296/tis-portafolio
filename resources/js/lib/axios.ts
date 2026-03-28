import axios from "axios";

/* URL base */
axios.defaults.baseURL = "http://127.0.0.1:8000";

const token = localStorage.getItem("token");

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axios.defaults.headers.common["Accept"] = "application/json";

export default axios;