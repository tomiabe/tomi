import React, { useState } from 'react';
import { useEditor } from './EditorContext';
import { PencilSquare, XMark, Check } from '../Icons';
import { assetUrl } from '../../utils/asset-url';

interface EditableImageProps {
    src: string;
    path: string;
    className?: string;
    isStudio?: boolean;
}

export const EditableImage: React.FC<EditableImageProps> = ({
    src,
    path,
    className = '',
    isStudio = false
}) => {
    const { isEditMode, updateContent, updateStudioContent } = useEditor();
    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [tempUrl, setTempUrl] = useState(src);

    React.useEffect(() => {
        setTempUrl(src);
    }, [src]);

    if (!isEditMode) {
        return <img src={assetUrl(src)} className={className} alt="" />;
    }

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isStudio) {
            updateStudioContent(path, tempUrl);
        } else {
            updateContent(path, tempUrl);
        }
        setIsEditing(false);
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTempUrl(src);
        setIsEditing(false);
    };

    const triggerEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    };

    return (
        <div
            className="relative group w-full h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => e.stopPropagation()}
        >
            <img src={assetUrl(src)} className={className} alt="" />

            {isHovered && !isEditing && (
                <button
                    onClick={triggerEdit}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all rounded-lg z-20 cursor-pointer"
                >
                    <div className="bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform">
                        <PencilSquare className="w-5 h-5" />
                    </div>
                </button>
            )}

            {isEditing && (
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 rounded-lg z-50 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-full max-w-[240px] space-y-3">
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest text-center">Edit Image URL</p>
                        <textarea
                            value={tempUrl}
                            onChange={(e) => setTempUrl(e.target.value)}
                            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] resize-none"
                            placeholder="Enter image URL..."
                            autoFocus
                        />
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                                title="Save"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center"
                                title="Cancel"
                            >
                                <XMark className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
