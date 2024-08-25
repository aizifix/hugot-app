"use client";

import Image from "next/image";
import defaultPfp from '../../public/default_pfp.jpg';
import { useState, useEffect } from "react";
import axios from "axios";

export default function HugotModal({ handleClose, onPostSuccess }) {
    const [text, setText] = useState("");
    const [theme, setTheme] = useState("");
    const [themes, setThemes] = useState([]);  // State to hold themes
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data from sessionStorage
        const userData = sessionStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Fetch available themes from the server
        const fetchThemes = async () => {
            try {
                const response = await axios.post('http://localhost/hugot-api/user.php', {
                    operation: 'get_themes',
                });

                if (Array.isArray(response.data)) {
                    setThemes(response.data);
                } else {
                    console.error('Unexpected response format', response.data);
                    setThemes([]);
                }
            } catch (err) {
                console.error('Error fetching themes', err);
                setThemes([]);
            }
        };

        fetchThemes();
    }, []);

    const handleInputChange = (e) => {
        const textarea = e.target;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        setText(textarea.value);
    };

    const handleThemeChange = (e) => {
        setTheme(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Submitting post:", {
                text: text,
                theme: theme,
                user: user
            });

            const response = await axios.post('http://localhost/hugot-api/user.php', {
                operation: 'post_hugot',
                data: {
                    text: text,
                    theme: theme,
                    user: user
                }
            });

            console.log("Response from server:", response.data);

            if (response.data.success) {
                handleClose();
                onPostSuccess();
            } else {
                console.error(response.data.error || 'An error occurred');
            }
        } catch (err) {
            console.error('An error occurred during the hugot post process', err);
        }
    };

    return (
        <div className="fixed bg-[#000000] top-0 left-0 w-[100%] h-[100%] z-[1000] transition-all">
            <div className="h-[100%] w-[100%] relative flex justify-center items-center">
                <form className="border border-[#262629] w-[500px] bg-black rounded-xl p-3" onSubmit={handleSubmit}>
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                                <div className="rounded-full h-[30px] w-[30px] bg-[#262629] overflow-hidden relative">
                                    <Image
                                        src={defaultPfp}  
                                        alt="Profile Picture"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            <p className="text-[16px]">
                                {user ? `@${user.username}` : '@loading...'}
                            </p>
                        </div>
                        <select 
                            className="bg-[black] border border-[#262629] py-1 px-2 cursor-pointer rounded-md" 
                            name="Theme" 
                            value={theme} 
                            onChange={handleThemeChange} 
                            required
                        >
                            <option value="" disabled>Select Theme</option>
                            {themes.map((theme) => (
                                <option key={theme.theme_id} value={theme.theme_id}>
                                    {theme.theme_type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-4">
                        <textarea 
                            className="w-full bg-black text-[16px] text-white outline-none overflow-auto resize-none"
                            value={text}
                            onChange={handleInputChange}
                            placeholder="isulat na imong hugot..."
                            rows={1}
                            required
                        />
                    </div>
                    <div className="h-[35px] flex justify-end">
                        <button className="bg-white text-black px-5 py-1 rounded-md hover:bg-[#b3b3b3]" type="submit">Hugot</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
