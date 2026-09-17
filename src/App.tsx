import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AgentChat } from './components/AgentChat';
import { LetterDocument } from './components/LetterDocument';
import { ScenariosModal } from './components/ScenariosModal';
import { SavedLettersModal } from './components/SavedLettersModal';
import { SystemDiagramModal } from './components/SystemDiagramModal';
import {
  ChatMessage,
  AgentStage,
  AgentExtractedContext,
  AgentDraft,
  ScenarioTemplate,
} from './types';
import { MessageSquare, FileText, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'therapeutic_letter_writer_drafts_v1';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg_welcome',
  role: 'assistant',
  content: `Hello. It's completely normal to feel lost, uncertain, or hesitant to speak up when you're facing friction or conflict with a classmate, friend, or someone in your life.\n\nI'm here to listen without judgment, help you understand what's happening, and work with you to find words that feel safe and authentic to send.\n\nWho is this about, and how have you been feeling about the situation?`,
  timestamp: Date.now(),
  stage: 1,
  suggestedReplies: [
    "I'm avoiding conflict with a classmate on a group project.",
    "Things feel awkward after an argument.",
    "A friend stopped responding and I feel anxious.",
  ],
};

export const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [currentStage, setCurrentStage] = useState<AgentStage>(1);
  const [stageTitle, setStageTitle] = useState<string>('Identity & Feelings');
  const [extractedContext, setExtractedContext] = useState<AgentExtractedContext>({});
  const [currentDraft, setCurrentDraft] = useState<AgentDraft | null>(null);

  const [isThinking, setIsThinking] = useState(false);
  const [isRevising, setIsRevising] = useState(false);

  // Modals
  const [isScenariosOpen, setIsScenariosOpen] = useState(false);
  const [isSavedLettersOpen, setIsSavedLettersOpen] = useState(false);
  const [isSystemDiagramOpen, setIsSystemDiagramOpen] = useState(false);

  // Mobile Tab View (chat vs document)
  const [mobileTab, setMobileTab] = useState<'chat' | 'canvas'>('chat');

  // Saved Drafts
  const [savedDrafts, setSavedDrafts] = useState<AgentDraft[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDrafts));
    } catch (e) {
      console.error('Failed to persist drafts to localStorage', e);
    }
  }, [savedDrafts]);

  // Send Message to Agent
  const handleSendMessage = async (userText: string, customDraftTrigger = false) => {
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsThinking(true);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          currentStage,
          extractedContext,
          currentDraft,
          requestDraftNow: customDraftTrigger,
        }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // Non-JSON response (e.g., 404 HTML page)
      }

      if (!response.ok) {
        const errorMsg = data?.reply || data?.error || data?.message || `Server returned HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      if (data.currentStage) {
        setCurrentStage(data.currentStage as AgentStage);
      }
      if (data.stageTitle) {
        setStageTitle(data.stageTitle);
      }
      if (data.extractedContext) {
        setExtractedContext((prev) => ({ ...prev, ...data.extractedContext }));
      }
      if (data.draft) {
        setCurrentDraft(data.draft);
      }

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am listening. Please continue.',
        timestamp: Date.now(),
        stage: data.currentStage,
        suggestedReplies: data.suggestedReplies || [],
        draft: data.draft || undefined,
      };

      setMessages([...updatedMessages, assistantMsg]);
    } catch (error: any) {
      console.error('Error in agent conversation:', error);
      const isMissingKey = error?.message?.includes('GEMINI_API_KEY') || error?.message?.includes('MISSING_GEMINI_API_KEY');
      const is404 = error?.message?.includes('404');

      const fallbackContent = isMissingKey
        ? error.message
        : is404
        ? "⚠️ Backend API route not reachable (HTTP 404).\n\nIf you deployed on Vercel, ensure that your repository includes `vercel.json` and the `/api/index.ts` serverless function, and that `GEMINI_API_KEY` is added under Project Settings → Environment Variables."
        : "I'm here with you. Navigating these emotions takes patience. Could you tell me a bit more about what outcome would feel safest and most respectful for you?";

      const fallbackMsg: ChatMessage = {
        id: `assistant_fallback_${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
        timestamp: Date.now(),
        stage: currentStage,
        suggestedReplies: isMissingKey || is404
          ? [
              'Where do I add GEMINI_API_KEY on Vercel?',
              'How do I test my deployment?',
            ]
          : [
              'I just want them to understand my side.',
              'I want to resolve this without a fight.',
              'Can we write the letter with what you know?',
            ],
      };
      setMessages([...updatedMessages, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  // User clicked "Draft letter now"
  const handleRequestDraftNow = () => {
    handleSendMessage('Can we draft the message now with what we have so far?', true);
    setMobileTab('canvas');
  };

  // Direct Revision of Draft
  const handleReviseDraft = async (directive: string, customFeedback?: string) => {
    if (!currentDraft) return;
    setIsRevising(true);

    try {
      const response = await fetch('/api/agent/revise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentDraft,
          revisionDirective: directive,
          customFeedback,
          extractedContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Revision failed');
      }

      const data = await response.json();
      if (data.draft) {
        setCurrentDraft(data.draft);
      }

      // Add a brief assistant message in chat noting the revision
      const revisionNoteMsg: ChatMessage = {
        id: `assistant_rev_${Date.now()}`,
        role: 'assistant',
        content: data.agentNote || `I have updated the letter with this revision: "${directive}". Take a look at the revised letter in the canvas on the right.`,
        timestamp: Date.now(),
        stage: 6,
        suggestedReplies: [
          'This looks great and feels safe to send.',
          'Can we soften the ending a little bit?',
          'How do you think they will react to this?',
        ],
        draft: data.draft || currentDraft || undefined,
      };

      setMessages((prev) => [...prev, revisionNoteMsg]);
      setCurrentStage(6);
      setStageTitle('Check & Revise');
    } catch (err) {
      console.error('Revision error:', err);
    } finally {
      setIsRevising(false);
    }
  };

  // Select a preset scenario
  const handleSelectScenario = (scenario: ScenarioTemplate) => {
    setCurrentDraft(null);
    setCurrentStage(2);
    setStageTitle('Events & Context');
    setExtractedContext(scenario.context);

    const initialScenarioMessage: ChatMessage = {
      id: `user_scenario_${Date.now()}`,
      role: 'user',
      content: scenario.initialUserMessage,
      timestamp: Date.now(),
    };

    setMessages([
      INITIAL_MESSAGE,
      initialScenarioMessage,
    ]);

    // Send to agent to initiate response
    setIsThinking(true);
    fetch('/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: INITIAL_MESSAGE.role, content: INITIAL_MESSAGE.content },
          { role: 'user', content: scenario.initialUserMessage },
        ],
        currentStage: 2,
        extractedContext: scenario.context,
        currentDraft: null,
        requestDraftNow: false,
      }),
    })
      .then(async (res) => {
        let data: any = null;
        try {
          data = await res.json();
        } catch {}
        if (!res.ok) {
          throw new Error(data?.reply || data?.error || `HTTP ${res.status}`);
        }
        return data;
      })
      .then((data) => {
        if (data.currentStage) setCurrentStage(data.currentStage as AgentStage);
        if (data.stageTitle) setStageTitle(data.stageTitle);
        if (data.extractedContext) setExtractedContext(data.extractedContext);
        if (data.draft) setCurrentDraft(data.draft);

        const replyMsg: ChatMessage = {
          id: `assistant_scenario_${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: Date.now(),
          stage: data.currentStage || 2,
          suggestedReplies: data.suggestedReplies || [],
        };
        setMessages([INITIAL_MESSAGE, initialScenarioMessage, replyMsg]);
      })
      .catch((err) => {
        console.error('Scenario load error:', err);
        const isMissingKey = err?.message?.includes('GEMINI_API_KEY');
        const fallbackScenarioMsg: ChatMessage = {
          id: `assistant_scenario_err_${Date.now()}`,
          role: 'assistant',
          content: isMissingKey
            ? err.message
            : `I understand this situation is challenging. Let's take a deep breath. Can you tell me what matters most to you in how this gets resolved?`,
          timestamp: Date.now(),
          stage: 2,
          suggestedReplies: isMissingKey
            ? ['Where do I add GEMINI_API_KEY on Vercel?']
            : ['I want to protect our relationship.', 'I need to set a boundary.'],
        };
        setMessages([INITIAL_MESSAGE, initialScenarioMessage, fallbackScenarioMsg]);
      })
      .finally(() => {
        setIsThinking(false);
      });
  };

  // Start fresh
  const handleNewConversation = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        id: `msg_welcome_${Date.now()}`,
        timestamp: Date.now(),
      },
    ]);
    setCurrentStage(1);
    setStageTitle('Identity & Feelings');
    setExtractedContext({});
    setCurrentDraft(null);
    setMobileTab('chat');
  };

  // Save draft
  const handleSaveDraft = (draft: AgentDraft) => {
    setSavedDrafts((prev) => {
      const exists = prev.some((d) => d.id === draft.id);
      if (exists) {
        return prev.map((d) => (d.id === draft.id ? draft : d));
      }
      return [draft, ...prev];
    });
  };

  // Delete draft
  const handleDeleteDraft = (id: string) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const isCurrentDraftSaved = currentDraft
    ? savedDrafts.some((d) => d.id === currentDraft.id)
    : false;

  return (
    <div className="berkeley-shell h-screen max-h-screen flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <Header
        onNewConversation={handleNewConversation}
        onOpenScenarios={() => setIsScenariosOpen(true)}
        onOpenSavedLetters={() => setIsSavedLettersOpen(true)}
        onOpenSystemDiagram={() => setIsSystemDiagramOpen(true)}
        savedLettersCount={savedDrafts.length}
        currentStage={currentStage}
        stageTitle={stageTitle}
      />

      {/* Mobile Tab Switcher */}
      <div className="ds-mobile-tabs lg:hidden shrink-0 px-4 py-3 flex items-center justify-center space-x-2">
        <button
          type="button"
          onClick={() => setMobileTab('chat')}
          data-active={mobileTab === 'chat'}
          className="ds-mobile-tab flex-1 py-2 px-3 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Agent Dialogue</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('canvas')}
          data-active={mobileTab === 'canvas'}
          className="ds-mobile-tab flex-1 py-2 px-3 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer relative"
        >
          <FileText className="w-4 h-4" />
          <span>Letter Canvas</span>
          {currentDraft && (
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          )}
        </button>
      </div>

      {/* Main Two-Panel Workspace */}
      <main className="ds-page-frame flex-1 min-h-0 w-full p-2 sm:p-4 md:p-[25px] flex flex-col overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-5 flex-1 min-h-0 h-full">
          {/* Left Panel: Agent Conversation */}
          <section
            aria-label="Agent Conversation"
            className={`lg:col-span-7 flex flex-col h-full min-h-0 min-w-0 overflow-hidden ${
              mobileTab === 'canvas' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <AgentChat
              messages={messages}
              currentStage={currentStage}
              stageTitle={stageTitle}
              isThinking={isThinking}
              onSendMessage={handleSendMessage}
              onRequestDraftNow={handleRequestDraftNow}
              onSelectScenario={handleSelectScenario}
              extractedContext={extractedContext}
              hasDraft={Boolean(currentDraft)}
              currentDraft={currentDraft}
              onViewCanvas={() => setMobileTab('canvas')}
              onReviseDraft={handleReviseDraft}
            />
          </section>

          {/* Right Panel: Working Letter Canvas & Analysis */}
          <section
            aria-label="Letter Canvas and Analysis"
            className={`lg:col-span-5 flex flex-col h-full min-h-0 min-w-0 overflow-hidden ${
              mobileTab === 'chat' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <LetterDocument
              draft={currentDraft}
              extractedContext={extractedContext}
              currentStage={currentStage}
              isRevising={isRevising}
              onReviseDraft={handleReviseDraft}
              onRequestDraftNow={handleRequestDraftNow}
              onUpdateDraftContent={(newContent) => {
                if (!currentDraft) return;
                setCurrentDraft({
                  ...currentDraft,
                  formattedMessage: newContent,
                  wordCount: newContent.trim().split(/\s+/).filter(Boolean).length,
                });
              }}
              onSaveDraft={handleSaveDraft}
              isDraftSaved={isCurrentDraftSaved}
            />
          </section>
        </div>
      </main>

      {/* Modals */}
      <ScenariosModal
        isOpen={isScenariosOpen}
        onClose={() => setIsScenariosOpen(false)}
        onSelectScenario={handleSelectScenario}
      />

      <SavedLettersModal
        isOpen={isSavedLettersOpen}
        onClose={() => setIsSavedLettersOpen(false)}
        savedDrafts={savedDrafts}
        onSelectDraft={(draft) => {
          setCurrentDraft(draft);
          setMobileTab('canvas');
        }}
        onDeleteDraft={handleDeleteDraft}
      />

      <SystemDiagramModal
        isOpen={isSystemDiagramOpen}
        onClose={() => setIsSystemDiagramOpen(false)}
      />
    </div>
  );
};

export default App;
