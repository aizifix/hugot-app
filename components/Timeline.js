"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import HugotCreate from '@/components/HugotCreate';
import HugotCard from '@/components/HugotCard';

export default function Timeline() {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const response = await axios.post('http://localhost/hugot-api/user.php', {
                operation: 'get_timeline_posts',
            }, { withCredentials: true }); // Ensure cookies are sent

            console.log('API Response:', response.data);

            if (Array.isArray(response.data)) {
                setPosts(response.data);
            } else {
                setPosts([]); // Handle case where the response is not an array
            }
        } catch (err) {
            console.error('Error fetching posts:', err);

            if (err.response && err.response.status === 401) {
                console.error('Unauthorized access - Please check your session.');
            }

            setPosts([]); // Handle any errors gracefully
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostSuccess = () => {
        fetchPosts(); // Re-fetch posts after a new hugot is created
    };

    const handleLikeChange = () => {
        fetchPosts(); // Re-fetch posts after a like change
    };

    return (
        <>
            <div className="fixed left-[50%] translate-x-[-49.5%] z-[1000]">
                <HugotCreate onPostSuccess={handlePostSuccess} />
            </div>

            <div className="w-[100%] ml-[300px] mr-[10px] mt-[165px]">
                <div>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <HugotCard 
                                key={post.post_id} 
                                name={`@${post.username}`} 
                                theme={post.theme_type} 
                                content={post.post_content}
                                initialHeartCount={post.heart_count} 
                                postId={post.post_id}
                                userId={JSON.parse(sessionStorage.getItem('user')).user_id} // Logged-in user's ID
                                postOwnerId={post.user_id} // Post owner's ID
                                onLikeChange={handleLikeChange} // Pass the function to update state
                            />
                        ))
                    ) : (
                        <p>No posts yet.</p>
                    )}
                </div>
            </div>
        </>
    );
}
