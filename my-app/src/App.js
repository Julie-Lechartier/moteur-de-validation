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

  const validateField = (name, value) => {
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
        return age < 18 ? 'Âge minimum 18 ans' : '';
      case 'postalCode':
        return !/^\d{5}$/.test(value) ? '5 chiffres requis' : '';
      default:
        return '';
    }
  };

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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid =
      Object.values(formData).every((v) => v !== '') &&
      Object.values(errors).every((e) => !e);
    if (isValid) {
      localStorage.setItem('inscription', JSON.stringify(formData));
      setShowSuccess(true);
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
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Test"
            maxLength="50"
          />
          {errors.firstName && (
            <span className="error">{errors.firstName}</span>
          )}
        </div>
        <div className="field-group">
          <label>Nom *</label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Doe"
            maxLength="50"
          />
          {errors.lastName && <span className="error">{errors.lastName}</span>}
        </div>
        <div className="field-group">
          <label>Email *</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="test@test.com"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="field-group">
          <label>Date de naissance *</label>
          <input
            name="birthDate"
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
            <span className="error">{errors.birthDate}</span>
          )}
        </div>
        <div className="field-group">
          <label>Code postal *</label>
          <input
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="01000"
            maxLength="5"
          />
          {errors.postalCode && (
            <span className="error">{errors.postalCode}</span>
          )}
        </div>
        <div className="field-group">
          <label>Ville</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Lyon"
          />
          {errors.city && <span className="error">{errors.city}</span>}
        </div>
        <button type="submit" disabled={!isFormValid}>S'inscrire</button>
      </form>
      {showSuccess && <div className="success-toast">Inscription réussie</div>}
    </div>
  );
}
export default App;
