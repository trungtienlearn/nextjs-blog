// app/admin/posts/page.js
import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";
// TODO: Import component nút Delete sau

async function getPostsData() {
  await dbConnect();
  // Chỉ lấy các trường cần thiết để hiển thị danh sách
  const posts = await Post.find({})
    .select("title slug status createdAt")
    .sort({ createdAt: -1 })
    .lean(); // .lean() trả về plain JS object, nhẹ hơn
  // Chuyển đổi _id và createdAt thành string để tránh lỗi serialization
  return JSON.parse(JSON.stringify(posts));
}

export default async function ManagePostsPage() {
  const posts = await getPostsData();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Posts</h1>
        <Link
          href="/admin/posts/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create New Post
        </Link>
      </div>

      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >
                  No posts found.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {post.title}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {post.slug}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                        post.status === "published"
                          ? "text-green-900"
                          : "text-yellow-900"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-0 ${
                          post.status === "published"
                            ? "bg-green-200"
                            : "bg-yellow-200"
                        } opacity-50 rounded-full`}
                      ></span>
                      <span className="relative">{post.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {/* TODO: Thêm Link Edit và Component Button Delete */}
                    <Link
                      href={`/admin/posts/edit/${post._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </Link>
                    {/* <DeletePostButton postId={post._id} /> */}
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
