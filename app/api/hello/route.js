// app/api/hello/route.js
import { NextResponse } from 'next/server';

// Xử lý phương thức GET
export async function GET(request) {
  // request object chứa thông tin về request đến (headers, params...)
  // Ở đây chúng ta không dùng đến nó cho ví dụ đơn giản này

  // Trả về một phản hồi JSON
  return NextResponse.json({ message: 'Hello from the API!' });
}

// Bạn có thể export thêm các hàm POST, PUT, DELETE... ở đây nếu cần
// export async function POST(request) {
//   const body = await request.json(); // Đọc body của request POST
//   console.log(body);
//   return NextResponse.json({ received: body });
// }