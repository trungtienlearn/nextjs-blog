// components/AuthStatus.js
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AuthStatus() {
  const { data: session, status } = useSession(); // Hook để lấy session phía client

  if (status === 'loading') {
    return <span className="text-sm">Loading...</span>;
  }

  if (session) {
    // Đã đăng nhập
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm hidden sm:inline">Hi, {session.user?.name || 'User'}!</span>
         {session.user?.role === 'admin' && (
            <Link href="/admin" className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded">
               Admin
            </Link>
         )}
        <button
          onClick={() => signOut({ callbackUrl: '/' })} // Đăng xuất và về trang chủ
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
        >
          Logout
        </button>
      </div>
    );
  }

  // Chưa đăng nhập
  return (
    <div className="flex items-center space-x-3">
      <Link href="/login" className="text-sm hover:text-blue-300">Login</Link>
      <Link href="/register" className="text-sm bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">Register</Link>
    </div>
  );
}