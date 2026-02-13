# TEST_PLAN.md - Activité 2 YNOV

## Stratégie de tests

J'ai séparé les tests en deux catégories :

**Tests unitaires (UT)** : testent les fonctions isolées comme `validateField()`  
**Tests d'intégration (IT)** : testent le formulaire complet avec des interactions utilisateur

## Tests d'intégration - App.test.js

**Bouton désactivé par défaut**  
Ce que je teste : Formulaire vide au chargement  
Ce que je vérifie : Bouton submit en gris (`disabled`)

**Code postal 4 chiffres**  
Ce que je teste : Saisie "6900"  
Ce que je vérifie : Message d'erreur "5 chiffres requis" + bouton disabled

**Bloque chiffres nom/prénom**  
Ce que je teste : Saisie "Test123!" dans nom  
Ce que je vérifie : Input garde seulement "Test"

**Mineur bloqué**  
Ce que je teste : Date naissance 2009  
Ce que je vérifie : Erreur "Âge minimum de 18 ans"

**Utilisateur chaotique**  
Ce que je teste : 6900 → efface → 69001 → formulaire complet → submit  
Ce que je vérifie : Toaster apparaît + champs reset

**Caractères autorisés**  
Ce que je teste : Saisie "Test" normale  
Ce que je vérifie : Input accepte les lettres

## Couverture des contraintes YNOV

Feedback erreurs rouges : Tests code postal et âge  
Bouton disabled invalide : Tests 1 et 2  
Utilisateur chaotique : Test 5 (erreur → correction → succès)  
Toaster au succès : Test 5

## Résultats coverage

App.js : 97% statements, 93% branches, 100% lines  
Tests : 6/6 passent

## Pourquoi cette stratégie ?

Tests IT uniquement car c'est un formulaire simple (pas de logique métier complexe isolée)  
userEvent au lieu de fireEvent pour que ce soit plus réaliste
waitFor() partout pour async  
Cas limites : 4 chiffres CP, mineur, caractères spéciaux  
Utilisateur chaotique : erreur → correction → succès complet
