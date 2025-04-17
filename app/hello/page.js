'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'; // Import Link
export default function HelloPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch('/api/posts');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);
    useEffect(() => {
        console.log('Posts:', posts);
    }, [posts]);
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <h1 className="text-2xl font-bold">Hello, Next.js!</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {posts.length > 0 && (
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post._id} className="border p-4 rounded shadow hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                        <p className="text-gray-700">{post.excerpt}</p>
                        <Link href={`/posts/${post.slug}`} className="text-blue-600 hover:underline mt-2 inline-block">
                            Read more &rarr;
                        </Link>
                    </div>
                ))}
            </div>
        )}
        
        </div>
    );
}