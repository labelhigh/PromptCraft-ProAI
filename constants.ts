
import { Strategy, StrategyDefinition } from './types';

export const STRATEGIES: StrategyDefinition[] = [
  {
    id: Strategy.ZeroShot,
    name: '零樣本',
    description: '直接要求模型執行任務，不提供任何範例。',
    requires_input: false,
  },
  {
    id: Strategy.FewShot,
    name: '少樣本',
    description: '提供1至5個範例，引導模型的輸出格式與風格。',
    requires_input: true,
  },
  {
    id: Strategy.ChainOfThought,
    name: '思維鏈 (CoT)',
    description: '引導模型「一步一步思考」，以處理複雜的推理任務。',
    requires_input: false,
  },
  {
    id: Strategy.RolePrompting,
    name: '角色扮演',
    description: '定義 AI 的人格 (角色、語氣、目標對象) 來框架回應。',
    requires_input: true,
  },
  {
    id: Strategy.SystemPrompting,
    name: '系統指令',
    description: '加入關於輸出格式或其他限制的嚴格說明。',
    requires_input: true,
  },
  {
    id: Strategy.StepBack,
    name: '回溯提示',
    description: '在回答特定問題前，先要求模型從更廣泛的概念進行概括。',
    requires_input: false,
  },
];
