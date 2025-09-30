import React from 'react';
import { Strategy, StrategyDefinition, StrategyInputs, FewShotExample, RolePromptingInputs, SystemPromptingInputs, AIAssistableField } from '../types';
import { TrashIcon, SparklesIcon } from './Icons';

interface StrategyPanelProps {
    strategies: StrategyDefinition[];
    selectedStrategy: Strategy;
    onStrategyChange: (strategyId: Strategy) => void;
    strategyInputs: StrategyInputs;
    onFewShotChange: (examples: FewShotExample[]) => void;
    onRolePromptingChange: (inputs: RolePromptingInputs) => void;
    onSystemPromptingChange: (inputs: SystemPromptingInputs) => void;
    onAIAssist: (field: AIAssistableField) => void;
    enhancingField: AIAssistableField | null;
}

const fewShotTemplates: Record<string, FewShotExample[]> = {
    '問答': [
        { id: 'template-qa-1', inputLabel: '問題', outputLabel: '答案', input: '台灣最高的山是哪一座？', output: '玉山。' },
        { id: 'template-qa-2', inputLabel: '問題', outputLabel: '答案', input: '誰寫了《哈利波特》？', output: 'J.K. 羅琳。' },
    ],
    '摘要': [
        { id: 'template-summary-1', inputLabel: '文章', outputLabel: '摘要', input: '人工智慧（AI）是電腦科學的一個分支，旨在創建能夠執行通常需要人類智慧的任務的智慧代理。這些任務包括學習、推理、問題解決、感知和語言理解。 AI 可以分為兩大類：狹義 AI，專門用於執行特定任務；以及通用 AI (AGI)，具備執行任何人類能夠完成的智慧任務的能力。', output: 'AI 是電腦科學的一個分支，專注於創建能執行學習、推理和語言理解等需要人類智慧的任務的智慧代理，分為專門的狹義 AI 和具備通用能力的 AGI。' },
    ],
    '翻譯': [
        { id: 'template-translate-1', inputLabel: '原文', outputLabel: '譯文', input: 'Hello, world', output: 'Bonjour, le monde.' },
        { id: 'template-translate-2', inputLabel: '原文', outputLabel: '譯文', input: '我愛程式設計', output: 'I love programming.' },
    ]
};


