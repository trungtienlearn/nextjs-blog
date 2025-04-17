// components/admin/DeleteUserButton.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteUserButton({ userId, isCurrentUser }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    // Hỏi xác nhận trước khi xóa
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      setIsLoading(false);

      if (res.ok) { // Status 204 cũng là ok
        console.log(`User ${userId} deleted successfully`);
        alert('User deleted successfully!'); // Thông báo đơn giản
        router.refresh(); // Tải lại dữ liệu trang hiện tại (danh sách user)
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Failed to delete user' })); // Bắt cả lỗi khi parse json
        setError(errorData.error || 'Failed to delete user');
        console.error('Delete user failed:', errorData);
         alert(`Error: ${errorData.error || 'Failed to delete user'}`); // Hiện lỗi rõ hơn
      }
    } catch (err) {
      setIsLoading(false);
      setError('An unexpected error occurred.');
      console.error('Delete user exception:', err);
      alert('An unexpected error occurred.');
    }
  };

  // Không hiển thị nút xóa nếu là tài khoản của chính admin đang đăng nhập
  if (isCurrentUser) {
    return <span className="text-xs text-gray-500">Cannot delete self</span>;
  }

  return (
    <>
      <button
        onClick={handleDelete}
        className={`text-red-600 hover:text-red-900 text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
        title={`Delete user ${userId}`}
      >
        {isLoading ? 'Deleting...' : 'Delete'}
      </button>
      {/* Có thể hiển thị lỗi nhỏ gần nút nếu muốn thay vì alert */}
      {/* {error && <p className="text-xs text-red-500 mt-1">{error}</p>} */}
    </>
  );
}