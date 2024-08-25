"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import LoginPromptModal from "../components/modals/LoginPromptModal"; 
import defaultPfp from "../public/default_pfp.jpg";
import Image from "next/image";

export default function HugotCard({ name, theme, content, postId, initialHeartCount = 0, userId, postOwnerId, onLikeChange }) {
    const [liked, setLiked] = useState(false);
    const [heartCount, setHeartCount] = useState(initialHeartCount);
    const [showMenu, setShowMenu] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [comments, setComments] = useState([]); // State to hold comments
    const [newComment, setNewComment] = useState(""); // State for new comment input

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setIsAuthenticated(true);
            fetchLikeStatus();
            fetchComments(); // Fetch comments when component mounts
        }
    }, []);

    const fetchLikeStatus = async () => {
        try {
            const response = await axios.post('http://localhost/hugot-api/user.php', {
                operation: 'get_like_status',
                data: {
                    post_id: postId,
                    user_id: userId
                }
            });
            if (response.data.liked) {
                setLiked(true);
            }
        } catch (err) {
            console.error('An error occurred while fetching like status:', err);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.post('http://localhost/hugot-api/user.php', {
                operation: 'get_comments',
                data: { post_id: postId }
            });
            if (response.data) {
                setComments(response.data);
            }
        } catch (err) {
            console.error('An error occurred while fetching comments:', err);
        }
    };

    const addComment = async () => {
        if (!newComment.trim()) return;
        try {
            const response = await axios.post('http://localhost/hugot-api/user.php', {
                operation: 'add_comment',
                data: {
                    post_id: postId,
                    user_id: userId,
                    comment: newComment
                }
            });

            if (response.data.success) {
                setNewComment(""); // Clear the input field
                fetchComments(); // Refresh comments after adding a new one
            }
        } catch (err) {
            console.error('An error occurred while adding comment:', err);
        }
    };

    const toggleLike = async () => {
        if (!isAuthenticated) {
            setShowLoginPrompt(true);
            return;
        }

        try {
            const newLikedState = !liked;

            const response = await axios.post('http://localhost/hugot-api/user.php', {
                operation: newLikedState ? 'like_post' : 'unlike_post',
                data: {
                    post_id: postId,
                    user_id: userId
                }
            });

            if (response.data.success) {
                setLiked(newLikedState);
                setHeartCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
                if (onLikeChange) {
                    onLikeChange();
                }
            } else {
                console.error('An error occurred while liking/unliking the post:', response.data.error);
            }
        } catch (err) {
            console.error('An error occurred during the like operation:', err);
        }
    };

    return (
        <div className="flex flex-col border border-[#262629] h-auto p-5 gap-3 rounded-xl mt-3 relative">
            <div className="flex items-center justify-between">  
                <div className="flex items-center gap-2">
                    <div className="rounded-full h-[30px] w-[30px] bg-[#262629] overflow-hidden relative">
                        <Image
                             src={defaultPfp}  
                             alt="Profile Picture"
                             layout="fill"
                             objectFit="cover"
                        />
                    </div>
                    <div>
                        <p>{name}</p>
                    </div>
                </div>
                <div className="relative flex items-center">
                    <div className="border border-[#57575c] px-3 py-1 rounded-md">
                        <p>{theme}</p>
                    </div>
                    {userId === postOwnerId && (
                        <div className="relative ml-2">
                            <i 
                                className="bx bx-dots-horizontal-rounded cursor-pointer"
                                onClick={() => setShowMenu(!showMenu)}
                            />
                            {showMenu && (
                                <div className="absolute right-0 mt-2 w-32 bg-[black] border border-[#262629] rounded-lg shadow-lg z-10">
                                    <div className="m-1 px-4 py-2 hover:bg-gray-100 hover:m-1 hover:text-black cursor-pointer hover:rounded-md hover:transition-all" onClick={() => console.log('Edit post:', postId)}>Edit</div>
                                    <div className="m-1 px-4 py-2 hover:bg-gray-100 hover:m-1 hover:text-black cursor-pointer hover:rounded-md hover:transition-all" onClick={() => console.log('Delete post:', postId)}>Delete</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="w-[900px]">
                <p className="break-words">{content}</p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1" onClick={toggleLike} style={{ cursor: "pointer" }}>
                        <i className={`text-xl bx ${liked ? 'bxs-heart text-[red]' : 'bx-heart'}`} />
                        <p>{heartCount < 0 ? 0 : heartCount}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <i className='text-xl bx bx-comment text-[#59595984] hover:cursor-not-allowed'/>
                        <p>{comments.length}</p>
                    </div>
                </div>
                <div>
                    <i className='text-xl bx bx-share'/>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-md font-bold">Comments</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="mt-2">
                        <p className="text-sm">
                            <span className="font-bold">{comment.username}: </span>
                            {comment.comment}
                        </p>
                    </div>
                ))}
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        className="border border-[#262629] bg-black text-white p-2 rounded-md w-full"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        onClick={addComment}
                        className="bg-[#333333] text-white px-4 py-2 rounded-md hover:bg-[#555555] transition-all"
                    >
                        Comment
                    </button>
                </div>
            </div>

            <LoginPromptModal show={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
        </div>
    );
}
