import React, { useState } from "react";
import { Terminal, BookOpen, Brain, Target, Star, ChevronDown, Check, Sparkles, AlertCircle } from "lucide-react";
import { Topic, Difficulty, TopicMeta } from "../types";
import { TOPICS } from "../data";

interface SetupFormProps {
  onGenerate: (topic: Topic, difficulty: Difficulty) => void;
  isLoading: boolean;
  error: string | null;
}

export default function SetupForm({ onGenerate, isLoading, error }: SetupFormProps) {
  const [selectedTopic, setSelectedTopic] = useState<Topic>("JavaScript");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("Medium");

  const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

  const getTopicIcon = (id: Topic) => {
    switch (id) {
      case "JavaScript": return <Terminal className="h-5 w-5" />;
      case "Python": return <BookOpen className="h-5 w-5" />;
      case "DSA": return <Brain className="h-5 w-5" />;
      case "AI/ML": return <Target className="h-5 w-5" />;
      case "HR Interview": return <Star className="h-5 w-5" />;
    }
  };

  const activeTopicDetails = TOPICS.find(t => t.id === selectedTopic);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Brand Setup Heading */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Initialize Mock Chamber
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Configure specialization matrix and target difficulty. Press generate to start synthesis.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="mt-8 rounded-3xl border border-slate-900 bg-slate-950 p-6 shadow-2xl sm:p-8">
        
        {/* Step 1: Select Topic Track */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
            Step 1: Focus Track Specialization
          </label>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`relative cursor-pointer rounded-2xl border p-5 transition-all select-none flex flex-col justify-between ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/50"
                      : "border-slate-800 bg-slate-900/10 hover:border-slate-700 hover:bg-slate-900/30"
                  }`}
                  id={`setup-topic-card-${topic.id.replace(" ", "-")}`}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white">
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </span>
                  )}

                  <div>
                    <span className={`inline-flex rounded-xl p-2.5 ${topic.colorClass}`}>
                      {getTopicIcon(topic.id)}
                    </span>
                    <h3 className="mt-4 text-base font-bold text-white tracking-tight">
                      {topic.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Skills/Syllabus Preview Box */}
        {activeTopicDetails && (
          <div className="mt-6 rounded-2xl bg-slate-900/20 border border-slate-900 p-4">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-2">
              Chamber Skill Index — {activeTopicDetails.name}
            </span>
            <div className="flex flex-wrap gap-2">
              {activeTopicDetails.skillsCovered.map((skill, index) => (
                <span 
                  key={index}
                  className="rounded-lg bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-semibold text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Row for Difficulty Selector */}
        <div className="mt-8 border-t border-slate-900 pt-8 grid gap-6 sm:grid-cols-2">
          {/* Step 2: Select Difficulty */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Step 2: Experience Matrix
            </label>
            <div className="flex rounded-xl bg-slate-900/40 border border-slate-900 p-1.5">
              {difficulties.map((diff) => {
                const isSelected = selectedDifficulty === diff;
                let colorTheme = "hover:text-slate-200 text-slate-400";
                if (isSelected) {
                  if (diff === "Easy") colorTheme = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                  if (diff === "Medium") colorTheme = "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
                  if (diff === "Hard") colorTheme = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                }

                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${colorTheme}`}
                    id={`setup-difficulty-${diff}`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Informational Guide */}
          <div className="rounded-2xl border border-dashed border-slate-850 p-4 flex items-start space-x-3 text-slate-400 text-xs">
            <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Our evaluation agent tracks technical keyword matches, logical cohesion, and grammar variables to formulate accurate, industry-standard scores.
            </p>
          </div>
        </div>

        {/* Error Notification banner */}
        {error && (
          <div className="mt-6 rounded-2xl bg-rose-500/10 border border-rose-500/25 p-4 text-xs font-medium text-rose-400 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Final Trigger Submission Button */}
        <div className="mt-8 pt-6 border-t border-slate-900">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onGenerate(selectedTopic, selectedDifficulty)}
            className="w-full flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4 font-extrabold text-sm uppercase tracking-wider text-white shadow-xl shadow-indigo-500/5 hover:from-indigo-505 hover:to-purple-505 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            id="setup-generate-btn"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Synthesizing Interview Question...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 animate-pulse fill-white/10" />
                <span>Sync with Gemini & Generate Question</span>
              </div>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
