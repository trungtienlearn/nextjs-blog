// lib/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this user.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email for this user.'],
    unique: true, // Đảm bảo email là duy nhất
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Validate định dạng email cơ bản
  },
  password: {
    // Mật khẩu sẽ được hash trước khi lưu ở bước sau (Authentication)
    type: String,
    required: [true, 'Please provide a password.'],
    select: false, // Mặc định không trả về field password khi query
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Chỉ cho phép 2 giá trị này
    default: 'user', // Giá trị mặc định là 'user'
  },
  // Có thể thêm các trường khác như avatar, provider (nếu dùng OAuth)...
}, { timestamps: true }); // Tự động thêm createdAt và updatedAt

// Tránh việc biên dịch lại model nếu nó đã tồn tại (quan trọng cho Next.js dev mode)
export default mongoose.models.User || mongoose.model('User', UserSchema);