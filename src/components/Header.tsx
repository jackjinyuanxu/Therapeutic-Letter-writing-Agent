import React from 'react';
import { Sparkles, BookOpen, FolderArchive, RotateCcw, ShieldCheck, Info } from 'lucide-react';
import { AgentStage } from '../types';

interface HeaderProps {
  onNewConversation: () => void;
  onOpenScenarios: () => void;
  onOpenSavedLetters: () => void;
  onOpenSystemDiagram: () => void;
  savedLettersCount: number;
  currentStage: AgentStage;
  stageTitle: string;
}

const STAGE_NAMES: Record<AgentStage, string> = {
  1: '1. Identity & Feelings',
  2: '2. Events & Context',
  3: '3. Root Cause',
  4: '4. Goal & Boundaries',
  5: '5. Letter Drafted',
  6: '6. Review & Revise',
};

export const Header: React.FC<HeaderProps> = ({
  onNewConversation,
  onOpenScenarios,
  onOpenSavedLetters,
  onOpenSystemDiagram,
  savedLettersCount,
  currentStage,
  stageTitle,
}) => {
  return (
    <header className="ds-header no-print sticky top-0 z-30 shrink-0">
      <div className="ds-header-inner">
        <div className="ds-header-brand-row">
          <div className="ds-brand-lockup">
            <div className="ds-brand-mark flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="ds-brand-copy">
              <h1 className="ds-brand-title">Therapeutic Letter Writer</h1>
              <p className="ds-brand-subtitle">
                Empathetic communication support for relationship tension and conflict avoidance
              </p>
            </div>
          </div>
          <span className="ds-kicker ds-header-kicker">
            <ShieldCheck className="w-3.5 h-3.5" /> Agent Support
          </span>
        </div>

        <div className="ds-header-control-row">
          <div className="ds-stage-pill flex items-center gap-2 px-4 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-yellow-300 border border-blue-600 shrink-0" />
            <span className="font-normal whitespace-nowrap">Stage {currentStage} of 6</span>
            <span className="ds-stage-divider" aria-hidden="true" />
            <span className="font-semibold text-black truncate">{stageTitle || STAGE_NAMES[currentStage]}</span>
          </div>

          <nav className="ds-header-actions" aria-label="Prototype actions">
            <button
              type="button"
              id="btn-system-diagram"
              onClick={onOpenSystemDiagram}
              className="ds-nav-button"
              title="See how the prototype works"
            >
              <Info className="w-4 h-4" />
              <span>System Diagram</span>
            </button>

            <button
              type="button"
              id="btn-scenarios"
              onClick={onOpenScenarios}
              className="ds-nav-button"
              title="Browse conflict and communication scenarios"
            >
              <BookOpen className="w-4 h-4" />
              <span>Scenarios</span>
            </button>

            <button
              type="button"
              id="btn-saved-letters"
              onClick={onOpenSavedLetters}
              className="ds-nav-button relative"
              title="View saved letters and messages"
            >
              <FolderArchive className="w-4 h-4" />
              <span>Saved</span>
              {savedLettersCount > 0 && <span className="ds-saved-count">{savedLettersCount}</span>}
            </button>

            <button
              type="button"
              id="btn-reset-conversation"
              onClick={onNewConversation}
              className="ds-nav-button"
              title="Restart the conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
