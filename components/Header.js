// components/Header.js
"use client"; // Bắt buộc vì dùng hook useState và usePathname

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation"; // Hook để lấy đường dẫn hiện tại
import AuthStatus from "@/components/AuthStatus"; // Import component trạng thái đăng nhập

// Định nghĩa các link điều hướng
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Posts", href: "/posts" },
  // Thêm các link khác nếu cần, ví dụ:
  // { label: 'About', href: '/about' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Lấy path hiện tại

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      {" "}
      {/* Sticky header */}
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {" "}
          {/* Container chính của navbar */}
          {/* Phần Bên trái: Logo/Tên Trang */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-blue-600"
            >
              trungtienlearn.com {/* Hoặc dùng logo <Image /> */}
            </Link>
          </div>
          {/* Phần Ở giữa: Các Link Điều hướng (Cho Desktop) */}
          <div className="hidden md:block">
            {" "}
            {/* Ẩn trên mobile, hiện từ md trở lên */}
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white" // Style khi active
                        : "text-gray-700 hover:bg-gray-200 hover:text-gray-900" // Style mặc định và hover
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
          {/* Phần Bên phải: AuthStatus và Nút Mobile Menu */}
          <div className="flex items-center">
            {/* AuthStatus (Ẩn trên mobile nếu cần không gian) */}
            <div className="hidden md:block">
              <AuthStatus />
            </div>

            {/* Nút Hamburger Menu (Chỉ hiện trên mobile) */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon: Hamburger khi đóng, X khi mở */}
                {isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* --- Mobile Menu --- */}
      {/* Sử dụng transition để có hiệu ứng đóng/mở mượt mà */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 border-t border-gray-200" : "max-h-0"
        }`} // max-h để tạo hiệu ứng xổ xuống
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)} // Đóng menu khi nhấp link
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        {/* Thêm AuthStatus vào mobile menu */}
        <div className="pt-4 pb-3 border-t border-gray-200 px-5">
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
