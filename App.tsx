
import React, { useState, useEffect, useCallback } from 'react';
import { Strategy, StrategyInputs, FewShotExample, AssistantMessage, MessageSender, AIAssistableField, RolePromptingInputs, SystemPromptingInputs } from './types';
import { STRATEGIES, DEMO_API_KEY } from './constants';
import Header from './components/Header';
import StrategyPanel from './components/StrategyPanel';
import MainEditor from './components/MainEditor';
import OutputPanel from './components/OutputPanel';
import AssistantPanel from './components/AssistantPanel';
import ApiKeyModal from './components/ApiKeyModal';
import { buildPrompt } from './services/promptBuilder';
import { getStrategySuggestion, enhanceCoreConcept, getAIAssistanceForField } from './services/geminiService';

const initialAssistantMessage: AssistantMessage = { id: '1', sender: MessageSender.AI, text: '您好！我是您的 AI 助理。請先點擊右上角的「API 金鑰」按鈕來設定您的 Google Gemini API 金鑰。' };

const initialStrategyInputs: StrategyInputs = {
    [Strategy.FewShot]: [],
    [Strategy.RolePrompting]: { role: '', tone: '', audience: '' },
    [Strategy.SystemPrompting]: { format: '', constraints: '' }
};


const App: React.FC = () => {
    const [coreConcept, setCoreConcept] = useState<string>("");
    const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(Strategy.ZeroShot);
    const [strategyInputs, setStrategyInputs] = useState<StrategyInputs>(initialStrategyInputs);
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
    const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);
    const [isAssistantLoading, setIsAssistantLoading] = useState<boolean>(false);
    const [enhancingField, setEnhancingField] = useState<AIAssistableField | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

    useEffect(() => {
        const storedApiKey = localStorage.getItem('gemini_api_key');
        if (storedApiKey) {
            setApiKey(storedApiKey);
            setAssistantMessages([{ id: '1', sender: MessageSender.AI, text: '您好！我是您的 AI 助理。今天我該如何協助您打造完美的提示詞呢？' }]);
        } else {
            // No key found, automatically set up the demo key for a seamless first-time experience.
            setApiKey(DEMO_API_KEY);
            localStorage.setItem('gemini_api_key', DEMO_API_KEY);
            setAssistantMessages([{ 
                id: '1', 
                sender: MessageSender.AI, 
                text: '您好！為了讓您快速開始，系統已自動為您載入 DEMO 金鑰。\n\n您可以立即開始使用 AI 助理，或點擊右上角的「API 金鑰」按鈕來更換成您自己的金鑰。' 
            }]);
        }
    }, []);

    const handleSaveApiKey = (key: string) => {
        const trimmedKey = key.trim();
        setApiKey(trimmedKey);
        localStorage.setItem('gemini_api_key', trimmedKey);
        if(assistantMessages.length > 0 && assistantMessages[0].id === '1' && !apiKey) {
           setAssistantMessages([{ id: '1', sender: MessageSender.AI, text: 'API 金鑰已設定！現在您可以開始使用 AI 助理功能了。' }]);
        }
    };


    useEffect(() => {
        const prompt = buildPrompt(coreConcept, selectedStrategy, strategyInputs);
        setGeneratedPrompt(prompt);
    }, [coreConcept, selectedStrategy, strategyInputs]);

    const handleStrategyChange = (strategyId: Strategy) => {
        setSelectedStrategy(strategyId);
    };

    const handleFewShotChange = (examples: FewShotExample[]) => {
        setStrategyInputs(prev => ({ ...prev, [Strategy.FewShot]: examples }));
    };


    const handleRolePromptingChange = (newInputs: RolePromptingInputs) => {
        setStrategyInputs(prev => ({ ...prev, [Strategy.RolePrompting]: newInputs }));
    }

    const handleSystemPromptingChange = (newInputs: SystemPromptingInputs) => {
        setStrategyInputs(prev => ({ ...prev, [Strategy.SystemPrompting]: newInputs }));
    }

    const handleAssistantAction = useCallback(async (action: 'suggest' | 'optimize') => {
        if (isAssistantLoading || !coreConcept.trim()) return;

        if (!apiKey) {
            const aiError: AssistantMessage = { id: Date.now().toString(), sender: MessageSender.AI, text: '請先點擊右上角的「API 金鑰」按鈕來設定您的 API 金鑰。' };
            setAssistantMessages(prev => [...prev, aiError]);
            setIsApiKeyModalOpen(true);
            return;
        }

        const userMessageText = action === 'suggest' ? '為我的想法建議一個策略。' : '優化我的核心概念。';
        const userMessage: AssistantMessage = { id: Date.now().toString(), sender: MessageSender.User, text: userMessageText };
        
        setAssistantMessages(prev => [...prev, userMessage]);
        setIsAssistantLoading(true);

        const loadingMessageId = (Date.now() + 1).toString();
        setAssistantMessages(prev => [...prev, { id: loadingMessageId, sender: MessageSender.AI, text: "思考中...", isLoading: true }]);

        try {
            const aiResponseText = action === 'suggest'
                ? await getStrategySuggestion(coreConcept, apiKey)
                : await enhanceCoreConcept(coreConcept, apiKey);

            const aiMessage: AssistantMessage = { id: (Date.now() + 2).toString(), sender: MessageSender.AI, text: aiResponseText };
            
            setAssistantMessages(prev => prev.filter(m => m.id !== loadingMessageId).concat(aiMessage));

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
            const aiError: AssistantMessage = { id: (Date.now() + 2).toString(), sender: MessageSender.AI, text: `抱歉，我遇到一個錯誤： ${errorMessage}` };
            setAssistantMessages(prev => prev.filter(m => m.id !== loadingMessageId).concat(aiError));
        } finally {
            setIsAssistantLoading(false);
        }
    }, [coreConcept, isAssistantLoading, apiKey]);

    const handleAIAssist = useCallback(async (field: AIAssistableField) => {
        if (enhancingField) return;

        if (!apiKey) {
            const aiError: AssistantMessage = { id: Date.now().toString(), sender: MessageSender.AI, text: '請先點擊右上角的「API 金鑰」按鈕來設定您的 API 金鑰。' };
            setAssistantMessages(prev => [...prev, aiError]);
            setIsApiKeyModalOpen(true);
            return;
        }

        setEnhancingField(field);
        try {
            let response: string;
            const currentRoleInputs = strategyInputs[Strategy.RolePrompting] || { role: '', tone: '', audience: ''};
            const currentSystemInputs = strategyInputs[Strategy.SystemPrompting] || { format: '', constraints: ''};

            if (field === 'coreConcept') {
                response = await enhanceCoreConcept(coreConcept, apiKey);
                setCoreConcept(response);
            } else {
                 response = await getAIAssistanceForField(field, {
                    coreConcept,
                    ...currentRoleInputs,
                    ...currentSystemInputs,
                }, apiKey);

                switch(field) {
                    case 'role':
                        handleRolePromptingChange({ ...currentRoleInputs, role: response });
                        break;
                    case 'tone':
                        handleRolePromptingChange({ ...currentRoleInputs, tone: response });
                        break;
                    case 'audience':
                        handleRolePromptingChange({ ...currentRoleInputs, audience: response });
                        break;
                    case 'format':
                        handleSystemPromptingChange({ ...currentSystemInputs, format: response });
                        break;
                    case 'constraints':
                        handleSystemPromptingChange({ ...currentSystemInputs, constraints: response });
                        break;
                }
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "發生未知錯誤。";
            const aiError: AssistantMessage = { id: (Date.now() + 2).toString(), sender: MessageSender.AI, text: `抱歉，為欄位 "${field}" 提供建議時發生錯誤： ${errorMessage}` };
            setAssistantMessages(prev => [...prev, aiError]);
        } finally {
            setEnhancingField(null);
        }
    }, [enhancingField, coreConcept, strategyInputs, apiKey]);

    const handleClearAll = () => {
        if (window.confirm("您確定要清除所有內容嗎？此操作無法復原。")) {
            setCoreConcept('');
            setSelectedStrategy(Strategy.ZeroShot);
            setStrategyInputs(initialStrategyInputs);
            setAssistantMessages([{ id: '1', sender: MessageSender.AI, text: '已清除所有內容。' }]);
            
             if (apiKey && window.confirm("您是否也要清除已儲存的 API 金鑰？")) {
                setApiKey(null);
                localStorage.removeItem('gemini_api_key');
                setAssistantMessages([initialAssistantMessage]);
            }
        }
    };


    return (
        <>
            <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
                <Header onClearAll={handleClearAll} />
                <main className="flex-grow p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-screen-2xl w-full mx-auto">
                    <div className="flex flex-col gap-6">
                        <StrategyPanel
                            strategies={STRATEGIES}
                            selectedStrategy={selectedStrategy}
                            onStrategyChange={handleStrategyChange}
                            strategyInputs={strategyInputs}
                            onFewShotChange={handleFewShotChange}
                            onRolePromptingChange={handleRolePromptingChange}
                            onSystemPromptingChange={handleSystemPromptingChange}
                            onAIAssist={handleAIAssist}
                            enhancingField={enhancingField}
                        />
                        <MainEditor
                            value={coreConcept}
                            onChange={e => setCoreConcept(e.target.value)}
                            onEnhance={() => handleAIAssist('coreConcept')}
                            isEnhancing={enhancingField === 'coreConcept'}
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        <OutputPanel prompt={generatedPrompt} />
                        <AssistantPanel
                            messages={assistantMessages}
                            isLoading={isAssistantLoading}
                            onAction={handleAssistantAction}
                            hasCoreConcept={!!coreConcept.trim()}
                        />
                    </div>
                </main>
            </div>
            <ApiKeyModal
                isOpen={isApiKeyModalOpen}
                currentApiKey={apiKey}
                onClose={() => setIsApiKeyModalOpen(false)}
                onSave={handleSaveApiKey}
            />
        </>
    );
};

export default App;
