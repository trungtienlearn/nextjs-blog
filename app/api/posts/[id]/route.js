// app/api/posts/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import Post from '@/lib/models/Post';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
// TODO: Import getServerSession và authOptions để bảo vệ API route sau

// --- GET SINGLE POST ---
export async function GET(request, { params }) {
    const { id } = params;

    // TODO: Bảo vệ route
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    try {
        await dbConnect();
        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        return NextResponse.json({ post }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch post:', error);
        return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
    }
}

// --- UPDATE POST ---
export async function PUT(request, { params }) {
     const { id } = params;
     // TODO: Bảo vệ route

    if (!mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
     }

    try {
        const body = await request.json();
         // Validate dữ liệu body nếu cần
        const { title, slug, excerpt, content, imageUrl, status } = body;

        await dbConnect();

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { title, slug, excerpt, content, imageUrl, status },
            { new: true, runValidators: true } // Trả về doc mới, chạy validation
        );

        if (!updatedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Post updated successfully', post: updatedPost }, { status: 200 });

    } catch (error) {
         console.error('Failed to update post:', error);
          if (error.code === 11000) {
             return NextResponse.json({ error: 'Slug already exists.' }, { status: 409 });
         }
         return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
    }
}

// --- DELETE POST ---
export async function DELETE(request, { params }) {
    const { id } = params;
    // TODO: Bảo vệ route

     if (!mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
     }

    try {
        await dbConnect();
        const deletedPost = await Post.findByIdAndDelete(id);

        if (!deletedPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Trả về 204 No Content là chuẩn cho DELETE thành công không cần body
        // Hoặc trả về JSON nếu muốn: return NextResponse.json({ message: 'Post deleted successfully' });
        return new Response(null, { status: 204 });


    } catch (error) {
         console.error('Failed to delete post:', error);
         return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
}