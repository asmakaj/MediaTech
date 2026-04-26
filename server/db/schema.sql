CREATE DATABASE IF NOT EXISTS mediatech;
USE mediatech;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pseudo VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    genre VARCHAR(20),
    date_naissance DATE,
    type_membre VARCHAR(50),
    photo VARCHAR(255),
    points DECIMAL(10,2) DEFAULT 0,
    level ENUM('debutant','intermediaire','avance','expert') DEFAULT 'debutant',
    role ENUM('visiteur','simple','complexe','admin') DEFAULT 'simple',
    actif BOOLEAN DEFAULT FALSE,
    token_validation VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE salles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE objets (
    id VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    marque VARCHAR(100),
    description TEXT,
    type_id INT,
    etat ENUM('Actif','Inactif') DEFAULT 'Actif',
    consommation DECIMAL(10,2) DEFAULT 0,
    consommation_max DECIMAL(10,2) DEFAULT 0,
    salle_id INT,
    connectivite VARCHAR(100),
    batterie INT,
    derniere_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    params JSON,
    FOREIGN KEY (type_id) REFERENCES categories(id),
    FOREIGN KEY (salle_id) REFERENCES salles(id)
);

CREATE TABLE action_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(100),
    detail TEXT,
    pts_gagnes DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE deletion_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    objet_id VARCHAR(50),
    user_id INT,
    reason TEXT,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (objet_id) REFERENCES objets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    salle_id INT,
    user_id INT,
    date_reservation DATE,
    heure VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (salle_id) REFERENCES salles(id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO categories (nom) VALUES
('Borne interactive'),('Console de jeux'),('Television'),('Imprimante'),
('Ordinateur'),('Capteur'),('Thermostat'),('Eclairage'),('VR'),('Camera');

INSERT INTO salles (nom) VALUES
('Espace Gaming'),('Salle multimedia'),('Espace bureautique'),('Cyber-espace'),
('Hall principal'),('Atelier numerique'),('Salle lecture'),('Espace jeunesse'),('Salle conference');

INSERT INTO users (pseudo, password, nom, prenom, email, age, genre, type_membre, points, level, role, actif) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Super', 'admin@mediatech.fr', 35, 'Homme', 'Administrateur', 150, 'expert', 'admin', TRUE),
('mdupont', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dupont', 'Marie', 'marie@mail.com', 28, 'Femme', 'Adulte lecteur', 45, 'avance', 'complexe', TRUE),
('jlevier', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Levier', 'Jean', 'jean@mail.com', 22, 'Homme', 'Etudiant', 5, 'debutant', 'simple', TRUE);

INSERT INTO objets (id, nom, marque, description, type_id, etat, consommation, consommation_max, salle_id, connectivite, batterie, params) VALUES
('OBJ1','Borne Retour Auto','Bibliotech','Borne de retour automatique des documents',1,'Actif',85,100,5,'Wi-Fi',NULL,'{"volume":5}'),
('OBJ2','PS5','Sony','Console de jeux nouvelle generation',2,'Actif',200,220,1,'Wi-Fi',NULL,'{"mode":"eco"}'),
('OBJ3','TV Samsung 8K','Samsung','Television 8K 75 pouces',3,'Actif',120,150,2,'Wi-Fi, Bluetooth',NULL,'{"luminosite":70}'),
('OBJ4','Imprimante 3D','MakerBot','Imprimante 3D professionnelle',4,'Actif',250,300,6,'USB, Wi-Fi',NULL,'{"temperature_buse":210}'),
('OBJ5','Thermostat Principal','Nest','Thermostat intelligent',7,'Inactif',5,10,9,'Wi-Fi',85,'{"temp_cible":21}'),
('OBJ6','Eclairage LED Reading','Philips','Systeme eclairage LED salle lecture',8,'Actif',40,45,7,'Zigbee',NULL,'{"intensite":100}'),
('OBJ7','Camera Entree','Hikvision','Camera surveillance entree principale',10,'Actif',15,20,5,'Wi-Fi, Ethernet',NULL,'{"resolution":"4K","detection_mouvement":true}'),
('OBJ8','Capteur CO2 Conf','Aranet','Capteur qualite air salle conference',6,'Actif',2,5,9,'Bluetooth',90,'{"co2_ppm":650,"temperature":22}'),
('OBJ9','Ordinateur Accueil','Dell','PC fixe poste accueil',5,'Actif',180,200,5,'Ethernet',NULL,'{"os":"Windows 11"}'),
('OBJ10','Casque VR','Meta','Casque de realite virtuelle Quest 3',9,'Inactif',20,25,1,'Wi-Fi',75,'{"resolution":"2064x2208"}');
