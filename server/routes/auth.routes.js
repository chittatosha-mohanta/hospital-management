import express from 'express';
import { registerPatient, registerHospital, loginUser, getProfile, updateProfile, supabaseLogin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerPatient);
router.post('/register-hospital', registerHospital);
router.post('/login', loginUser);
router.post('/supabase-login', supabaseLogin);
router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

export default router;
