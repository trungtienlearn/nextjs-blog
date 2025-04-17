// app/admin/layout.js
import Link from 'next/link';
import { getServerSession } from 'next-auth/next'; // Nếu cần xác thực người dùng
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Có thể import thêm component Sidebar nếu muốn tách ra
// import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({ children }) {
  // TODO: Kiểm tra quyền admin ở đây nếu cần thiết và chặt chẽ hơn
  const session = await getServerSession(authOptions); // Lấy session phía server
  if (session?.user?.role !== 'admin') {
    // Redirect hoặc hiển thị trang báo lỗi không có quyền
    return <p>Access Denied</p>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar đơn giản */}
      <aside className="w-64 bg-gray-800 text-white p-4"> {/* Fixed sidebar */}
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/admin" className="hover:text-blue-300">Dashboard</Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/posts" className="hover:text-blue-300">Manage Posts</Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/users" className="hover:text-blue-300">Manage Users</Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/media" className="hover:text-blue-300">Media Library</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      {/* Thêm ml-64 (margin-left = width của sidebar) */}
      <main className="flex-grow p-6 bg-gray-100 text-gray-900">
         {/* Header của Admin (nếu cần) */}
        {/* <header className="bg-white shadow p-4 mb-6">Admin Header</header> */}
        {children} {/* Nội dung của các trang admin sẽ vào đây */}
      </main>
    </div>
  );
}