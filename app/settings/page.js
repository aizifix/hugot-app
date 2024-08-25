"use client";

import { useState, useEffect } from 'react';
import SideNav from '../../components/SideNav';
import Image from 'next/image';
import axios from 'axios';
import defaultCover from '../../public/default-cover.png';
import defaultPfp from '../../public/default_pfp.jpg';

export default function SettingsPage() {
    const [coverPhoto, setCoverPhoto] = useState(defaultCover);
    const [profilePhoto, setProfilePhoto] = useState(defaultPfp);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUsername(user.username);
            setProfilePhoto(user.profile_photo || defaultPfp);
            setCoverPhoto(user.cover_photo || defaultCover);
        }
    }, []);

    const handleCoverPhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverPhotoFile(file);
            const reader = new FileReader();
            reader.onload = () => setCoverPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleProfilePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhotoFile(file);
            const reader = new FileReader();
            reader.onload = () => setProfilePhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        const formData = new FormData();
        formData.append('operation', 'update_user_settings');
        formData.append('username', username);
        formData.append('password', password);
        if (coverPhotoFile) formData.append('cover_photo', coverPhotoFile);
        if (profilePhotoFile) formData.append('profile_photo', profilePhotoFile);

        try {
            const response = await axios.post('http://localhost/hugot-api/user.php', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                alert('Settings updated successfully');

                const updatedUser = {
                    ...JSON.parse(sessionStorage.getItem('user')),
                    username: username,
                    profile_photo: response.data.profile_photo || profilePhoto,
                    cover_photo: response.data.cover_photo || coverPhoto,
                };
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
                window.location.reload();
            } else {
                alert('Failed to update settings: ' + response.data.error);
            }
        } catch (err) {
            console.error('Error updating settings:', err);
            alert('An error occurred while updating settings.');
        }
    };

    return (
        <div className="flex max-w-[1540px] my-0 mx-auto">
            <SideNav />
            <div className="border border-[#262629] w-[800px] ml-[300px] h-[500px] mt-3 rounded-xl p-5">
                <h1 className="text-[18px] font-extrabold">Settings</h1>
                
                {/* Change Cover Photo */}
                <h1 className="mt-3 font-semibold">Change cover photo</h1>
                <div className="border border-[#262629] h-[130px] mt-2 rounded-xl relative overflow-hidden">
                    <Image src={coverPhoto} alt="Cover Photo" layout="fill" objectFit="cover" />
                    <label className="absolute top-2 right-2 cursor-pointer">
                        <i className="bg-[#00000059] p-2 rounded-full bx bx-pencil text-white text-xl" />
                        <input type="file" className="hidden" onChange={handleCoverPhotoChange} />
                    </label>
                </div>

                {/* Change Profile Picture */}
                <div className="flex gap-8">
                    <div className="flex flex-col items-center relative">
                        <h1 className="mt-3 font-semibold">Change profile picture</h1>
                        <div className="relative">
                            <div className="border border-[#262629] h-[130px] w-[130px] rounded-full mt-3 relative overflow-hidden">
                                <Image src={profilePhoto} alt="Profile Picture" layout="fill" objectFit="cover" />
                            </div>
                            <label className="absolute top-5 right-5 transform translate-x-4 translate-y-[-4px] cursor-pointer z-20">
                                <i className="bx bx-pencil bg-[#333333] rounded-full p-2 text-white text-xl" />
                                <input type="file" className="hidden" onChange={handleProfilePhotoChange} />
                            </label>
                        </div>
                    </div>

                    {/* Edit Profile */}
                    <div className="mt-3">
                        <h1 className="font-semibold">Edit Profile</h1>
                        <p onClick={() => setShowUsernameModal(true)} className="cursor-pointer hover:underline">Change username</p>
                        <p onClick={() => setShowPasswordModal(true)} className="cursor-pointer hover:underline mt-2">Change password</p>
                    </div>
                </div>

                {/* Save Button */}
                <button 
                    className="bg-[white] text-black px-5 py-2 mt-5 rounded-md hover:bg-[#d1d1d1] transition-all" 
                    onClick={handleSaveChanges}
                >
                    Save Changes
                </button>

                {/* Username Modal */}
                {showUsernameModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                        <div className="bg-black rounded-lg p-6 w-[400px]">
                            <h2 className="text-[18px] font-extrabold">Change Username</h2>
                            <p className="mt-4">Current username: @{username}</p>
                            <input 
                                type="text" 
                                className="bg-black text-white border-[#262629] border rounded-md p-2 mt-4 w-full" 
                                placeholder="New username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <input 
                                type="password" 
                                className="bg-black text-white border-[#262629] border rounded-md p-2 mt-4 w-full" 
                                placeholder="Enter current password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="flex justify-between mt-6">
                                <button 
                                    className="bg-[#555] text-white px-5 py-2 rounded-md hover:bg-[#333] transition-all"
                                    onClick={() => setShowUsernameModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="bg-[white] text-black px-5 py-2 rounded-md hover:bg-[#bbbbbb] transition-all"
                                    onClick={() => {
                                        handleSaveChanges();
                                        setShowUsernameModal(false);
                                    }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
                        <div className="bg-black rounded-lg p-6 w-[400px]">
                            <h2 className="text-[18px] font-extrabold">Change Password</h2>
                            <input 
                                type="password" 
                                className="bg-black text-white border-[#262629] border rounded-md p-2 mt-4 w-full" 
                                placeholder="Current password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input 
                                type="password" 
                                className="bg-black text-white border-[#262629] border rounded-md p-2 mt-4 w-full" 
                                placeholder="New password"
                            />
                            <input 
                                type="password" 
                                className="bg-black text-white border-[#262629] border rounded-md p-2 mt-4 w-full" 
                                placeholder="Confirm new password"
                            />
                            <div className="flex justify-between mt-6">
                                <button 
                                    className="bg-[#555] text-white px-5 py-2 rounded-md hover:bg-[#333] transition-all"
                                    onClick={() => setShowPasswordModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="bg-[#ffffff] text-black px-5 py-2 rounded-md hover:bg-[#145A86] transition-all"
                                    onClick={() => {
                                        handleSaveChanges();
                                        setShowPasswordModal(false);
                                    }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
