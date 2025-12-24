import React, { useRef } from 'react';
import { Camera, Upload } from 'lucide-react';

const ImageUploadButton = ({
    onImageSelect,
    currentImage,
    type = 'avatar', // 'avatar' or 'cover'
    className = '',
    disabled = false
}) => {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        if (!disabled) {
            fileInputRef.current?.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Harap pilih file gambar (JPG, PNG, GIF, dll)');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            alert('Ukuran file terlalu besar. Maksimal 5MB');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            onImageSelect(reader.result);
        };
        reader.readAsDataURL(file);

        // Reset input
        e.target.value = '';
    };

    const isAvatar = type === 'avatar';
    const isCover = type === 'cover';

    return (
        <div
            className={`relative group cursor-pointer ${className}`}
            onClick={handleClick}
        >
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
            />

            {/* Current Image or Placeholder */}
            {currentImage ? (
                <img
                    src={currentImage}
                    alt={isAvatar ? 'Profile' : 'Cover'}
                    className={`w-full h-full object-cover ${isAvatar ? 'rounded-full' : ''
                        }`}
                />
            ) : (
                <div className={`w-full h-full ${isAvatar
                        ? 'rounded-full bg-gradient-primary flex items-center justify-center text-white text-5xl font-bold'
                        : 'bg-gradient-primary'
                    }`}>
                    {isAvatar && 'U'}
                </div>
            )}

            {/* Camera Overlay */}
            <div className={`
        absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 
        transition-opacity duration-200 flex items-center justify-center
        ${isAvatar ? 'rounded-full' : ''}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
      `}>
                <div className="text-center text-white">
                    <Camera className="w-8 h-8 mx-auto mb-1" />
                    <span className="text-sm font-semibold">
                        {currentImage ? 'Ubah' : 'Upload'} {isAvatar ? 'Foto' : 'Sampul'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ImageUploadButton;
