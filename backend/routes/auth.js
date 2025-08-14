const express = require('express');
const {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  refreshToken,
  deleteAccount,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validate,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require('../middleware/validation');
const { upload } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.post('/signup', validateRegistration, signup);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.get('/me', getMe);
router.post('/logout', logout);
router.put('/profile', 
  upload.single('profileImage'),
  validateProfileUpdate, 
  updateProfile
);
router.put('/change-password', validatePasswordChange, changePassword);
router.post('/resend-verification', resendVerification);
router.delete('/delete-account', deleteAccount);

module.exports = router;