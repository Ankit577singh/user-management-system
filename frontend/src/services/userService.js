import axios from "axios";

const API = `${import.meta.env.VITE_BACKEND_URL}/api/users`;

export const createUser = (data) =>
  axios.post(API, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

export const updateUser = (id, data) =>
  axios.put(`${API}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

export const getUsers = (page) =>
  axios.get(`${API}?page=${page}`);

export const getUserById = (id) =>
  axios.get(`${API}/${id}`);

export const deleteUser = (id) =>
  axios.delete(`${API}/${id}`);

export const exportUsersCSV = () =>
  axios.get(`${API}/export/csv`, {
    responseType: "blob"
});
