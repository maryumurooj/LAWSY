//// Axios configuration (assuming it's in a separate file or your main entry point)
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',  // Base URL for your backend
});

export default instance;
