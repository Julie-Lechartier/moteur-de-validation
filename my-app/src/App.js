import { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    birthDate: '',
    postalCode: '',
    city: '',
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Valide un champ individuellement
   * @param {string} name
   * @param {string} value
   * @returns {string}
   */
  const validateField = (name, value) => {
    /* istanbul ignore next */
    switch (name) {
      case 'lastName':
      case 'firstName':
      case 'city':
        const nameRegex = /^[A-Za-zÀ-ÿ\s\-]+$/;
        if (!nameRegex.test(value)) return 'Seulement lettres, espaces, tirets';
        return value.length < 2 ? 'Minimum 2 caractères' : '';
      case 'email':
        return !value.includes('@') ? 'Email invalide' : '';
      case 'birthDate':
        if (!value) return 'Date de naissance requise';
        const age = new Date().getFullYear() - new Date(value).getFullYear();
        return age < 18 ? 'Âge minimum de 18 ans' : '';
      case 'postalCode':
        return !/^\d{5}$/.test(value) ? '5 chiffres requis' : '';
      default:
        return '';
    }
  };

  /**
   * Bloque les caractères non autorisés dans les noms/villes
   * @param {Object} e
   */
  const handleKeyDown = (e) => {
    const { name } = e.target;
    if (name === 'lastName' || name === 'firstName' || name === 'city') {
      const allowed =
        /[A-Za-zÀ-ÿ\s\-]|Backspace|Delete|Tab|ArrowLeft|ArrowRight|Home|End/;
      if (!allowed.test(e.key) && e.key.length === 1) {
        e.preventDefault();
      }
    }
  };
  /**
   * Gère la saisie utilisateur et met à jour le state + validation temps réel
   * @param {Object} e
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  /**
   * Valide au focus out (quand utilisateur quitte le champ)
   * @param {Object} e
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  /**
   * Soumet le formulaire si valide → localStorage + toaster + reset
   * @param {Object} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid =
      Object.values(formData).every((v) => v !== '') &&
      Object.values(errors).every((e) => !e);
    if (isValid) {
      localStorage.setItem('inscription', JSON.stringify(formData));
      setShowSuccess(true);
      /* istanbul ignore next */
      setTimeout(() => setShowSuccess(false), 3000);
      setFormData({
        lastName: '',
        firstName: '',
        email: '',
        birthDate: '',
        postalCode: '',
        city: '',
      });
      setErrors({});
    }
  };
  const isFormValid =
    Object.values(formData).every((v) => v !== '') &&
    Object.values(errors).every((e) => !e);
  return (
    <div className="App">
      <h1>Formulaire d'inscription</h1>
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label>Prénom *</label>
          <input
            name="firstName"
            data-testid="firstName-input"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Test"
          />
          {errors.firstName && (
            <span className="error" data-testid="firstName-error">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className="field-group">
          <label>Nom *</label>
          <input
            name="lastName"
            data-testid="lastName-input"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Doe"
          />
          {errors.lastName && (
            <span className="error" data-testid="lastName-error">
              {errors.lastName}
            </span>
          )}
        </div>

        <div className="field-group">
          <label>Email *</label>
          <input
            name="email"
            data-testid="email-input"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="test@test.com"
          />
          {errors.email && (
            <span className="error" data-testid="email-error">
              {errors.email}
            </span>
          )}
        </div>

        <div className="field-group">
          <label>Date de naissance *</label>
          <input
            name="birthDate"
            data-testid="birth-input"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
            max={
              new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                .toISOString()
                .split('T')[0]
            }
          />
          {errors.birthDate && (
            <span className="error" data-testid="birth-error">
              {errors.birthDate}
            </span>
          )}
        </div>

        <div className="field-group">
          <label>Code postal *</label>
          <input
            name="postalCode"
            data-testid="postalCode-input"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="01000"
            maxLength={5}
          />
          {errors.postalCode && (
            <span className="error" data-testid="postalCode-error">
              {errors.postalCode}
            </span>
          )}
        </div>

        <div className="field-group">
          <label>Ville</label>
          <input
            name="city"
            data-testid="ville-input"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Lyon"
          />
          {errors.city && (
            <span className="error" data-testid="ville-error">
              {errors.city}
            </span>
          )}
        </div>

        <button
          type="submit"
          data-testid="submit-button"
          disabled={!isFormValid}
        >
          S'inscrire
        </button>
      </form>
      {showSuccess && (
        <div className="success-toast" data-testid="success-toast">
          Inscription réussie !
        </div>
      )}
    </div>
  );
}
export default App;
