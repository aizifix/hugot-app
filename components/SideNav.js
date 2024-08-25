"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import logo from '../public/logo.png';
import defaultPfp from '../public/default_pfp.jpg'; 
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SideNav() {
    const [username, setUsername] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(defaultPfp); // Use defaultPfp directly
    const [themes, setThemes] = useState([]); 
    const router = useRouter();

    useEffect(() => {
        // Retrieve user data from sessionStorage
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);
            setProfilePhoto(user.profile_photo || defaultPfp); // Use stored profile photo or default
        }

        // Fetch themes from the server
        const fetchThemes = async () => {
            try {
                const response = await fetch('http://localhost/hugot-api/user.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        operation: 'get_themes',
                    }),
                });
                const data = await response.json();

                if (Array.isArray(data)) {
                    setThemes(data);
                } else {
                    console.error('Failed to fetch themes:', data.error);
                }
            } catch (err) {
                console.error('Error fetching themes:', err);
            }
        };

        fetchThemes();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost/hugot-api/user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    operation: 'logout',
                }),
            });
            const data = await response.json();
            
            if (data.success) {
                // Clear sessionStorage on the client side
                sessionStorage.removeItem('user');
                
                // Redirect to the login page
                router.push('/');
            } else {
                console.error('Failed to logout:', data.error);
            }
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    return (
        <>
            <div className="w-[300px] h-[100vh] p-3 flex flex-col justify-between fixed bg-black">
                <div>
                    <Image 
                        src={logo}
                        alt="Logo"
                        className="w-[80px]"
                    />

                    {/* Profile Info */}
                    <div className="flex items-center gap-1 my-5">
                        <div className="h-[30px] w-[30px] overflow-hidden rounded-full">
                            <Image src={profilePhoto} alt="Profile Picture" width={30} height={30} />
                        </div>
                        <Link className="hover:underline" href="/profile">{username ? `@${username}` : 'Guest'}</Link>    
                    </div>

                    {/* Nav Buttons */}
                    <div>
                        <ul className="flex flex-col gap-1 transition-all">
                            <li>
                                <Link href="/home">        
                                    <span className="flex items-center hover:bg-[#262629] p-2 gap-2 rounded-md">
                                        <i className="bx bx-home text-xl"/>
                                        <p>Home</p>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/settings" className="">       
                                    <span className="flex items-center hover:bg-[#262629] p-2 gap-2 rounded-md">
                                        <i className="bx bx-cog text-xl"/>
                                        <p>Settings</p>
                                    </span>
                                </Link>
                            </li>
                        </ul>   
                        <div className="h-[1px] bg-[#262629] mt-4"></div>  
                    </div>

                    {/* Themes */}
                    <div className="mt-3">
                        <h1 className="font-extrabold text-[18px] mb-1">Themes</h1>
                        <div className="w-full flex flex-wrap gap-2">
                            {themes.length > 0 ? (
                                themes.map((theme) => (
                                    <Link key={theme.theme_id} className="mt-2" href="/">
                                        <span className="bg-black text-white px-2 py-1 border-2 border-[#262629] rounded-md">
                                            {theme.theme_type}
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-white">No themes available</p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Logout */}
                <div className="mb-3">
                    <span 
                        className="flex items-center hover:bg-[#262629] p-2 gap-2 rounded-md cursor-pointer"
                        onClick={handleLogout}
                    >
                        <i className="bx bx-exit text-xl"/>
                        <p>Log out</p>
                    </span>
                </div>
            </div>
        </>
    );
}
