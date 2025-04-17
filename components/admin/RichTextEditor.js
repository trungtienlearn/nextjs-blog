// components/admin/RichTextEditor.js
'use client';

// React Hooks
import React, { useRef, useState, useEffect } from 'react';

// Tiptap Core and React specific imports
import { useEditor, EditorContent } from '@tiptap/react';

// Tiptap Extensions (Imported explicitly)
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Image from '@tiptap/extension-image'; // Image extension

// --- Component Toolbar (Thanh công cụ) ---
// Nhận thêm props: isFullscreen, onToggleFullscreen
const EditorToolbar = ({ editor, onInsertImage, isFullscreen, onToggleFullscreen }) => {
  if (!editor) return null;

  return (
    // Thêm class 'tiptap-toolbar' để CSS toàn cục có thể nhắm mục tiêu
    // flex-shrink-0 ngăn toolbar bị co lại khi nội dung dài trong flex-col
    <div className="tiptap-toolbar border-b border-gray-300 p-2 flex flex-wrap gap-1 bg-gray-50 flex-shrink-0">
      {/* Nút định dạng cơ bản */}
      <button type="button" title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}><b>B</b></button>
      <button type="button" title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}><i>I</i></button>
      <button type="button" title="Paragraph" onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>P</button>

      {/* Nút Headings */}
      <button type="button" title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>H1</button>
      <button type="button" title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
      <button type="button" title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>

      {/* Nút Lists */}
      <button type="button" title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>UL</button>
      <button type="button" title="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>OL</button>

      {/* Nút Chèn Ảnh */}
      <button type="button" onClick={onInsertImage} title="Insert Image">🖼️ Img</button>

      {/* Nút Fullscreen / Exit Fullscreen */}
      {/* ml-auto đẩy nút này sang cạnh phải của toolbar */}
      <button type="button" onClick={onToggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'} className="ml-auto">
         {/* Thay đổi icon/text dựa vào trạng thái fullscreen */}
        {isFullscreen ? '↙️ Exit' : '↗️ Full'}
      </button>

      {/* Không còn <style jsx> cho button ở đây, giả định style nằm trong globals.css */}
    </div>
  );
};


// --- Component Editor Chính ---
const RichTextEditor = ({ content, onChange }) => {
  // State cho chế độ fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);
  // State cho trạng thái upload ảnh
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  // Ref cho input file ẩn
  const fileInputRef = useRef(null);

  // Khởi tạo Tiptap Editor instance
  const editor = useEditor({
    extensions: [
      Document, Paragraph, Text,
      Heading.configure({ levels: [1, 2, 3] }),
      Bold, Italic, ListItem, BulletList, OrderedList,
      Image.configure({
          inline: false, // Ảnh là block element
          // Có thể thêm các cấu hình khác cho Image nếu cần
      }),
    ],
    // Nội dung ban đầu được truyền từ component cha
    content: content || '',
    // Thuộc tính áp dụng cho vùng soạn thảo .ProseMirror
    editorProps: {
      attributes: {
        // Class cơ bản, không dùng prose ở đây để tránh xung đột
        // Thêm overflow-y-auto để nội dung bên trong tự cuộn nếu dài
        class: "focus:outline-none p-4 flex-grow",
      },
    },
    // Callback khi nội dung thay đổi
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Gọi hàm onChange của cha với nội dung HTML mới
    },
    // Tránh lỗi hydration mismatch
    immediatelyRender: false,
  });

  // Hàm bật/tắt chế độ fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Có thể cần gọi editor.commands.focus() sau khi thay đổi kích thước
    // để đảm bảo editor vẫn focus
     setTimeout(() => editor?.commands.focus(), 100);
  };

  // Xử lý khóa/mở cuộn trang khi vào/thoát fullscreen
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || ''; // Trả về giá trị cũ hoặc mặc định
    }
    // Cleanup function khi component unmount hoặc isFullscreen thay đổi
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [isFullscreen]);


  // Hàm kích hoạt input file ẩn
  const triggerFileInput = () => {
    setUploadError('');
    fileInputRef.current?.click();
  };

  // Hàm xử lý khi người dùng chọn file ảnh
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    // Chỉ cho phép upload ảnh
    if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file.');
        // Reset input file
        if(fileInputRef.current) fileInputRef.current.value = '';
        return;
    }

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Gọi API upload
      const res = await fetch('/api/upload', { method: 'POST', body: formData });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();

      // Chèn ảnh vào editor nếu thành công
      if (data.url) {
        editor.chain().focus().setImage({
            src: data.url,
            alt: file.name, // Lấy tên file làm alt text mặc định
            // title: file.name // Có thể thêm title
         }).run();
         console.log('Image inserted:', data.url);
      }

    } catch (err) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
      // Reset input file để có thể chọn lại cùng file nếu cần
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Xác định class cho container dựa vào trạng thái fullscreen
  const containerClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-white border border-gray-300 shadow-lg flex flex-col" // Style fullscreen
    : "relative border border-gray-300 rounded-md flex flex-col"; // Style bình thường

  return (
    // Container chính với class động
    <div className={containerClasses}>

      {/* Thanh công cụ Toolbar */}
      <EditorToolbar
        editor={editor}
        onInsertImage={triggerFileInput}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Input file ẩn để chọn ảnh */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/*" // Chỉ chấp nhận file ảnh
      />

      {/* Hiển thị trạng thái Uploading hoặc Lỗi Upload */}
       <div className="p-1 text-xs flex-shrink-0 bg-gray-50 border-b border-gray-300"> {/* Đặt ở vị trí hợp lý hơn */}
         {isUploading && <p className="text-blue-600 px-2">⏳ Uploading image...</p>}
         {uploadError && <p className="text-red-600 px-2">⚠️ Error: {uploadError}</p>}
       </div>

      {/* Vùng chứa nội dung soạn thảo */}
      {/* flex-grow làm cho vùng này giãn ra, overflow-y-auto để cuộn nội dung bên trong */}
      <div className="editor-content-wrapper flex-grow overflow-y-auto">
          <EditorContent editor={editor} className="h-full" />
           {/* CSS để đảm bảo vùng .ProseMirror bên trong co giãn và có chiều cao tối thiểu */}
           <style jsx global>{`
                .editor-content-wrapper .ProseMirror {
                    height: 100%;
                    min-height: 200px; /* Chiều cao tối thiểu ở chế độ thường */
                    padding: 1rem; /* Thêm padding trực tiếp cho vùng nhập liệu */
                    outline: none; /* Bỏ outline mặc định */
                }
                /* Có thể thêm style riêng cho chế độ fullscreen nếu cần */
                 body[style*="overflow: hidden"] .editor-content-wrapper .ProseMirror {
                     /* Style riêng cho editor khi fullscreen nếu muốn */
                 }
           `}</style>
      </div>
    </div>
  );
};

export default RichTextEditor;