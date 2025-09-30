import { Strategy, StrategyInputs, FewShotExample } from '../types';

export const buildPrompt = (coreConcept: string, strategy: Strategy, inputs: StrategyInputs): string => {
    switch (strategy) {
        case Strategy.ZeroShot:
            return coreConcept;

        case Strategy.FewShot:
            const examples = inputs[Strategy.FewShot] || [];

            // If there are no examples, it behaves like Zero-Shot.
            if (examples.length === 0) {
                return coreConcept;
            }
            
            const exampleText = examples
                .map(ex => {
                    // Use trimmed labels if they exist for clean formatting.
                    const cleanInputLabel = ex.inputLabel?.trim();
                    const cleanOutputLabel = ex.outputLabel?.trim();
                    const inputLine = cleanInputLabel ? `${cleanInputLabel}: ${ex.input}` : ex.input;
                    const outputLine = cleanOutputLabel ? `${cleanOutputLabel}: ${ex.output}` : ex.output;
                    return `${inputLine}\n${outputLine}`;
                })
                .join('\n\n');

            // Use the labels from the last example to format the final prompt.
            const lastExample = examples[examples.length - 1];
            const finalInputLabel = lastExample.inputLabel?.trim();
            const finalOutputLabel = lastExample.outputLabel?.trim();

            const finalInputLine = finalInputLabel 
                ? `${finalInputLabel}: ${coreConcept}` 
                : coreConcept;

            const finalOutputLine = finalOutputLabel
                ? `\n${finalOutputLabel}:`
                : "";

            return `${exampleText}\n\n${finalInputLine}${finalOutputLine}`;

        case Strategy.ChainOfThought:
            return `${coreConcept}\n\n讓我們一步一步地思考。`;

        case Strategy.RolePrompting:
            const { role, tone, audience } = inputs[Strategy.RolePrompting] || { role: '[角色]', tone: '[語氣]', audience: '[目標對象]' };
            return `扮演一位 ${role}。請以 ${tone} 的語氣，向 ${audience} 回應。\n\n任務：\n${coreConcept}`;

        case Strategy.SystemPrompting:
            const { format, constraints } = inputs[Strategy.SystemPrompting] || { format: '[格式]', constraints: '[限制條件]' };
            return `系統指令：\n- 輸出格式必須是： ${format}\n- 請遵守以下限制： ${constraints}\n\n使用者提示：\n${coreConcept}`;

        case Strategy.StepBack:
            return `在回答具體問題之前，請先解釋與其相關的更廣泛的概念和原則。然後，運用這些原則來詳細回答以下問題。\n\n問題： ${coreConcept}`;
            
        default:
            return coreConcept;
    }
};