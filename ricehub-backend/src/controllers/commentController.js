import Comment from '../models/Comment.js';
import Rice from '../models/Rice.js'; // <--- Ensure Rice is imported
import Notification from '../models/Notification.js'; // <--- Ensure Notification is imported
import catchAsync from '../utils/catchAsync.js';

export const addComment = catchAsync(async (req, res) => {
  const { text, riceId } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('Comment text is required');
  }

  // 1. Create the Comment
  const comment = await Comment.create({
    text,
    rice: riceId,
    author: req.user._id,
  });

  // 2. Populate author details for the frontend
  await comment.populate('author', 'username avatar');

  // 3. NOTIFICATION LOGIC (The part that was likely crashing)
  try {
    // We must fetch the Rice document to know who owns it
    const rice = await Rice.findById(riceId);
    
    // Only send notification if the rice exists AND it's not my own post
    if (rice && rice.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: rice.author,
        sender: req.user._id,
        type: 'comment',
        rice: riceId
      });
    }
  } catch (error) {
    // If notification fails, just log it. DO NOT crash the request.
    console.error("Notification failed:", error);
  }

  // 4. Send Success Response
  res.status(201).json(comment);
});

// 2. Get all comments for a specific rice
export const getCommentsByRice = catchAsync(async (req, res) => {
  const { riceId } = req.params;

  const comments = await Comment.find({ rice: riceId })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 }); // Newest first

  res.json(comments);
});


// Delete a comment
export const deleteComment = catchAsync(async (req, res) => {
  const comment = await Comment.findById(req.params.id).populate('rice');

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check permission: User must be the comment author OR the post owner
  const isCommentAuthor = comment.author.toString() === req.user._id.toString();
  const isPostOwner = comment.rice.author.toString() === req.user._id.toString();

  if (!isCommentAuthor && !isPostOwner) {
    res.status(401);
    throw new Error('Not authorized to delete this comment');
  }

  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
});