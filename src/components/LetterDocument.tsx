import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Printer,
  Edit3,
  Eye,
  Sparkles,
  ShieldAlert,
  Compass,
  FileText,
  Mail,
  MessageSquare,
  StickyNote,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import {
  AgentDraft,
  AgentExtractedContext,
  MessageFormat,
  CommunicationTone,
  AgentStage,
} from '../types';

interface LetterDocumentProps {
  draft: AgentDraft | null;
  extractedContext: AgentExtractedContext;
  currentStage: AgentStage;
  isRevising: boolean;
  onReviseDraft: (directive: string, customFeedback?: string) => void;
  onRequestDraftNow: () => void;
  onUpdateDraftContent: (newContent: string) => void;
  onSaveDraft: (draft: AgentDraft) => void;
  isDraftSaved: boolean;
}

const FORMAT_ICONS: Record<MessageFormat, React.FC<{ className?: string }>> = {
  personal_letter: FileText,
  email: Mail,
  text_message: MessageSquare,
  brief_note: StickyNote,
};

const FORMAT_LABELS: Record<MessageFormat, string> = {
  personal_letter: 'Personal Letter',
  email: 'Email',
  text_message: 'Text Message',
  brief_note: 'Brief Note',
};

const TONE_LABELS: Record<CommunicationTone, string> = {
  honest_gentle: 'Honest & Gentle',
  firm_clear: 'Firm & Clear Boundaries',
  calm_deescalated: 'Calm & De-escalated',
  warm_accountable: 'Warm & Accountable',
  neutral_direct: 'Neutral & Direct',
  heartfelt_receptive: 'Heartfelt & Receptive',
};

