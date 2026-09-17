import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage, AgentStage, AgentExtractedContext, ScenarioTemplate, AgentDraft } from '../types';
import { SCENARIO_TEMPLATES } from '../data/scenarios';

interface AgentChatProps {
  messages: ChatMessage[];
  currentStage: AgentStage;
  stageTitle: string;
  isThinking: boolean;
  onSendMessage: (content: string) => void;
  onRequestDraftNow: () => void;
  onSelectScenario: (scenario: ScenarioTemplate) => void;
  extractedContext: AgentExtractedContext;
  hasDraft: boolean;
  currentDraft?: AgentDraft | null;
  onViewCanvas?: () => void;
  onReviseDraft?: (directive: string) => void;
}

const STAGE_STEPS: { stage: AgentStage; label: string; desc: string }[] = [
  { stage: 1, label: 'Identity & Feelings', desc: 'Who it is & emotional pressure' },
  { stage: 2, label: 'Context & Events', desc: 'What happened & history' },
  { stage: 3, label: 'Conflict Cause', desc: 'Why the tension occurred' },
  { stage: 4, label: 'Goals & Boundaries', desc: 'What you need to accomplish' },
  { stage: 5, label: 'Letter Draft', desc: 'Crafting the authentic letter' },
  { stage: 6, label: 'Check & Revise', desc: 'Refining tone and boundaries' },
];

