// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect'; // Hàm kết nối DB đã tạo
import User from '@/lib/models/User';    // Model User đã tạo
import bcrypt from 'bcryptjs';          // Import bcryptjs

export const authOptions = {
  session: {
    strategy: 'jwt', // Sử dụng JSON Web Tokens cho session
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        // Các trường sẽ hiển thị trên form đăng nhập (nếu dùng trang mặc định)
        // Chúng ta sẽ tạo form riêng nên phần này không quá quan trọng
        email: { label: 'Email', type: 'email', placeholder: 'jsmith@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Logic xác thực khi người dùng cố gắng đăng nhập
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        await dbConnect(); // Kết nối database

        // Tìm user bằng email, và LẤY CẢ trường password (do đặt select: false)
        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user) {
          console.log('No user found with email:', credentials.email);
          throw new Error('Invalid credentials'); // Không nên nói rõ là sai email hay password
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu đã hash trong DB
        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordMatch) {
          console.log('Password mismatch for user:', credentials.email);
          throw new Error('Invalid credentials');
        }

        console.log('Login successful for user:', user.email);
        // Xác thực thành công, trả về object user (không bao gồm password)
        // Dữ liệu trả về ở đây sẽ được dùng để tạo JWT/session
        return {
          id: user._id.toString(), // Chuyển ObjectId thành string
          name: user.name,
          email: user.email,
          role: user.role,
          // Thêm các trường khác nếu cần trong session
        };
      },
    }),
    // Có thể thêm các provider khác ở đây (Google, GitHub...)
  ],
  secret: process.env.NEXTAUTH_SECRET, // Secret key để ký JWT
  pages: {
    signIn: '/login', // Chỉ định trang đăng nhập tùy chỉnh
    // error: '/auth/error', // Trang hiển thị lỗi xác thực (tùy chọn)
    // signOut: '/auth/signout', // Trang xác nhận đăng xuất (tùy chọn)
  },
  callbacks: {
    // Tùy chỉnh dữ liệu trong JWT và session (nếu cần)
    async jwt({ token, user }) {
        // Khi đăng nhập thành công (có user object), thêm id và role vào token
        if (user) {
            token.id = user.id;
            token.role = user.role;
        }
        return token;
    },
    async session({ session, token }) {
        // Gán dữ liệu từ token (đã có id, role) vào session object
        if (token && session.user) {
            session.user.id = token.id;
            session.user.role = token.role;
        }
        return session;
    },
  }
  // Thêm các cấu hình khác nếu cần: debug, adapter...
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // Export handler cho cả GET và POST