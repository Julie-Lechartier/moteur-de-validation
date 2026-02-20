import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const getUsers = async () => {
  return await axios.get(API_URL);
};

export const createUser = async (user) => {
  return await axios.post(API_URL, user);
};