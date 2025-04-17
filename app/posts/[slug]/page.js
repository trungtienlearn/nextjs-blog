// app/posts/[slug]/page.js
import Link from 'next/link';
import Image from 'next/image';
// Đảm bảo import đúng hàm từ lib/data
import { getAllPublishedPostSlugs, getPublishedPostBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
// *** KHÔNG IMPORT useParams ở đây ***

// generateStaticParams giữ nguyên (Đảm bảo getAllPublishedPostSlugs hoạt động đúng)
export async function generateStaticParams() {
    const posts = await getAllPublishedPostSlugs();
    if (!posts) return [];
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

// generateMetadata ĐÃ SỬA LỖI "await params"
export async function generateMetadata({ params }) {
    try {
        // *** SỬA Ở ĐÂY: Await params trước khi dùng ***
        const resolvedParams = await params;
        // console.log('Resolved params in generateMetadata:', resolvedParams); // Bỏ log này nếu không cần thiết

        // Dùng resolvedParams.slug
        const post = await getPublishedPostBySlug(resolvedParams.slug);

        if (!post) {
            return { title: 'Post Not Found' };
        }
        return {
            title: post.title,
            description: post.excerpt || '...', // Giữ fallback
        };
    } catch (error) {
        console.error("Error in generateMetadata:", error);
        // Trả về metadata lỗi nếu có vấn đề
        return {
            title: "Error",
            description: "Could not load metadata for this post.",
        };
    }
}

// Component Page nhận prop { params }
export default async function PostDetailPage({ params }) {
  try { // Thêm try...catch bao quanh logic chính của page
      // *** SỬA Ở ĐÂY: Await params theo yêu cầu của lỗi ***
      const resolvedParams = await params;
      const slug = resolvedParams.slug; // Lấy slug từ params đã await

      console.log(`Workspaceing post with resolved slug: ${slug}`); // Log để kiểm tra

      // Gọi hàm lấy dữ liệu bằng slug đã được giải quyết
      const post = await getPublishedPostBySlug(slug);

      // Xử lý notFound giữ nguyên
      if (!post) {
          notFound();
      }

      // Trả về JSX để render (giữ nguyên phần return)
      return (
          <article className="container mx-auto px-4 py-8 max-w-3xl">
              {/* Ảnh đại diện bài viết */}
              {post.imageUrl && (
                  <div className="mb-8 relative aspect-video">
                      <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          priority
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
                      />
                  </div>
              )}

              {/* Tiêu đề bài viết */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{post.title}</h1>

              {/* Meta (Ngày đăng) */}
              <div className="text-sm text-gray-500 mb-6">
                  Published on {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown date'}
              </div>

              {/* Hiển thị Content HTML */}
              <div
                  className="prose lg:prose-xl max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Link Back */}
              <div className="mt-12 pt-8 border-t">
                  <Link href="/" className="text-blue-600 hover:underline">
                      &larr; Back to Home
                  </Link>
              </div>
          </article>
      );

  } catch (error) {
      // Xử lý lỗi nếu await params hoặc getPublishedPostBySlug thất bại trong page component
      console.error("Error in PostDetailPage:", error);
      // Có thể hiển thị một trang lỗi tùy chỉnh hoặc gọi notFound() tùy trường hợp
      notFound(); // Hoặc return component báo lỗi khác
  }
}