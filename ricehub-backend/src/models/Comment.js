import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  
  // Who wrote it?
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Where was it written?
  rice: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Rice', 
    required: true 
  },
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);