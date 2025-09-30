import React, { useState } from 'react';
import { ClipboardIcon, DownloadIcon } from './Icons';

interface OutputPanelProps {
    prompt: string;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ prompt }) => {
    const [copyText, setCopyText] = useState('複製');

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt);
        setCopyText('已複製!');
        setTimeout(() => setCopyText('複製'), 2000);
    };

    const handleExport = () => {
        const blob = new Blob([prompt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompt.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col shadow-lg shadow-black/20">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-slate-100">
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">4. 已生成的提示詞</span>
                </h2>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="flex items-center gap-1.5 text-sm py-1 px-3 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors">
                       <ClipboardIcon className="w-4 h-4" /> {copyText}
                    </button>
                    <button onClick={handleExport} className="flex items-center gap-1.5 text-sm py-1 px-3 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors">
                        <DownloadIcon className="w-4 h-4" /> 匯出
                    </button>
                </div>
            </div>
            <pre className="w-full flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-sm text-slate-200 overflow-auto whitespace-pre-wrap font-mono min-h-[150px]">
                <code>{prompt}</code>
            </pre>
        </div>
    );
};

export default OutputPanel;