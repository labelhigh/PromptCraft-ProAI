import React from 'react';
import { SparklesIcon, ArrowPathIcon, KeyIcon } from './Icons';

interface HeaderProps {
    onClearAll: () => void;
    onOpenApiKeyModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClearAll, onOpenApiKeyModal }) => {
    return (
        <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-700">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100">PromptCraft Pro (提示詞工藝專家)</h1>
                        <p className="text-sm text-slate-400">AI 輔助提示詞工程工作區</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <button
                            onClick={onOpenApiKeyModal}
                            aria-label="設定 API 金鑰"
                            aria-describedby="tooltip-apikey"
                            className="flex items-center gap-2 text-sm py-2 px-4 bg-slate-700/50 hover:bg-slate-700 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <KeyIcon className="w-5 h-5" />
                            <span>API 金鑰</span>
                        </button>
                        <div
                            id="tooltip-apikey"
                            role="tooltip"
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                        >
                            輸入您的 Google Gemini API 金鑰
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-950"></div>
                        </div>
                    </div>
                    <div className="relative group">
                        <button
                            onClick={onClearAll}
                            aria-label="清除所有輸入"
                            aria-describedby="tooltip-clear"
                            className="flex items-center gap-2 text-sm py-2 px-4 bg-slate-700/50 hover:bg-slate-700 rounded-md text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                            <span>清除所有</span>
                        </button>
                         <div
                            id="tooltip-clear"
                            role="tooltip"
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                        >
                            清除所有輸入並重設為預設值
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-950"></div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
