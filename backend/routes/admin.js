const express = require('express');
const router = express.Router();
const {
  getDashboard,
  getUsers,
  deleteUser,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes are protected and require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

module.exports = router;