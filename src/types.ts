export type RelationshipType =
  | 'classmate_peer'
  | 'romantic_partner'
  | 'family_parent_sibling'
  | 'close_friend'
  | 'coworker_manager'
  | 'roommate'
  | 'ex_partner'
  | 'in_law_extended_family'
  | 'other';

export type CommunicationGoal =
  | 'express_feelings'
  | 'set_boundary'
  | 'apologize_or_amend'
  | 'resolve_misunderstanding'
  | 'request_space'
  | 'reconnect'
  | 'ask_clarification'
  | 'end_or_transition'
  | 'address_academic_conflict';

export type MessageFormat =
  | 'personal_letter'
  | 'email'
  | 'text_message'
  | 'brief_note';

export type CommunicationTone =
  | 'honest_gentle'
  | 'firm_clear'
  | 'calm_deescalated'
  | 'warm_accountable'
  | 'neutral_direct'
  | 'heartfelt_receptive';

export type AgentStage = 1 | 2 | 3 | 4 | 5 | 6;

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
  stage?: AgentStage;
  suggestedReplies?: string[];
  draft?: AgentDraft;
}

export interface AgentExtractedContext {
  recipientName?: string;
  relationship?: string;
  whatHappened?: string;
  userFeelings?: string;
  conflictCause?: string;
  userNeedsAndWants?: string;
  communicationGoal?: string;
  desiredOutcome?: string;
  boundariesAndConstraints?: string;
}

export interface FactAssumptionNote {
  thought: string;
  translation: string;
  whyItDeescalates: string;
}

export interface BoundaryPreserved {
  boundary: string;
  howPreserved: string;
}

export interface AgentDraft {
  id: string;
  title: string;
  formattedMessage: string;
  format: MessageFormat;
  tone: CommunicationTone;
  subjectLine?: string;
  salutation?: string;
  closing?: string;
  strategyExplanation: string;
  howItMayBeReceived: string;
  factAssumptionNotes: FactAssumptionNote[];
  boundariesPreserved: BoundaryPreserved[];
  wordCount: number;
  readingTimeSeconds: number;
  createdAt: number;
}

export interface ScenarioTemplate {
  id: string;
  title: string;
  tag: string;
  description: string;
  initialUserMessage: string;
  context: Partial<AgentExtractedContext>;
}
