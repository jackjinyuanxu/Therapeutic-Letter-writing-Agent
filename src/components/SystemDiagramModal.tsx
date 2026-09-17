import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  FileText,
  Layers,
  MessageSquare,
  Network,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const flowGroups = [
  {
    label: 'Information comes in',
    kind: 'input',
    icon: MessageSquare,
    boxes: [
      {
        title: '1. You share the situation',
        text: 'You type what happened, how you feel, what you need, and any boundaries.',
      },
      {
        title: '2. You choose what happens next',
        text: 'You can answer a question, pick an example scenario, request a draft, or ask for a revision.',
      },
    ],
  },
  {
    label: 'Always works the same way',
    kind: 'fixed',
    icon: ShieldCheck,
    boxes: [
      {
        title: '3. The app organizes your details',
        text: 'It keeps the current conversation, known details, conversation stage, and working draft together.',
      },
      {
        title: '4. The app adds fixed guidance',
        text: 'The guidance says to be supportive, avoid diagnosis or blame, separate facts from guesses, and respect boundaries.',
      },
    ],
  },
  {
    label: 'AI can vary',
    kind: 'ai',
    icon: Sparkles,
    boxes: [
      {
        title: '5. Gemini makes sense of the context',
        text: 'It interprets the words and chooses a useful next question. Different runs may phrase this differently.',
      },
      {
        title: '6. Gemini writes or revises',
        text: 'When asked, it creates a letter and explains its approach and how the message might be received.',
      },
    ],
  },
  {
    label: 'You get something back',
    kind: 'output',
    icon: FileText,
    boxes: [
      {
        title: '7. The app checks the response',
        text: 'It checks that the expected pieces are present and provides a basic backup draft if a required draft is missing.',
      },
      {
        title: '8. You stay in control',
        text: 'You receive a next question or an editable letter, plus suggestions, explanations, and revision choices.',
      },
    ],
  },
] as const;

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="system-diagram-title"
      className="ds-modal-overlay fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6"
    >
      <div className="ds-modal ds-system-modal w-full overflow-hidden flex flex-col max-h-[94vh]">
        <div className="ds-modal-header ds-system-header">
          <div className="ds-system-title-lockup">
            <div className="ds-brand-mark flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="ds-system-title-line">
                <h2 id="system-diagram-title">How the Letter Writer Works</h2>
                <span className="ds-kicker">Plain-language guide</span>
              </div>
              <p>What the app handles, what the AI does, and what comes back to you.</p>
            </div>
          </div>

          <button type="button" onClick={onClose} aria-label="Close diagram" className="ds-icon-button ds-system-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="ds-system-content">
          <section aria-labelledby="system-flow-heading">
            <div className="ds-section-heading">
              <span className="ds-section-number">01</span>
              <div>
                <h3 id="system-flow-heading">The full journey</h3>
                <p>Blue labels are predictable app steps. The yellow AI section can produce different wording each time.</p>
              </div>
            </div>

            <div className="ds-system-flow" aria-label="Information flow from the user through the app and AI, then back to the user">
              {flowGroups.map((group, index) => {
                const Icon = group.icon;
                return (
                  <React.Fragment key={group.label}>
                    <div className={`ds-flow-group ds-flow-${group.kind}`}>
                      <div className="ds-flow-label">
                        <Icon className="w-4 h-4" />
                        <span>{group.label}</span>
                      </div>
                      {group.boxes.map((box) => (
                        <article className="ds-flow-box" key={box.title}>
                          <h4>{box.title}</h4>
                          <p>{box.text}</p>
                        </article>
                      ))}
                    </div>
                    {index < flowGroups.length - 1 && (
                      <div className="ds-flow-arrow" aria-hidden="true">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="ai-scope-heading">
            <div className="ds-section-heading">
              <span className="ds-section-number">02</span>
              <div>
                <h3 id="ai-scope-heading">What Gemini sees—and what it does not</h3>
                <p>Only information needed for the current conversation or revision is placed in the AI request.</p>
              </div>
            </div>

            <div className="ds-ai-scope-grid">
              <article className="ds-scope-box ds-scope-given">
                <div className="ds-scope-title">
                  <Eye className="w-5 h-5" />
                  <h4>9. The AI is given</h4>
                </div>
                <p>
                  Your current conversation, the details gathered from it, the current stage, and whether you asked for a draft.
                  For a revision, it also receives the current draft and your requested change.
                </p>
              </article>

              <article className="ds-scope-box ds-scope-not-given">
                <div className="ds-scope-title">
                  <Layers className="w-5 h-5" />
                  <h4>10. The AI is not given</h4>
                </div>
                <p>
                  Other saved letters, unrelated files or accounts, or personal information you did not type or select in this
                  conversation. The app does not ask the model to search for outside facts about you.
                </p>
              </article>
            </div>
          </section>

          <section className="ds-walkthrough" aria-labelledby="walkthrough-heading">
            <div className="ds-section-heading">
              <span className="ds-section-number">03</span>
              <div>
                <h3 id="walkthrough-heading">A short walkthrough</h3>
                <p>Think of the prototype as a guided writing table, not an automatic decision-maker.</p>
              </div>
            </div>
            <ol>
              <li><CheckCircle2 className="w-4 h-4" /><span><strong>Share:</strong> You describe the situation in your own words.</span></li>
              <li><CheckCircle2 className="w-4 h-4" /><span><strong>Guide:</strong> The app supplies the same communication rules every time.</span></li>
              <li><CheckCircle2 className="w-4 h-4" /><span><strong>Generate:</strong> Gemini suggests a question or draft, so wording can vary.</span></li>
              <li><CheckCircle2 className="w-4 h-4" /><span><strong>Decide:</strong> You review, edit, save, or revise the result before using it.</span></li>
            </ol>
          </section>
        </div>

        <div className="ds-modal-footer ds-system-footer">
          <p>The AI can help with wording, but it can misunderstand context. You make the final decision.</p>
          <button type="button" onClick={onClose} className="ds-primary-button px-5 py-2 text-sm cursor-pointer">
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
