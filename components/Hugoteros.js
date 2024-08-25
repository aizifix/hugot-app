"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import defaultPfp from "../public/default_pfp.jpg";

export default function Hugoteros() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchLatestUsers = async () => {
            try {
                const response = await fetch('http://localhost/hugot-api/user.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        operation: 'get_latest_users',
                    }),
                });
                const data = await response.json();

                if (Array.isArray(data)) {
                    // Filter to only keep the latest 8 users
                    setUsers(data.slice(0, 8));
                } else {
                    console.error('Failed to fetch users:', data.error);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchLatestUsers();
    }, []);

    return (
        <>
            <div className="w-[280px] h-[100vh] p-3 flex flex-col sticky top-0 flex-shrink-0">
                <div className="border border-[#262629] p-3 h-[370px] rounded-md">
                    <h1 className="text-[18px] font-extrabold mb-3">Recent Hugoteros</h1>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <div key={user.user_id} className="flex items-center gap-2 my-3">
                              
                                <div className="rounded-full h-[30px] w-[30px] bg-[#262629] overflow-hidden relative">
                                    <Image
                                        src={defaultPfp}  
                                        alt="Profile Picture"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <p>@{user.username}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">No users available</p>
                    )}
                </div>
            </div>
        </>
    );
}
