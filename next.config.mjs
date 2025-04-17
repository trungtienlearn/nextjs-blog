/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https', // Giao thức của URL ảnh
            hostname: 'fakeimg.pl', // *** Hostname cần cho phép ***
            port: '', // Bỏ trống nếu không có port cụ thể (thường là vậy)
            pathname: '/**', // Cho phép mọi đường dẫn dưới hostname này (dấu ** khớp nhiều cấp)
          },
          // ANH NÊN THÊM CẢ HOSTNAME CỦA CLOUDINARY VÀO ĐÂY LUÔN
           {
             protocol: 'https',
             // Hostname chuẩn của Cloudinary thường là res.cloudinary.com
             hostname: 'res.cloudinary.com',
             port: '',
             // Pathname có thể giới hạn theo cloud_name của anh để chặt chẽ hơn
             // Ví dụ: pathname: '/ten-cloud-cua-anh/**',
             // Hoặc cho phép tất cả: pathname: '/**', (ít an toàn hơn chút)
             pathname: '/YOUR_CLOUDINARY_CLOUD_NAME/**', // !!! THAY YOUR_CLOUDINARY_CLOUD_NAME bằng cloud name thật của anh
           },
          // Thêm các object khác vào đây nếu cần cho phép các hostname khác
        ],
      },
};

export default nextConfig;
