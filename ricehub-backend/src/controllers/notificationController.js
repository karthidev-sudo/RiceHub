import Notification from '../models/Notification.js';
import catchAsync from '../utils/catchAsync.js';

// Get my notifications
export const getMyNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate('sender', 'username avatar')
    .populate('rice', 'title') // We need the title to show "User liked 'My Rice'"
    .sort({ createdAt: -1 });

  res.json(notifications);
});

// Mark all as read
export const markNotificationsRead = catchAsync(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );
  res.json({ message: 'Marked as read' });
});