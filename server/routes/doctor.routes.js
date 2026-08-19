import express from 'express';
import {
  searchDoctors,
  addDoctor,
  getHospitalDoctors,
  getDoctorsByHospital,
  getDoctorProfile,
  updateDoctorProfile,
  removeDoctor,
} from '../controllers/doctorController.js';
import { protect } from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

// Public routes
router.get('/', searchDoctors);
router.get('/hospital/:hospitalId', getDoctorsByHospital);
router.get('/:userId', getDoctorProfile);

// Hospital admin routes
router.post('/', protect, roleGuard('hospitalAdmin'), addDoctor);
router.get('/my-hospital/list', protect, roleGuard('hospitalAdmin'), getHospitalDoctors);
router.delete('/:userId', protect, roleGuard('hospitalAdmin'), removeDoctor);

// Doctor or hospital admin
router.put('/:userId', protect, roleGuard('doctor', 'hospitalAdmin'), updateDoctorProfile);

export default router;
