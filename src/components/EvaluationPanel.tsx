import React, { useState, useEffect } from "react";
import { Award, CheckCircle, AlertTriangle, BookOpen, Clock, ArrowRight, RefreshCw, LayoutDashboard, Copy, Code, Check } from "lucide-react";
import { Topic, Difficulty, AIEvaluation } from "../types";

export function RadialScoreMeter({ score }: { score: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const increment = score / steps;
    let stepCount = 0;

    const timer = setInterval(() => {
      stepCount++;
      if (stepCount >= steps) {
        setCurrent(score);
        clearInterval(timer);
      } else {
        setCurrent((prev) => {
          const val = prev + increment;
          return val > score ? score : +(val.toFixed(1));
        });
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const percentage = (current / 10) * 100;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = "stroke-rose-500 text-rose-450";
  let bgGlow = "from-rose-500/5 to-transparent";
  if (score >= 7.5) {
    colorClass = "stroke-emerald-500 text-emerald-400";
    bgGlow = "from-emerald-500/5 to-transparent";
  } else if (score >= 5.0) {
    colorClass = "stroke-indigo-500 text-indigo-400";
    bgGlow = "from-indigo-500/5 to-transparent";
  }

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-900 bg-gradient-to-b ${bgGlow} shadow-xl`}>
      <div className="relative h-24 w-24">
        <svg className="h-full w-full rotate-[-90deg]">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="7"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            className={`transition-all duration-300 ${colorClass.split(" ")[0]}`}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white leading-none">{current}</span>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Score / 10</span>
        </div>
      </div>
      <h4 className="mt-4 text-xs font-extrabold uppercase tracking-widest text-slate-400">Rating Analysis</h4>
      <span className={`text-sm font-bold mt-1 ${colorClass.split(" ")[1]}`}>
        {score >= 8.5 ? "Superior Work" : score >= 7.0 ? "Solid Execution" : score >= 5.0 ? "Requires Study" : "Critique Review Needed"}
      </span>
    </div>
  );
}

interface EvaluationPanelProps {
  topic: Topic;
  difficulty: Difficulty;
  question: string;
  userAnswer: string;
  evaluation: AIEvaluation;
  onNextSession: () => void;
  onGoDashboard: () => void;
}

export default function EvaluationPanel({
  topic,
  difficulty,
  question,
  userAnswer,
  evaluation,
  onNextSession,
  onGoDashboard
}: EvaluationPanelProps) {
  const [activeTab, setActiveTab] = useState<"reference" | "user">("reference");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(evaluation.betterAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Upper Status Bar */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6 border-b border-slate-900">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Evaluation Report Matrix
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Session Results Summary</h2>
        </div>
        
        {/* Navigation Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onGoDashboard}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-slate-900 active:scale-95"
            id="evaluation-dashboard-link"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={onNextSession}
            className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white transition hover:from-indigo-50o hover:to-purple-50o active:scale-95"
            id="evaluation-next-btn"
          >
            <span>Next Question</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Stats Split Layout */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        
        {/* Left hand details (score radial & topic specs) */}
        <div className="space-y-6">
          <RadialScoreMeter score={evaluation.score} />

          {/* Specialization Specs Card */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-450">Chamber Specifications</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-900/60 border border-slate-800/40 p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Focus Area</span>
                <p className="text-xs font-extrabold text-white mt-0.5">{topic}</p>
              </div>
              <div className="rounded-xl bg-slate-900/60 border border-slate-800/40 p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Difficulty</span>
                <p className="text-xs font-extrabold text-white mt-0.5">{difficulty}</p>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-slate-800 p-3.5">
              <span className="text-[10px] font-bold text-indigo-400 uppercase flex items-center mb-1.5">
                <Award className="h-3.5 w-3.5 mr-1 text-indigo-400" />
                Study Recommendation
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {evaluation.score >= 8 ? (
                  "You have solid command over this scenario. Try harder configurations to challenge edge-cases."
                ) : evaluation.score >= 5.5 ? (
                  "Good progress. Re-implement the gaps detailed on the right to polish your responses."
                ) : (
                  "Focus heavily on the model syntax below and attempt similar structures."
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Hand: Detailed Strengths & Improvement list */}
        <div className="md:col-span-2 space-y-6">
          {/* Graded Details */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950 p-6 space-y-6">
            
            {/* Speeches feedback */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">Mentor Remarks</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/10 rounded-xl p-4 border border-slate-850 italic">
                "{evaluation.feedback}"
              </p>
            </div>

            {/* Strengths Accordion Column */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Identified Strengths ({evaluation.strengths.length})</span>
              </div>
              <ul className="grid gap-2 text-xs">
                {evaluation.strengths.map((str, index) => (
                  <li key={index} className="flex items-start space-x-2.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-3 text-slate-300 leading-relaxed">
                    <span className="text-emerald-400 font-bold mt-0.5">✔</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements Accordion Column */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-purple-400">
                <AlertTriangle className="h-4 w-4 text-purple-400" />
                <span className="text-xs font-extrabold uppercase tracking-wider">Targeted Revisions Needed ({evaluation.improvements.length})</span>
              </div>
              <ul className="grid gap-2 text-xs">
                {evaluation.improvements.map((imp, index) => (
                  <li key={index} className="flex items-start space-x-2.5 rounded-xl border border-purple-500/10 bg-purple-500/5 p-3 text-slate-300 leading-relaxed">
                    <span className="text-purple-400 font-black mt-0.5">➜</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Comparisons Studio Side-by-Side Accordions */}
      <div className="mt-8 rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden">
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-slate-900 px-5 py-3 bg-slate-950">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab("reference")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === "reference"
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
              id="evaluation-tab-reference"
            >
              Exemplar Reference Res
            </button>
            <button
              onClick={() => setActiveTab("user")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === "user"
                  ? "bg-slate-900 text-slate-200"
                  : "text-slate-400 hover:text-white"
              }`}
              id="evaluation-tab-user"
            >
              Your Response
            </button>
          </div>

          {activeTab === "reference" && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition"
              id="evaluation-copy-code"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied Sample" : "Copy Exemplar"}</span>
            </button>
          )}
        </div>

        {/* Tab Context panel slider */}
        <div className="p-5 max-h-[440px] overflow-y-auto bg-slate-950 font-mono text-xs sm:text-sm">
          {activeTab === "reference" ? (
            <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-sans prose prose-invert">
              {evaluation.betterAnswer}
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-slate-450 leading-relaxed bg-slate-900/20 p-4 border border-slate-900 rounded-xl font-mono text-xs">
              {userAnswer.trim() === "" ? "[Skip answer submitted]" : userAnswer}
            </div>
          )}
        </div>
      </div>

      {/* Retrial and back button panel */}
      <div className="mt-8 flex items-center justify-center space-x-4">
        <button
          onClick={onNextSession}
          className="flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-900/50 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white hover:bg-slate-900 transition active:scale-95"
          id="evaluation-try-again"
        >
          <RefreshCw className="h-4 w-4 text-indigo-400" />
          <span>Launch Fresh Question</span>
        </button>
      </div>

    </div>
  );
}
