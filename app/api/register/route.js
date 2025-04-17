// app/api/register/route.js
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input cơ bản
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
         return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    await dbConnect();

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 }); // 409 Conflict
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Tạo user mới
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      // role sẽ tự động là 'user' theo default trong Schema
    });

    console.log('New user created:', newUser.email);

    // Không trả về thông tin nhạy cảm
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 } // 201 Created
    );

  } catch (error) {
    console.error('Registration error:', error);
    // Check for specific Mongoose validation errors if needed
    if (error.name === 'ValidationError') {
         return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}