"use client";

import ReactDOM from "react-dom";

export default function LoginPromptModal({ show, onClose }) {
    if (!show) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 back">
            <div className="bg-[black] border border-[#262629] p-5 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">Please Log In</h2>
                <p className="mb-4">You need to log in to interact with hugots.</p>
                <button 
                    className="bg-white text-black px-4 py-2 rounded"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>,
        document.body
    );
}
