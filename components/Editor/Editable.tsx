import React, { useRef, useEffect } from 'react';
import { useEditor } from './EditorContext';

interface EditableProps {
    text: string;
    path: string;
    component?: any;
    className?: string;
    isStudio?: boolean;
    multiline?: boolean;
}

export const Editable: React.FC<EditableProps> = ({
    text,
    path,
    component: Component = 'span',
    className = '',
    isStudio = false,
    multiline = false
}) => {
    const { isEditMode, updateContent, updateStudioContent } = useEditor();
    const elementRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (elementRef.current && elementRef.current.innerText !== text) {
            elementRef.current.innerText = text;
        }
    }, [text]);

    const handleBlur = () => {
        if (!elementRef.current) return;
        const newValue = elementRef.current.innerText;
        if (newValue !== text) {
            if (isStudio) {
                updateStudioContent(path, newValue);
            } else {
                updateContent(path, newValue);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            elementRef.current?.blur();
        }
        if (e.key === 'Escape') {
            if (elementRef.current) {
                elementRef.current.innerText = text;
                elementRef.current.blur();
            }
        }
    };

    if (!isEditMode) {
        const hasHtml = /<[a-z][\s\S]*>/i.test(text);

        if (typeof Component === 'string') {
            const Tag = Component as any;
            if (hasHtml) {
                return <Tag className={className} dangerouslySetInnerHTML={{ __html: text }} />;
            }
            return <Tag className={className}>{text}</Tag>;
        }

        const CustomComponent = Component as any;
        return (
            <CustomComponent
                className={className}
                content={text}
                text={text}
            >
                {text}
            </CustomComponent>
        );
    }

    const Tag = multiline ? 'div' : 'span';

    return (
        <Tag
            ref={elementRef as any}
            contentEditable
            suppressContentEditableWarning
            className={`${className} outline-none focus:ring-2 focus:ring-blue-500/50 rounded-sm bg-blue-500/5 transition-all cursor-text min-h-[1.5em] min-w-[20px] inline-block whitespace-pre-wrap`}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            title={`Click to edit ${path}`}
        >
            {text || ''}
        </Tag>
    );
};
