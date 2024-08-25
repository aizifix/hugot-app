"use client";

import { useEffect, useState } from "react";
import HugotCard from "./HugotCard"; // Assuming you have a HugotCard component to display individual hugots

export default function RecentHugots() {
    const [hugots, setHugots] = useState([]);

    useEffect(() => {
        const fetchRecentHugots = async () => {
            try {
                const response = await fetch('http://localhost/hugot-api/user.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        operation: 'get_recent_hugots',
                    }),
                });
                const data = await response.json();

                if (Array.isArray(data)) {
                    // Store the fetched hugots in the state
                    setHugots(data.slice(0, 5)); // Limit to the latest 5 hugots
                } else {
                    console.error('Failed to fetch recent hugots:', data.error);
                }
            } catch (err) {
                console.error('Error fetching recent hugots:', err);
            }
        };

        fetchRecentHugots();
    }, []);

    return (
        <div className="w-[800px] ml-8">
            <h1 className="font-bold text-2xl">Recent Hugots</h1>
            <div className="w-[100%] h-[600px] overflow-x-hidden overflow-y-visible">
                {hugots.length > 0 ? (
                    hugots.map((hugot) => (
                        <HugotCard 
                            key={hugot.post_id} 
                            name={`@${hugot.username}`} 
                            theme={hugot.theme_type} 
                            content={hugot.hugot_post}
                            postId={hugot.post_id}
                            initialHeartCount={hugot.heart_count}
                            userId={hugot.user_id} 
                            postOwnerId={hugot.user_id}
                            onLikeChange={() => {}} // pass an empty function haha
                        />
                    ))
                ) : (
                    <p>No hugots available</p>
                )}
            </div>
        </div>
    );
}
