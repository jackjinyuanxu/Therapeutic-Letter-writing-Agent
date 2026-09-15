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
      <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="shrink-0 p-5 sm:p-6 pb-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Communication Canvas</h2>
              <p className="text-xs text-stone-500">Live draft & situational understanding</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
              currentStage >= 5
                ? 'bg-amber-50 text-amber-800 border-amber-300 font-semibold'
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            {currentStage >= 5 ? 'Stage 5: Drafting Ready' : `Stage ${currentStage}: Exploring Context`}
          </span>
        </div>

        {/* Scrollable Context & Prompt Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-5 overscroll-contain">
          {/* If at Stage 5 and awaiting first generation */}
          {currentStage >= 5 && (
            <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-stone-800">
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
                      className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs transition-colors"
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
            <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200/80">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center">
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
            <div className="border border-dashed border-stone-300 rounded-xl p-5 text-center bg-stone-50/40">
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
                className="inline-flex items-center px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                Draft Letter Now with Available Details
              </button>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="shrink-0 p-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 bg-stone-50/50">
          <span>Safe • Non-judgmental • Authentic Voice</span>
          <span>No unearned apologies</span>
        </div>
      </div>
    );
  }

  const FormatIcon = FORMAT_ICONS[draft.format] || FileText;

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
      {/* Top Bar */}
      <div className="shrink-0 px-5 py-3.5 bg-stone-50/90 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-stone-200/80 text-stone-700">
            <FormatIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 truncate max-w-[220px] sm:max-w-xs">
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
            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              copied
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
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
            className={`inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isDraftSaved
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
            }`}
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
            className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
            title="Download .txt"
          >
            <Download className="w-4 h-4 text-stone-600" />
          </button>

          <button
            type="button"
            id="btn-print-draft"
            onClick={handlePrint}
            className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
            title="Print or Save PDF"
          >
            <Printer className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 px-5 border-b border-stone-200 bg-white flex space-x-6 text-xs font-semibold">
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
            <div className="bg-white rounded-xl border border-stone-200/90 p-6 sm:p-8 shadow-xs relative print:border-none print:shadow-none">
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
                  className="w-full text-sm sm:text-base font-serif leading-relaxed text-stone-900 p-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              ) : (
                <div className="font-serif text-sm sm:text-base text-stone-900 leading-relaxed whitespace-pre-wrap selection:bg-amber-100">
                  {draft.formattedMessage}
                </div>
              )}
            </div>

            {/* Quick Refine Chips */}
            <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
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
                  className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors cursor-pointer disabled:opacity-50"
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
                  className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors cursor-pointer disabled:opacity-50"
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
                  className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors cursor-pointer disabled:opacity-50"
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
                  className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  🕊️ De-escalate defensiveness
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reception' && (
          <div className="space-y-4">
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-amber-950 flex items-center mb-2">
                <Sparkles className="w-4 h-4 mr-2 text-amber-700" />
                How the Recipient May Receive This Letter
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                {draft.howItMayBeReceived ||
                  'This draft speaks from your own experience without making assumptions about their hidden motives. It invites an open, non-defensive dialogue while making your boundaries clear.'}
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
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
            <div className="bg-white p-5 rounded-xl border border-stone-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Communication Strategy
              </h3>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                {draft.strategyExplanation}
              </p>
            </div>

            {/* Facts vs Assumptions Translation */}
            {draft.factAssumptionNotes && draft.factAssumptionNotes.length > 0 && (
              <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
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
              <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-2">
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
