const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');
require('dotenv').config();

function updateLevel(points) {
    if (points >= 60) return { level: 'expert', role: 'admin' };
    if (points >= 30) return { level: 'avance', role: 'complexe' };
    return { level: 'debutant', role: 'simple' };
}

exports.register = async (req, res) => {
    const { pseudo, password, nom, prenom, email, age, genre, date_naissance, type_membre } = req.body;
    try {
        // Validation de la date de naissance
        if (!date_naissance) {
            return res.status(400).json({ message: 'Date de naissance requise' });
        }

        const birthDate = new Date(date_naissance);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Vérifier que la date n'est pas dans le futur
        if (birthDate > today) {
            return res.status(400).json({ message: 'La date de naissance ne peut pas être dans le futur' });
        }

        // Calculer l'âge à partir de la date de naissance
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }

        // Vérifier que l'âge est >= 10 ans
        if (calculatedAge < 10) {
            return res.status(400).json({ message: 'Vous devez avoir au minimum 10 ans' });
        }

        // Vérifier la cohérence entre l'âge saisi et la date de naissance
        if (parseInt(age) !== calculatedAge) {
            return res.status(400).json({ message: `L'âge saisi ne correspond pas à la date de naissance. Age calculé: ${calculatedAge} ans` });
        }

        const [existing] = await db.query('SELECT id FROM users WHERE pseudo=? OR email=?', [pseudo, email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Pseudo ou email deja utilise' });

        const hash = await bcrypt.hash(password, 10);

        // Inscription directe avec compte actif (pas de validation email)
        await db.query(
            'INSERT INTO users (pseudo, password, nom, prenom, email, age, genre, date_naissance, type_membre, actif) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [pseudo, hash, nom, prenom, email, calculatedAge, genre, date_naissance, type_membre, true]
        );
        
        console.log('✅ Utilisateur créé:', { pseudo, email, age: calculatedAge, genre, type_membre, actif: true });

        res.json({ 
            message: 'Inscription reussie. Vous pouvez vous connecter maintenant.',
            success: true
        });
    } catch (err) {
        console.error('❌ Erreur register:', err.message);
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { pseudo, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE pseudo=?', [pseudo]);
        if (!rows.length) return res.status(401).json({ message: 'Identifiants invalides' });
        const user = rows[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Identifiants invalides' });

        const newPoints = parseFloat(user.points) + 0.25;
        const { level, role } = updateLevel(newPoints);
        await db.query('UPDATE users SET points=?, level=?, role=? WHERE id=?', [newPoints, level, role, user.id]);
        await db.query('INSERT INTO action_log (user_id, type, detail, pts_gagnes) VALUES (?,?,?,?)',
            [user.id, 'Connexion', 'Ouverture de session', 0.25]);

        const token = jwt.sign({ id: user.id, pseudo: user.pseudo, role, level }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, pseudo: user.pseudo, nom: user.nom, prenom: user.prenom, email: user.email, age: user.age, genre: user.genre, type_membre: user.type_membre, points: newPoints, level, role, photo: user.photo } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, pseudo, nom, prenom, email, age, genre, date_naissance, type_membre, photo, points, level, role FROM users WHERE id=?', [req.user.id]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { nom, prenom, password } = req.body;
    try {
        if (password) {
            const hash = await bcrypt.hash(password, 10);
            await db.query('UPDATE users SET nom=?, prenom=?, password=? WHERE id=?', [nom, prenom, hash, req.user.id]);
        } else {
            await db.query('UPDATE users SET nom=?, prenom=? WHERE id=?', [nom, prenom, req.user.id]);
        }
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)', [req.user.id, 'Profil', 'Modification du profil']);
        res.json({ message: 'Profil mis a jour' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
