import express from 'express';
import {
  createPrescription,
  getPrescriptions,
  getPrescription,
} from '../controllers/prescriptionController.js';
import { protect } from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

// Doctor — create prescription
router.post('/', protect, roleGuard('doctor'), createPrescription);

// Get prescriptions (role-based filtering inside controller)
router.get('/', protect, getPrescriptions);

// Get single prescription (access control inside controller)
router.get('/:id', protect, getPrescription);

export default router;
