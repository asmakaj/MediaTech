# MediaTech — Plateforme de gestion d’objets connectés

> Application web complète développée avec React, Node.js et MySQL permettant de gérer des objets connectés, des utilisateurs et des réservations via une interface moderne et sécurisée.

---

## Contexte — Projet informatique

Ce projet a été conçu dans le cadre d’un travail en équipe en informatique.

**L’équipe :**
- Nassim  Izza
- Asma  Kajeiou
- Marwa  
- Yasmina  Hida
- Amir  

---

## Le problème

La gestion d’objets connectés dans un environnement (école, entreprise, médiathèque…) peut rapidement devenir complexe :
- suivi des objets difficile  
- réservations mal organisées  
- accès non sécurisé aux données  

MediaTech propose une solution centralisée permettant de gérer efficacement tous ces éléments.

---

## La solution

MediaTech est une application web complète composée de trois parties principales :

- Un frontend en React pour l’interface utilisateur  
- Un backend en Node.js pour la logique serveur  
- Une base de données MySQL pour stocker les informations  

L’application permet :
- la gestion des utilisateurs  
- la gestion des objets connectés  
- la gestion des réservations  
- un système de droits d’accès selon le niveau  

---

## Fonctionnement global


Navigateur <--> Frontend React (port 5173) <--> Backend Node.js (port 5000) <--> MySQL (WAMP)


Le frontend envoie des requêtes au backend.  
Le backend traite les données et communique avec la base MySQL.  
Les résultats sont ensuite renvoyés au frontend et affichés à l’utilisateur.

---

## Architecture du projet


mediatech/
client/ <-- frontend React
server/ <-- backend Node.js

client/
src/
pages/
components/
context/
index.html
package.json
vite.config.js

server/
controllers/
routes/
middleware/
db/
schema.sql
connection.js
.env
index.js
package.json


---

## Installation du projet

### 1. Prérequis

- WAMP (MySQL)
- Node.js
- npm

---

### 2. Base de données

- Démarrer WAMP  
- Ouvrir phpMyAdmin : http://localhost/phpmyadmin  
- Importer le fichier :
  `server/db/schema.sql`

Cela crée automatiquement :
- la base `mediatech`  
- les tables (users, objets, reservations, etc.)  
- des données de test  

---

### 3. Configuration

Modifier le fichier `server/.env` :


DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mediatech
JWT_SECRET=changer_cette_valeur
PORT=5000


---

### 4. Lancer le backend

Dans le dossier `server/` :


npm install
npm run dev


Le serveur démarre sur le port 5000.

---

### 5. Lancer le frontend

Dans le dossier `client/` :


npm install
npm run dev


Le site est accessible sur :
http://localhost:5173

---

## Comptes de démonstration

| Identifiant | Mot de passe | Niveau | Accès |
|------------|-------------|--------|------|
| admin      | password    | Expert | Tous les modules |
| mdupont    | password    | Avancé | Information, Visualisation, Gestion |
| jlevier    | password    | Débutant | Information, Visualisation |

---

## Fonctionnalités principales

- Authentification sécurisée (JWT)  
- Gestion des rôles utilisateurs  
- Gestion des objets connectés  
- Système de réservation  
- Interface dynamique avec React  

---

## Stack technique

- React (Vite)  
- Node.js (Express)  
- MySQL (WAMP)  
- JavaScript  

---

## Commandes principales

À chaque utilisation :

### Étape 1
Démarrer WAMP

### Étape 2
Dans `server/` :

npm run dev


### Étape 3
Dans `client/` :

npm run dev


### Étape 4
Ouvrir :
http://localhost:5173

---
