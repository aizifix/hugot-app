"use client";

import Link from "next/link";
import { useState, useRef } from 'react';
import axios from 'axios';

export default function SignUpForm() {

    const usernameRef = useRef('');
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const confirmPasswordRef = useRef('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if(passwordRef.current.value !== confirmPasswordRef.current.value) {
            setError("Passwords do not match");
            return;
        }
    
        try {
            console.log("Sending data:", {
                operation: 'signup',
                data: {
                    username: usernameRef.current.value,
                    email: emailRef.current.value,
                    password: passwordRef.current.value 
                }
            });
    
            const response = await axios.post('http://localhost/hugot-api/user.php', {
                operation: 'signup', 
                data: {
                    username: usernameRef.current.value,
                    email: emailRef.current.value,
                    password: passwordRef.current.value 
                }
            });
    
            console.log("Received response:", response.data);
    
            if (response.data.success) {
                setSuccess(response.data.success);
                setError('');
            } else {
                setError(response.data.error || 'An error occurred');
            }
    
        } catch(err) {
            console.error('Axios error:', err);
            setError('An error has occurred during the sign-up process');
        }
    };
    
    return (
        <>
            <form onSubmit={handleSubmit} className="w-full max-w-xs bg-black p-4 rounded-lg shadow-md border-2 border-[#262629]">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <h1 className="text-2xl text-white font-bold mb-4">Sign up</h1>
                {/* Username */}
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

                {/* Email */}
                <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <div className="border-solid border-2 h-10 border-[#262629] overflow-hidden mb-3 rounded-md flex justify-center pl-1">
                    <input 
                        className="w-full h-full p-2 mb-6 text-white rounded-md bg-transparent outline-none" 
                        type="email" 
                        id="email" 
                        ref={emailRef}
                        required
                    />
                </div>

                {/* Password */}
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

                {/* Confirm Password */}
                <label className="block text-white text-sm font-bold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <div className="border-solid border-2 h-10 border-[#262629] overflow-hidden mb-3 rounded-md flex justify-center pl-1">
                    <input 
                        className="w-full h-full p-2 mb-6 text-white rounded-md bg-transparent outline-none" 
                        type="password" 
                        id="confirmPassword" 
                        ref={confirmPasswordRef}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="w-full py-2 bg-white text-black rounded-md hover:bg-gray-200 mt-3"
                >
                    Sign up          
                </button>
                <div>
                    <p className="text-sm text-center p-3">Already have an account? <Link className="hover:underline" href="/"><b>Log in</b></Link></p>
                </div>
            </form>
        </>
    );
}
