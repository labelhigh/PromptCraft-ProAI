export enum Strategy {
  ZeroShot = 'Zero-Shot',
  FewShot = 'Few-Shot',
  ChainOfThought = 'Chain-of-Thought',
  RolePrompting = 'Role-Prompting',
  SystemPrompting = 'System-Prompting',
  StepBack = 'Step-Back',
}

export interface FewShotExample {
  id: string;
  input: string;
  output: string;
  inputLabel?: string;
  outputLabel?: string;
}

export interface RolePromptingInputs {
  role: string;
  tone: string;
  audience: string;
}

export interface SystemPromptingInputs {
  format: string;
  constraints: string;
}

export type StrategyInputs = {
  [Strategy.FewShot]?: FewShotExample[];
  [Strategy.RolePrompting]?: RolePromptingInputs;
  [Strategy.SystemPrompting]?: SystemPromptingInputs;
};

export interface StrategyDefinition {
  id: Strategy;
  name: string;
  description: string;
  requires_input: boolean;
}

export enum MessageSender {
  User = 'user',
  AI = 'ai',
}

export interface AssistantMessage {
  id: string;
  sender: MessageSender;
  text: string;
  isLoading?: boolean;
}

export type AIAssistableField = 'coreConcept' | 'role' | 'tone' | 'audience' | 'format' | 'constraints';
