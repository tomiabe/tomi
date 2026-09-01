import React from 'react';
import { useEditor } from './EditorContext';
import { Trash, Plus } from '../Icons';

interface ListControlsProps {
    onAdd?: () => void;
    onRemove?: () => void;
    className?: string;
    label?: string;
}

export const ListControls: React.FC<ListControlsProps> = ({ onAdd, onRemove, className = "", label }) => {
    const { isEditMode } = useEditor();
    if (!isEditMode) return null;

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {onRemove && (
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-md transition-all cursor-pointer shadow-sm group/btn"
                    title="Remove Item"
                >
                    <Trash className="w-3.5 h-3.5" />
                </button>
            )}
            {onAdd && (
                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(); }}
                    className="p-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-md transition-all cursor-pointer shadow-sm flex items-center gap-1.5 group/btn"
                    title={label || "Add Item"}
                >
                    <Plus className="w-3.5 h-3.5" />
                    {label && <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{label}</span>}
                </button>
            )}
        </div>
    );
};
