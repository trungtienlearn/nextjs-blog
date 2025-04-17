// components/PostCard.js
import Link from 'next/link';
import Image from 'next/image';

// Hàm format ngày tháng đơn giản (có thể dùng thư viện như date-fns nếu cần phức tạp hơn)
const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        return new Date(dateString).toLocaleDateString('vi-VN', { // Format tiếng Việt
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return '';
    }
};

export default function PostCard({ post }) {
    // Kiểm tra nếu không có post thì không render gì cả
    if (!post) {
        return null;
    }

    // Lấy các thuộc tính từ post, cung cấp giá trị mặc định nếu cần
    const { title = 'Untitled Post', slug = '#', imageUrl, excerpt, createdAt, _id } = post;
    const formattedDate = formatDate(createdAt);

    return (
        // Thẻ Card chính
        <article key={_id} className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
            {/* Phần ảnh đại diện */}
            <Link href={`/posts/${slug}`} className="block flex-shrink-0">
                <div className="relative h-48 w-full"> {/* Đặt chiều cao cố định cho ảnh */}
                    <Image
                        className="object-cover" // Đảm bảo ảnh che phủ mà không bị méo
                        src={imageUrl || 'https://fakeimg.pl/600x400'} // Dùng ảnh thật hoặc ảnh placeholder
                        alt={title}
                        fill // Cho ảnh tự lấp đầy thẻ div cha
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Giúp trình duyệt chọn ảnh tối ưu
                    />
                </div>
            </Link>

            {/* Phần nội dung thẻ */}
            <div className="flex flex-1 flex-col justify-between p-6">
                <div className="flex-1">
                    {/* Tiêu đề */}
                    <Link href={`/posts/${slug}`} className="mt-2 block group">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {title}
                        </h3>
                        {/* Đoạn trích dẫn */}
                        {excerpt && (
                            <p className="mt-3 text-base text-gray-500 line-clamp-3"> {/* line-clamp giới hạn 3 dòng */}
                                {excerpt}
                            </p>
                        )}
                    </Link>
                </div>
                {/* Ngày đăng */}
                <div className="mt-4 flex items-center">
                    <div className="text-sm text-gray-500">
                        <time dateTime={createdAt?.toString()}>
                            {formattedDate}
                        </time>
                    </div>
                </div>
            </div>
        </article>
    );
}