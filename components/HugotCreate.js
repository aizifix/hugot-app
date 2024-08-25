"use client";

import ReactDOM from 'react-dom';
import HugotModal from '@/components/modals/HugotModal';
import { useState, useEffect } from "react";
import Image from 'next/image';
import defaultPfp from '../public/default_pfp.jpg';

export default function HugotCreate({ onPostSuccess }) {
    const [showModal, setShowModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePostSuccess = () => {
        onPostSuccess();
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000); // Hide notification after 3 seconds
    };

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal]);

    const handleClickOutside = (e) => {
        if (e.target.className.includes('modal-overlay')) {
            handleCloseModal();
        }
    };

    const modalContent = (
        <div 
            className="fixed inset-0 bg-[#000000d7] z-[1000] flex justify-center items-center modal-overlay " 
            onClick={handleClickOutside}
        >
            <div className="modal-container show border border-[#262629] w-[500px] bg-black rounded-xl p-3">
                {/* Insert image here use default for now as we will fetch*/}
                <HugotModal handleClose={handleCloseModal} onPostSuccess={handlePostSuccess} />
            </div>
        </div>
    );

    return (
        <>
            {showModal && ReactDOM.createPortal(modalContent, document.body)}

            <div 
                className="bg-[black] flex flex-col border border-[#262629] h-[150px] p-5 gap-3 rounded-xl mt-3 w-[945px] cursor-pointer hover:bg-[#252525c9] hover:transition-all"
                onClick={handleShowModal}
            >
                 <div className="rounded-full h-[30px] w-[30px] bg-[#262629] overflow-hidden relative">
                        <Image
                             src={defaultPfp}  
                             alt="Profile Picture"
                             layout="fill"
                             objectFit="cover"
                        />
                </div>
                <div className="mt-2 text-[#5c5c61]">
                    <p className="">
                        Isulat na imong hugot...
                    </p>
                </div>
            </div>

            {showNotification && (
                <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
                    Hugot has been posted successfully!
                </div>
            )}
        </>
    );
}
