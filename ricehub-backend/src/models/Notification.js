import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who gets the alert
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },    // Who triggered it
  type: { type: String, enum: ['like', 'comment'], required: true },
  rice: { type: mongoose.Schema.Types.ObjectId, ref: 'Rice' },                      // Which post is it about?
  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);