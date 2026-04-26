const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db/connection');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

function updateLevel(points) {
    if (points >= 60) return { level: 'expert', role: 'admin' };
    if (points >= 30) return { level: 'avance', role: 'complexe' };
    if (points >= 10) return { level: 'intermediaire', role: 'simple' };
    return { level: 'debutant', role: 'simple' };
}

exports.register = async (req, res) => {
    const { pseudo, password, nom, prenom, email, age, genre, date_naissance, type_membre } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM users WHERE pseudo=? OR email=?', [pseudo, email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Pseudo ou email deja utilise' });

        const hash = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(32).toString('hex');

        await db.query(
            'INSERT INTO users (pseudo, password, nom, prenom, email, age, genre, date_naissance, type_membre, token_validation) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [pseudo, hash, nom, prenom, email, age, genre, date_naissance, type_membre, token]
        );

        const validationUrl = `${process.env.CLIENT_URL}/valider-email?token=${token}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Validation de votre compte MediaTech',
            html: `<p>Bonjour ${prenom},</p><p>Cliquez sur ce lien pour valider votre inscription :</p><a href="${validationUrl}">${validationUrl}</a>`
        });

        res.json({ message: 'Inscription reussie. Verifiez votre email.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.validateEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const [rows] = await db.query('SELECT id FROM users WHERE token_validation=?', [token]);
        if (!rows.length) return res.status(400).json({ message: 'Token invalide' });
        await db.query('UPDATE users SET actif=TRUE, token_validation=NULL WHERE token_validation=?', [token]);
        res.json({ message: 'Compte active. Vous pouvez vous connecter.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { pseudo, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE pseudo=?', [pseudo]);
        if (!rows.length) return res.status(401).json({ message: 'Identifiants invalides' });
        const user = rows[0];
        if (!user.actif) return res.status(401).json({ message: 'Compte non active. Verifiez votre email.' });
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
