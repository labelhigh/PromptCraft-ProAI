import { GoogleGenAI } from "@google/genai";
import { AIAssistableField } from "../types";

// Cache the AI instance to avoid re-creating it on every call with the same key.
let aiInstance: GoogleGenAI | null = null;
let cachedApiKey: string | null = null;

const getAiClient = (apiKey: string): GoogleGenAI => {
    if (!apiKey) {
        throw new Error("API 金鑰未設定。請在設定中輸入您的 Gemini API 金鑰。");
    }
    if (aiInstance && cachedApiKey === apiKey) {
        return aiInstance;
    }
    aiInstance = new GoogleGenAI({ apiKey });
    cachedApiKey = apiKey;
    return aiInstance;
};


const callGemini = async (prompt: string, apiKey: string): Promise<string> => {
    try {
        const ai = getAiClient(apiKey);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            // Check for common API key errors
            if (error.message.includes('API key not valid')) {
                 throw new Error(`您的 API 金鑰無效，請檢查後再試一次。`);
            }
            throw new Error(`與 AI 服務通訊時發生錯誤: ${error.message}`);
        }
        throw new Error("與 AI 服務通訊時發生未知錯誤。");
    }
}


export const getStrategySuggestion = async (coreConcept: string, apiKey: string): Promise<string> => {
    const prompt = `分析以下使用者請求，並從此清單中推薦最適合的提示詞工程策略：零樣本、少樣本、思維鏈、角色扮演、系統指令、回溯提示。請用 2-3 句話簡要解釋您的理由。

使用者請求：「${coreConcept}」`;

    return callGemini(prompt, apiKey);
};

export const enhanceCoreConcept = async (coreConcept: string, apiKey: string): Promise<string> => {
    const prompt = `重寫並增強以下使用者提供的文字，使其成為一個更清晰、更具體、對大型語言模型更有效的提示詞。請增加細節、消除歧義，並調整其結構以獲得更好的 AI 回應。僅回傳優化後的提示詞，不要包含任何額外的前言或標籤。

原始文字：「${coreConcept}」

優化後的提示詞：`;
    
    return callGemini(prompt, apiKey);
};

interface AIAssistContext {
    coreConcept: string;
    role?: string;
    tone?: string;
    audience?: string;
    format?: string;
    constraints?: string;
}

export const getAIAssistanceForField = async (
    field: AIAssistableField,
    context: AIAssistContext,
    apiKey: string
): Promise<string> => {
    let prompt = '';
    switch (field) {
        case 'role':
            prompt = `根據以下核心概念，為 AI 助理建議一個最適合的專家角色。請僅回傳角色名稱 (例如："資深數據分析師" 或 "創意文案寫手")。\n\n核心概念：「${context.coreConcept}」`;
            break;
        case 'tone':
            prompt = `考量 AI 的角色是「${context.role || '專家'}」且目標對象是「${context.audience || '一般大眾'}」，請建議一個最適合的溝通語氣。請僅回傳語氣描述 (例如："專業且具權威性" 或 "親切且鼓勵人心")。\n\n核心概念：「${context.coreConcept}」`;
            break;
        case 'audience':
            prompt = `考量 AI 的角色是「${context.role || '專家'}」，請建議與之互動的目標對象。請僅回傳目標對象的描述 (例如："行銷部門主管" 或 "程式設計初學者")。\n\n核心概念：「${context.coreConcept}」`;
            break;
        case 'format':
            prompt = `根據以下核心概念，建議一個最適合的結構化輸出格式。請僅回傳格式描述 (例如："包含 '優點' 和 '範例' 鍵的 JSON 物件" 或 "使用 Markdown 標題和項目符號清單")。\n\n核心概念：「${context.coreConcept}」`;
            break;
        case 'constraints':
            prompt = `根據以下核心概念和輸出格式，建議一條清晰的限制條件。請僅回傳限制條件文字 (例如："總字數不超過 200 字" 或 "確保程式碼範例可直接執行")。\n\n核心概念：「${context.coreConcept}」\n輸出格式：「${context.format || '無特定格式'}」`;
            break;
        default:
            return '';
    }
    return callGemini(prompt, apiKey);
}