const StrategyPanel: React.FC<StrategyPanelProps> = ({
    strategies,
    selectedStrategy,
    onStrategyChange,
    strategyInputs,
    onFewShotChange,
    onRolePromptingChange,
    onSystemPromptingChange,
    onAIAssist,
    enhancingField
}) => {
    
    const renderStrategyInputs = () => {
        const strategyDefinition = strategies.find(s => s.id === selectedStrategy);
        if (!strategyDefinition || !strategyDefinition.requires_input) {
            return null;
        }

        let content;
        switch (selectedStrategy) {
            case Strategy.FewShot:
                const examples = strategyInputs[Strategy.FewShot] || [];
                const handleExampleChange = (index: number, field: keyof Omit<FewShotExample, 'id'>, value: string) => {
                    const newExamples = [...examples];
                    newExamples[index] = { ...newExamples[index], [field]: value };
                    onFewShotChange(newExamples);
                };
                const addExample = () => {
                    onFewShotChange([...examples, { id: Date.now().toString(), inputLabel: '輸入', outputLabel: '輸出', input: '', output: '' }]);
                };
                const removeExample = (id: string) => {
                    onFewShotChange(examples.filter(ex => ex.id !== id));
                };

                const handleLoadTemplate = (templateName: string) => {
                    const template = fewShotTemplates[templateName];
                    if (template) {
                        onFewShotChange(template.map(t => ({...t, id: `template-${templateName}-${Math.random()}`})));
                    }
                };

                content = (
                    <div className="space-y-4">
                        <div className="p-3 bg-slate-900/50 rounded-md border border-slate-700">
                            <label className="block text-sm font-medium text-slate-400 mb-2">載入範本</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(fewShotTemplates).map(name => (
                                    <button
                                        key={name}
                                        onClick={() => handleLoadTemplate(name)}
                                        className="text-xs py-1 px-3 bg-slate-700 hover:bg-cyan-600 rounded-full text-slate-300 hover:text-white transition-colors"
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {examples.map((ex, index) => (
                            <div key={ex.id} className="p-3 bg-slate-800 rounded-md space-y-3 relative">
                                <button 
                                    onClick={() => removeExample(ex.id)}
                                    aria-label={`移除範例 ${index + 1}`}
                                    className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-1 rounded-full hover:bg-slate-700 transition-colors">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                                <label className="block text-sm font-medium text-slate-400">範例 {index + 1}</label>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder="輸入標籤"
                                        value={ex.inputLabel}
                                        onChange={(e) => handleExampleChange(index, 'inputLabel', e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                    />
                                    <input
                                        type="text"
                                        placeholder="輸出標籤"
                                        value={ex.outputLabel}
                                        onChange={(e) => handleExampleChange(index, 'outputLabel', e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-xs text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                    />
                                </div>

                                <textarea
                                    placeholder={ex.inputLabel || "輸入內容"}
                                    value={ex.input}
                                    onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                                    className="w-full h-16 bg-slate-700 border border-slate-600 rounded-md p-2 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                />
                                <textarea
                                    placeholder={ex.outputLabel || "輸出內容"}
                                    value={ex.output}
                                    onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                                    className="w-full h-16 bg-slate-700 border border-slate-600 rounded-md p-2 text-sm text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                />
                            </div>
                        ))}
                        <button onClick={addExample} className="w-full text-sm py-2 px-4 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors">
                            + 新增範例
                        </button>
                    </div>
                );
                break;
            case Strategy.RolePrompting:
                const inputs = strategyInputs[Strategy.RolePrompting] || { role: '', tone: '', audience: '' };
                const handleChange = (field: keyof RolePromptingInputs, value: string) => {
                    onRolePromptingChange({ ...inputs, [field]: value });
                };
                content = (
                    <div className="space-y-3">
                         <div className="relative">
                            <input type="text" placeholder="AI 角色 (例如：行銷專家)" value={inputs.role} onChange={e => handleChange('role', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition pr-10" />
                            <button onClick={() => onAIAssist('role')} disabled={!!enhancingField} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">
                                <SparklesIcon className={`w-5 h-5 ${enhancingField === 'role' ? 'animate-pulse' : ''}`} />
                            </button>
                         </div>
                         <div className="relative">
                             <input type="text" placeholder="語氣 (例如：專業、幽默)" value={inputs.tone} onChange={e => handleChange('tone', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition pr-10" />
                            <button onClick={() => onAIAssist('tone')} disabled={!!enhancingField} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">
                                <SparklesIcon className={`w-5 h-5 ${enhancingField === 'tone' ? 'animate-pulse' : ''}`} />
                            </button>
                         </div>
                         <div className="relative">
                             <input type="text" placeholder="目標對象 (例如：初學者)" value={inputs.audience} onChange={e => handleChange('audience', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition pr-10" />
                             <button onClick={() => onAIAssist('audience')} disabled={!!enhancingField} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">
                                <SparklesIcon className={`w-5 h-5 ${enhancingField === 'audience' ? 'animate-pulse' : ''}`} />
                            </button>
                         </div>
                    </div>
                );
                break;
            case Strategy.SystemPrompting:
                 const sysInputs = strategyInputs[Strategy.SystemPrompting] || { format: '', constraints: '' };
                 const handleSysChange = (field: keyof SystemPromptingInputs, value: string) => {
                    onSystemPromptingChange({ ...sysInputs, [field]: value });
                };
                content = (
                    <div className="space-y-3">
                        <div className="relative">
                           <input type="text" placeholder="輸出格式 (例如：JSON, Markdown)" value={sysInputs.format} onChange={e => handleSysChange('format', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition pr-10" />
                           <button onClick={() => onAIAssist('format')} disabled={!!enhancingField} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">
                                <SparklesIcon className={`w-5 h-5 ${enhancingField === 'format' ? 'animate-pulse' : ''}`} />
                            </button>
                        </div>
                        <div className="relative">
                            <textarea placeholder="限制條件 (例如：字數限制、風格指南)" value={sysInputs.constraints} onChange={e => handleSysChange('constraints', e.target.value)} className="w-full h-24 bg-slate-700 border border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition pr-10" />
                            <button onClick={() => onAIAssist('constraints')} disabled={!!enhancingField} className="absolute top-2 right-0 flex items-center px-3 text-slate-400 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors">
                                <SparklesIcon className={`w-5 h-5 ${enhancingField === 'constraints' ? 'animate-pulse' : ''}`} />
                            </button>
                        </div>
                    </div>
                );
                break;
            default:
                content = null;
        }

        return (
             <div className="mt-4 animate-[fadeIn_0.5s_ease-in-out]">
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
                {content}
            </div>
        )
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 h-min shadow-lg shadow-black/20">
            <h2 className="text-lg font-semibold text-slate-100 mb-3">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">1. 選擇策略</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {strategies.map(strategy => (
                    <div key={strategy.id} className="relative group flex">
                        <button
                            onClick={() => onStrategyChange(strategy.id)}
                            aria-describedby={`tooltip-${strategy.id}`}
                            className={`w-full h-full p-3 rounded-lg text-left transition-all duration-200 flex items-center ${selectedStrategy === strategy.id ? 'bg-cyan-600 text-white shadow-lg ring-2 ring-cyan-400' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}
                        >
                            <p className="font-semibold text-sm">{strategy.name}</p>
                        </button>
                        <div
                            id={`tooltip-${strategy.id}`}
                            role="tooltip"
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20"
                        >
                            {strategy.description}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-950"></div>
                        </div>
                    </div>
                ))}
            </div>
            {renderStrategyInputs()}
        </div>
    );
};

export default StrategyPanel;