import axios from 'axios';

export const API = axios.create({
  baseURL: "https://fauzancodes.site:8000/waysbeans-api/v1/",
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};