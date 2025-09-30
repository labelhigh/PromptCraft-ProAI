import React from 'react';
import { SparklesIcon } from './Icons';

interface MainEditorProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onEnhance: () => void;
    isEnhancing: boolean;
}

const MainEditor: React.FC<MainEditorProps> = ({ value, onChange, onEnhance, isEnhancing }) => {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col flex-grow relative shadow-lg shadow-black/20">
            <div className="flex justify-between items-center mb-3">
                 <h2 className="text-lg font-semibold text-slate-100">
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">2. 撰寫您的核心概念</span>
                 </h2>
                 <button 
                    onClick={onEnhance} 
                    disabled={isEnhancing}
                    aria-label="使用 AI 增強核心概念"
                    className="text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    <SparklesIcon className={`w-6 h-6 ${isEnhancing ? 'animate-pulse' : ''}`} />
                </button>
            </div>
            <textarea
                value={value}
                onChange={onChange}
                placeholder="在此輸入您的核心概念、問題或內容..."
                className="w-full flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-base text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
            />
        </div>
    );
};

export default MainEditor;