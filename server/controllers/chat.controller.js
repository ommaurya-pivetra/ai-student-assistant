const Chat = require('../models/Chat');

class ChatController {
  async getHistory(req, res, next) {
    try {
      const chats = await Chat.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('mode prompt createdAt _id');

      return res.status(200).json({
        success: true,
        data: { chats }
      });
    } catch (error) {
      return next(error);
    }
  }

  async getChatById(req, res, next) {
    try {
      const { chatId } = req.params;

      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          success: false,
          error: { message: 'Chat not found' }
        });
      }

      if (chat.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: { message: 'Unauthorized' }
        });
      }

      return res.status(200).json({
        success: true,
        data: { chat }
      });
    } catch (error) {
      return next(error);
    }
  }

  async saveChat(req, res, next) {
    try {
      const { mode, prompt, response } = req.body;

      if (!mode || !prompt || !response) {
        return res.status(400).json({
          success: false,
          error: { message: 'Mode, prompt, and response are required' }
        });
      }

      const chat = await Chat.create({
        userId: req.user.id,
        mode,
        prompt,
        response
      });

      return res.status(201).json({
        success: true,
        data: { chat }
      });
    } catch (error) {
      return next(error);
    }
  }

  async deleteChat(req, res, next) {
    try {
      const { chatId } = req.params;

      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          success: false,
          error: { message: 'Chat not found' }
        });
      }

      if (chat.userId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: { message: 'Unauthorized' }
        });
      }

      await Chat.deleteOne({ _id: chatId });

      return res.status(200).json({
        success: true,
        data: { message: 'Chat deleted' }
      });
    } catch (error) {
      return next(error);
    }
  }

  async clearHistory(req, res, next) {
    try {
      await Chat.deleteMany({ userId: req.user.id });

      return res.status(200).json({
        success: true,
        data: { message: 'All chats deleted' }
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new ChatController();
