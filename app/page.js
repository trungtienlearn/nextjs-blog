// app/page.js
import Link from 'next/link'; // Import Link
import { getPosts } from '@/lib/data'; // Import hàm getPosts (sử dụng alias @)

export default async function HomePage() {
  // Dữ liệu bài viết giả - ĐÃ THÊM SLUG
  const posts = await getPosts(); // Gọi hàm getPosts để lấy danh sách bài viết

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          // Bọc toàn bộ div bài viết bằng Link hoặc chỉ tiêu đề cũng được
          <div key={post.id} className="border p-4 rounded shadow hover:shadow-md transition-shadow">
              <Link href={`/posts/${post.slug}`} className="group"> {/* Sử dụng Link và tạo href động */}
                <h3 className="text-xl font-bold mb-1 group-hover:text-blue-600 transition-colors">{post.title}</h3>
              </Link>
            <p className="text-gray-700">{post.excerpt}</p>
             <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline mt-2 inline-block">
                Read more &rarr;
             </Link>
          </div>
        ))}
      </div>
    </div>
  )
}