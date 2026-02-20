import { renderHook, act } from '@testing-library/react';
import { UserProvider, UserContext } from '../context/UserContext';
import axios from 'axios';
import React from 'react';

jest.mock('axios');

describe('UserContext', () => {
  it('ajoute un utilisateur avec succès', async () => {
    const newUser = { firstName: 'Julie', lastName: 'Lechartier', email: 'julie@test.com' };
    axios.post.mockResolvedValue({ data: { ...newUser, id: 101 } });

    const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;
    const { result } = renderHook(() => React.useContext(UserContext), { wrapper });

    await act(async () => {
      await result.current.addUser(newUser);
    });

    expect(result.current.users).toContainEqual({ ...newUser, id: 101 });
    expect(result.current.error).toBeNull();
  });

  it("gère l'erreur serveur (500)", async () => {
    const newUser = { firstName: 'Julie', lastName: 'Lechartier', email: 'julie@test.com' };
    axios.post.mockRejectedValue(new Error("Server Error"));

    const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;
    const { result } = renderHook(() => React.useContext(UserContext), { wrapper });

    await act(async () => {
      await expect(result.current.addUser(newUser)).rejects.toThrow();
    });

    expect(result.current.error).toBe("Erreur lors de l'ajout de l'utilisateur");
  });
});