export const LetterDocument: React.FC<LetterDocumentProps> = ({
  draft,
  extractedContext,
  currentStage,
  isRevising,
  onReviseDraft,
  onRequestDraftNow,
  onUpdateDraftContent,
  onSaveDraft,
  isDraftSaved,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [activeTab, setActiveTab] = useState<'letter' | 'reception' | 'strategy'>('letter');

  const handleCopy = async () => {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    if (!draft) return;
    const blob = new Blob([draft.formattedMessage], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const startEditing = () => {
    if (!draft) return;
    setEditedText(draft.formattedMessage);
    setIsEditing(true);
  };

  const saveEditing = () => {
    onUpdateDraftContent(editedText);
    setIsEditing(false);
  };

  // If no draft generated yet, show the Agent's Understood Context & Progress
  if (!draft) {
    const hasAnyContext = Object.values(extractedContext).some(
      (val) => typeof val === 'string' && val.trim().length > 0
    );

    return (
      <div className="ds-panel flex flex-col h-full min-h-0 overflow-hidden">
        {/* Header */}
        <div className="ds-panel-bar shrink-0 p-5 sm:p-6 pb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="ds-step-badge w-9 h-9 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Communication Canvas</h2>
              <p className="text-xs text-stone-500">Live draft & situational understanding</p>
            </div>
          </div>
          <span
            className="ds-chip px-2.5 py-1 text-xs"
          >
            {currentStage >= 5 ? 'Stage 5: Drafting Ready' : `Stage ${currentStage}: Exploring Context`}
          </span>
        </div>

        {/* Scrollable Context & Prompt Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-5 overscroll-contain">
          {/* If at Stage 5 and awaiting first generation */}
          {currentStage >= 5 && (
            <div className="ds-highlight p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    Ready to Generate Draft
                  </h4>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    We have gathered enough context to create your letter. Click below to craft your letter draft right now.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={onRequestDraftNow}
                      className="ds-primary-button px-3.5 py-1.5 text-xs flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Generate Draft Letter Now</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Understood Context Dashboard */}
          <div className="space-y-4">
            <div className="ds-card p-4">
              <h3 className="ds-kicker px-1.5 py-0.5 mb-3 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-stone-700" />
                Agent's Current Understanding
              </h3>

              {hasAnyContext ? (
                <div className="space-y-3 text-xs">
                  {extractedContext.recipientName && (
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold text-stone-700 w-24 shrink-0">Recipient:</span>
                      <span className="text-stone-900">
                        {extractedContext.recipientName}{' '}
                        {extractedContext.relationship && (
                          <span className="text-stone-500">({extractedContext.relationship})</span>
                        )}
                      </span>
                    </div>
                  )}

                  {extractedContext.whatHappened && (
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold text-stone-700 w-24 shrink-0">What Happened:</span>
                      <span className="text-stone-800 leading-relaxed">
                        {extractedContext.whatHappened}
                      </span>
                    </div>
                  )}

                  {extractedContext.userFeelings && (
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold text-stone-700 w-24 shrink-0">Your Feelings:</span>
                      <span className="text-stone-800 leading-relaxed font-medium">
                        {extractedContext.userFeelings}
                      </span>
                    </div>
                  )}

                  {extractedContext.userNeedsAndWants && (
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold text-stone-700 w-24 shrink-0">Needs & Wants:</span>
                      <span className="text-stone-800 leading-relaxed">
                        {extractedContext.userNeedsAndWants}
                      </span>
                    </div>
                  )}

                  {extractedContext.boundariesAndConstraints && (
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold text-stone-700 w-24 shrink-0">Boundaries:</span>
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-sm border border-amber-200">
                        {extractedContext.boundariesAndConstraints}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-stone-500 leading-relaxed">
                  The Therapeutic Letter Writer is listening on the left. As you describe what you're
                  facing, key details about who you're speaking with, what happened, and how you feel will
                  crystallize here.
                </p>
              )}
            </div>

            {/* Interaction Loop Guidance */}
            <div className="ds-card p-5 text-center">
              <div className="w-10 h-10 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400 mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-stone-900 mb-1">
                No Letter Drafted Yet
              </h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4 leading-relaxed">
                We believe in <em>understanding before writing</em>. We explore the feelings, context, and
                reason for writing first so the letter represents you truthfully without unnecessary
                escalation.
              </p>

              <button
                type="button"
                id="btn-draft-now-empty-state"
                onClick={onRequestDraftNow}
                className="ds-primary-button inline-flex items-center px-4 py-2 text-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                Draft Letter Now with Available Details
              </button>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="ds-mono shrink-0 p-4 border-t border-blue-600 flex items-center justify-between text-[11px] text-stone-600 bg-white">
          <span>Safe • Non-judgmental • Authentic Voice</span>
          <span>No unearned apologies</span>
        </div>
      </div>
    );
  }

  const FormatIcon = FORMAT_ICONS[draft.format] || FileText;

  return (
    <div className="ds-panel flex flex-col h-full min-h-0 overflow-hidden">
      {/* Top Bar */}
      <div className="ds-panel-bar shrink-0 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="ds-step-badge p-1.5">
            <FormatIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold truncate max-w-[220px] sm:max-w-xs">
              {draft.title}
            </h2>
            <div className="flex items-center space-x-2 text-[11px] text-stone-500">
              <span>{FORMAT_LABELS[draft.format]}</span>
              <span>•</span>
              <span className="text-amber-700 font-medium">{TONE_LABELS[draft.tone] || draft.tone}</span>
              <span>•</span>
              <span>{draft.wordCount} words (~{draft.readingTimeSeconds}s read)</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            id="btn-copy-draft"
            onClick={handleCopy}
            className="ds-small-button inline-flex items-center px-2.5 py-1.5 text-xs cursor-pointer"
            title="Copy letter to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-stone-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="btn-save-draft"
            onClick={() => onSaveDraft(draft)}
            className="ds-small-button inline-flex items-center px-2.5 py-1.5 text-xs cursor-pointer"
            title="Save to drafts"
          >
            {isDraftSaved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 mr-1 text-amber-700" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 mr-1 text-stone-500" />
                <span>Save</span>
              </>
            )}
          </button>

          <button
            type="button"
            id="btn-download-draft"
            onClick={handleDownload}
            className="ds-icon-button p-1.5 cursor-pointer"
            title="Download .txt"
          >
            <Download className="w-4 h-4 text-stone-600" />
          </button>

          <button
            type="button"
            id="btn-print-draft"
            onClick={handlePrint}
            className="ds-icon-button p-1.5 cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="ds-tabs shrink-0 px-5 flex space-x-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('letter')}
          className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'letter'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Letter Canvas
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reception')}
          className={`py-2.5 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'reception'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <span>How It May Be Received</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('strategy')}
          className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'strategy'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Strategy & De-escalation
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 bg-stone-50/40 overscroll-contain">
        {activeTab === 'letter' && (
          <div className="space-y-4">
            {/* Subject line for emails */}
            {draft.subjectLine && (
              <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs flex items-center space-x-2">
                <span className="font-semibold text-stone-500">Subject:</span>
                <span className="font-medium text-stone-900">{draft.subjectLine}</span>
              </div>
            )}

            {/* Letter Paper Container */}
            <div className="ds-document p-6 sm:p-8 relative print:border-none print:shadow-none">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 text-xs text-stone-400">
                <span>{FORMAT_LABELS[draft.format]}</span>
                <button
                  type="button"
                  onClick={isEditing ? saveEditing : startEditing}
                  className="inline-flex items-center text-xs font-semibold text-stone-700 hover:text-stone-900 hover:underline cursor-pointer"
                >
                  {isEditing ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Save Edits
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5 mr-1 text-stone-500" />
                      Edit Directly
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <textarea
                  rows={14}
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="ds-input w-full text-sm sm:text-base font-serif leading-relaxed p-2 border-2 focus:outline-none"
                />
              ) : (
                <div className="font-serif text-sm sm:text-base text-stone-900 leading-relaxed whitespace-pre-wrap selection:bg-amber-100">
                  {draft.formattedMessage}
                </div>
              )}
            </div>

            {/* Quick Refine Chips */}
            <div className="ds-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">Quick Revisions:</span>
                <span className="text-[11px] text-stone-400">One-click agent refinement</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isRevising}
                  onClick={() =>
                    onReviseDraft(
                      'Make the boundaries firmer and clear without attacking or escalating'
                    )
                  }
                  className="ds-chip text-xs px-3 py-1.5 cursor-pointer disabled:opacity-50"
                >
                  🛡️ Make boundary firmer
                </button>

                <button
                  type="button"
                  disabled={isRevising}
                  onClick={() =>
                    onReviseDraft(
                      'Soften the tone to be gentler and more reconnecting, while keeping honesty'
                    )
                  }
                  className="ds-chip text-xs px-3 py-1.5 cursor-pointer disabled:opacity-50"
                >
                  🌿 Soften tone & warm up
                </button>

                <button
                  type="button"
                  disabled={isRevising}
                  onClick={() =>
                    onReviseDraft(
                      'Make it shorter and more concise, suitable for a quick SMS or text message'
                    )
                  }
                  className="ds-chip text-xs px-3 py-1.5 cursor-pointer disabled:opacity-50"
                >
                  💬 Shorten for Text Message
                </button>

                <button
                  type="button"
                  disabled={isRevising}
                  onClick={() =>
                    onReviseDraft(
                      'Ensure all defensiveness is dialed down and express feelings purely as personal I-statements'
                    )
                  }
                  className="ds-chip text-xs px-3 py-1.5 cursor-pointer disabled:opacity-50"
                >
                  🕊️ De-escalate defensiveness
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reception' && (
          <div className="space-y-4">
            <div className="ds-highlight p-5">
              <h3 className="text-sm font-bold text-amber-950 flex items-center mb-2">
                <Sparkles className="w-4 h-4 mr-2 text-amber-700" />
                How the Recipient May Receive This Letter
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {draft.howItMayBeReceived ||
                  'This draft speaks from your own experience without making assumptions about their hidden motives. It invites an open, non-defensive dialogue while making your boundaries clear.'}
              </p>
            </div>

            <div className="ds-card p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Key Communication Safeguards
              </h4>
              <ul className="space-y-2 text-xs text-stone-700">
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>No unearned apologies:</strong> You are not made to admit fault for things
                    you don't believe you did wrong.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Authentic voice:</strong> Free of clinical therapy jargon or synthetic
                    phrases; sounds like a real person.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Non-escalating:</strong> Replaces accusations or speculation with grounded
                    personal feelings and specific events.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'strategy' && (
          <div className="space-y-4">
            <div className="ds-card p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Communication Strategy
              </h3>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                {draft.strategyExplanation}
              </p>
            </div>

            {/* Facts vs Assumptions Translation */}
            {draft.factAssumptionNotes && draft.factAssumptionNotes.length > 0 && (
              <div className="ds-card p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Facts vs. Assumptions De-escalation
                </h3>
                <div className="space-y-2.5">
                  {draft.factAssumptionNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center text-rose-800 font-medium">
                        <span className="w-16 font-semibold shrink-0 text-stone-500">Unfiltered:</span>
                        <span>"{note.thought}"</span>
                      </div>
                      <div className="flex items-center text-emerald-800 font-medium">
                        <span className="w-16 font-semibold shrink-0 text-stone-500">Grounded:</span>
                        <span>"{note.translation}"</span>
                      </div>
                      <div className="text-[11px] text-stone-500 italic pl-16">
                        Why: {note.whyItDeescalates}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Boundaries Preserved */}
            {draft.boundariesPreserved && draft.boundariesPreserved.length > 0 && (
              <div className="ds-card p-5 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Boundaries Preserved
                </h3>
                <div className="space-y-2">
                  {draft.boundariesPreserved.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-2 text-xs p-2.5 rounded-lg bg-stone-50 border border-stone-200"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-stone-900">{b.boundary}</div>
                        <div className="text-stone-600 text-[11px]">{b.howPreserved}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
