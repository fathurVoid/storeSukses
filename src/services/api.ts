import axios from 'axios';

export const API_BASE_URL = 'https://dummyjson.com';

/** Single Axios instance: every external request goes through this client. */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});
