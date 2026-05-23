import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Terminal, BookOpen, Brain, Target, Star, HelpCircle, ArrowLeft, Send, RotateCw, Lightbulb, Hourglass, Trash } from "lucide-react";
import { Topic, Difficulty, InterviewQuestion } from "../types";

export function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    if (!text) return;

    let index = 0;
    let accum = "";
    const timer = setInterval(() => {
      if (index < text.length) {
        accum += text.charAt(index);
        setDisplayed(accum);
        index++;
      } else {
        clearInterval(timer);
      }
    }, 10); // snappy and delightful typing

    return () => clearInterval(timer);
  }, [text]);

  return <p className="whitespace-pre-wrap text-slate-200 leading-relaxed text-sm sm:text-base pr-2">{displayed}</p>;
}

interface InterviewPanelProps {
  topic: Topic;
  difficulty: Difficulty;
  questionData: InterviewQuestion;
  onSubmitAnswer: (answer: string) => void;
  onCancel: () => void;
  isEvaluating: boolean;
  evaluationError: string | null;
}

export default function InterviewPanel({
  topic,
  difficulty,
  questionData,
  onSubmitAnswer,
  onCancel,
  isEvaluating,
  evaluationError
}: InterviewPanelProps) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  
  // Timer states
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const wordCount = answer.trim() === "" ? 0 : answer.trim().split(/\s+/).length;

  const handlePrepackMockText = () => {
    setAnswer("Personally, I approach this problem by considering the architectural requirements. For " + topic + ", it's important to keep standards in mind...");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header Matrix details */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6 border-b border-slate-900">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onCancel}
            className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-400 hover:text-white transition active:scale-90"
            title="Return to setup"
            id="interview-back-btn"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                {topic}
              </span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                difficulty === "Medium" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                "bg-rose-500/10 text-rose-400 border-rose-500/20"
              }`}>
                {difficulty}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">Active Response Center</h2>
          </div>
        </div>

        {/* Dynamic Timer Widget */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 rounded-xl border border-slate-900 bg-slate-950/40 px-3.5 py-1.5 text-xs text-slate-400 font-mono">
            <Hourglass className="h-4 w-4 animate-spin text-slate-500" />
            <span>EXAM TIMER: {formatTimer(seconds)}</span>
          </div>
        </div>
      </div>

      {/* Main Studio layout */}
      <div className="mt-8 grid gap-8">
        
        {/* Left Hand: Question Box with Typing Effect */}
        <div className="rounded-2xl border border-indigo-500/20 bg-slate-950 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/5 blur-2xl rounded-full" />
          
          <div className="flex items-center space-x-2 text-indigo-400">
            <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">Gemini Evaluation Agent</span>
          </div>

          <div className="mt-4 min-h-[90px] text-slate-200">
            <TypingText text={questionData.question} />
          </div>

          <div className="mt-6 pt-5 border-t border-slate-900/60 flex items-center justify-between">
            {/* Toggleable Hint trigger */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-800 bg-slate-900/10 text-slate-400 hover:text-white transition"
              id="interview-hint-toggle"
            >
              <Lightbulb className={`h-4 w-4 ${showHint ? "text-amber-400 fill-amber-400/10" : "text-slate-500"}`} />
              <span>{showHint ? "Hide Hint" : "Reveal Hint"}</span>
            </button>

            {/* Micro mock helper */}
            <button 
              onClick={handlePrepackMockText}
              className="text-[10px] text-slate-550 hover:underline"
            >
              Paste starter draft template
            </button>
          </div>

          {/* Prompt Hint Drawer */}
          {showHint && (
            <div className="mt-4 rounded-xl bg-slate-900/30 border border-slate-800/60 p-4 text-xs text-amber-300 flex items-start space-x-2.5 animate-fadeIn">
              <span className="inline-flex rounded bg-amber-500/10 p-1 text-amber-400">
                <Lightbulb className="h-3.5 w-3.5" />
              </span>
              <p className="leading-relaxed">
                <strong>Recruiter Pointer:</strong> {questionData.hint}
              </p>
            </div>
          )}
        </div>

        {/* Answer Composition Box */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Compose Your Response:
            </label>
            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
              <span className={wordCount < 15 ? "text-rose-400" : "text-slate-500"}>
                {wordCount} Words (Min 15 recommended)
              </span>
              <span>•</span>
              <span>Markdown and code templates allowed</span>
            </div>
          </div>

          <div className="relative rounded-2xl border border-slate-905 bg-slate-950 focus-within:ring-1 focus-within:ring-indigo-500/50">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your complete, step-by-step reply here... (e.g. explain mechanisms, write code blocks if applicable, or detail behavioral methodologies using standard models)"
              rows={11}
              className="w-full bg-transparent px-5 py-4 text-sm text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-0 resize-y font-mono"
              id="interview-textarea"
            />
            
            {/* Quick clean state */}
            {answer.trim() !== "" && (
              <button 
                onClick={() => setAnswer("")}
                className="absolute right-4 bottom-4 p-2 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-rose-400 transition"
                title="Clear answer"
                id="interview-clear-text"
              >
                <Trash className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Error Banner */}
          {evaluationError && (
            <div className="rounded-2xl bg-rose-500/10 border border-rose-500/25 p-4 text-xs text-rose-400">
              {evaluationError}
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
            <button
              onClick={onCancel}
              className="rounded-xl border border-slate-800 bg-slate-900/10 px-5 py-3 text-xs font-bold text-slate-400 hover:bg-slate-900 hover:text-white transition active:scale-95 text-center"
              id="interview-cancel-btn"
            >
              Abuse & Reset Session
            </button>

            <button
              type="button"
              disabled={isEvaluating || answer.trim() === ""}
              onClick={() => onSubmitAnswer(answer)}
              className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-500/5 active:scale-95 disabled:pointer-events-none disabled:opacity-45"
              id="interview-submit-btn"
            >
              {isEvaluating ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin" />
                  <span>Submitting to Gemini Review...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 fill-white/10" />
                  <span>Submit Practice Response</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
