const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', auth, ctrl.getMe);
router.put('/profile', auth, ctrl.updateProfile);

module.exports = router;
