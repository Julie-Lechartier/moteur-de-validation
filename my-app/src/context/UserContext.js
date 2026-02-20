import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const UserProvider = ({ children }) => {

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API_URL);
        setUsers(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des utilisateurs");
      }
    };

    fetchUsers();
  }, []);

  const addUser = async (user) => {
    try {
      const response = await axios.post(API_URL, user);
      setUsers((prev) => [...prev, response.data]);
      setError(null);
    } catch (err) {
      setError("Erreur lors de l'ajout de l'utilisateur");
      throw err;
    }
  };

  const isEmailTaken = (email) => {
    return users.some(u => u.email === email);
  };

  return (
    <UserContext.Provider value={{ users, addUser, isEmailTaken, error }}>
      {children}
    </UserContext.Provider>
  );
};