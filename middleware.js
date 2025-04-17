// middleware.js
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log('Middleware token:', req.nextauth.token); // Log token để debug

    // Ví dụ: Kiểm tra thêm role 'admin'
    // if (req.nextUrl.pathname.startsWith('/admin') && req.nextauth.token?.role !== 'admin') {
    //   console.log('Access denied: User is not admin');
    //   // Redirect về trang chủ hoặc trang báo lỗi không có quyền
    //   return NextResponse.rewrite(new URL('/denied', req.url));
    // }

    // Nếu không có kiểm tra gì thêm, cứ để request đi tiếp
    return NextResponse.next();
  },
  {
    callbacks: {
      // Callback này quyết định việc truy cập có được phép hay không
      authorized: ({ req, token }) => {
        // console.log('Authorized callback token:', token);
        // !!token trả về true nếu token tồn tại (đã đăng nhập), false nếu không
        return !!token;
      }
    },
    pages: {
        signIn: '/login', // Vẫn trỏ về trang login nếu chưa đăng nhập
    }
  }
);

// Config matcher để middleware chỉ chạy trên các route admin
export const config = {
  matcher: [
    '/admin/:path*', // Áp dụng cho /admin và tất cả các trang con của nó
  ],
};