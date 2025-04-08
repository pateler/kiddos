
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, createAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/create-admin', createAdmin);

module.exports = router;
