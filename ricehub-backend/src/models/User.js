import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: 'https://github.com/shadcn.png' },
  bio: String,
  savedRices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rice' }],
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre('save', async function () {
  // If password is not modified, just return (no next needed)
  if (!this.isModified('password')) return;
  
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // No next() call needed in async functions
});
// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);