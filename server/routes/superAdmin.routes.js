import express from 'express';
import {
  getAllHospitals,
  updateHospitalStatus,
  toggleFeatured,
  getAllUsers,
  toggleUserStatus,
  getPlatformAnalytics,
} from '../controllers/superAdminController.js';
import { protect } from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

// All routes require superAdmin
router.use(protect, roleGuard('superAdmin'));

// Hospitals
router.get('/hospitals', getAllHospitals);
router.put('/hospitals/:id/status', updateHospitalStatus);
router.put('/hospitals/:id/feature', toggleFeatured);

// Users
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);

// Analytics
router.get('/analytics', getPlatformAnalytics);

export default router;
