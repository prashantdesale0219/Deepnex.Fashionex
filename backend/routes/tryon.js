const express = require('express');
const {
  createTryOnTask,
  getTryOnTaskStatus,
  getUserTryOnTasks,
  cancelTryOnTask,
  deleteTryOnTask,
  retryTryOnTask,
  downloadTryOnResult
} = require('../controllers/tryonController');
const { protect, rateLimitAuth } = require('../middleware/auth');
const {
  validate,
  schemas
} = require('../middleware/validation');

const router = express.Router();

// Test endpoint (no auth) - must be before protect middleware
router.get('/test-download/:id', (req, res) => {
  console.log('🧪 Test download route hit');
  console.log('📋 Test params:', req.params);
  console.log('📋 Test URL:', req.url);
  res.json({ message: 'Test download route working', id: req.params.id, url: req.url });
});

// All routes below are protected
router.use(protect);
router.use(rateLimitAuth);

// @desc    Create new try-on task
// @route   POST /api/tryon
// @access  Private
router.post('/',
  validate(schemas.tryOnRequest),
  createTryOnTask
);

// @desc    Get user's try-on tasks
// @route   GET /api/tryon/list
// @access  Private
router.get('/list',
  validate(schemas.pagination),
  getUserTryOnTasks
);

// @desc    Get try-on task status
// @route   GET /api/tryon/:id
// @access  Private
router.get('/:id', getTryOnTaskStatus);



// @desc    Download try-on result
// @route   GET /api/tryon/:id/download
// @access  Private
router.get('/:id/download', (req, res, next) => {
  console.log('🚀 Route hit: /api/tryon/:id/download');
  console.log('📋 Route params:', req.params);
  console.log('📋 Route URL:', req.url);
  next();
}, downloadTryOnResult);

// @desc    Cancel try-on task
// @route   DELETE /api/tryon/:id/cancel
// @access  Private
router.delete('/:id/cancel', cancelTryOnTask);

// @desc    Retry failed try-on task
// @route   POST /api/tryon/:id/retry
// @access  Private
router.post('/:id/retry', retryTryOnTask);

// @desc    Delete try-on task
// @route   DELETE /api/tryon/:id
// @access  Private
router.delete('/:id', deleteTryOnTask);

module.exports = router;