"use client";

import Link from "next/link";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import axios from 'axios';

export default function LoginForm() {

    const usernameRef = useRef('');
    const passwordRef = useRef('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter(); // Initialize the useRouter hook

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost/hugot-api/user.php', {
                operation: 'login', 
                data: {
                    username: usernameRef.current.value,
                    password: passwordRef.current.value 
                }
            });

            if (response.data.success) {
                setSuccess('Login successful.');
                setError('');
                // Store user data in sessionStorage or cookies if needed
                sessionStorage.setItem('user', JSON.stringify(response.data.user));

                // Redirect to /home route
                router.push('/home');
            } else {
                setError(response.data.error || 'An error occurred');
            }

        } catch(err) {
            setError('An error has occurred during the login process');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="w-full max-w-xs bg-black p-4 rounded-lg shadow-md border-2 border-[#262629]">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <h1 className="text-2xl text-white font-bold mb-4">Log in</h1>
                
                <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                    Username
                </label>
                <div className="border-solid border-2 h-10 border-[#262629] overflow-hidden mb-3 rounded-md flex justify-center pl-1 relative">
                    <h1 className="absolute left-2 top-[50%] translate-y-[-50%] text-[#727279]">@</h1>
                    <input 
                        className="w-full h-full pl-[1.5rem] p-2 mb-6 text-white rounded-md bg-transparent outline-none" 
                        type="text" 
                        id="username" 
                        ref={usernameRef}
                        required
                    />
                </div>
                
                <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>

                <div className="border-solid border-2 h-10 border-[#262629] overflow-hidden mb-3 rounded-md flex justify-center pl-1">
                    <input 
                        className="w-full h-full p-2 mb-6 text-white rounded-md bg-transparent outline-none" 
                        type="password" 
                        id="password" 
                        ref={passwordRef}
                        required
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full py-2 bg-white text-black rounded-md hover:bg-gray-200 mt-3"
                >
                    Log in          
                </button>
                <div>
                    <p className="text-sm text-center p-3">Don't have an account yet? <Link className="hover:underline" href="/signup"><b>Sign up</b></Link></p>
                </div>
            </form>
        </>
    );
}
