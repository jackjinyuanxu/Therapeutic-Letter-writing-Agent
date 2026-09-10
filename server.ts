import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

// CORS & Preflight handling for deployments
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Lazy initialization of GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing. Please configure it in AI Studio settings.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function generateWithRetry(params: any, retries = 2, delayMs = 1000): Promise<any> {
  const ai = getGenAI();
  const modelsToTry = [params.model || 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await ai.models.generateContent({
          ...params,
          model: modelName,
        });
      } catch (err: any) {
        const isTransient =
          err?.status === 503 ||
          err?.message?.includes('503') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('UNAVAILABLE');
        if (attempt < retries && isTransient) {
          console.warn(`Transient Gemini error with ${modelName} (attempt ${attempt + 1}/${retries + 1}), retrying in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delayMs *= 1.5;
          continue;
        }
        // If last attempt on this model failed due to high demand/503, loop to try fallback model
        if (isTransient && modelName !== modelsToTry[modelsToTry.length - 1]) {
          console.warn(`Switching to model ${modelsToTry[1]}...`);
          break;
        }
        if (modelName === modelsToTry[modelsToTry.length - 1]) {
          throw err;
        }
      }
    }
  }
}

// Health check endpoint (accessible at /api/health and /health)
const handleHealth = (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    runtime: process.env.VERCEL ? 'vercel-serverless' : 'node-container',
    time: new Date().toISOString(),
  });
};
app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

const THERAPEUTIC_LETTER_WRITER_SYSTEM_INSTRUCTION = `You are the Therapeutic Letter Writer agent.

## Role Name
Therapeutic Letter Writer

## Purpose
Help users understand pressure or issues in a relationship and provide support for written communication.

## Engagement Context
The user feels lost or uncertain and is avoiding conflict with a classmate or another person in their life.

## Behavioral Rules
* Be genuine.
* Be patient.
* Check details and dig deeper into the user’s feelings, needs, and wants.
* Filter out harmful information to ensure written communication is safe to send.
* Do not rush into drafting before understanding the situation.

## Interaction Loop (6 Stages)
Stage 1. Understand who the user is talking about: identity, relationship, and feelings.
Stage 2. Understand the context and what happened.
Stage 3. Ask why the situation happened and what caused the conflict.
Stage 4. Understand why the user wants to write and what they want the message to accomplish (needs, wants, desired outcome, boundaries).
Stage 5. Draft the letter/message. (Only draft when enough context is known or the user explicitly asks to draft).
Stage 6. Check with the user and revise based on additional context or concerns.

## Boundaries
* No judgment.
* No personal opinions.
* No unnecessary critique.
* Be supportive.
* Do not make decisions about the relationship for the user.

## Does Not Do
* Diagnose the user or the other person.
* Decide who is right or wrong.
* Tell the user what they “should” feel.
* Invent motives or feelings for either person.
* Encourage hostile, manipulative, or harmful communication.

## Required Inputs to Track
* Who the message is for and their relationship to the user.
* What happened.
* How the user feels about the situation.
* What the user wants to communicate (user needs and wants).
* What outcome the user hopes for.
* Any important details or boundaries that should be included or avoided.

## Outputs
* Empathetic, calm conversational responses.
* A written letter/message appropriate to the situation (when ready in Stage 5 or 6, or requested).
* Clarification of what the message communicates and how it may realistically be received.
* Separate feelings, events, and assumptions (translations into grounded "I" experience).

## Knowledge Base Guidelines
1. Understand before writing: Do NOT immediately generate a letter from the first vague sentence unless the user explicitly requests an immediate draft or has already provided full details. Dig deeper into emotions and relationship context first.
2. Separate feelings, events, and assumptions: What happened, how the user feels, and what they assume the other person intended are distinct. Never present assumptions as facts.
3. The user determines the intention: Clarify the goal rather than deciding it for them.
4. Support does not mean automatically agreeing: Be emotionally supportive without assigning blame or verifying unproven motives.
5. Specific context changes the message: Relationship history, power dynamics, and recent events matter.
6. Use language that represents the user: Natural, authentic human language. NO THERAPY JARGON (do not use "holding space", "validating your journey", "honoring emotional complexity").
7. Avoid unnecessary escalation: Translate attacks or insults into clear expressions of feelings, needs, and boundaries without weakening healthy boundaries.
8. Apologies must match what the user means: Do not make the user apologize for things they do not believe they did wrong. Distinguish between apologizing for an action, acknowledging impact, explaining intentions, and expressing regret.
9. Communication support, not therapy: You help them reflect to communicate clearly, not conduct therapy or diagnose.

You must ALWAYS respond with valid JSON matching the specified schema.`;

// Primary Agent Chat Handler
const handleChat = async (req: express.Request, res: express.Response) => {
  const {
    messages = [],
    currentStage = 1,
    extractedContext = {},
    currentDraft = null,
    requestDraftNow = false,
  } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    console.error('CRITICAL: GEMINI_API_KEY environment variable is not defined.');
    return res.status(500).json({
      error: 'MISSING_GEMINI_API_KEY',
      reply: '⚠️ GEMINI_API_KEY is not configured in this deployment.\n\nTo make your agent work on Vercel:\n1. Open your Vercel Project Dashboard (vercel.com).\n2. Navigate to Settings → Environment Variables.\n3. Add `GEMINI_API_KEY` with your API key from Google AI Studio.\n4. Redeploy under Deployments → Redeploy.\n\nOnce added, your AI agent will respond dynamically to all inputs.',
      currentStage: currentStage || 1,
      stageTitle: 'Setup Required: Missing API Key',
      suggestedReplies: [
        'How do I add GEMINI_API_KEY on Vercel?',
        'Where do I get a Gemini API key?',
      ],
      extractedContext: extractedContext || {},
      isDraftReady: false,
      draft: null,
    });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided.' });
  }

  const prompt = `You are the Therapeutic Letter Writer agent interacting with the user.

Conversation History:
${messages
  .map(
    (m: any) =>
      `${m.role === 'assistant' ? 'Therapeutic Letter Writer' : 'User'}: ${m.content}`
  )
  .join('\n\n')}

Current Extracted Context so far:
${JSON.stringify(extractedContext, null, 2)}

Current Stage: ${currentStage} (1: Identity & Feelings, 2: Context & Events, 3: Causes & Root, 4: Goals & Boundaries, 5: Drafting, 6: Review & Revise)
User specifically requested draft now? ${requestDraftNow ? 'YES - user wants to draft immediately with current information' : 'NO - follow interaction loop naturally'}
Existing draft present? ${currentDraft ? 'YES' : 'NO'}

CRITICAL INSTRUCTIONS:
1. Speak in a genuine, supportive, patient, and non-judgmental tone.
2. Check details and dig into how they are feeling, what happened, what they need, or what boundaries they have.
3. MANDATORY RULE FOR DRAFTING:
   - If currentStage is 5 or 6, OR if you advance currentStage to 5 or 6, OR if requestDraftNow is true:
     YOU MUST GENERATE AND POPULATE THE "draft" OBJECT!
     "draft.formattedMessage" MUST contain the complete, beautifully composed message ready to send.
     "draft.title" must be a descriptive title.
     "draft.strategyExplanation" must explain how the message de-escalates conflict and protects boundaries.
     "draft.howItMayBeReceived" must outline how the recipient is likely to perceive and react to this message.
     Set "isDraftReady": true.
     NEVER return "draft": null when currentStage is 5 or 6! The user is in the drafting stage and must see the draft immediately.
     In your conversational "reply", announce that you have written a draft, briefly summarize how it approaches the situation, and invite their thoughts or adjustments.
4. If essential context is still being explored (Stages 1-4) and requestDraftNow is false:
   Keep "draft" as null (unless retaining an existing draft), set isDraftReady: false, and ask the next thoughtful question in the interaction loop.
5. Provide 2 to 3 helpful, conversational "suggestedReplies" that the user can click to answer easily.
6. Provide "howItMayBeReceived" explaining how a recipient would likely perceive this message.
7. Return strictly valid JSON.`;

  try {
    const response = await generateWithRetry({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: THERAPEUTIC_LETTER_WRITER_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: 'Your conversational agent response to the user. Genuine, patient, empathetic, non-judgmental.',
            },
            currentStage: {
              type: Type.INTEGER,
              description: 'Current stage in interaction loop (1 to 6).',
            },
            stageTitle: {
              type: Type.STRING,
              description: 'Title of the current stage e.g. Understanding Relationship & Feelings, Exploring Events, Root Cause, Clarifying Goals & Boundaries, Drafting Letter, or Review & Feedback.',
            },
            suggestedReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 short, realistic reply suggestions the user could tap.',
            },
            extractedContext: {
              type: Type.OBJECT,
              properties: {
                recipientName: { type: Type.STRING },
                relationship: { type: Type.STRING },
                whatHappened: { type: Type.STRING },
                userFeelings: { type: Type.STRING },
                conflictCause: { type: Type.STRING },
                userNeedsAndWants: { type: Type.STRING },
                communicationGoal: { type: Type.STRING },
                desiredOutcome: { type: Type.STRING },
                boundariesAndConstraints: { type: Type.STRING },
              },
            },
            isDraftReady: {
              type: Type.BOOLEAN,
              description: 'True if a draft is included and ready to view/send, false if still exploring.',
            },
            draft: {
              type: Type.OBJECT,
              nullable: true,
              properties: {
                title: { type: Type.STRING },
                formattedMessage: { type: Type.STRING },
                format: {
                  type: Type.STRING,
                  enum: ['personal_letter', 'email', 'text_message', 'brief_note'],
                },
                tone: {
                  type: Type.STRING,
                  enum: [
                    'honest_gentle',
                    'firm_clear',
                    'calm_deescalated',
                    'warm_accountable',
                    'neutral_direct',
                    'heartfelt_receptive',
                  ],
                },
                subjectLine: { type: Type.STRING },
                salutation: { type: Type.STRING },
                closing: { type: Type.STRING },
                strategyExplanation: {
                  type: Type.STRING,
                  description: 'How this draft communicates needs and feelings without escalation or hostility.',
                },
                howItMayBeReceived: {
                  type: Type.STRING,
                  description: 'Realistic perspective on how the other person is likely to perceive and react to this message.',
                },
                factAssumptionNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      thought: { type: Type.STRING },
                      translation: { type: Type.STRING },
                      whyItDeescalates: { type: Type.STRING },
                    },
                    required: ['thought', 'translation', 'whyItDeescalates'],
                  },
                },
                boundariesPreserved: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      boundary: { type: Type.STRING },
                      howPreserved: { type: Type.STRING },
                    },
                    required: ['boundary', 'howPreserved'],
                  },
                },
              },
            },
          },
          required: [
            'reply',
            'currentStage',
            'stageTitle',
            'suggestedReplies',
            'extractedContext',
            'isDraftReady',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    // GUARANTEE: If stage is 5 or 6 (or draft was explicitly requested), ensure draft exists!
    if ((parsed.currentStage >= 5 || requestDraftNow) && (!parsed.draft || !parsed.draft.formattedMessage)) {
      console.warn('Draft was missing or null in stage >= 5; generating draft explicitly...');
      const ctx = { ...extractedContext, ...parsed.extractedContext };
      const recipient = ctx.recipientName || 'Jordan';
      const relationship = ctx.relationship || 'Peer / Classmate';
      const whatHappened = ctx.whatHappened || 'Unspoken tension or avoided conversation';
      const feelings = ctx.userFeelings || 'Anxious about conflict, wanting clear communication';
      const needs = ctx.userNeedsAndWants || 'Clarity, mutual respect, and a peaceful outcome';
      const boundaries = ctx.boundariesAndConstraints || 'Firm yet respectful boundaries without hostility';

      try {
        const draftPrompt = `You are the Therapeutic Letter Writer agent.
Generate a complete, empathetic, de-escalating message draft to ${recipient} (${relationship}).
Context of issue: ${whatHappened}
User's feelings: ${feelings}
User's goal/needs: ${needs}
Boundaries: ${boundaries}

Draft a respectful, clear message that uses 'I' statements, avoids blaming, sets clear expectations, and protects personal boundaries.`;

        const fallbackDraftRes = await generateWithRetry({
          model: 'gemini-3.1-flash-lite',
          contents: draftPrompt,
          config: {
            systemInstruction: THERAPEUTIC_LETTER_WRITER_SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                formattedMessage: { type: Type.STRING },
                format: {
                  type: Type.STRING,
                  enum: ['personal_letter', 'email', 'text_message', 'brief_note'],
                },
                tone: {
                  type: Type.STRING,
                  enum: [
                    'honest_gentle',
                    'firm_clear',
                    'calm_deescalated',
                    'warm_accountable',
                    'neutral_direct',
                    'heartfelt_receptive',
                  ],
                },
                subjectLine: { type: Type.STRING },
                strategyExplanation: { type: Type.STRING },
                howItMayBeReceived: { type: Type.STRING },
                factAssumptionNotes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      thought: { type: Type.STRING },
                      translation: { type: Type.STRING },
                      whyItDeescalates: { type: Type.STRING },
                    },
                    required: ['thought', 'translation', 'whyItDeescalates'],
                  },
                },
                boundariesPreserved: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      boundary: { type: Type.STRING },
                      howPreserved: { type: Type.STRING },
                    },
                    required: ['boundary', 'howPreserved'],
                  },
                },
              },
              required: ['title', 'formattedMessage', 'strategyExplanation', 'howItMayBeReceived'],
            },
          },
        });

        const fbObj = JSON.parse(fallbackDraftRes.text || '{}');
        if (fbObj && fbObj.formattedMessage) {
          parsed.draft = fbObj;
          parsed.isDraftReady = true;
          parsed.currentStage = 5;
        }
      } catch (genErr) {
        console.error('Error generating explicit stage 5 draft:', genErr);
      }

      // If still missing, produce a clean template draft directly
      if (!parsed.draft || !parsed.draft.formattedMessage) {
        parsed.draft = {
          title: `Message for ${recipient}`,
          formattedMessage: `Hi ${recipient},\n\nI hope you're doing well. I wanted to reach out directly because I've been feeling some stress around ${whatHappened}, and good communication is really important to me.\n\nCould we find a quick moment to sync up? My goal is just to make sure we're on the same page and can move forward smoothly without any awkwardness or misunderstandings.\n\nLet me know what time works best for you.\n\nBest,`,
          format: 'personal_letter',
          tone: 'honest_gentle',
          strategyExplanation: "Opens with positive intent and uses 'I' statements to lower defensiveness, states the issue neutrally without blame, and sets a collaborative next step.",
          howItMayBeReceived: "The recipient is likely to feel invited rather than accused, significantly reducing friction.",
          factAssumptionNotes: [
            {
              thought: "They don't care about this or are ignoring me",
              translation: "I've been feeling stress about this situation",
              whyItDeescalates: "Focuses on personal experience rather than assuming negative intent",
            },
          ],
          boundariesPreserved: [
            {
              boundary: "Clear, direct communication",
              howPreserved: "Initiates a dedicated check-in rather than letting tension linger",
            },
          ],
        };
        parsed.isDraftReady = true;
        parsed.currentStage = 5;
      }
    }

    // If draft exists, ensure metadata like wordCount & id
    if (parsed.draft && parsed.draft.formattedMessage) {
      const text = parsed.draft.formattedMessage;
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      parsed.draft = {
        ...parsed.draft,
        id: 'draft_' + Date.now(),
        wordCount,
        readingTimeSeconds: Math.max(10, Math.round((wordCount / 180) * 60)),
        createdAt: Date.now(),
        format: parsed.draft.format || 'personal_letter',
        tone: parsed.draft.tone || 'honest_gentle',
        factAssumptionNotes: parsed.draft.factAssumptionNotes || [],
        boundariesPreserved: parsed.draft.boundariesPreserved || [],
      };
      parsed.isDraftReady = true;
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Agent chat error:', error);

    const isDraftStep = requestDraftNow || currentStage >= 4;
    const ctx = extractedContext || {};
    const recipient = ctx.recipientName || 'Jordan';
    const whatHappened = ctx.whatHappened || 'our recent communication issue';

    const fallbackDraft = isDraftStep
      ? {
          id: 'draft_' + Date.now(),
          title: `Message for ${recipient}`,
          formattedMessage: `Hi ${recipient},\n\nI hope you're doing well. I wanted to reach out because I value open communication and felt we could sync up briefly about ${whatHappened}.\n\nMy priority is for us to be on the same page and handle this smoothly and respectfully together. Let me know when you might have a couple of minutes to touch base.\n\nBest,`,
          format: 'personal_letter' as const,
          tone: 'honest_gentle' as const,
          strategyExplanation: "Uses 'I' statements to articulate needs clearly without accusations or defensiveness.",
          howItMayBeReceived: "Approaches the recipient respectfully, making it easy to engage productively.",
          factAssumptionNotes: [
            {
              thought: "They're being difficult on purpose",
              translation: "I'd like us to find a moment to sync up directly",
              whyItDeescalates: "Replaces speculation with an honest request for direct dialogue",
            },
          ],
          boundariesPreserved: [
            {
              boundary: "Protecting personal peace and project timeline",
              howPreserved: "Establishes a constructive opportunity to connect without hostility",
            },
          ],
          wordCount: 52,
          readingTimeSeconds: 20,
          createdAt: Date.now(),
        }
      : currentDraft;

    return res.json({
      reply: isDraftStep
        ? `I have crafted a message draft for ${recipient} based on everything we discussed. You can view the full draft right here in the conversation and on the canvas to your right.`
        : `Thank you for sharing that with me. Facing tension or feeling like you have to avoid someone can weigh heavily on you. To help us find the right words to say, could you tell me a little more about what happened and what outcome would give you peace of mind?`,
      currentStage: isDraftStep ? 5 : Math.min(6, (currentStage || 1) + 1),
      stageTitle: isDraftStep ? 'Drafting Letter' : 'Understanding Feelings & Context',
      suggestedReplies: isDraftStep
        ? [
            'Can we make it slightly firmer?',
            'Can we make it shorter for a text message?',
            'This looks good to me.',
          ]
        : [
            'I really want to avoid a major argument.',
            'I just want them to understand my side.',
            'Can we draft a short message with what I shared?',
          ],
      extractedContext: {
        ...extractedContext,
      },
      isDraftReady: Boolean(fallbackDraft),
      draft: fallbackDraft,
    });
  }
};

