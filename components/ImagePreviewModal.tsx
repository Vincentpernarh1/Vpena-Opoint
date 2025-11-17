
import React from 'react';
import { XIcon } from './Icons';

interface ImagePreviewModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImagePreviewModal = ({ imageUrl, onClose }: ImagePreviewModalProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
            <div className="relative" onClick={e => e.stopPropagation()}>
                <img src={imageUrl} alt="Captured selfie" className="max-w-screen-md max-h-[80vh] rounded-lg shadow-xl" />
                <button onClick={onClose} className="absolute -top-4 -right-4 text-white bg-gray-800 rounded-full p-1 hover:bg-gray-600">
                    <XIcon className="h-6 w-6"/>
                </button>
            </div>
        </div>
    );
};

export default ImagePreviewModal;
