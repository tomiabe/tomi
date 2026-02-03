import React, { useState, useEffect } from 'react';
import { useEditor } from './EditorContext';
import { PencilSquare, XMark, ArrowDownTray, Key } from '../Icons';

export const EditorToolbar: React.FC = () => {
    const {
        isEditMode,
        isAuthenticated,
        toggleEditMode,
        login,
        saveChanges,
        isSaving
    } = useEditor();

    const [showLogin, setShowLogin] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [tapCount, setTapCount] = useState(0);

    // Hidden way to trigger login: Click 5 times on the toolbar area if not authenticated
    useEffect(() => {
        if (tapCount >= 5 && !isAuthenticated) {
            setShowLogin(true);
            setTapCount(0);
        }
        const timer = setTimeout(() => setTapCount(0), 2000);
        return () => clearTimeout(timer);
    }, [tapCount, isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            setShowLogin(false);
            setPassword('');
            setError(false);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    if (!isAuthenticated && !showLogin) {
        return (
            <div
                className="fixed bottom-4 left-4 z-[99999] w-8 h-8 opacity-0 hover:opacity-10 cursor-pointer"
                onClick={() => setTapCount(prev => prev + 1)}
            />
        );
    }

    if (showLogin) {
        return (
            <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Key className="w-5 h-5 text-blue-500" />
                        </div>
                        <h2 className="text-xl font-bold">Editor Login</h2>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                className={`w-full bg-zinc-100 dark:bg-zinc-800 border ${error ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-700'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                                placeholder="Enter password..."
                            />
                            {error && <p className="text-red-500 text-xs mt-2 font-medium">Incorrect password</p>}
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                            >
                                Unlock
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowLogin(false)}
                                className="px-6 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] animate-slideUp">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-700/50 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
                <div className="flex items-center px-3 border-r border-zinc-200 dark:border-zinc-700 mr-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Editor Mode</span>
                </div>

                <button
                    onClick={toggleEditMode}
                    className={`p-2 rounded-full transition-all ${isEditMode ? 'bg-blue-500 text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-60'}`}
                    title={isEditMode ? "Disable Editing" : "Enable Editing"}
                >
                    <PencilSquare className="w-5 h-5" />
                </button>

                <button
                    onClick={saveChanges}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95'}`}
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <ArrowDownTray className="w-4 h-4" />
                    )}
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>

                <button
                    onClick={() => window.location.reload()}
                    className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-60 transition-all"
                    title="Cancel Changes"
                >
                    <XMark className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
