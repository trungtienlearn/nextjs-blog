// app/api/posts/route.js
import dbConnect from '@/lib/dbConnect';
import Post from '@/lib/models/Post';
import { NextResponse } from 'next/server';
// TODO: Import getServerSession và authOptions để bảo vệ API route sau
// import { getServerSession } from "next-auth/next"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request) {
  // TODO: Bảo vệ route này (ví dụ: chỉ admin)
  // const session = await getServerSession(authOptions)
  // if (!session || session.user.role !== 'admin') {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // }

  try {
    await dbConnect();
    const posts = await Post.find({}).sort({ createdAt: -1 }); // Lấy tất cả posts, sắp xếp mới nhất trước
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// --- Thêm hàm POST vào đây ---
export async function POST(request) {
    // TODO: Bảo vệ route này (ví dụ: chỉ admin)
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'admin') {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    try {
        const body = await request.json();
        const { title, slug, excerpt, content, imageUrl, status } = body;

        // Validate cơ bản
        if (!title || !slug || !content) {
            return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
        }

        await dbConnect();

        // Kiểm tra slug tồn tại? (Có thể bỏ qua nếu có xử lý lỗi unique của DB)
        // const existingPost = await Post.findOne({ slug });
        // if (existingPost) {
        //     return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        // }

        const newPost = await Post.create({
            title,
            slug,
            excerpt,
            content,
            imageUrl,
            status: status || 'draft',
            // author: session.user.id // Gán author khi đã bảo vệ route
        });

        return NextResponse.json({ message: 'Post created successfully', post: newPost }, { status: 201 });

    } catch (error) {
        console.error('Failed to create post:', error);
         if (error.code === 11000) { // Lỗi duplicate key (ví dụ: slug)
             return NextResponse.json({ error: 'Slug already exists.' }, { status: 409 });
         }
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}