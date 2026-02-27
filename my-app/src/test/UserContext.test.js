import { renderHook, act } from '@testing-library/react-hooks'; // <-- hook testing library correcte
import { UserProvider, UserContext } from '../context/UserContext';
import axios from 'axios';
import React from 'react';

jest.mock('axios');

describe('UserContext', () => {
  const wrapper = ({ children }) => <UserProvider>{children}</UserProvider>;

  it('ajoute un utilisateur avec succès', async () => {
    const newUser = { firstName: 'Julie', lastName: 'Lechartier', email: 'julie@test.com' };
    axios.post.mockResolvedValue({ data: { ...newUser, id: 101 } });

    const { result, waitForNextUpdate } = renderHook(() => React.useContext(UserContext), { wrapper });

    await act(async () => {
      await result.current.addUser(newUser);
      await waitForNextUpdate(); // attend que le state se mette à jour
    });

    expect(result.current.users).toContainEqual({ ...newUser, id: 101 });
    expect(result.current.error).toBeNull();
  });

  it("gère l'erreur serveur (500)", async () => {
    const newUser = { firstName: 'Julie', lastName: 'Lechartier', email: 'julie@test.com' };
    axios.post.mockRejectedValue(new Error("Server Error"));

    const { result, waitForNextUpdate } = renderHook(() => React.useContext(UserContext), { wrapper });

    await act(async () => {
      await expect(result.current.addUser(newUser)).rejects.toThrow("Erreur ajout user");
      await waitForNextUpdate();
    });

    expect(result.current.error).toBe("Erreur lors de l'ajout de l'utilisateur");
  });
});