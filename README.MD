
# DynamoCraft - Plateforme d'Échange d'Impressions 3D

## Table des matières
1. [Présentation du Projet](#présentation-du-projet)
2. [Fonctionnalités Principales](#fonctionnalités-principales)
3. [Architecture et Technologies](#architecture-et-technologies)
4. [Installation et Configuration](#installation-et-configuration)
5. [Utilisation](#utilisation)

## Présentation du Projet

**DynamoCraft** est une plateforme web dédiée au partage et à l'exploration de modèles d'impression 3D. Conçue pour répondre aux besoins spécifiques de la communauté de l'impression 3D, DynamoCraft offre une interface intuitive qui facilite la découverte, le téléchargement, et la contribution de modèles 3D. La plateforme est structurée pour encourager l'interaction communautaire et fournir des outils aux créateurs pour partager leurs œuvres avec d'autres.

## Fonctionnalités Principales

### Gestion des Utilisateurs
- **Création et Gestion de Comptes :** Les utilisateurs peuvent s'inscrire sur la plateforme en fournissant des informations de base. Une fois inscrits, ils peuvent personnaliser leur profil en ajoutant une biographie, une photo de profil, et en définissant leurs centres d'intérêt.
- **Connexion et Déconnexion :** Les utilisateurs peuvent se connecter pour accéder à leur espace personnel, gérer leurs modèles, et interagir avec d'autres membres. Ils peuvent se déconnecter à tout moment pour sécuriser leur compte.
- **Mot de Passe Oublié :** Un mécanisme de récupération de mot de passe est en place. En cas d'oubli, les utilisateurs peuvent réinitialiser leur mot de passe via un email de récupération sécurisé.

### Gestion des Modèles 3D
- **Téléchargement de Modèles :** Tous les modèles disponibles sur la plateforme sont gratuits. Les utilisateurs connectés peuvent parcourir les différentes catégories et télécharger des modèles d'impression 3D directement depuis la plateforme.
- **Ajout de Modèles :** Les membres de la communauté peuvent contribuer en ajoutant leurs propres modèles. Ces modèles sont classés dans des catégories pertinentes, et les créateurs peuvent ajouter des descriptions, des images, et des fichiers 3D.
- **Fonction Admirative :** Chaque modèle peut être "admiré" par les utilisateurs via un bouton dédié. Cette fonctionnalité permet de mettre en avant les créations les plus appréciées par la communauté.

### Interaction Communautaire
- **Commentaires :** Chaque modèle dispose d'une section commentaires où les utilisateurs peuvent poser des questions, donner des retours, et discuter des modèles avec les créateurs ou d'autres membres de la communauté.
- **Gestion Administrative :** Une interface dédiée permet de modérer le contenus, gérer les utilisateurs, et intervenir en cas de besoin pour maintenir un environnement sécurisé et agréable.

## Architecture et Technologies

### Architecture 3-Tiers
DynamoCraft est structuré en trois couches distinctes, chacune avec des responsabilités spécifiques :
1. **Front-End (Client) :** Développé en Angular, cette couche gère l'interface utilisateur, la navigation et les interactions côté client.
2. **Back-End (Serveur) :** Géré par Express.js, cette couche s'occupe des API, de la logique métier, et des interactions avec la base de données.
3. **Base de Données :** MySQL est utilisé pour stocker les informations relatives aux utilisateurs, modèles, commentaires, etc. Sequelize est utilisé comme ORM pour faciliter les opérations CRUD.

### Technologies Utilisées

#### Front-End (Angular)
- **Modules Angular :** Utilisation des modules standards d'Angular tels que `@angular/core`, `@angular/forms`, `@angular/router` pour structurer l'application.
- **Bootstrap & Bootstrap Icons :** Intégration de Bootstrap pour créer une interface utilisateur moderne et responsive, complétée par des icônes élégantes avec Bootstrap Icons.
- **Chart.js & ng2-charts :** Pour afficher des statistiques et des graphiques dynamiques sur l'utilisation de la plateforme ou les performances des modèles.
- **Three.js & Plugins :** Intégration de Three.js et de ses plugins pour le rendu 3D des modèles, permettant aux utilisateurs de visualiser les objets directement dans le navigateur.
- **Ng-recaptcha & Ngx-captcha :** Pour intégrer des reCAPTCHA dans les formulaires, protégeant ainsi les pages critiques (comme l'inscription) des abus et des bots.

#### Back-End (Express.js)
- **Express.js :** Le framework principal pour créer des API RESTful, gérant les requêtes, les réponses, et l'interaction avec la base de données.
- **Sequelize :** Un ORM puissant pour Node.js qui simplifie les interactions avec MySQL. Il permet de gérer les modèles, les migrations, et les seeds.
- **bcrypt :** Utilisé pour le hachage des mots de passe, garantissant que les informations sensibles des utilisateurs sont stockées de manière sécurisée.
- **jsonwebtoken :** Pour la gestion de l'authentification des utilisateurs via des tokens JWT, assurant une session sécurisée pour chaque utilisateur connecté.
- **multer :** Middleware pour la gestion des fichiers téléchargés, crucial pour le stockage et la manipulation des fichiers de modèles 3D.
- **nodemailer :** Utilisé pour envoyer des emails, tels que les confirmations d'inscription, les réinitialisations de mot de passe, ou les notifications administratives.
- **dotenv :** Pour charger les configurations sensibles depuis un fichier `.env`, séparant ainsi les paramètres critiques du code.
- **axios :** Bibliothèque pour effectuer des requêtes HTTP vers d'autres services, souvent utilisée pour appeler des API externes ou gérer des requêtes complexes côté serveur.
- **jimp :** Pour la manipulation d'images, permettant de redimensionner, compresser, ou transformer les images des utilisateurs ou des modèles.
- **cheerio :** Pour le traitement et l'analyse de contenu HTML, potentiellement utilisé pour scraper ou manipuler des pages avant le rendu.
- **image-downloader :** Bibliothèque pour télécharger des images à partir de liens, utilisée pour gérer les avatars ou les images des modèles directement depuis des sources externes.
- **nodemon :** Un outil pratique qui redémarre automatiquement le serveur Node.js à chaque modification du code source, ce qui améliore la productivité en développement.
- **sequelize-auto-migration :** Outil pour automatiser la création de migrations de base de données en fonction des modifications apportées aux modèles Sequelize.

## Installation et Configuration

### Prérequis
- **Node.js et npm :** Pour installer et gérer les dépendances du projet.
- **MySQL :** Pour la gestion et le stockage des données.

### Étapes d'Installation

1. **Cloner le dépôt Git :**
   - Commencez par cloner le dépôt du projet sur votre machine locale :
   ```bash
   git clone <votre-depot-git>
   cd Projet_DynamoCraft
   ```

2. **Installation des Dépendances :**
   - **Front-End :**
     - Naviguez vers le répertoire `frontend` et installez les dépendances nécessaires :
     ```bash
     cd frontend
     npm install
     ```
   - **Back-End :**
     - Faites de même pour le répertoire `backend` :
     ```bash
     cd backend
     npm install
     ```

3. **Configuration des Fichiers :**
   - Créez un fichier `.env` dans le répertoire `backend` pour configurer les variables d'environnement telles que les informations de connexion à MySQL, les clés JWT pour l'authentification, et les configurations liées à l'envoi d'emails via Nodemailer. Un exemple de contenu du fichier `.env` pourrait être :
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=yourpassword
   DB_NAME=dynamocraft
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

4. **Initialisation de la Base de Données :**
   - Après avoir configuré les variables d'environnement et démarré votre serveur MySQL, initialisez la base de données et configurez les tables en exécutant la commande suivante depuis le répertoire `backend` :
     ```bash
     npm run reset-db
     ```
   - Cette commande exécutera les opérations suivantes :
     - Annulation de toutes les migrations précédentes (`sequelize db:migrate:undo:all`)
     - Application des migrations pour recréer les tables (`sequelize db:migrate`)
     - Insertion des données de seed pour peupler la base de données avec des informations initiales (`sequelize db:seed:all`)

5. **Démarrage des Serveurs :**
   - **Back-End :** Démarrez le serveur Express.js avec Nodemon pour bénéficier d'un rechargement automatique à chaque modification du code :
     ```bash
     nodemon app.js
     ```
   - **Front-End :** Lancez le serveur de développement Angular pour voir l'application en action :
     ```bash
     ng serve
     ```
   - Une fois les serveurs démarrés, vous pouvez accéder à l'application via votre navigateur à l'adresse suivante :
     ```
     http://localhost:4200/
