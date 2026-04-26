const db = require('../db/connection');

function updateLevel(points) {
    if (points >= 60) return { level: 'expert', role: 'admin' };
    if (points >= 30) return { level: 'avance', role: 'complexe' };
    if (points >= 10) return { level: 'intermediaire', role: 'simple' };
    return { level: 'debutant', role: 'simple' };
}

exports.getAll = async (req, res) => {
    const { q, type_id, etat } = req.query;
    let sql = `SELECT o.*, c.nom as type_nom, s.nom as salle_nom 
               FROM objets o 
               LEFT JOIN categories c ON o.type_id = c.id 
               LEFT JOIN salles s ON o.salle_id = s.id WHERE 1=1`;
    const params = [];
    if (q) { sql += ' AND (o.nom LIKE ? OR o.marque LIKE ? OR o.description LIKE ?)'; params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
    if (type_id) { sql += ' AND o.type_id = ?'; params.push(type_id); }
    if (etat) { sql += ' AND o.etat = ?'; params.push(etat); }
    try {
        const [rows] = await db.query(sql, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOne = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT o.*, c.nom as type_nom, s.nom as salle_nom FROM objets o LEFT JOIN categories c ON o.type_id=c.id LEFT JOIN salles s ON o.salle_id=s.id WHERE o.id=?`,
            [req.params.id]
        );
        if (!rows.length) return res.status(404).json({ message: 'Objet introuvable' });

        const user = req.user;
        const newPoints = parseFloat((await db.query('SELECT points FROM users WHERE id=?', [user.id]))[0][0].points) + 0.50;
        const { level, role } = updateLevel(newPoints);
        await db.query('UPDATE users SET points=?, level=?, role=? WHERE id=?', [newPoints, level, role, user.id]);
        await db.query('INSERT INTO action_log (user_id, type, detail, pts_gagnes) VALUES (?,?,?,?)',
            [user.id, 'Consultation', `Objet: ${rows[0].nom}`, 0.50]);

        res.json({ objet: rows[0], newPoints, level, role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    const { id, nom, marque, description, type_id, consommation, consommation_max, salle_id, connectivite, params } = req.body;
    try {
        await db.query(
            'INSERT INTO objets (id, nom, marque, description, type_id, consommation, consommation_max, salle_id, connectivite, params) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [id || ('O' + Date.now()), nom, marque, description, type_id, consommation, consommation_max, salle_id, connectivite, JSON.stringify(params || {})]
        );
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)', [req.user.id, 'Creation objet', `Nouvel objet: ${nom}`]);
        res.json({ message: 'Objet cree' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update = async (req, res) => {
    const { nom, marque, description, etat, consommation, salle_id, connectivite, params } = req.body;
    try {
        await db.query(
            'UPDATE objets SET nom=?, marque=?, description=?, etat=?, consommation=?, salle_id=?, connectivite=?, params=?, derniere_interaction=NOW() WHERE id=?',
            [nom, marque, description, etat, consommation, salle_id, connectivite, JSON.stringify(params || {}), req.params.id]
        );
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)', [req.user.id, 'Modification objet', `Objet ${req.params.id} mis a jour`]);
        res.json({ message: 'Objet mis a jour' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.toggle = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT etat, nom FROM objets WHERE id=?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ message: 'Introuvable' });
        const newEtat = rows[0].etat === 'Actif' ? 'Inactif' : 'Actif';
        await db.query('UPDATE objets SET etat=?, derniere_interaction=NOW() WHERE id=?', [newEtat, req.params.id]);
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)',
            [req.user.id, 'Modification etat', `${rows[0].nom} -> ${newEtat}`]);
        res.json({ etat: newEtat });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.requestDeletion = async (req, res) => {
    const { reason } = req.body;
    try {
        const [existing] = await db.query('SELECT id FROM deletion_requests WHERE objet_id=? AND status="pending"', [req.params.id]);
        if (existing.length) return res.status(400).json({ message: 'Demande deja en cours' });
        await db.query('INSERT INTO deletion_requests (objet_id, user_id, reason) VALUES (?,?,?)', [req.params.id, req.user.id, reason]);
        await db.query('INSERT INTO action_log (user_id, type, detail) VALUES (?,?,?)', [req.user.id, 'Demande suppression', `Objet: ${req.params.id}`]);
        res.json({ message: 'Demande envoyee' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const [total] = await db.query('SELECT COUNT(*) as total, SUM(CASE WHEN etat="Actif" THEN consommation ELSE 0 END) as conso FROM objets');
        const [inefficaces] = await db.query('SELECT * FROM objets WHERE etat="Actif" AND consommation > consommation_max * 1.5');
        const [parType] = await db.query('SELECT c.nom, COUNT(o.id) as count FROM objets o LEFT JOIN categories c ON o.type_id=c.id GROUP BY c.id');
        res.json({ total: total[0], inefficaces, parType });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
