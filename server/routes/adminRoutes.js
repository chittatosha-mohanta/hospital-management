const express = require('express');
const { getDoctors, createDoctor, getStats } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/doctors', getDoctors);
router.post('/doctors', createDoctor);
router.get('/stats', getStats);

module.exports = router;
