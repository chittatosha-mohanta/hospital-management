import express from 'express';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import { protect } from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';

const router = express.Router();

// Public — get departments for a hospital
router.get('/:hospitalId', getDepartments);

// Hospital admin — manage departments
router.post('/', protect, roleGuard('hospitalAdmin'), createDepartment);
router.put('/:id', protect, roleGuard('hospitalAdmin'), updateDepartment);
router.delete('/:id', protect, roleGuard('hospitalAdmin'), deleteDepartment);

export default router;
