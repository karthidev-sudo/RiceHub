import mongoose from 'mongoose';

const riceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true }, // URL from Cloudinary
  
  // Structured data for filtering later
  config: {
    windowManager: { type: String, required: true }, // e.g., Hyprland
    distro: { type: String, required: true },        // e.g., Arch
    shell: { type: String, default: 'zsh' },
    dotfilesUrl: { type: String },         // GitHub Link
    codeSnippet: { type: String },
  },

  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Index for search performance
riceSchema.index({ title: 'text', 'config.windowManager': 'text' });

export default mongoose.model('Rice', riceSchema);