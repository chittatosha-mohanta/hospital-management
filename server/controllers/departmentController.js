import Department from '../models/Department.js';

// @desc    Get departments for a hospital (public)
// @route   GET /api/departments/:hospitalId
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({
      hospital: req.params.hospitalId,
      isActive: true,
    }).populate('headDoctor', 'name avatar');

    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create department (hospital admin)
// @route   POST /api/departments
export const createDepartment = async (req, res) => {
  try {
    const { name, description, icon, headDoctor } = req.body;

    const department = await Department.create({
      hospital: req.user.hospital,
      name,
      description,
      icon,
      headDoctor,
    });

    res.status(201).json(department);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A department with this name already exists in your hospital' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update department (hospital admin)
// @route   PUT /api/departments/:id
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findOne({
      _id: req.params.id,
      hospital: req.user.hospital,
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    const { name, description, icon, headDoctor, isActive } = req.body;
    if (name !== undefined) department.name = name;
    if (description !== undefined) department.description = description;
    if (icon !== undefined) department.icon = icon;
    if (headDoctor !== undefined) department.headDoctor = headDoctor;
    if (isActive !== undefined) department.isActive = isActive;

    await department.save();
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete department (hospital admin)
// @route   DELETE /api/departments/:id
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findOneAndDelete({
      _id: req.params.id,
      hospital: req.user.hospital,
    });

    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
