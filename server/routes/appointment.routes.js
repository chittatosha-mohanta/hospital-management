import express from 'express';
import {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getHospitalAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

// Patient routes
router.post('/', protect, roleGuard('patient'), bookAppointment);
router.get('/my', protect, roleGuard('patient'), getMyAppointments);
router.put('/:id/cancel', protect, roleGuard('patient'), cancelAppointment);

// Doctor routes
router.get('/doctor', protect, roleGuard('doctor'), getDoctorAppointments);
router.put('/:id/status', protect, roleGuard('doctor', 'hospitalAdmin'), updateAppointmentStatus);

// Hospital admin routes
router.get('/hospital', protect, roleGuard('hospitalAdmin'), getHospitalAppointments);

// Public — get available slots
router.get('/slots/:doctorId/:date', getAvailableSlots);

export default router;
