const express = require('express');
const router = express.Router();
const { getAll, create, createBulk, update, remove, getStats } = require('../controllers/attendanceController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAll);
router.post('/', protect, create);
router.post('/bulk', protect, createBulk);
router.put('/:id', protect, update);
router.delete('/:id', protect, remove);
router.get('/stats', protect, getStats);

module.exports = router;
