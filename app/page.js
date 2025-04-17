// app/page.js
import { getPublishedPostsForList } from '@/lib/data'; // Import hàm lấy bài viết đã publish
import PostCard from '@/components/PostCard'; // Import component PostCard

export default async function HomePage() {
  // Gọi hàm mới để lấy các bài viết đã publish cho trang chủ
  const posts = await getPublishedPostsForList();

  return (
    <div className="container mx-auto px-4 py-8"> {/* Container chung */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">
        Recent Blog Posts
      </h1>

      {/* Kiểm tra nếu có bài viết */}
      {posts && posts.length > 0 ? (
        // Tạo layout lưới (Grid)
        // - 1 cột trên mobile (mặc định)
        // - 2 cột trên tablet (md:grid-cols-2)
        // - 3 cột trên desktop (lg:grid-cols-3)
        // - gap-6 hoặc gap-8 để tạo khoảng cách giữa các card
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Lặp qua mảng posts và render PostCard */}
          {posts.map((post) => (
            <PostCard key={post._id} post={post} /> // Truyền post object vào PostCard
          ))}
        </div>
      ) : (
        // Hiển thị khi không có bài viết
        <p className="text-center text-gray-500">
          There are no published posts yet. Check back soon!
        </p>
      )}

       {/* TODO: Thêm nút Phân trang (Pagination) ở đây nếu cần */}
       {/* <div className="mt-12 text-center"> ... Pagination Component ... </div> */}
    </div>
  );
}