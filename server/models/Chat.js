const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mode: {
      type: String,
      enum: ['explain', 'mcq', 'summarize', 'improve'],
      required: true
    },
    prompt: {
      type: String,
      required: true
    },
    response: mongoose.Schema.Types.Mixed
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
