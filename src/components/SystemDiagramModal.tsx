import React, { useState } from 'react';
import {
  X,
  Network,
  Cpu,
  Layers,
  ShieldCheck,
  ArrowRight,
  ArrowDown,
  Database,
  Sparkles,
  MessageSquare,
  FileText,
  CheckCircle2,
  Workflow,
  Zap,
  Repeat,
  CornerDownRight,
  Sliders,
  Send,
  Eye,
  ListFilter,
  Activity,
} from 'lucide-react';

interface SystemDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemDiagramModal: React.FC<SystemDiagramModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'io' | 'architecture' | 'loop' | 'pipeline'>('io');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="system-diagram-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-white rounded-2xl max-w-5xl w-full border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs">
              <Network className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 id="system-diagram-title" className="text-base sm:text-lg font-bold text-stone-900 flex items-center space-x-2">
                <span>System Architecture & Process Specification</span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Interactive Diagram
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                Detailed breakdown of Input, Interaction Process, Output, and Full-Stack Pipeline
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-stone-200 bg-white flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('io')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'io'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-amber-600" />
              <span>Input ➔ Process ➔ Output</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-stone-700" />
              <span>Full-Stack Architecture</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('loop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'loop'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Workflow className="w-3.5 h-3.5 text-stone-700" />
              <span>6-Stage Flow & Fast-Track Loop</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Harm-Reduction Filters</span>
            </button>
          </div>

          <div className="text-[11px] text-stone-500 hidden sm:flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Express + Gemini 3.1 Flash Lite</span>
          </div>
        </div>

        {/* Tab 0 (NEW & DEFAULT): Clear Input ➔ Interaction Process ➔ Output */}
        {activeTab === 'io' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* Top Linear Flow Banner */}
            <div className="bg-stone-900 rounded-2xl p-4 sm:p-5 text-stone-100 border border-stone-800 shadow-inner">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>End-to-End Functional Pipeline Overview</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center text-center">
                {/* Step 1 Box */}
                <div className="md:col-span-3 p-3 rounded-xl bg-stone-800/90 border border-stone-700 space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                      1. INPUT
                    </span>
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Context & Emotion</h4>
                  <p className="text-[11px] text-stone-400 leading-tight">
                    Recipient relationship, triggering event, unspoken feelings, boundaries, or preset scenarios.
                  </p>
                </div>

                {/* Arrow 1 */}
                <div className="md:col-span-1 flex items-center justify-center py-1 md:py-0">
                  <div className="hidden md:flex items-center w-full justify-center">
                    <div className="h-0.5 w-full bg-amber-400/60" />
                    <ArrowRight className="w-4 h-4 text-amber-400 -ml-1 shrink-0" />
                  </div>
                  <div className="flex md:hidden items-center justify-center">
                    <ArrowDown className="w-4 h-4 text-amber-400" />
                  </div>
                </div>

                {/* Step 2 Box */}
                <div className="md:col-span-3 p-3 rounded-xl bg-stone-800/90 border border-stone-700 space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                      2. INTERACTION PROCESS
                    </span>
                    <Workflow className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white">6-Stage Dialogue & Pacing</h4>
                  <p className="text-[11px] text-stone-400 leading-tight">
                    Paced therapeutic questioning, fact vs. assumption analysis, Gemini inference & fast-track bypass.
                  </p>
                </div>

                {/* Arrow 2 */}
                <div className="md:col-span-1 flex items-center justify-center py-1 md:py-0">
                  <div className="hidden md:flex items-center w-full justify-center">
                    <div className="h-0.5 w-full bg-emerald-400/60" />
                    <ArrowRight className="w-4 h-4 text-emerald-400 -ml-1 shrink-0" />
                  </div>
                  <div className="flex md:hidden items-center justify-center">
                    <ArrowDown className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* Step 3 Box */}
                <div className="md:col-span-3 p-3 rounded-xl bg-stone-800/90 border border-stone-700 space-y-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      3. OUTPUT
                    </span>
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white">Letter & Perception Forecast</h4>
                  <p className="text-[11px] text-stone-400 leading-tight">
                    De-escalated letter, strategy rationale, reaction forecast, and dual-panel synchronized canvas.
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed 3-Column Visual Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* COLUMN 1: INPUT */}
              <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
                        IN
                      </div>
                      <h3 className="text-sm font-bold text-stone-900">1. System Inputs</h3>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">User & Session</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    The raw materials supplied by the user and application state before inference:
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Recipient Profile</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Identity and hierarchy (e.g. boss, friend, roommate, spouse, client) determining appropriate formality and tone.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>The Friction Incident</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Raw narrative of what happened (e.g., unpaid invoice, ignored texts, uncredited presentation, broken promise).
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Emotional State & Avoidance Fear</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Underlying feeling (resentment, anxiety, guilt) and specific fear (e.g., <em>"I don't want to sound aggressive"</em>).
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Preset Conflict Scenarios</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        One-click starter scenarios (e.g. <em>Late Freelance Payment</em>, <em>Family Vacation Pressure</em>) pre-seeding context.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900">
                  <strong>Payload Form:</strong> Transmitted via <code className="bg-amber-100 px-1 py-0.5 rounded text-[10px]">POST /api/agent/chat</code> with conversation history and active stage.
                </div>
              </div>

              {/* COLUMN 2: INTERACTION PROCESS */}
              <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                        PROC
                      </div>
                      <h3 className="text-sm font-bold text-stone-900">2. Interaction Process</h3>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">Agent Dialogue</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    How the therapeutic agent explores, analyzes, and paces the interaction:
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Paced 6-Stage Dialogue Loop</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Ensures deep listening before jumping to drafting. Stages 1–4 extract recipient identity, facts vs. assumptions, and non-negotiables.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Fast-Track Drafting Bypass</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        User can click <em>"Draft letter now"</em> at any time to skip exploration and immediately synthesize a draft using gathered context.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Gemini Inference Gateway</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Node.js/Express applies system instructions to <code className="text-[11px]">gemini-3.1-flash-lite</code> with automatic 503 retry and <code className="text-[11px]">gemini-3.8-flash</code> fallback.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>Collaborative Revision Loop (Stage 6)</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Targeted revisions via <code className="bg-stone-200/80 px-1 py-0.5 rounded text-[10px]">POST /api/agent/revise</code>: adjust tone (gentle/direct), length, or channel format.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-[11px] text-blue-900">
                  <strong>Pacing Rule:</strong> Never generates a draft in Stages 1–4 unless the user explicitly triggers the fast-track button.
                </div>
              </div>

              {/* COLUMN 3: OUTPUT */}
              <div className="rounded-xl border border-stone-200 bg-white p-4 space-y-4 shadow-2xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
                        OUT
                      </div>
                      <h3 className="text-sm font-bold text-stone-900">3. System Outputs</h3>
                    </div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">Deliverables</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    The concrete artifacts generated for the user:
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-1">
                      <div className="font-semibold text-emerald-950 flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>The De-Escalated Letter / Message</span>
                      </div>
                      <p className="text-[11px] text-stone-700">
                        Ready-to-send authentic text: zero passive-aggression, clear "I" statements, and healthy boundary preservation without unearned apologies.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Recipient Reaction Forecast</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Predictive breakdown of how the recipient is likely to feel and react, defusing anticipation anxiety.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Strategic Rationale Notes</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Explanation of why specific phrasing, pacing, and framing were chosen to maintain connection while staying firm.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
                      <div className="font-semibold text-stone-900 flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Dual-Panel UI Delivery</span>
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Rendered simultaneously as an inline in-chat card (with one-click copy) and an editable live document canvas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-900">
                  <strong>User Agency:</strong> Copy to clipboard, save to local archive, or request instant revisions.
                </div>
              </div>
            </div>

            {/* Visual Trace Example Card */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
                <Workflow className="w-4 h-4 text-amber-600" />
                <span>Concrete Execution Trace: "Late Freelance Invoice"</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] font-mono text-amber-700 font-bold uppercase">Input Given</span>
                  <p className="text-[11px] text-stone-700 italic">
                    "My client hasn't paid an invoice that was due 3 weeks ago. I feel awkward asking again because I don't want to lose them, but I need the money."
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] font-mono text-blue-700 font-bold uppercase">Processing Applied</span>
                  <p className="text-[11px] text-stone-700">
                    Agent validates discomfort ➔ removes unearned apologies (e.g. <em>"Sorry to bother you"</em>) ➔ frames reminder with clear dates and accounting clarity.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Output Generated</span>
                  <p className="text-[11px] text-stone-700 font-medium">
                    Professional, firm email stating invoice details, payment link, deadline, and positive lookahead to next milestone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Full-Stack Architecture with Visual Arrows & Lines */}
        {activeTab === 'architecture' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            {/* Top architectural diagram canvas */}
            <div className="relative bg-stone-950 rounded-2xl p-5 sm:p-7 border border-stone-800 text-stone-100 overflow-hidden shadow-inner">
              {/* Subtle architectural dot grid background */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Diagram Title Pill */}
              <div className="relative z-10 flex items-center justify-between mb-6 flex-wrap gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
                    Data Pipeline & Communication Topology
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-[11px] text-stone-400 font-mono">
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-0.5 bg-amber-400 inline-block" />
                    <span>HTTP REST</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
                    <span>Gemini Inference</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-0.5 bg-sky-400 inline-block" />
                    <span>Reactive State</span>
                  </span>
                </div>
              </div>

              {/* Grid of 3 Major Tiers with Visual Connector Lines between them */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-11 gap-4 items-stretch">
                {/* TIER 1: Client Browser Application */}
                <div
                  onMouseEnter={() => setHoveredNode('client')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`lg:col-span-3 rounded-xl border p-4 space-y-3 transition-all duration-200 flex flex-col justify-between ${
                    hoveredNode === 'client'
                      ? 'bg-stone-900/95 border-amber-400 ring-2 ring-amber-400/20'
                      : 'bg-stone-900/80 border-stone-700/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
                        Tier 1 • Client
                      </span>
                      <span className="text-[11px] text-amber-400 font-semibold flex items-center">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        React 18
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2">Browser Workspace</h3>

                    <div className="space-y-2 text-xs">
                      <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 space-y-0.5">
                        <p className="font-semibold text-stone-200">AgentChat Component</p>
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Progressive stage conversation, quick suggestions, and in-chat draft card
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 space-y-0.5">
                        <p className="font-semibold text-stone-200">LetterDocument Component</p>
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Live working canvas, tone selector, strategy notes, and forecast radar
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 space-y-0.5">
                        <p className="font-semibold text-stone-200">State & Storage</p>
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Conversation history, extracted context, and localStorage draft archive
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-400 font-mono flex items-center justify-between">
                    <span>PORT: 3000 / SPA</span>
                    <span className="text-emerald-400">Vite Bundle</span>
                  </div>
                </div>

                {/* CONNECTOR 1: Client <---> Server with directional arrows */}
                <div className="lg:col-span-1 flex flex-col justify-center items-center py-2 lg:py-0 space-y-2">
                  <div className="hidden lg:flex flex-col items-center w-full px-1">
                    <span className="text-[10px] font-mono text-amber-400 whitespace-nowrap mb-1">
                      POST payload
                    </span>
                    <div className="w-full flex items-center">
                      <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 to-amber-500" />
                      <ArrowRight className="w-4 h-4 text-amber-400 -ml-1 shrink-0" />
                    </div>

                    <div className="my-2.5 px-1 py-0.5 rounded text-[9px] font-mono text-stone-400 bg-stone-900 border border-stone-800 text-center">
                      JSON Sync
                    </div>

                    <div className="w-full flex items-center">
                      <ArrowRight className="w-4 h-4 text-sky-400 -mr-1 rotate-180 shrink-0" />
                      <div className="h-0.5 w-full bg-gradient-to-l from-sky-400 to-sky-500" />
                    </div>
                    <span className="text-[10px] font-mono text-sky-400 whitespace-nowrap mt-1">
                      Draft & Stage
                    </span>
                  </div>

                  {/* Mobile direction arrow */}
                  <div className="flex lg:hidden items-center justify-center space-x-2 py-1">
                    <ArrowDown className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-mono text-stone-400">HTTP Request / Response</span>
                    <ArrowDown className="w-5 h-5 text-sky-400 rotate-180" />
                  </div>
                </div>

                {/* TIER 2: Express Server & Agent Orchestrator */}
                <div
                  onMouseEnter={() => setHoveredNode('server')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`lg:col-span-3 rounded-xl border p-4 space-y-3 transition-all duration-200 flex flex-col justify-between ${
                    hoveredNode === 'server'
                      ? 'bg-stone-900/95 border-amber-400 ring-2 ring-amber-400/20'
                      : 'bg-stone-900/80 border-stone-700/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
                        Tier 2 • Gateway
                      </span>
                      <span className="text-[11px] text-amber-400 font-semibold flex items-center">
                        <Database className="w-3 h-3 mr-1" />
                        Express / Node
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2">Agent Orchestrator</h3>

                    <div className="space-y-2 text-xs">
                      <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 space-y-0.5">
                        <p className="font-semibold text-stone-200 font-mono text-[11px] text-amber-300">
                          POST /api/agent/chat
                        </p>
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Validates stage pacing, extracts relationship facts, and ensures Stage 5/6 drafts
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 space-y-0.5">
                        <p className="font-semibold text-stone-200 font-mono text-[11px] text-amber-300">
                          POST /api/agent/revise
                        </p>
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Applies targeted tone shifts, SMS conversion, or custom boundary refinements
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 space-y-0.5">
                        <p className="font-semibold text-stone-200 flex items-center justify-between">
                          <span>Retry & Fallback Guard</span>
                          <Zap className="w-3 h-3 text-amber-400" />
                        </p>
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Retries transient 503 errors and auto-switches to secondary Gemini model
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-400 font-mono flex items-center justify-between">
                    <span>HOST: 0.0.0.0:3000</span>
                    <span className="text-amber-400">Server-Side Secret Key</span>
                  </div>
                </div>

                {/* CONNECTOR 2: Server <---> Gemini AI with directional arrows */}
                <div className="lg:col-span-1 flex flex-col justify-center items-center py-2 lg:py-0 space-y-2">
                  <div className="hidden lg:flex flex-col items-center w-full px-1">
                    <span className="text-[10px] font-mono text-emerald-400 whitespace-nowrap mb-1">
                      Inference
                    </span>
                    <div className="w-full flex items-center">
                      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
                      <ArrowRight className="w-4 h-4 text-emerald-400 -ml-1 shrink-0" />
                    </div>

                    <div className="my-2.5 px-1 py-0.5 rounded text-[9px] font-mono text-stone-400 bg-stone-900 border border-stone-800 text-center">
                      JSON Schema
                    </div>

                    <div className="w-full flex items-center">
                      <ArrowRight className="w-4 h-4 text-emerald-400 -mr-1 rotate-180 shrink-0" />
                      <div className="h-0.5 w-full bg-gradient-to-l from-emerald-400 to-emerald-500" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 whitespace-nowrap mt-1">
                      Structured AST
                    </span>
                  </div>

                  {/* Mobile direction arrow */}
                  <div className="flex lg:hidden items-center justify-center space-x-2 py-1">
                    <ArrowDown className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-mono text-stone-400">GenAI SDK Streaming/Call</span>
                    <ArrowDown className="w-5 h-5 text-emerald-400 rotate-180" />
                  </div>
                </div>

                {/* TIER 3: Cognitive Inference Engine */}
                <div
                  onMouseEnter={() => setHoveredNode('gemini')}
                  onMouseLeave={() => setHoveredNode(null)}
                  className={`lg:col-span-3 rounded-xl border p-4 space-y-3 transition-all duration-200 flex flex-col justify-between ${
                    hoveredNode === 'gemini'
                      ? 'bg-stone-900/95 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-stone-900/80 border-stone-700/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
                        Tier 3 • Intelligence
                      </span>
                      <span className="text-[11px] text-emerald-400 font-semibold flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Google Gen AI
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2">Gemini Cognitive Engine</h3>

                    <div className="space-y-2 text-xs">
                      <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-300 font-mono text-[11px]">
                            gemini-3.1-flash-lite
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            Primary
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Low-latency, high conversational fluency for responsive, patient dialogue
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-300 font-mono text-[11px]">
                            gemini-3.8-flash
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-stone-800 text-stone-300 border border-stone-700">
                            Backup
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Resilience fallback ensuring zero dropped requests or session interrupts
                        </p>
                      </div>

                      <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 space-y-0.5">
                        <p className="font-semibold text-stone-200">System Instruction Persona</p>
                        <p className="text-[11px] text-stone-400 leading-tight">
                          Therapeutic Letter Writer: genuine, non-judgmental, checks feelings & boundaries
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 text-[10px] text-stone-400 font-mono flex items-center justify-between">
                    <span>Strict JSON Schema</span>
                    <span className="text-emerald-400">Deterministic Typing</span>
                  </div>
                </div>
              </div>

              {/* Bottom Callout: Automated Safeguard Feedback Loop */}
              <div className="relative z-10 mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-2 text-xs text-stone-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Stage 5/6 Safety Guarantee:</strong> If the model returns in stage 5/6 without a draft, the Express gateway synthesizes one immediately.
                  </span>
                </div>
                <span className="text-[11px] font-mono text-stone-500">
                  Total Latency: ~400–800ms
                </span>
              </div>
            </div>

            {/* Step-by-step Flow Sequence with Visual Arrows */}
            <div className="rounded-xl border border-stone-200 bg-white p-5 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
                <Network className="w-4 h-4 text-stone-800" />
                <span>End-to-End Execution Sequence</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                {/* Node 1 */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 relative flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-bold text-xs">
                      1
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">Input</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">User Prompt & Action</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed mt-1">
                      User inputs a situation, clicks a quick reply, or selects a conflict template.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-200/80 text-[10px] text-amber-700 font-mono">
                    Client ➔ HTTP POST
                  </div>
                </div>

                {/* Node 2 */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 relative flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-amber-800 text-stone-100 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">Gateway</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Context & Persona Injection</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed mt-1">
                      Express packs active extracted context, stage rules, and the therapeutic role.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-200/80 text-[10px] text-amber-700 font-mono">
                    Express ➔ Google SDK
                  </div>
                </div>

                {/* Node 3 */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 relative flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-stone-800 text-stone-100 flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                    <span className="text-[10px] font-mono text-stone-500 uppercase">Inference</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Gemini Synthesis & De-escalation</h4>
                    <p className="text-[11px] text-stone-600 leading-relaxed mt-1">
                      Filters harmful phrasing, drafts authentic letter, and crafts recipient reaction forecast.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-stone-200/80 text-[10px] text-emerald-700 font-mono">
                    Gemini ➔ JSON Schema
                  </div>
                </div>

                {/* Node 4 */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 relative flex flex-col justify-between space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-stone-100 flex items-center justify-center font-bold text-xs">
                      4
                    </span>
                    <span className="text-[10px] font-mono text-emerald-800 uppercase">Render</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Synchronized Dual-Panel Sync</h4>
                    <p className="text-[11px] text-stone-700 leading-relaxed mt-1">
                      In-chat letter card renders with one-click copy, and the letter canvas updates in real time.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-emerald-200 text-[10px] text-emerald-800 font-mono">
                    Client State ➔ Ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Visual 6-Stage Flow Pipeline with Connecting Arrows & Fast-Track Loop */}
        {activeTab === 'loop' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start space-x-3">
              <Workflow className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Paced Exploration vs. Fast-Track Drafting
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                  The therapeutic interaction loop adheres to <strong>understanding before writing</strong>. However, users can click <em>"Draft letter now"</em> at any moment to fast-track through to Stage 5, generating a complete draft from available details.
                </p>
              </div>
            </div>

            {/* Visual Pipeline Flow with Line Connectors */}
            <div className="relative border border-stone-200 rounded-2xl p-5 sm:p-6 bg-stone-50/50 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                  Sequential Progression (Stages 1 ➔ 6)
                </span>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-stone-200 text-stone-700">
                  Interactive State Machine
                </span>
              </div>

              {/* Connected Stage Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 relative">
                {/* Stage 1 */}
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center text-[10px] font-bold">
                      1
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">Listen</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Identity & Feelings</h4>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    Who the user is writing to, relationship dynamics, and emotional pressure.
                  </p>
                  <div className="text-[10px] text-stone-600 pt-1 border-t border-stone-100">
                    Avoids invalidating discomfort
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">Unpack</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Context & Events</h4>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    Chronological events, past tension, and the trigger that prompted avoidance.
                  </p>
                  <div className="text-[10px] text-stone-600 pt-1 border-t border-stone-100">
                    Separates facts from assumptions
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center text-[10px] font-bold">
                      3
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">Analyze</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Conflict Cause</h4>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    Underlying conflict roots, fear of confrontation, or missed communications.
                  </p>
                  <div className="text-[10px] text-stone-600 pt-1 border-t border-stone-100">
                    Finds the core vulnerability
                  </div>
                </div>

                {/* Stage 4 */}
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 shadow-2xs space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center text-[10px] font-bold">
                      4
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">Intent</span>
                  </div>
                  <h4 className="text-xs font-bold text-stone-900">Goals & Boundaries</h4>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    What outcome provides peace of mind; firm boundaries to preserve self-respect.
                  </p>
                  <div className="text-[10px] text-stone-600 pt-1 border-t border-stone-100">
                    No unearned apologies
                  </div>
                </div>

                {/* Stage 5 (Milestone) */}
                <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 shadow-xs space-y-2 relative ring-2 ring-amber-400/20">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-amber-900 text-stone-100 flex items-center justify-center text-[10px] font-bold">
                      5
                    </span>
                    <span className="text-[10px] text-amber-800 font-mono font-bold">Draft</span>
                  </div>
                  <h4 className="text-xs font-bold text-amber-950">Letter Drafting</h4>
                  <p className="text-[11px] text-stone-700 leading-tight">
                    Full synthesized letter rendered in-chat and canvas, with strategy analysis.
                  </p>
                  <div className="text-[10px] text-amber-900 font-medium pt-1 border-t border-amber-200">
                    In-chat card + Canvas sync
                  </div>
                </div>

                {/* Stage 6 (Loop) */}
                <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-300 shadow-xs space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-full bg-emerald-800 text-stone-100 flex items-center justify-center text-[10px] font-bold">
                      6
                    </span>
                    <span className="text-[10px] text-emerald-800 font-mono font-bold">Revise</span>
                  </div>
                  <h4 className="text-xs font-bold text-emerald-950">Check & Revise</h4>
                  <p className="text-[11px] text-stone-700 leading-tight">
                    Quick-tuning tone, condensing for SMS, and recipient reaction forecasting.
                  </p>
                  <div className="text-[10px] text-emerald-900 font-medium pt-1 border-t border-emerald-200 flex items-center">
                    <Repeat className="w-3 h-3 mr-1 text-emerald-700" />
                    <span>Iterative Feedback</span>
                  </div>
                </div>
              </div>

              {/* Fast-Track Bypass Visual Arrow */}
              <div className="p-3.5 rounded-xl bg-stone-900 text-stone-100 border border-stone-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-white">
                      Fast-Track Drafting Bypass (Stages 1–4 ➔ Stage 5)
                    </span>
                    <p className="text-[11px] text-stone-400">
                      Clicking "Draft letter now with available details" jumps directly to Stage 5 synthesis, bypassing remaining inquiry.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-stone-800 text-amber-300 border border-stone-700">
                  requestDraftNow = true
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Harm-Reduction Filter Pipeline with Visual Arrow Flow */}
        {activeTab === 'pipeline' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Harm Reduction & Safe Communication Pipeline
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed mt-0.5">
                  When facing relationship tension, raw emotional drafts often contain hidden traps: blame, unearned apologies, or sarcasm. Here is how the agent transforms your message:
                </p>
              </div>
            </div>

            {/* Visual Arrow Flow for Filters */}
            <div className="space-y-3">
              {/* Filter 1 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-red-100 text-red-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 flex items-center space-x-2">
                      <span>Inflammatory Language Scrubbing</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-50 text-red-700 border border-red-200">
                        De-escalation
                      </span>
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      Filters out passive-aggressive language, threats, sarcasm, and ultimatums that trigger defensive counter-attacks.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono text-[11px] text-stone-400 hidden sm:block">
                  Raw Input ➔ Safe Delivery
                </div>
              </div>

              {/* Connecting Arrow */}
              <div className="flex justify-center -my-1">
                <ArrowDown className="w-4 h-4 text-stone-400" />
              </div>

              {/* Filter 2 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 flex items-center space-x-2">
                      <span>Accusation to "I"-Statement Translation</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Psychological Safety
                      </span>
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      Converts <em>"You never reply to my messages"</em> into <em>"I felt uncertain about our group project when I didn't hear back."</em>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono text-[11px] text-stone-400 hidden sm:block">
                  Blame ➔ Observation
                </div>
              </div>

              {/* Connecting Arrow */}
              <div className="flex justify-center -my-1">
                <ArrowDown className="w-4 h-4 text-stone-400" />
              </div>

              {/* Filter 3 */}
              <div className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 flex items-center space-x-2">
                      <span>Unearned Apology Removal</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-200">
                        Dignity & Boundaries
                      </span>
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                      Avoidant writers frequently apologize for setting standard boundaries. The agent strips capitulating apologies while maintaining respect.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono text-[11px] text-stone-400 hidden sm:block">
                  Capitulation ➔ Boundary
                </div>
              </div>

              {/* Connecting Arrow */}
              <div className="flex justify-center -my-1">
                <ArrowDown className="w-4 h-4 text-stone-400" />
              </div>

              {/* Filter 4 */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-800 text-stone-100 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 flex items-center space-x-2">
                      <span>Recipient Reaction Forecast</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Anxiety Relief
                      </span>
                    </h4>
                    <p className="text-xs text-stone-700 leading-relaxed mt-0.5">
                      Generates a forecast of how the recipient is likely to interpret and react to the message, giving the user peace of mind before sending.
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 font-mono text-[11px] text-emerald-800 font-semibold hidden sm:block">
                  Verified Safe to Send
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50/90 flex items-center justify-between shrink-0 text-xs text-stone-500">
          <span className="font-mono text-[11px]">Therapeutic Letter Writer • System Specification</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-semibold cursor-pointer transition-colors shadow-xs"
          >
            Close Diagram
          </button>
        </div>
      </div>
    </div>
  );
};
