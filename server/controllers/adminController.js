const db = require('../db/connection');

function updateLevel(points) {
    if (points >= 60) return { level: 'expert', role: 'admin' };
    if (points >= 30) return { level: 'avance', role: 'complexe' };
    return { level: 'debutant', role: 'simple' };
}

exports.getUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, pseudo, nom, prenom, email, age, genre, type_membre, points, level, role, actif, created_at FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT type_membre FROM users WHERE id=?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ message: 'Utilisateur introuvable' });
        if (rows[0].type_membre === 'administrateur') {
            return res.status(403).json({ message: 'Impossible de supprimer un compte administrateur' });
        }
        await db.query('DELETE FROM users WHERE id=?', [req.params.id]);
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)', [req.user.id, 'Admin: Suppr User', `User ${req.params.id} supprime`]);
        res.json({ message: 'Utilisateur supprime' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adjustPoints = async (req, res) => {
    const { delta } = req.body;
    try {
        const [rows] = await db.query('SELECT points, pseudo FROM users WHERE id=?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ message: 'Introuvable' });
        const newPoints = Math.max(0, parseFloat(rows[0].points) + delta);
        const { level, role } = updateLevel(newPoints);
        await db.query('UPDATE users SET points=?, level=?, role=? WHERE id=?', [newPoints, level, role, req.params.id]);
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)',
            [req.user.id, 'Admin: Modif points', `${rows[0].pseudo} ajuste de ${delta}pts`]);
        res.json({ newPoints, level, role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT l.*, u.pseudo FROM action_log l LEFT JOIN users u ON l.user_id=u.id ORDER BY l.created_at DESC LIMIT 500'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDeletionRequests = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT dr.*, o.nom as objet_nom, u.pseudo FROM deletion_requests dr 
             LEFT JOIN objets o ON dr.objet_id=o.id LEFT JOIN users u ON dr.user_id=u.id 
             WHERE dr.status="pending"`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.approveDeletion = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT objet_id FROM deletion_requests WHERE id=?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ message: 'Introuvable' });
        await db.query('DELETE FROM objets WHERE id=?', [rows[0].objet_id]);
        await db.query('UPDATE deletion_requests SET status="approved" WHERE id=?', [req.params.id]);
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)',
            [req.user.id, 'Admin: Approval', `Objet ${rows[0].objet_id} supprime`]);
        res.json({ message: 'Objet supprime' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.rejectDeletion = async (req, res) => {
    try {
        await db.query('UPDATE deletion_requests SET status="rejected" WHERE id=?', [req.params.id]);
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)',
            [req.user.id, 'Admin: Rejet', `Demande ${req.params.id} rejetee`]);
        res.json({ message: 'Demande rejetee' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM categories');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addCategory = async (req, res) => {
    const { nom } = req.body;
    try {
        await db.query('INSERT INTO categories (nom) VALUES (?)', [nom]);
        res.json({ message: 'Categorie ajoutee' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await db.query('DELETE FROM categories WHERE id=?', [req.params.id]);
        res.json({ message: 'Categorie supprimee' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getSalles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM salles');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.exportData = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, pseudo, email, points, level, role FROM users');
        const [objets] = await db.query('SELECT * FROM objets');
        const [logs] = await db.query('SELECT * FROM action_log ORDER BY created_at DESC LIMIT 1000');
        res.json({ users, objets, logs, exported_at: new Date() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getReservations = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT r.*, s.nom as salle_nom, u.pseudo FROM reservations r LEFT JOIN salles s ON r.salle_id=s.id LEFT JOIN users u ON r.user_id=u.id ORDER BY r.date_reservation DESC'
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createReservation = async (req, res) => {
    const { salle_id, date_reservation, heure } = req.body;
    try {
        await db.query('INSERT INTO reservations (salle_id, user_id, date_reservation, heure) VALUES (?,?,?,?)',
            [salle_id, req.user.id, date_reservation, heure]);
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)',
            [req.user.id, 'Reservation', `Salle ${salle_id} le ${date_reservation}`]);
        res.json({ message: 'Reservation enregistree' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
