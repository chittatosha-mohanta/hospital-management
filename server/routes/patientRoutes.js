const express = require('express');
const { getAvailableDoctors, bookAppointment, getMyAppointments } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('patient'));

router.get('/doctors', getAvailableDoctors);
router.post('/appointments', bookAppointment);
router.get('/appointments', getMyAppointments);

module.exports = router;
