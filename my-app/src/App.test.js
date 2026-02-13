import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App - Tests INTÉGRATION user-event (YNOV)', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
  });

  test('bouton désactivé par défaut', () => {
    render(<App />);
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });

  test('erreur code postal 4 chiffres - message visible + bouton gris', async () => {
    render(<App />);
    const postalInput = screen.getByTestId('postalCode-input');
    await user.type(postalInput, '6900');

    await waitFor(() => {
      // error message
      expect(screen.getByTestId('postalCode-error')).toBeInTheDocument();
      expect(screen.getByText('5 chiffres requis')).toBeVisible();
      // btn
      expect(screen.getByTestId('submit-button')).toBeDisabled();
    });
  });
  // invalide name
  test('bloque chiffres dans nom/prénom/ville', async () => {
    render(<App />);
    const nomInput = screen.getByTestId('lastName-input');
    await user.type(nomInput, 'Test123!');
    expect(nomInput).toHaveValue('Test');
  });
  // 18 years
  test('bloque mineur moins de 18 ans', async () => {
    render(<App />);
    await user.type(screen.getByTestId('birth-input'), '2009-01-01');
    await user.type(screen.getByTestId('postalCode-input'), '69001');
    await user.type(screen.getByTestId('lastName-input'), 'Doe');

    expect(screen.getByTestId('birth-error')).toHaveTextContent(
      'Âge minimum de 18 ans',
    );
    expect(screen.getByTestId('submit-button')).toBeDisabled();
  });
  test('utilisateur chaotique: erreur → correction → succès', async () => {
    render(<App />);

    const postalInput = screen.getByTestId('postalCode-input');
    await user.type(postalInput, '6900');
    await waitFor(() => {
      expect(screen.getByTestId('postalCode-error')).toBeInTheDocument();
      expect(screen.getByText('5 chiffres requis')).toBeVisible();
    });

    await user.clear(postalInput);
    await user.type(postalInput, '69001');
    await user.type(screen.getByTestId('lastName-input'), 'Test');
    await user.type(screen.getByTestId('firstName-input'), 'Test');
    await user.type(screen.getByTestId('email-input'), 'test@test.com');
    await user.type(screen.getByTestId('birth-input'), '1995-01-01');
    await user.type(screen.getByTestId('ville-input'), 'Lyon');

    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).not.toBeDisabled();
    });

    await user.click(screen.getByTestId('submit-button'));
    await waitFor(() => {
      expect(screen.getByTestId('success-toast')).toBeVisible();
      expect(screen.getByText('Inscription réussie !')).toBeInTheDocument();
    });

    expect(screen.getByTestId('lastName-input')).toHaveValue('');
    expect(screen.getByTestId('postalCode-input')).toHaveValue('');
  });
  test('handleKeyDown accepte caractères autorisés', async () => {
    render(<App />);
    const nomInput = screen.getByTestId('lastName-input');
    await user.type(nomInput, 'Jean');
    expect(nomInput).toHaveValue('Jean');
  });
});