export const AgentChat: React.FC<AgentChatProps> = ({
  messages,
  currentStage,
  stageTitle,
  isThinking,
  onSendMessage,
  onRequestDraftNow,
  onSelectScenario,
  extractedContext,
  hasDraft,
  currentDraft,
  onViewCanvas,
  onReviseDraft,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyDraft = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraftId(id);
    setTimeout(() => setCopiedDraftId(null), 2500);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isThinking) return;
    onSendMessage(trimmed);
    setInputValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isThinking) return;
    onSendMessage(suggestion);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    // Auto adjust height
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  // Check if user has engaged
  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <div className="ds-panel flex flex-col h-full min-h-0 overflow-hidden">
      {/* Stage Stepper Header */}
      <div className="ds-panel-bar shrink-0 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="ds-step-badge inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold">
              {currentStage}
            </span>
            <span className="ds-kicker px-1.5 py-0.5">
              {stageTitle || 'Interaction Loop'}
            </span>
          </div>
          <span className="ds-mono text-[11px] text-blue-700 font-medium">
            Step {currentStage} of 6
          </span>
        </div>

        {/* 6 Step Bar */}
        <div className="grid grid-cols-6 gap-1.5">
          {STAGE_STEPS.map((step) => {
            const isCompleted = step.stage < currentStage;
            const isCurrent = step.stage === currentStage;
            return (
              <div key={step.stage} className="flex flex-col items-center group relative">
                <div
                  data-complete={isCompleted}
                  data-current={isCurrent}
                  className="ds-progress-track w-full transition-all duration-300"
                />
                <span
                  className={`text-[10px] mt-1 truncate max-w-full font-medium ${
                    isCurrent
                      ? 'text-stone-900 font-semibold'
                      : isCompleted
                      ? 'text-stone-600'
                      : 'text-stone-400'
                  }`}
                >
                  {step.label.split(' ')[0]}
                </span>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 px-2 py-1 bg-stone-900 text-stone-100 text-[10px] rounded-md shadow-md whitespace-nowrap pointer-events-none">
                  <div className="font-semibold">{step.label}</div>
                  <div className="text-stone-400">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 overscroll-contain">
        {messages.map((msg, index) => {
          const isAssistant = msg.role === 'assistant';
          const isLast = index === messages.length - 1;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`flex items-start max-w-[92%] sm:max-w-[85%] space-x-2.5 ${
                  isAssistant ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
                    isAssistant
                      ? 'bg-stone-900 text-amber-300 ring-2 ring-stone-200'
                      : 'bg-stone-700 text-stone-100'
                  }`}
                >
                  {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Content */}
                <div
                  className={`${isAssistant ? 'ds-assistant-message' : 'ds-user-message'} px-4 py-3 text-sm leading-relaxed`}
                >
                  {/* Assistant Tag */}
                  {isAssistant && (
                    <div className="flex items-center space-x-1.5 mb-1.5 text-[11px] font-semibold text-stone-600">
                      <span>Therapeutic Letter Writer</span>
                      <span className="text-stone-400">•</span>
                      <span className="text-stone-500 font-normal">Supportive & Non-judgmental</span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  {/* If draft is attached to this message, or if it's the latest assistant message in drafting stage with active draft */}
                  {(() => {
                    const draftToShow =
                      msg.draft ||
                      (isAssistant && isLast && currentDraft && (msg.stage === 5 || msg.stage === 6 || currentStage >= 5)
                        ? currentDraft
                        : null);

                    if (!draftToShow || !draftToShow.formattedMessage) return null;

                    const isCopied = copiedDraftId === draftToShow.id;

                    return (
                      <div className="mt-3.5 pt-3 border-t border-stone-200/80">
                        <div className="ds-card p-3.5 sm:p-4 text-stone-800 space-y-3">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="ds-kicker px-2 py-0.5">
                                <FileText className="w-3 h-3 mr-1" />
                                {draftToShow.title || 'Generated Letter Draft'}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium border border-stone-200">
                                {draftToShow.format.replace('_', ' ')}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopyDraft(draftToShow.formattedMessage, draftToShow.id)}
                                className="ds-small-button px-2 py-1 text-xs flex items-center space-x-1 cursor-pointer"
                                title="Copy letter to clipboard"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-[11px] text-emerald-700 font-medium">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                                    <span className="text-[11px]">Copy</span>
                                  </>
                                )}
                              </button>

                              {onViewCanvas && (
                                <button
                                  type="button"
                                  onClick={onViewCanvas}
                                  className="ds-primary-button px-2.5 py-1 text-[11px] flex items-center space-x-1 cursor-pointer"
                                >
                                  <span>Open Full Canvas</span>
                                  <ExternalLink className="w-3 h-3 text-stone-300" />
                                </button>
                              )}
                            </div>
                          </div>

                          {draftToShow.subjectLine && (
                            <div className="text-xs font-semibold text-stone-800 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200/80">
                              <span className="text-stone-400 font-normal mr-1.5">Subject:</span>
                              {draftToShow.subjectLine}
                            </div>
                          )}

                          <div className="ds-document p-3.5 font-serif text-sm text-stone-900 leading-relaxed whitespace-pre-wrap">
                            {draftToShow.formattedMessage}
                          </div>

                          {draftToShow.strategyExplanation && (
                            <div className="ds-highlight text-xs p-2.5 flex items-start space-x-2">
                              <Sparkles className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-amber-900">Why this works: </span>
                                <span className="text-stone-700 leading-relaxed">{draftToShow.strategyExplanation}</span>
                              </div>
                            </div>
                          )}

                          {onReviseDraft && (
                            <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-1.5 items-center">
                              <span className="text-[11px] text-stone-400 mr-1">Quick adjust:</span>
                              <button
                                type="button"
                                onClick={() => onReviseDraft('Make the tone slightly softer and more approachable')}
                                className="ds-chip text-[11px] px-2 py-0.5 cursor-pointer"
                              >
                                Softer tone
                              </button>
                              <button
                                type="button"
                                onClick={() => onReviseDraft('Make boundaries clearer and firmer without hostility')}
                                className="ds-chip text-[11px] px-2 py-0.5 cursor-pointer"
                              >
                                Firmer boundary
                              </button>
                              <button
                                type="button"
                                onClick={() => onReviseDraft('Shorten and adapt into a concise text message')}
                                className="ds-chip text-[11px] px-2 py-0.5 cursor-pointer"
                              >
                                Shorten for SMS
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Suggested quick replies (rendered below last assistant message) */}
              {isAssistant && isLast && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                <div className="mt-3 ml-10 flex flex-wrap gap-2 max-w-[88%]">
                  <span className="text-[11px] text-stone-400 font-medium self-center mr-1">
                    Quick reply:
                  </span>
                  {msg.suggestedReplies.map((reply, rIdx) => (
                    <button
                      key={rIdx}
                      type="button"
                      onClick={() => handleSuggestionClick(reply)}
                      disabled={isThinking}
                      className="ds-chip text-xs px-3 py-1.5 text-left cursor-pointer flex items-center space-x-1"
                    >
                      <span>{reply}</span>
                      <ArrowRight className="w-3 h-3 text-stone-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing / Thinking Indicator */}
        {isThinking && (
          <div className="flex items-start space-x-2.5 max-w-[85%]">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center shrink-0 ring-2 ring-stone-200">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-stone-100 border border-stone-200 text-stone-600 text-xs flex items-center space-x-2 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Reflecting and checking details with care...</span>
            </div>
          </div>
        )}

        {/* Preset Starters Banner (only when starting fresh) */}
        {!hasUserMessages && (
          <div className="mt-4 pt-4 border-t border-stone-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700">
                Or pick a scenario to explore how the agent works:
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCENARIO_TEMPLATES.slice(0, 4).map((scenario) => (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => onSelectScenario(scenario)}
                  className="ds-card p-2.5 text-left group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-stone-900 group-hover:text-amber-700">
                      {scenario.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-600 border border-stone-200">
                      {scenario.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                    {scenario.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-3 sm:p-4 bg-white border-t border-blue-600">
        {/* Action bar above input */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center space-x-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
            <span>Supportive communication • Safe to express uncertainty</span>
          </div>

          {hasUserMessages && (
            <button
              type="button"
              onClick={onRequestDraftNow}
              disabled={isThinking}
              className="inline-flex items-center text-xs font-medium text-blue-700 hover:text-black hover:underline cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
              {hasDraft ? 'Regenerate draft now' : 'Draft letter with what we have'}
            </button>
          )}
        </div>

        {/* Textarea Input */}
        <div className="ds-input-frame relative flex items-end transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Share what happened, how you feel, or who this is about... (Shift+Enter for new line)"
            disabled={isThinking}
            className="ds-input w-full py-3 pl-3.5 pr-12 text-sm bg-transparent resize-none focus:outline-none min-h-[44px] max-h-[140px]"
          />
          <button
            type="button"
            id="btn-send-agent-message"
            onClick={handleSend}
            disabled={!inputValue.trim() || isThinking}
            className="ds-icon-button absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center cursor-pointer"
            title="Send message (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
