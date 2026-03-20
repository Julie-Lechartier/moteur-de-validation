import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const API_URL = process.env.REACT_APP_API_URL;

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(API_URL);
        setUsers(res.data.users);
      } catch {
        setError("Erreur lors du chargement des utilisateurs");
      }
    };
    fetchUsers();
  }, []);

  const addUser = async (user) => {
    try {
      const res = await axios.post(API_URL, user);
      setUsers(prev => [...prev, res.data]);
      setError(null);
    } catch {
      setError("Erreur lors de l'ajout de l'utilisateur");
      throw new Error("Erreur ajout user");
    }
  };

  return (
    <UserContext.Provider value={{ users, addUser, error }}>
      {children}
    </UserContext.Provider>
  );
};