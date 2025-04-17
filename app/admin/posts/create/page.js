// app/admin/posts/create/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic'; // Import dynamic để lazy load editor

// Lazy load RichTextEditor vì nó là Client Component lớn
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

export default function CreatePostPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '<p>Xóa nội dung này và viết bài của bạn.</p>', // Nội dung ban đầu cho editor
    imageUrl: '',
    status: 'draft',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
      }));
    }
  };

   // Hàm callback nhận nội dung từ RichTextEditor
  const handleContentChange = (newContent) => {
    setFormData((prev) => ({ ...prev, content: newContent }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Kiểm tra content có trống không (Tiptap có thể trả về '<p></p>')
    if (!formData.content || formData.content === '<p></p>') {
        setError('Content is required.');
        setIsLoading(false);
        return;
    }

    try {
      // Gửi formData (bao gồm content dạng HTML) lên API
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setIsLoading(false);

      if (res.ok) {
        // ... xử lý thành công như cũ ...
         router.push('/admin/posts');
         router.refresh();
      } else {
        // ... xử lý lỗi như cũ ...
         const errorData = await res.json();
         setError(errorData.error || 'Failed to create post');
      }
    } catch (err) {
      // ... xử lý lỗi như cũ ...
       setIsLoading(false);
       setError('An unexpected error occurred.');
    }
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Create New Post</h1>
            <Link href="/admin/posts" className="text-blue-600 hover:underline">
                &larr; Back to Posts
            </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
            {/* ---- ĐÃ SỬA LỖI HIỂN THỊ ERROR ---- */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {/* ------------------------------------ */}


            {/* Title Input */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title *</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className="input-field" disabled={isLoading} />
            </div>

            {/* Slug Input */}
             <div className="mb-4">
              <label htmlFor="slug" className="block text-gray-700 text-sm font-bold mb-2">Slug *</label>
              <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleInputChange} required className="input-field" disabled={isLoading} />
            </div>

             {/* Excerpt Input */}
             <div className="mb-4">
              <label htmlFor="excerpt" className="block text-gray-700 text-sm font-bold mb-2">Excerpt</label>
              <textarea name="excerpt" id="excerpt" value={formData.excerpt} onChange={handleInputChange} rows="3" className="input-field" disabled={isLoading}></textarea>
            </div>

             {/* Image URL Input (Tạm thời) */}
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
              <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="input-field" placeholder="/images/sample-post.jpg" disabled={isLoading} />
            </div>

             {/* Content Input - RichTextEditor */}
             <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content *</label>
              <RichTextEditor
                content={formData.content}
                onChange={handleContentChange}
              />
            </div>

             {/* Status Select */}
             <div className="mb-6">
                <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleInputChange} className="input-field" disabled={isLoading}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
             </div>

            {/* Submit Button */}
            <div className="text-right">
               <button type="submit" className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Post'}
              </button>
            </div>

        </form>
        {/* Helper CSS */}
        <style jsx>{`
            .input-field {
                 @apply shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline;
            }
            .input-field:disabled {
                 @apply bg-gray-100 cursor-not-allowed;
            }
        `}</style>
    </div>
);
}