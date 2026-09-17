import React from 'react';
import { X, FolderArchive, Trash2, ExternalLink, Copy, Check, FileText } from 'lucide-react';
import { AgentDraft } from '../types';

interface SavedLettersModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDrafts: AgentDraft[];
  onSelectDraft: (draft: AgentDraft) => void;
  onDeleteDraft: (id: string) => void;
}

export const SavedLettersModal: React.FC<SavedLettersModalProps> = ({
  isOpen,
  onClose,
  savedDrafts,
  onSelectDraft,
  onDeleteDraft,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (draft: AgentDraft) => {
    try {
      await navigator.clipboard.writeText(draft.formattedMessage);
      setCopiedId(draft.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="ds-modal-overlay fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="ds-modal max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="ds-modal-header px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-stone-100 flex items-center justify-center">
              <FolderArchive className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Saved Messages & Letters</h2>
              <p className="text-xs text-stone-500">
                {savedDrafts.length} message{savedDrafts.length === 1 ? '' : 's'} saved on this device
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

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {savedDrafts.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <FileText className="w-10 h-10 mx-auto mb-2 stroke-1" />
              <p className="text-sm font-medium text-stone-600">No saved letters yet</p>
              <p className="text-xs text-stone-400 mt-1">
                When you draft a letter with the agent, click "Save" to keep it stored here.
              </p>
            </div>
          ) : (
            savedDrafts.map((draft) => (
              <div
                key={draft.id}
                className="ds-card p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">{draft.title}</h3>
                    <div className="flex items-center space-x-2 text-[11px] text-stone-500 mt-0.5">
                      <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{draft.format.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{draft.wordCount} words</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(draft)}
                      className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                      title="Copy message"
                    >
                      {copiedId === draft.id ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteDraft(draft.id)}
                      className="ds-danger-button p-1.5 cursor-pointer"
                      title="Delete saved draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDraft(draft);
                        onClose();
                      }}
                      className="inline-flex items-center px-2.5 py-1 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium cursor-pointer"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-serif line-clamp-3 bg-white p-2.5 rounded-lg border border-stone-100 leading-relaxed">
                  {draft.formattedMessage}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="ds-modal-footer px-6 py-3.5 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="ds-primary-button px-4 py-2 text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
