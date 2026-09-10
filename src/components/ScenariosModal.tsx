import React from 'react';
import { X, BookOpen, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { SCENARIO_TEMPLATES } from '../data/scenarios';
import { ScenarioTemplate } from '../types';

interface ScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: ScenarioTemplate) => void;
}

export const ScenariosModal: React.FC<ScenariosModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Relationship Scenarios</h2>
              <p className="text-xs text-stone-500">
                Explore how the Therapeutic Letter Writer helps resolve uncertainty and conflict
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3">
          {SCENARIO_TEMPLATES.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => {
                onSelectScenario(scenario);
                onClose();
              }}
              className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                      {scenario.title}
                    </h3>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      {scenario.tag}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
                <div className="w-7 h-7 rounded-full bg-stone-100 group-hover:bg-stone-900 group-hover:text-stone-100 text-stone-500 flex items-center justify-center shrink-0 transition-colors mt-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="italic truncate max-w-[85%]">
                  "{scenario.initialUserMessage.slice(0, 80)}..."
                </span>
                <span className="text-amber-700 font-medium group-hover:underline shrink-0">
                  Try scenario →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Designed for genuine, safe, and de-escalated communication
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-white text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
