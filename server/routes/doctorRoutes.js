const express = require('express');
const { getDoctorAppointments, updateAppointmentStatus, addPrescription } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('doctor'));

router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:id', updateAppointmentStatus);
router.post('/prescriptions', addPrescription);

module.exports = router;
