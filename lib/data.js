// lib/data.js

// Dữ liệu bài viết giả - ĐÃ THÊM CONTENT
const posts = [
  { id: 1, title: 'Getting Started with Next.js', slug: 'getting-started-with-nextjs', excerpt: 'Learn the basics...', content: 'This is the full content...', imageUrl: '/images/sample-post.jpg' }, // Thêm imageUrl
  { id: 2, title: 'Styling in Next.js', slug: 'styling-in-nextjs', excerpt: 'Explore Tailwind CSS...', content: 'Styling is crucial...', imageUrl: '/images/sample-post.jpg' }, // Thêm imageUrl
  { id: 3, title: 'Data Fetching Strategies', slug: 'data-fetching-strategies', excerpt: 'Understand Server Components...', content: 'Next.js offers versatile data fetching...', imageUrl: '/images/sample-post.jpg' }, // Thêm imageUrl
  { id: 4, title: 'Understanding App Router', slug: 'understanding-app-router', excerpt: 'Deep dive into...', content: 'The App Router introduced...', imageUrl: '/images/sample-post.jpg' }, // Thêm imageUrl
];

// Hàm giả lập việc lấy danh sách bài viết
export async function getPosts() {
  await new Promise(resolve => setTimeout(resolve, 50));
  console.log('Fetching all posts list...');
  return posts;
}

// Hàm giả lập việc lấy một bài viết theo slug
export async function getPostBySlug(slug) {
  await new Promise(resolve => setTimeout(resolve, 100)); // Giả lập độ trễ cao hơn chút
  console.log(`Workspaceing post by slug: ${slug}...`);
  const post = posts.find((post) => post.slug === slug);
  return post; // Sẽ trả về undefined nếu không tìm thấy
}