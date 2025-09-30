import React, { useRef, useEffect } from 'react';
import { AssistantMessage, MessageSender } from '../types';
import { SparklesIcon } from './Icons';


interface AssistantPanelProps {
    messages: AssistantMessage[];
    isLoading: boolean;
    onAction: (action: 'suggest' | 'optimize') => void;
    hasCoreConcept: boolean;
}

const AssistantPanel: React.FC<AssistantPanelProps> = ({ messages, isLoading, onAction, hasCoreConcept }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);
    
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col flex-grow shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2 flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-cyan-400" />
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">3. AI 助理</span>
            </h2>
            <div className="flex-grow bg-slate-900 rounded-md p-3 overflow-y-auto mb-3 border border-slate-700 min-h-[200px]">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === MessageSender.User ? 'justify-end' : ''}`}>
                            {msg.sender === MessageSender.AI && <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-white"/></div>}
                            <div className={`max-w-md p-3 rounded-lg ${msg.sender === MessageSender.AI ? 'bg-slate-700 text-slate-200' : 'bg-blue-600 text-white'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                     <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
                <button 
                    onClick={() => onAction('suggest')}
                    disabled={isLoading || !hasCoreConcept}
                    className="flex-1 text-sm py-2 px-4 bg-cyan-600 hover:bg-cyan-500 rounded-md text-white transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    建議策略
                </button>
                <button
                    onClick={() => onAction('optimize')}
                    disabled={isLoading || !hasCoreConcept}
                    className="flex-1 text-sm py-2 px-4 bg-purple-600 hover:bg-purple-500 rounded-md text-white transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                    優化概念
                </button>
            </div>
        </div>
    );
};

export default AssistantPanel;