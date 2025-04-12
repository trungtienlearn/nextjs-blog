// app/posts/[slug]/page.js
import Link from 'next/link';
import Image from 'next/image'; // Import Image từ Next.js
import { getPosts, getPostBySlug } from '@/lib/data'; // Import cả 2 hàm
import { notFound } from 'next/navigation'; // Import notFound

// Hàm này báo cho Next.js biết cần tạo trang tĩnh cho những slug nào
export async function generateStaticParams() {
  const posts = await getPosts(); // Lấy tất cả posts (chỉ cần slug)
  console.log('Generating static params for posts...');
  return posts.map((post) => ({
    slug: post.slug, // Trả về mảng các object chứa slug
  }));
}

// Component Page giờ là async và nhận params
export default async function PostDetailPage({ params }) {
  const slug = params.slug;
  const post = await getPostBySlug(slug); // Lấy dữ liệu bài viết cụ thể

  // Nếu không tìm thấy bài viết, hiển thị trang 404
  if (!post) {
    notFound();
  }

  return (
    <article> {/* Bọc nội dung bằng article cho ngữ nghĩa tốt hơn */}
      {/* Ảnh đại diện bài viết */}
      {post.imageUrl && ( // Chỉ hiển thị nếu có imageUrl
        <div className="mb-8 relative h-60 md:h-96"> {/* Container cho ảnh, đặt chiều cao cố định hoặc tỷ lệ */}
          <Image
            src={post.imageUrl} // Đường dẫn từ thư mục public
            alt={post.title}    // Văn bản thay thế quan trọng
            fill // Cho phép ảnh fill đầy container cha
            style={{ objectFit: 'cover' }} // Giữ tỷ lệ và cắt ảnh nếu cần
            priority // Đặt priority=true nếu ảnh này quan trọng (Above The Fold)
            // sizes="(max-width: 768px) 100vw, 700px" // Tùy chọn: giúp trình duyệt chọn ảnh tối ưu hơn
          />
           {/* Nếu không dùng fill, bạn cần cung cấp width và height cố định:
           <Image
            src={post.imageUrl}
            alt={post.title}
            width={700} // !!! THAY BẰNG CHIỀU RỘNG THỰC CỦA ẢNH GỐC
            height={400} // !!! THAY BẰNG CHIỀU CAO THỰC CỦA ẢNH GỐC
            priority
            className="w-full h-auto" // Để ảnh responsive theo chiều rộng container
           />
           */}
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

      <div className="prose lg:prose-xl max-w-none mb-8">
         <p>{post.content}</p>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </article>
  );
}

// (Optional) Metadata động cho SEO
export async function generateMetadata({ params }) {
    const post = await getPostBySlug(params.slug);
    if (!post) {
        return { title: 'Post Not Found' };
    }
    return {
        title: post.title,
        description: post.excerpt,
    };
}