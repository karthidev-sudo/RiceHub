import Rice from "../models/Rice.js";
import catchAsync from "../utils/catchAsync.js";
import cloudinary from "../config/cloudinary.js";
import { z } from "zod";
import Notification from "../models/Notification.js";

// Zod Schema for input validation
const createRiceSchema = z.object({
  title: z.string().min(3),
  windowManager: z.string().min(1),
  distro: z.string().min(1),
});

export const createRice = catchAsync(async (req, res) => {
  // 1. Check if file exists
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  // 2. Validate Text Data
  // req.body comes as strings (multipart/form-data), so we might need to parse JSON if sent as string
  // For now, we assume simple fields
  const validation = createRiceSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400);
    throw new Error(validation.error.errors[0].message);
  }

  // 3. Upload to Cloudinary (Stream)
  // We wrap the stream in a Promise to await it
  const uploadToCloudinary = () => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "ricehub" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(req.file.buffer);
    });
  };

  const cloudImage = await uploadToCloudinary();

  // 4. Create Rice in DB
  const rice = await Rice.create({
    title: req.body.title,
    description: req.body.description,
    imageUrl: cloudImage.secure_url,
    config: {
      windowManager: req.body.windowManager,
      distro: req.body.distro,
      shell: req.body.shell,
      dotfilesUrl: req.body.dotfilesUrl,
      codeSnippet: req.body.codeSnippet,
    },
    author: req.user._id,
  });

  res.status(201).json(rice);
});

export const getAllRices = catchAsync(async (req, res) => {
  const { search, wm, sort } = req.query; // Add sort

  let query = {};
  if (search) {
    /* ... search logic ... */
  }
  if (wm) {
    /* ... wm logic ... */
  }

  let rices = Rice.find(query).populate("author", "username avatar");

  // SORTING LOGIC
  if (sort === "top") {
    // Sort by length of 'likes' array (Descending)
    // Note: Sorting by array length in Mongo requires aggregation or a virtual count field.
    // For a simple app, we can fetch all and sort in JS, or better:
    // Add a 'likesCount' field to the schema and keep it updated.
    // BUT, the easiest valid MongoDB sort without schema changes is just 'createdAt':

    // Simplest approach: Sort by createdAt (Latest) or just let frontend sort if data is small.
    // Professional approach: Use Mongo Aggregation.

    rices = await Rice.aggregate([
      { $match: query },
      {
        $addFields: { likesCount: { $size: "$likes" } },
      },
      { $sort: { likesCount: -1 } }, // High to Low
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      }, // Re-populate author
      { $unwind: "$author" }, // Aggregation returns array, flatten it
    ]);

    return res.json(rices); // Return immediately for aggregation path
  } else {
    // Default: Newest first
    rices = await rices.sort({ createdAt: -1 });
  }

  const result = await rices;
  res.json(result);
});

// Get single rice by ID
export const getRiceById = catchAsync(async (req, res) => {
  const rice = await Rice.findById(req.params.id).populate(
    "author",
    "username avatar"
  );

  if (!rice) {
    res.status(404);
    throw new Error("Rice not found");
  }

  res.json(rice);
});

// Toggle Like
export const toggleLike = catchAsync(async (req, res) => {
  const rice = await Rice.findById(req.params.id);

  if (!rice) {
    res.status(404);
    throw new Error("Rice not found");
  }

  // Check if user already liked
  const isLiked = rice.likes.includes(req.user._id);

  if (isLiked) {
    // Unlike: Remove user ID from array
    rice.likes = rice.likes.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
  } else {
    // Like: Add user ID
    rice.likes.push(req.user._id);

    if (rice.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: rice.author,
        sender: req.user._id,
        type: "like",
        rice: rice._id,
      });
    }
  }

  await rice.save();
  res.json({ likes: rice.likes, isLiked: !isLiked });
});

// Delete Rice
export const deleteRice = catchAsync(async (req, res) => {
  const rice = await Rice.findById(req.params.id);

  if (!rice) {
    res.status(404);
    throw new Error("Rice not found");
  }

  // Check ownership
  if (rice.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this rice");
  }

  // Use deleteOne because remove() is deprecated in Mongoose 7+
  await rice.deleteOne();

  res.json({ message: "Rice removed" });
});
