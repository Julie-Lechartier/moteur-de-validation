import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from './pages/Register';
import { UserProvider } from './context/UserContext';

describe('Register - Tests INTÉGRATION user-event (YNOV)', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    require('axios').default.get.mockResolvedValue({ data: [] });
    require('axios').default.post.mockResolvedValue({ data: { id: 1, firstName: 'Test', lastName: 'User' } });
  });

  const wrapper = ({ children }) => (
    <MemoryRouter initialEntries={['/register']}>
      <UserProvider>
        {children}
      </UserProvider>
    </MemoryRouter>
  );

  test('bouton désactivé par défaut', () => {
    render(<Register />, { wrapper });
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  test('erreur code postal 4 chiffres - message visible + bouton gris', async () => {
    render(<Register />, { wrapper });
    const postalInput = screen.getByTestId('postalCode-input');
    await user.type(postalInput, '6900');
    await waitFor(() => {
      expect(screen.getByTestId('postalCode-error')).toBeInTheDocument();
      expect(screen.getByText('5 chiffres requis')).toBeVisible();
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });

  test('bloque chiffres dans nom/prénom/ville', async () => {
    render(<Register />, { wrapper });
    const nomInput = screen.getByTestId('lastName-input');
    await user.type(nomInput, 'Test123!');
    expect(nomInput).toHaveValue('Test');
  });

  test('bloque mineur moins de 18 ans', async () => {
    render(<Register />, { wrapper });
    await user.type(screen.getByTestId('birth-input'), '2009-01-01');
    await user.type(screen.getByTestId('postalCode-input'), '69001');
    await user.type(screen.getByTestId('lastName-input'), 'Doe');
    expect(screen.getByTestId('birth-error')).toHaveTextContent('Âge minimum de 18 ans');
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  test('utilisateur chaotique: erreur → correction → succès', async () => {
    // ✅ Mock spécifique pour ce test

    render(<Register />, { wrapper });

    const postalInput = screen.getByTestId('postalCode-input');
    await user.type(postalInput, '6900');
    await waitFor(() => expect(screen.getByTestId('postalCode-error')).toBeInTheDocument());

    await user.clear(postalInput);
    await user.type(postalInput, '69001');
    await user.type(screen.getByTestId('lastName-input'), 'Test');
    await user.type(screen.getByTestId('firstName-input'), 'Test');
    await user.type(screen.getByTestId('email-input'), 'test@test.com');
    await user.type(screen.getByTestId('birth-input'), '1995-01-01');
    await user.type(screen.getByTestId('ville-input'), 'Lyon');

    await waitFor(() => expect(screen.getByTestId('submit-button')).not.toBeDisabled());
    await user.click(screen.getByTestId('submit-button'));

    await waitFor(() => expect(screen.getByText('Inscription réussie !')).toBeInTheDocument());
  });


  test('handleKeyDown accepte caractères autorisés', async () => {
    render(<Register />, { wrapper });
    const nomInput = screen.getByTestId('lastName-input');
    await user.type(nomInput, 'Jean');
    expect(nomInput).toHaveValue('Jean');
  });
});
