// components/AuthProvider.js
'use client'; // Provider này cũng cần là client component
import { SessionProvider } from 'next-auth/react';

// Mặc dù không cần props, nhưng dùng children pattern vẫn tốt
export default function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}