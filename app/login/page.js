// app/login/page.js
'use client'; // Đánh dấu là Client Component

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // Hook để gọi đăng nhập
import { useRouter } from 'next/navigation'; // Hook để điều hướng
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset lỗi cũ
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false, // Tự xử lý điều hướng, không để NextAuth làm
        email,
        password,
      });

      setIsLoading(false);

      if (result?.error) {
        setError('Invalid email or password. Please try again.'); // Hiển thị lỗi chung chung
        console.error('Login failed:', result.error);
      } else if (result?.ok) {
        // Đăng nhập thành công
        console.log('Login successful, redirecting...');
        // Điều hướng đến trang dashboard hoặc trang chủ
        // TODO: Thay đổi '/admin' thành trang đích mong muốn sau này
        router.push('/'); // Tạm thời về trang chủ
        router.refresh(); // Refresh lại trang để cập nhật trạng thái session ở layout
      }
    } catch (err) {
      setIsLoading(false);
      setError('An unexpected error occurred. Please try again.');
      console.error('Login exception:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-150px)]"> {/* Căn giữa trang */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="your.email@example.com"
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="******************"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
         <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="font-medium text-blue-600 hover:underline">
                    Register here
                </Link>
            </p>
        </div>
      </form>
    </div>
  );
}