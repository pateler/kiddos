import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getUserProfile, createAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/create-admin', createAdmin);

export default router;
