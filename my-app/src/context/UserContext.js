import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem('inscriptionList');
    return stored ? JSON.parse(stored) : [];
  });

  const addUser = (user) => {
    setUsers((prev) => {
      const updated = [...prev, user];
      localStorage.setItem('inscriptionList', JSON.stringify(updated));
      return updated;
    });
  };

  const isEmailTaken = (email) => {
    return users.some(u => u.email === email);
  };

  return (
    <UserContext.Provider value={{ users, addUser, isEmailTaken }}>
      {children}
    </UserContext.Provider>
  );
};
