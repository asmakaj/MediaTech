const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth, requireRole('admin'));

router.get('/users', ctrl.getUsers);
router.delete('/users/:id', ctrl.deleteUser);
router.patch('/users/:id/points', ctrl.adjustPoints);
router.get('/logs', ctrl.getLogs);
router.get('/deletion-requests', ctrl.getDeletionRequests);
router.post('/deletion-requests/:id/approve', ctrl.approveDeletion);
router.post('/deletion-requests/:id/reject', ctrl.rejectDeletion);
router.get('/categories', ctrl.getCategories);
router.post('/categories', ctrl.addCategory);
router.delete('/categories/:id', ctrl.deleteCategory);
router.get('/salles', ctrl.getSalles);
router.get('/export', ctrl.exportData);
router.get('/reservations', ctrl.getReservations);
router.post('/reservations', auth, ctrl.createReservation);

module.exports = router;
