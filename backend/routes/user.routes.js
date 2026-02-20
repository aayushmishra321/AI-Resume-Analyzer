import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { fullName, phone, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        phone,
        location
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update preferences
router.put('/preferences', authenticate, async (req, res) => {
  try {
    const { emailNotifications, weeklyReport, productUpdates, jobMatchAlerts } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'preferences.emailNotifications': emailNotifications,
        'preferences.weeklyReport': weeklyReport,
        'preferences.productUpdates': productUpdates,
        'preferences.jobMatchAlerts': jobMatchAlerts
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Change password
router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        stats: user.stats,
        subscription: user.subscription
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
