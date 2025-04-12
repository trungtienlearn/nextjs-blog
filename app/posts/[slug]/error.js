// app/posts/[slug]/error.js
'use client'; // BẮT BUỘC đối với Error Boundary

import { useEffect } from 'react';
import Link from 'next/link';

export default function PostError({ error, reset }) {
  useEffect(() => {
    // Ghi log lỗi ra console phía client (hoặc gửi lên dịch vụ log lỗi)
    console.error('Post Detail Error Boundary caught an error:', error);
  }, [error]);

  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-semibold text-red-600 mb-4">Oops! Something went wrong.</h2>
      <p className="mb-4">An error occurred while trying to load this post.</p>
      {/* Nút reset sẽ cố gắng render lại component PostDetailPage */}
      <button
        onClick={() => reset()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
      >
        Try Again
      </button>
      <Link href="/" className="text-blue-600 hover:underline">
        Go back home
      </Link>
    </div>
  );
}