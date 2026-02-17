const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const requireAuth = require('../middleware/auth.middleware');

router.post('/generate', requireAuth, aiController.generate.bind(aiController));
router.get('/modes', aiController.getModes.bind(aiController));

module.exports = router;
