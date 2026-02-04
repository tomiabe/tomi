import React from 'react';
import { EditorContext } from '../../../components/Editor/EditorContext';

interface PreviewWrapperProps {
    children: React.ReactNode;
    data: any;
    isStudio?: boolean;
}

const PreviewWrapper: React.FC<PreviewWrapperProps> = ({ children, data, isStudio = false }) => {
    // Mock the context. We disable isEditMode so Editable components just render text.
    // Or we enable it? No, if enabled, clicking text might try to open editor which won't work well in iframe.
    // Let's keep isEditMode false so it looks like the final site.
    const mockContext = {
        isEditMode: false,
        isAuthenticated: true,
        toggleEditMode: () => { },
        login: () => true,
        content: isStudio ? null : data,
        studioContent: isStudio ? data : null,
        updateContent: () => console.log('Content update triggered in preview'),
        updateStudioContent: () => console.log('Studio content update triggered in preview'),
        addItem: () => { },
        removeItem: () => { },
        saveChanges: async () => { },
        isSaving: false
    };

    return (
        <EditorContext.Provider value={mockContext}>
            <div className="dark:bg-black min-h-screen text-white">
                {children}
            </div>
        </EditorContext.Provider>
    );
};

export default PreviewWrapper;
