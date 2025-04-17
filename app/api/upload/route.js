// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
// TODO: Import getServerSession và authOptions để bảo vệ API route sau

// Cấu hình Cloudinary SDK bằng biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Sử dụng https
});

// Helper function để chuyển đổi ReadableStream thành Buffer
async function streamToBuffer(readableStream) {
  const chunks = [];
  for await (const chunk of readableStream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

// Helper function để upload stream lên Cloudinary
const uploadStreamToCloudinary = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Stream Error:", error);
                    return reject(error);
                }
                resolve(result);
            }
        );

        // Tạo một readable stream từ buffer và pipe nó vào upload stream của Cloudinary
        const readable = new Readable();
        readable._read = () => {}; // Required
        readable.push(buffer);
        readable.push(null); // Signal end of stream
        readable.pipe(uploadStream);
    });
};


export async function POST(request) {
  // TODO: Bảo vệ route này, chỉ cho admin upload
  // const session = await getServerSession(authOptions);
  // if (!session || session.user.role !== 'admin') {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const formData = await request.formData();
    const file = formData.get('file'); // Giả sử tên input file là 'file'

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded or file is invalid.' }, { status: 400 });
    }

    console.log('Received file:', file.name, file.type, file.size);

     // Kiểm tra loại file (chỉ cho phép ảnh) - nên làm chặt chẽ hơn
     if (!file.type.startsWith('image/')) {
         return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
     }

    // Đọc file thành buffer
    const fileBuffer = await streamToBuffer(file.stream());

    // Upload buffer lên Cloudinary
    const result = await uploadStreamToCloudinary(fileBuffer, {
         folder: 'my-nextjs-blog', // Tên thư mục trên Cloudinary (tùy chọn)
         resource_type: 'auto', // Tự động nhận diện loại file
    });


    console.log('Cloudinary Upload Result:', result);

    // Trả về thông tin ảnh đã upload thành công
    return NextResponse.json({
        message: 'File uploaded successfully',
        url: result.secure_url, // Luôn dùng secure_url (https)
        public_id: result.public_id,
        width: result.width,
        height: result.height,
    }, { status: 201 });

  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
  }
}