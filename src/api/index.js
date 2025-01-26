// src/api/index.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend's base URL
  // Do not set 'Content-Type' headers here; let the browser handle it for FormData
});

export default API;

//
