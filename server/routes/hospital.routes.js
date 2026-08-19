import express from 'express';
import {
  getHospitals,
  getHospitalBySlug,
  getMyHospital,
  updateMyHospital,
  getHospitalStats,
  getFeaturedHospitals,
  getCities,
} from '../controllers/hospitalController.js';
import { protect } from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

// Public routes
router.get('/', getHospitals);
router.get('/featured', getFeaturedHospitals);
router.get('/cities', getCities);
router.get('/:slug', getHospitalBySlug);

// Hospital admin routes
router.get('/my-hospital/details', protect, roleGuard('hospitalAdmin'), getMyHospital);
router.put('/my-hospital/details', protect, roleGuard('hospitalAdmin'), updateMyHospital);
router.get('/my-hospital/stats', protect, roleGuard('hospitalAdmin'), getHospitalStats);

export default router;
