const router = require('express').Router();
const ctrl = require('../controllers/objetController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.get('/stats', auth, requireRole('complexe', 'admin'), ctrl.getStats);
router.get('/:id', auth, ctrl.getOne);
router.post('/', auth, requireRole('complexe', 'admin'), ctrl.create);
router.put('/:id', auth, requireRole('complexe', 'admin'), ctrl.update);
router.patch('/:id/toggle', auth, requireRole('complexe', 'admin'), ctrl.toggle);
router.post('/:id/delete-request', auth, requireRole('complexe', 'admin'), ctrl.requestDeletion);

module.exports = router;
