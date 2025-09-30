import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
    isOpen: boolean;
    currentApiKey: string | null;
    onClose: () => void;
    onSave: (key: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, currentApiKey, onClose, onSave }) => {
    const [key, setKey] = useState('');

    useEffect(() => {
        if (currentApiKey) {
            setKey(currentApiKey);
        } else {
            setKey('');
        }
    }, [currentApiKey, isOpen]);

    const handleSave = () => {
        onSave(key);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            aria-modal="true"
            role="dialog"
        >
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0px); opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
            `}</style>
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md m-4 p-6 animate-slide-up">
                <h2 className="text-xl font-bold text-slate-100 mb-4">輸入您的 Gemini API 金鑰</h2>
                <p className="text-sm text-slate-400 mb-4">
                    您的 API 金鑰將會安全地儲存在您的瀏覽器中，且不會傳送到我們的伺服器。
                    您可以從 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google AI Studio</a> 取得您的金鑰。
                </p>
                <input
                    type="password"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="在此貼上您的 API 金鑰"
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition mb-6"
                    aria-label="Gemini API Key Input"
                />
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="text-sm py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSave}
                        className="text-sm py-2 px-4 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white transition-colors"
                    >
                        儲存金鑰
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
