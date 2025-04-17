// lib/models/Post.js
import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    trim: true, // Loại bỏ khoảng trắng thừa
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug for this post.'],
    unique: true, // Đảm bảo slug là duy nhất
    trim: true,
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot be more than 300 characters'],
  },
  content: {
    // Sẽ lưu HTML hoặc JSON từ Rich Text Editor
    type: String,
    required: [true, 'Please provide content for this post.'],
  },
  imageUrl: {
    // Lưu URL của ảnh đại diện (từ Cloudinary/Vercel Blob sau này)
    type: String,
  },
  // author: { // Có thể thêm sau khi có User model và Authentication
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
  status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft',
  },
  // Có thể thêm tags, categories...
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

export default mongoose.models.Post || mongoose.model('Post', PostSchema);