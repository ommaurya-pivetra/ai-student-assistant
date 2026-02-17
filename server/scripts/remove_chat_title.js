const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Chat = require('../models/Chat');

const run = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Check server/.env.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const result = await Chat.updateMany({ title: { $exists: true } }, { $unset: { title: '' } });
  console.log('Removed title from', result.modifiedCount, 'chats.');
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error('Failed to remove title field:', error.message);
  process.exit(1);
});