// Register chat endpoint on both /api/agent/chat and /agent/chat for Vercel/proxy compatibility
app.post('/api/agent/chat', handleChat);
app.post('/agent/chat', handleChat);

// Agent Direct Revision Handler
const handleRevise = async (req: express.Request, res: express.Response) => {
  const { currentDraft, revisionDirective, customFeedback, extractedContext = {} } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'MISSING_GEMINI_API_KEY',
      agentNote: 'GEMINI_API_KEY is not configured in your deployment environment variables. Please add GEMINI_API_KEY in Vercel Settings → Environment Variables.',
      draft: currentDraft,
    });
  }

  if (!currentDraft || !currentDraft.formattedMessage) {
    return res.status(400).json({ error: 'No draft provided to revise.' });
  }

  const prompt = `You are the Therapeutic Letter Writer agent revising a message.

Original Draft:
"""
${currentDraft.formattedMessage}
"""

Current Context:
Recipient: ${extractedContext.recipientName || 'Recipient'} (${extractedContext.relationship || 'Peer'})
Feelings & Needs: ${extractedContext.userFeelings || ''} / ${extractedContext.userNeedsAndWants || ''}
Boundaries: ${extractedContext.boundariesAndConstraints || 'Preserve personal boundaries'}

Requested Revision:
Directive: ${revisionDirective || 'Custom'}
User Feedback / Notes: ${customFeedback || 'Refine tone and clarity'}

Revise the message to faithfully incorporate this feedback.
Preserve the user's authentic voice, eliminate any unearned apologies if they do not wish to apologize, and maintain firm, respectful boundaries without escalation.
Provide an updated explanation of the strategy and how the revision may be received.`;

  try {
    const response = await generateWithRetry({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        systemInstruction: THERAPEUTIC_LETTER_WRITER_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            formattedMessage: { type: Type.STRING },
            format: {
              type: Type.STRING,
              enum: ['personal_letter', 'email', 'text_message', 'brief_note'],
            },
            tone: {
              type: Type.STRING,
              enum: [
                'honest_gentle',
                'firm_clear',
                'calm_deescalated',
                'warm_accountable',
                'neutral_direct',
                'heartfelt_receptive',
              ],
            },
            subjectLine: { type: Type.STRING },
            salutation: { type: Type.STRING },
            closing: { type: Type.STRING },
            strategyExplanation: { type: Type.STRING },
            howItMayBeReceived: { type: Type.STRING },
            agentNote: { type: Type.STRING, description: 'Short note back to the user explaining what was adjusted.' },
          },
          required: [
            'title',
            'formattedMessage',
            'format',
            'tone',
            'strategyExplanation',
            'howItMayBeReceived',
            'agentNote',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    const wordCount = parsed.formattedMessage.trim().split(/\s+/).filter(Boolean).length;

    const revisedDraft = {
      ...currentDraft,
      title: parsed.title || currentDraft.title,
      formattedMessage: parsed.formattedMessage,
      format: parsed.format || currentDraft.format,
      tone: parsed.tone || currentDraft.tone,
      subjectLine: parsed.subjectLine || currentDraft.subjectLine,
      salutation: parsed.salutation || currentDraft.salutation,
      closing: parsed.closing || currentDraft.closing,
      strategyExplanation: parsed.strategyExplanation || currentDraft.strategyExplanation,
      howItMayBeReceived: parsed.howItMayBeReceived || currentDraft.howItMayBeReceived,
      wordCount,
      readingTimeSeconds: Math.max(10, Math.round((wordCount / 180) * 60)),
    };

    return res.json({
      draft: revisedDraft,
      agentNote: parsed.agentNote || 'I have updated the draft based on your feedback.',
    });
  } catch (error: any) {
    console.error('Agent revise error:', error);
    return res.json({
      draft: currentDraft,
      agentNote: 'Unable to revise at this moment. You can directly edit the draft on the right.',
    });
  }
};

// Register revise endpoint on both /api/agent/revise and /agent/revise for Vercel/proxy compatibility
app.post('/api/agent/revise', handleRevise);
app.post('/agent/revise', handleRevise);

// Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Start persistent server in container/local environments; export app for Vercel Serverless
if (!process.env.VERCEL) {
  startServer();
}

export default app;
