import express from 'express';
import {
  createReview,
  getHospitalReviews,
  getDoctorReviews,
  respondToReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

// Patient — create review
router.post('/', protect, roleGuard('patient'), createReview);

// Public — get reviews
router.get('/hospital/:hospitalId', getHospitalReviews);
router.get('/doctor/:doctorId', getDoctorReviews);

// Hospital admin — respond to review
router.put('/:id/respond', protect, roleGuard('hospitalAdmin'), respondToReview);

export default router;
