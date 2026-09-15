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
    <header className="no-print bg-white/95 backdrop-blur-xs border-b border-stone-200 sticky top-0 z-30 shadow-2xs shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                Therapeutic Letter Writer
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
                <ShieldCheck className="w-3 h-3 mr-1 text-stone-600" /> Agent Support
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden md:block">
              Empathetic communication support for relationship tension and conflict avoidance
            </p>
          </div>
        </div>

        {/* Center Stage Pill for desktop */}
        <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-stone-50 border border-stone-200 rounded-full text-xs font-medium text-stone-700">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-stone-500 font-normal">Stage {currentStage}/6:</span>
          <span className="font-semibold text-stone-900">{stageTitle || STAGE_NAMES[currentStage]}</span>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          <button
            type="button"
            id="btn-system-diagram"
            onClick={onOpenSystemDiagram}
            className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer border border-stone-200"
            title="View System Architecture & Agent Interaction Loop"
          >
            <Info className="w-4 h-4 mr-1 text-stone-600" />
            <span className="hidden md:inline">System Diagram</span>
            <span className="md:hidden">Info</span>
          </button>

          <button
            type="button"
            id="btn-scenarios"
            onClick={onOpenScenarios}
            className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Browse Conflict & Communication Scenarios"
          >
            <BookOpen className="w-4 h-4 mr-1 text-stone-600" />
            <span>Scenarios</span>
          </button>

          <button
            type="button"
            id="btn-saved-letters"
            onClick={onOpenSavedLetters}
            className="relative inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            title="Saved Letters & Messages"
          >
            <FolderArchive className="w-4 h-4 mr-1 text-stone-600" />
            <span>Saved</span>
            {savedLettersCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] font-semibold bg-stone-800 text-stone-100">
                {savedLettersCount}
              </span>
            )}
          </button>

          <button
            type="button"
            id="btn-reset-conversation"
            onClick={onNewConversation}
            className="inline-flex items-center px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="Start New Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Start Fresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};
