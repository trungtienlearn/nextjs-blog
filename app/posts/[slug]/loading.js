// app/posts/[slug]/loading.js
export default function LoadingPostDetail() {
    return (
      <div>
        <div className="animate-pulse"> {/* Hiệu ứng pulse đơn giản của Tailwind */}
          {/* Skeleton cho tiêu đề */}
          <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
          {/* Skeleton cho nội dung */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
        <div className="mt-8">
           <div className="h-5 bg-gray-300 rounded w-1/4"></div> {/* Skeleton cho link Back */}
        </div>
      </div>
    );
  }