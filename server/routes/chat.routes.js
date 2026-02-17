const express = require('express');
const chatController = require('../controllers/chat.controller');
const requireAuth = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/history', chatController.getHistory);
router.post('/save', chatController.saveChat);
router.get('/:chatId', chatController.getChatById);
router.delete('/:chatId', chatController.deleteChat);
router.delete('/', chatController.clearHistory);

module.exports = router;
