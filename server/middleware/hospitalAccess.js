// Hospital data isolation middleware
// Ensures hospital admins and doctors can only access their own hospital's data
const hospitalAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  // Super admins bypass hospital isolation
  if (req.user.role === 'superAdmin') {
    return next();
  }

  // For hospital admin and doctor, verify hospital ownership
  if (req.user.role === 'hospitalAdmin' || req.user.role === 'doctor') {
    const hospitalId = req.params.hospitalId || req.body.hospitalId || req.query.hospitalId;

    if (hospitalId && req.user.hospital?.toString() !== hospitalId) {
      return res.status(403).json({
        message: 'Access denied — you can only access your own hospital data',
      });
    }

    // Attach hospital ID to request for convenience
    req.hospitalId = req.user.hospital;
  }

  next();
};

export default hospitalAccess;
