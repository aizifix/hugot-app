"use client";

import ProfilePhoto from "../components/ProfilePhoto";
import HugotCreate from "../components/HugotCreate";
import HugotCard from "../components/HugotCard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileCard() {
    const [username, setUsername] = useState("");
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [posts, setPosts] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);
            setFollowers(user.followers_count);
            setFollowing(user.following_count);
            setUserId(user.user_id);
            fetchUserPosts(user.user_id);
        }
    }, []);

    const fetchUserPosts = async (userId) => {
        try {
            const response = await axios.post('http://localhost/hugot-api/user.php', {
                operation: 'get_user_posts',
                data: { user_id: userId }
            });
    
            if (response.data.posts) {
                setPosts(response.data.posts);
            } else {
                console.error('Failed to fetch user posts', response.data);
            }
        } catch (err) {
            console.error('Error fetching user posts:', err);
        }
    };
    
    const handlePostSuccess = () => {
        if (userId) {
            fetchUserPosts(userId);
        }

        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    const handleLikeChange = () => {
        if (userId) {
            fetchUserPosts(userId);
        }
    };

    return (
        <div className="w-[100%] ml-[300px] mr-[10px]">
            <ProfilePhoto />
            <div className="mt-[85px]">
                <div className="flex justify-between">
                    <p>{username ? `@${username}` : 'Guest'}</p>
                    <div className="flex gap-4">
                        <p><b>{followers}</b> followers</p> 
                        <p><b>{following}</b> following</p>
                        <p><b>{posts.length}</b> hugots</p>
                    </div>
                </div>
                <HugotCreate onPostSuccess={handlePostSuccess} />
            </div>
            <div className="mt-[10px]">
            {posts.length > 0 ? (
                 posts.map((post) => {
                console.log("Post Object:", post); 
                return (
                    <HugotCard 
                        key={post.post_id} 
                        name={username} 
                        theme={post.theme_type} 
                        content={post.hugot_post}
                        postId={post.post_id}
                        initialHeartCount={post.heart_count}
                        userId={userId} 
                        postOwnerId={post.user_id}  
                        onLikeChange={handleLikeChange} 
                        showOptions={userId === post.user_id} 
                    />
                );
            })
        ) : (
            <p>No posts yet.</p>
        )}

            </div>
    
            {showNotification && (
                <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
                    Hugot has been posted successfully!
                </div>
            )}       
        </div>
    );
}
