import express from 'express';
import { registerPatient, registerHospital, loginUser, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerPatient);
router.post('/register-hospital', registerHospital);
router.post('/login', loginUser);
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

export default router;
