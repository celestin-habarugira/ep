const express = require('express');
const router = express.Router();
const { register, login, getProfile, getAll, getById, create, update, remove, uploadPhoto } = require('../controllers/employeeController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../config/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/', protect, getAll);
router.post('/', protect, admin, create);
router.get('/:id', protect, getById);
router.put('/:id', protect, admin, update);
router.delete('/:id', protect, admin, remove);
router.post('/upload-photo', protect, upload.singleHandled('photo'), uploadPhoto);

module.exports = router;
