const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.get('/health', adminController.getSystemHealth);
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.put('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);
router.get('/reports/usage', adminController.getUsageReports);
router.get('/metrics', adminController.getMetricsHistory);

module.exports = router;
