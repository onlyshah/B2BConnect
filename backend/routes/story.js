const express = require('express');
const { authenticate, authorize, ensureTenant } = require('../middleware/auth');
const {
  getStories,
  createStory,
  updateStory,
  viewStory,
} = require('../controllers/storyController');

const router = express.Router();

router.get('/', authenticate, ensureTenant, getStories);

router.post('/', authenticate, ensureTenant, authorize(['company-admin']), createStory);

router.put('/:storyId', authenticate, ensureTenant, authorize(['company-admin']), updateStory);

router.post('/:storyId/view', authenticate, ensureTenant, viewStory);

module.exports = router;
