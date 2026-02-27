import React, { createContext, useContext, useState, useCallback } from 'react';
import { SiteContent } from '../../types';

interface EditorContextType {
  isEditMode: boolean;
  isAuthenticated: boolean;
  toggleEditMode: () => void;
  login: (password: string) => boolean;
  content: SiteContent | null;
  updateContent: (path: string, value: any) => void;
  addItem: (path: string, item: any) => void;
  removeItem: (path: string, index: number) => void;
  saveChanges: () => Promise<void>;
  isSaving: boolean;
}

export const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
};

// Simple deep set utility
const deepSet = (obj: any, path: string, value: any) => {
  const schema = obj;
  const pList = path.split('.');
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    obj = schema[elem];
  }
  obj[pList[len - 1]] = value;
};

export const EditorProvider: React.FC<{
  children: React.ReactNode;
  initialContent: SiteContent | null;
  onContentUpdate: (content: SiteContent) => void;
}> = ({ children, initialContent, onContentUpdate }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // We maintain a local copy of the content that is currently being edited
  const [editContent, setEditContent] = useState<SiteContent | null>(initialContent);

  React.useEffect(() => {
    if (initialContent) setEditContent(initialContent);
  }, [initialContent]);


  const toggleEditMode = useCallback(() => {
    if (!isAuthenticated) return;
    setIsEditMode(prev => !prev);
  }, [isAuthenticated]);

  const login = useCallback((password: string) => {
    // In a real app, this would be a hash check or API call
    // For this implementation, we'll use a simple password from env or hardcoded for demo
    // The user will set the password in .env
    const correctPassword = (import.meta as any).env.VITE_EDITOR_PASSWORD || 'admin';
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setIsEditMode(true);
      return true;
    }
    return false;
  }, []);

  const addItem = useCallback((path: string, item: any) => {
    setEditContent((prev: any) => {
      if (!prev) return null;
      const next = JSON.parse(JSON.stringify(prev));
      const pList = path.split('.');
      let target = next;
      for (let i = 0; i < pList.length; i++) {
        if (!target[pList[i]]) target[pList[i]] = (i === pList.length - 1) ? [] : {};
        target = target[pList[i]];
      }
      if (Array.isArray(target)) {
        target.push(item);
      }
      onContentUpdate(next);
      return next;
    });
  }, [onContentUpdate]);

  const removeItem = useCallback((path: string, index: number) => {
    setEditContent((prev: any) => {
      if (!prev) return null;
      const next = JSON.parse(JSON.stringify(prev));
      const pList = path.split('.');
      let target = next;
      for (let i = 0; i < pList.length; i++) {
        if (!target[pList[i]]) return prev;
        target = target[pList[i]];
      }
      if (Array.isArray(target)) {
        target.splice(index, 1);
      }
      onContentUpdate(next);
      return next;
    });
  }, [onContentUpdate]);

  const updateContent = useCallback((path: string, value: any) => {
    setEditContent(prev => {
      if (!prev) return null;
      const next = JSON.parse(JSON.stringify(prev));
      deepSet(next, path, value);
      onContentUpdate(next);
      return next;
    });
  }, [onContentUpdate]);


  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const isDev = (import.meta as any).env.DEV;
      const endpoint = isDev ? '/api/save-content' : '/api/github-commit';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          home: editContent
        })
      });

      if (!response.ok) throw new Error('Save failed');

      alert('Changes saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <EditorContext.Provider value={{
      isEditMode,
      isAuthenticated,
      toggleEditMode,
      login,
      content: editContent,
      updateContent,
      addItem,
      removeItem,
      saveChanges,
      isSaving
    }}>
      {children}
    </EditorContext.Provider>
  );
};
