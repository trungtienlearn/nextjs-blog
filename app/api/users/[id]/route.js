// app/api/users/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request, { params }) {
    const { id } = params;
    const session = await getServerSession(authOptions);

    // *** BẮT BUỘC: Kiểm tra quyền admin ***
    if (!session || session.user?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    // *** BẮT BUỘC: Không cho admin tự xóa chính mình ***
    if (session.user?.id === id) {
         return NextResponse.json({ error: 'Admin cannot delete their own account.' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
     }

    try {
        await dbConnect();
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log(`Admin ${session.user.email} deleted user ${id}`);
        return new Response(null, { status: 204 }); // 204 No Content - Xóa thành công

    } catch (error) {
         console.error('Failed to delete user:', error);
         return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}

// TODO: Thêm hàm PUT để sửa role nếu cần