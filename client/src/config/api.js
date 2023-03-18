import axios from 'axios';

export const API = axios.create({
  baseURL: "https://waysbeans-coffee.up.railway.app/api/v1/",
  // baseURL: process.env.REACT_APP_BASE_URL,
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common.Authorization;
  }
};