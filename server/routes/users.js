const router = require('express').Router();
const db = require('../db/connection');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, pseudo, age, genre, type_membre, level, photo FROM users WHERE actif=TRUE');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/history', auth, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM action_log WHERE user_id=? ORDER BY created_at DESC LIMIT 100', [req.user.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
