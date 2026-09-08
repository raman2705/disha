"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { ArrowRight, Mic, MicOff, Send, Sparkles, Volume2, X } from "lucide-react";
import { useAppState } from "@/components/AppContext";
import { answerFromDishaContext, type AssistantResponse } from "@/lib/assistant";
import { assistantStarters, buildDishaContext, type DishaContext } from "@/lib/dishaContext";
import { finalizeNormalAssessment } from "@/lib/normalAssessment";
import { deepQuestions } from "@/lib/assessmentFlow";
import type { Opportunity } from "@/lib/opportunities";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type Message = {
  role: "user" | "assistant";
  text: string;
  response?: AssistantResponse;
};

export function DishaAssistantDrawer() {
  const pathname = usePathname();
  const { assistantOpen, setAssistantOpen, demoState, guidedDemoOpportunityId, guidedDemoActive, normalAssessment, setNormalAssessment } = useAppState();
  const context = useMemo(
    () => buildDishaContext({ pathname, opportunityId: guidedDemoActive ? guidedDemoOpportunityId : undefined, demoState, guidedDemoActive, normalAssessment }),
    [pathname, guidedDemoOpportunityId, demoState, guidedDemoActive, normalAssessment]
  );
  const starters = useMemo(() => assistantStarters(context), [context]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const speechWindow = window as typeof window & {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const SpeechRecognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    setSpeechAvailable(Boolean(SpeechRecognition));

    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      Array.from(event.results).forEach((result) => {
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) finalText += text;
        else interimText += text;
      });
      setTranscript(finalText || interimText);
      if (finalText.trim()) {
        setInput(finalText.trim());
      }
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        text: greetingForContext(context)
      }
    ]);
  }, [context.mode, context.profile.name, context.activeOpportunity?.name, context.journeyStage, context.currentOwner, context.paymentState]);

  const ask = async (message: string) => {
    const clean = message.trim();
    if (!clean) return;
    setInput("");
    setTranscript("");
    setMessages((current) => [...current, { role: "user", text: clean }]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, context })
      });
      if (!response.ok) throw new Error("Assistant API failed");
      const payload = (await response.json()) as AssistantResponse;
      setMessages((current) => [...current, { role: "assistant", text: payload.answer, response: payload }]);
      applyStructuredFactUpdate(clean);
    } catch {
      const payload = answerFromDishaContext(clean, context);
      setMessages((current) => [...current, { role: "assistant", text: payload.answer, response: payload }]);
      applyStructuredFactUpdate(clean);
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void ask(input);
  };

  const toggleMic = () => {
    if (!speechAvailable || !recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    setTranscript("");
    setListening(true);
    recognitionRef.current.start();
  };

  const speakLatest = () => {
    const latest = [...messages].reverse().find((message) => message.role === "assistant")?.response?.speechResponse;
    if (!latest || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(latest));
  };

  const applyStructuredFactUpdate = (message: string) => {
    if (guidedDemoActive || !normalAssessment.generated || !normalAssessment.assessmentResult || !context.activeOpportunity) return;
    const text = message.toLowerCase();
    const mentionsLeadership = /\b(led|lead|leadership|team|volunteer|organised|organized)\b/.test(text);
    if (!mentionsLeadership) return;

    // A fact stated in chat is an answer to a deep question, not a separate opinion: it is written
    // into the same draft the pages use, and the result is recomputed by the same engine.
    const answer = teamAnswerFor(context.activeOpportunity);
    if (!answer || normalAssessment.deepAnswers[answer.questionId] === answer.value) return;

    const previous = normalAssessment.assessmentResult;
    const nextDraft = finalizeNormalAssessment(
      {
        ...normalAssessment,
        deepAnswers: { ...normalAssessment.deepAnswers, [answer.questionId]: answer.value }
      },
      context.activeOpportunity
    );

    setNormalAssessment(nextDraft);
    const next = nextDraft.assessmentResult;
    if (!next) return;
    const previousFit = previous.competitiveness.score ?? "not scored";
    const nextFit = next.competitiveness.score ?? "not scored";
    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        text: `Saved that as your answer to "${answer.questionLabel}". The assessment was recomputed: competitive fit moved from ${previousFit} to ${nextFit}, and the recommendation is now ${next.recommendationLabel}.`
      }
    ]);
  };

  return (
    <>
      {assistantOpen ? <button aria-label="Close Disha Assistant backdrop" className="fixed inset-0 z-40 bg-slate-950/30" type="button" onClick={() => setAssistantOpen(false)} /> : null}
      <aside
        className={clsx(
          "fixed right-0 top-0 z-50 flex h-dvh w-full max-w-[440px] flex-col bg-white shadow-2xl ring-1 ring-stone-200 transition-transform duration-300",
          assistantOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!assistantOpen}
      >
        <div className="border-b border-stone-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EEF2FF] text-primary">
                <Sparkles size={19} />
              </span>
              <div>
                <h2 className="text-xl font-black text-ink">Disha Assistant</h2>
                <p className="mt-1 text-sm leading-5 text-muted">
                  {context.journeyStage} · {context.currentOwner}
                </p>
              </div>
            </div>
            <button type="button" onClick={() => setAssistantOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-md text-slate-600 hover:bg-stone-100" aria-label="Close Disha Assistant">
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {starters.map((starter) => (
              <button key={starter} type="button" onClick={() => ask(starter)} className="rounded-full bg-[#FBF7F1] px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-stone-200 hover:bg-[#EEF2FF]">
                {starter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-[#FFFCF8] p-5">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={clsx("rounded-lg p-4 text-sm leading-6 shadow-sm", message.role === "user" ? "ml-8 bg-primary text-white" : "mr-8 bg-white text-slate-700 ring-1 ring-stone-200")}>
              <p>{message.text}</p>
              {message.response?.supportingEvidence.length ? (
                <details className="mt-3 border-t border-stone-200 pt-3">
                  <summary className="cursor-pointer text-xs font-black uppercase tracking-normal text-primary">View evidence</summary>
                  <ul className="mt-2 space-y-1">
                    {message.response.supportingEvidence.slice(0, 3).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </details>
              ) : null}
              {message.response?.suggestedNextAction ? (
                <p className="mt-3 rounded-md bg-[#EEF2FF] p-2 text-xs font-bold text-primary">
                  Next: {message.response.suggestedNextAction}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="border-t border-stone-200 bg-white p-4">
          {transcript ? (
            <p className="mb-3 rounded-md bg-[#EEF2FF] p-2 text-xs font-semibold text-primary">
              {listening ? "Listening: " : "Transcript: "}{transcript}
            </p>
          ) : null}
          {!speechAvailable ? (
            <p className="mb-3 text-xs font-semibold text-muted">Voice input is not supported in this browser. Typed input still works.</p>
          ) : null}
          <div className="flex items-center gap-2 rounded-full bg-[#FBF7F1] p-2 ring-1 ring-stone-200">
            <button type="button" onClick={toggleMic} className={clsx("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", listening ? "bg-red-600 text-white" : "bg-white text-primary")} aria-label={listening ? "Stop listening" : "Start voice input"}>
              {listening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask Disha..." className="min-h-10 flex-1 bg-transparent text-sm outline-none" />
            <button type="button" onClick={speakLatest} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-700" aria-label="Speak latest answer">
              <Volume2 size={17} />
            </button>
            <button type="submit" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white" aria-label="Send">
              {input ? <Send size={17} /> : <ArrowRight size={17} />}
            </button>
          </div>
        </form>
      </aside>
    </>
  );
}

/**
 * Maps a leadership or team fact stated in chat onto the deep question it actually answers for the
 * opportunity in view. Returns nothing when that opportunity has no such question, so the
 * assistant never invents an answer to a question this opportunity does not ask.
 */
function teamAnswerFor(opportunity: Opportunity) {
  const question = deepQuestions(opportunity).find((item) => item.id === "team" || item.id === "trackRecord");
  if (!question) return null;
  const value = question.options[question.options.length - 1];
  return value ? { questionId: question.id, questionLabel: question.label, value } : null;
}

function greetingForContext(context: DishaContext) {
  const name = context.profile.name === "you" ? "there" : context.profile.name.split(" ")[0];
  const opportunity = context.activeOpportunity?.name ?? "this opportunity";

  if (context.mode === "normal" && !context.assessmentResult) {
    return "Hi 👋 I can help you assess an opportunity, understand what evidence matters, or figure out what to improve. What are you working on?";
  }

  if (context.journeyStage === "Assess") {
    return `Hi ${name}. I see you're looking at ${opportunity}. Your profile has some useful signals; I can help you spot what to fix first.`;
  }

  if (context.journeyStage === "Verification") {
    return `Hi ${name}. This application is with ${context.currentOwner} right now. You do not need to act unless they ask for a correction.`;
  }

  if (context.journeyStage === "Payment" && context.paymentState === "blocked") {
    return `Hi ${name}. I found why the payment has not moved: the beneficiary name needs correction. I can help you fix it.`;
  }

  if (context.journeyStage === "Payment" && context.paymentState === "revalidating") {
    return `Hi ${name}. The payment blocker is fixed. PFMS and the bank have the next step now.`;
  }

  if (context.journeyStage === "Renewal") {
    return `Hi ${name}. You can reuse most of the previous packet. The renewal needs the latest academic proof.`;
  }

  return `Hi ${name}. Tell me what you are trying to do, and I will help you choose the next useful step.`;
}
