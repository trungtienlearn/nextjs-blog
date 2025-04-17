// app/api/users/route.js
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import authOptions

export async function GET(request) {
  const session = await getServerSession(authOptions); // Lấy session phía server

  // *** BẮT BUỘC: Kiểm tra quyền admin ***
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 }); // 403 Forbidden
  }

  try {
    await dbConnect();
    // Lấy tất cả user, không lấy password, sắp xếp theo ngày tạo
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}