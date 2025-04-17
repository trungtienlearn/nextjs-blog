// lib/data.js
import dbConnect from "@/lib/dbConnect";
import Post from "@/lib/models/Post";

/**
 * Lấy TẤT CẢ SLUG của các bài viết CÔNG KHAI (status: 'published')
 * Dùng cho generateStaticParams để Next.js biết cần build những trang nào.
 */
export async function getAllPublishedPostSlugs() {
  try {
    await dbConnect();
    console.log("Fetching PUBLISHED slugs for generateStaticParams...");
    const posts = await Post.find({ status: "published" }) // *** CHỈ LẤY PUBLISHED ***
      .select("slug") // *** CHỈ LẤY SLUG ***
      .lean();
    return JSON.parse(JSON.stringify(posts)); // Trả về: [{ slug: '...' }, ...]
  } catch (error) {
    console.error(
      "Database Error - Failed to fetch published post slugs:",
      error
    );
    return []; // Trả về mảng rỗng nếu lỗi
  }
}

/**
 * Lấy danh sách các bài viết CÔNG KHAI (status: 'published') để hiển thị list (ví dụ: trang chủ)
 * Sắp xếp theo ngày tạo mới nhất.
 */
export async function getPublishedPostsForList() {
  try {
    await dbConnect();
    console.log("Fetching PUBLISHED posts for list display...");
    const posts = await Post.find({ status: "published" }) // *** CHỈ LẤY PUBLISHED ***
      .select("title slug excerpt createdAt imageUrl") // Lấy các trường cần cho list + ảnh (nếu cần)
      .sort({ createdAt: -1 }) // *** SẮP XẾP MỚI NHẤT ***
      .lean();
    return JSON.parse(JSON.stringify(posts));
  } catch (error) {
    console.error("Database Error - Failed to fetch published posts:", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
}

/**
 * Lấy chi tiết một bài viết CÔNG KHAI (status: 'published') theo slug.
 * Dùng cho trang chi tiết bài viết [slug]/page.js và generateMetadata.
 */
export async function getPublishedPostBySlug(slug) {
  if (!slug) return null; // Trả về null nếu không có slug

  try {
    await dbConnect();
    console.log(`Workspaceing PUBLISHED post by slug from DB: ${slug}...`);
    const post = await Post.findOne({ slug: slug, status: "published" }) // *** CHỈ LẤY PUBLISHED ***
      .select("title slug content createdAt imageUrl excerpt") // *** Lấy đủ các trường cần thiết (thêm createdAt, excerpt) ***
      .lean();

    if (!post) {
      console.log(`Published post with slug "${slug}" not found.`);
      return null; // Trả về null nếu không tìm thấy hoặc không phải published
    }
    return JSON.parse(JSON.stringify(post));
  } catch (error) {
    console.error(
      `Database Error - Failed to fetch published post by slug ${slug}:`,
      error
    );
    return null; // Trả về null nếu lỗi
  }
}

// --- Có thể giữ lại hàm getPosts cũ nếu cần cho trang Admin ---
// --- Hoặc tạo hàm mới ví dụ: getAllPostsForAdmin() ---
export async function getAllPostsForAdmin() {
  // Hàm này có thể lấy cả bài nháp cho trang quản lý
  try {
    await dbConnect();
    console.log("Fetching ALL posts for admin...");
    const postsData = await Post.find({}) // Lấy tất cả status
      .select("title slug status createdAt") // Lấy các trường cần cho bảng admin
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(postsData));
  } catch (error) {
    console.error(
      "Database Error - Failed to fetch all posts for admin:",
      error
    );
    return [];
  }
}
