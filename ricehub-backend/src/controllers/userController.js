import User from '../models/User.js';
import Rice from '../models/Rice.js';
import catchAsync from '../utils/catchAsync.js';
import cloudinary from '../config/cloudinary.js';

export const getUserProfile = catchAsync(async (req, res) => {
  const { username } = req.params;

  // 1. Find the user
  const user = await User.findOne({ username }).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // 2. Find all rices by this user
  const rices = await Rice.find({ author: user._id }).sort({ createdAt: -1 });

  res.json({ user, rices });
});

export const updateUserProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // 1. Handle Avatar Upload (if provided)
  let avatarUrl = user.avatar;
  if (req.file) {
    // Stream upload to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'ricehub/avatars' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };
    const result = await uploadToCloudinary();
    avatarUrl = result.secure_url;
  }

  // 2. Update Fields
  user.username = req.body.username || user.username;
  user.bio = req.body.bio || user.bio;
  user.avatar = avatarUrl;
  
  // Update Socials (Merge with existing)
  // We expect socials to be sent as a JSON string or individual fields
  // For simplicity, let's assume individual fields:
  user.socials = {
    github: req.body.github || user.socials?.github,
    twitter: req.body.twitter || user.socials?.twitter
  };

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    bio: updatedUser.bio,
    socials: updatedUser.socials,
  });
});

// Toggle Save Rice
export const toggleSaveRice = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { riceId } = req.body;

  // Check if already saved
  const isSaved = user.savedRices.includes(riceId);

  if (isSaved) {
    // Unsave
    user.savedRices = user.savedRices.filter(id => id.toString() !== riceId);
  } else {
    // Save
    user.savedRices.push(riceId);
  }

  await user.save();
  res.json(user.savedRices);
});

export const getMySavedRices = catchAsync(async (req, res) => {
  // Find the current user and populate the 'savedRices' array with actual data
  const user = await User.findById(req.user._id).populate({
    path: 'savedRices',
    populate: { path: 'author', select: 'username avatar' } // Also get author of those rices
  });

  res.json(user.savedRices);
});