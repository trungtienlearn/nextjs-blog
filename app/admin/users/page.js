// app/admin/users/page.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import DeleteUserButton from "@/components/admin/DeleteUserButton"; // Import component nút xóa

async function getUsersData() {
  await dbConnect();
  const users = await User.find({})
    .select("-password") // Không lấy password
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(users)); // Serialize data
}

export default async function ManageUsersPage() {
  const session = await getServerSession(authOptions);

  // Kiểm tra quyền Admin ngay tại Page Component (Middleware chỉ kiểm tra login)
  if (session?.user?.role !== "admin") {
    return (
      <div className="text-red-600 p-4 border border-red-400 rounded bg-red-100">
        Access Denied. You do not have permission to view this page.
      </div>
    );
  }

  // Nếu là admin, fetch dữ liệu users
  const users = await getUsersData();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Manage Users</h1>

      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Joined At
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 whitespace-no-wrap">
                    {user.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 whitespace-no-wrap">
                    {user.email}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-900 whitespace-no-wrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <DeleteUserButton
                      userId={user._id}
                      isCurrentUser={session.user.id === user._id}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
