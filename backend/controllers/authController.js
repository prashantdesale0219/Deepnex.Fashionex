const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { generateVerificationToken, generateOTP, sendVerificationEmail, sendPasswordResetEmail, sendOTPEmail } = require('../services/emailService');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Set JWT cookie
const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.JWT_EXPIRE?.replace('d', '')) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  res.cookie('token', token, cookieOptions);
};

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }
  
  // Generate OTP for email verification
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  // Create user
  const user = await User.create({
    email: email.toLowerCase(),
    passwordHash: password,
    firstName,
    lastName,
    otp,
    otpExpires,
    isEmailVerified: false
  });
  
  // Send OTP email
  try {
    await sendOTPEmail(user.email, user.firstName, otp);
    console.log(`OTP email sent to: ${user.email}`);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    // Don't fail registration if email fails
  }
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully. Please check your email for OTP to verify your account and login.',
    data: {
      email: user.email
    }
  });
});

// @desc    Request OTP for login
// @route   POST /api/auth/request-otp
// @access  Public
const requestOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    throw new AppError('No account found with this email', 404);
  }
  
  // Check if account is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated. Please contact support.', 401);
  }
  
  // Generate OTP
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  // Save OTP to user
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();
  
  // Send OTP email
  try {
    await sendOTPEmail(user.email, user.firstName, otp);
    console.log(`Login OTP sent to: ${user.email}`);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new AppError('Failed to send OTP. Please try again.', 500);
  }
  
  res.status(200).json({
    success: true,
    message: 'OTP sent to your email. Please use it to login.',
    data: {
      email: user.email
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validate all required fields
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }
  
  // Find user and include password for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Check if account is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated. Please contact support.', 401);
  }
  
  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }
  
  // Check if email is verified
  if (!user.isEmailVerified) {
    throw new AppError('Email not verified. Please verify your email before logging in.', 401);
  }
  
  // Generate token
  const token = generateToken(user._id);
  
  // Set cookie
  setTokenCookie(res, token);
  
  // Update last login
  await user.updateLastLogin();
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.getFullName(),
        role: user.role,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
        isEmailVerified: user.isEmailVerified
      },
      token
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  // Clear cookie
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.getFullName(),
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        preferences: user.preferences,
        apiUsage: user.apiUsage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, preferences } = req.body;
  
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Update fields
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences };
  }
  
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.getFullName(),
        role: user.role,
        preferences: user.preferences,
        updatedAt: user.updatedAt
      }
    }
  });
});

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Get user with password
  const user = await User.findById(req.user.id).select('+passwordHash');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Check current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }
  
  // Update password
  user.passwordHash = newPassword;
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
const refreshToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user || !user.isActive) {
    throw new AppError('User not found or inactive', 401);
  }
  
  // Generate new token
  const token = generateToken(user._id);
  
  // Set new cookie
  setTokenCookie(res, token);
  
  res.status(200).json({
    success: true,
    message: 'Token refreshed successfully',
    data: {
      token
    }
  });
});

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    throw new AppError('Password is required to delete account', 400);
  }
  
  // Get user with password
  const user = await User.findById(req.user.id).select('+passwordHash');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid password', 400);
  }
  
  // Soft delete - deactivate account
  user.isActive = false;
  await user.save();
  
  // Clear cookie
  res.cookie('token', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  
  res.status(200).json({
    success: true,
    message: 'Account deactivated successfully'
  });
});

// @desc    Verify email with OTP (for backward compatibility)
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    throw new AppError('Email and OTP are required', 400);
  }
  
  // Find user with valid OTP
  const user = await User.findOne({
    email: email.toLowerCase(),
    otp: otp,
    otpExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new AppError('Invalid or expired OTP', 400);
  }
  
  // Update user
  user.isEmailVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();
  
  res.json({
    success: true,
    message: 'Email verified successfully',
    data: {
      redirectUrl: `${process.env.CLIENT_URL}/?login=true`
    }
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    throw new AppError('Email is required', 400);
  }
  
  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    throw new AppError('No account found with this email', 404);
  }
  
  if (user.isEmailVerified && !req.body.forLogin) {
    throw new AppError('Email is already verified', 400);
  }
  
  // Generate new OTP
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();
  
  // Send OTP email
  await sendOTPEmail(user.email, user.firstName, otp);
  
  res.json({
    success: true,
    message: 'OTP sent successfully',
    data: {
      email: user.email
    }
  });
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError('No user found with this email address', 404);
  }
  
  // Generate reset token
  const resetToken = generateVerificationToken();
  const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = resetExpires;
  await user.save();
  
  // Send reset email
  await sendPasswordResetEmail(user.email, user.firstName, resetToken);
  
  res.json({
    success: true,
    message: 'Password reset email sent successfully'
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  
  // Find user with valid reset token
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });
  
  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }
  
  // Update password
  user.passwordHash = password;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
  
  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

module.exports = {
  signup,
  requestOTP,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  refreshToken,
  deleteAccount,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword
};