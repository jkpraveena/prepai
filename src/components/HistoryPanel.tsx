import React, { useState } from "react";
import { History, Search, Trash2, Calendar, Award, ChevronRight, ChevronDown, BookOpen, AlertCircle, Trash } from "lucide-react";
import { InterviewSession, Topic } from "../types";
import { TOPICS } from "../data";

interface HistoryPanelProps {
  sessions: InterviewSession[];
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

export default function HistoryPanel({ sessions, onDeleteSession, onClearAll }: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>("All");
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Filters logic
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = session.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          session.userAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopicFilter === "All" || session.topic === selectedTopicFilter;
    return matchesSearch && matchesTopic;
  });

  const toggleExpand = (id: string) => {
    if (expandedSessionId === id) {
      setExpandedSessionId(null);
    } else {
      setExpandedSessionId(id);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header Info */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6 border-b border-slate-900">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Stored Revision Index
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Review History</h2>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to permanently delete all practice history? This action is irreversible.")) {
                onClearAll();
              }
            }}
            className="flex items-center space-x-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition active:scale-95"
            id="history-clear-all"
          >
            <Trash2 className="h-4 w-4" />
            <span>Wipe History Ledger</span>
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        /* Empty State */
        <div className="mt-12 rounded-3xl border border-dashed border-slate-900 p-12 text-center text-slate-400 space-y-4">
          <History className="mx-auto h-12 w-12 text-slate-600 animate-pulse" />
          <div>
            <h3 className="text-lg font-bold text-white">No Mock Sessions Completed</h3>
            <p className="mt-1 text-sm text-slate-450 max-w-md mx-auto">
              You haven't submitted any questions for Gemini evaluation yet. Head over to the Mock Chamber, configure a track, and test your aptitude.
            </p>
          </div>
        </div>
      ) : (
        /* Stored ledger exists */
        <div className="mt-8 space-y-6">
          {/* Filtering controllers */}
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Search Input */}
            <div className="relative rounded-xl border border-slate-900 bg-slate-950 px-3 py-2 flex items-center col-span-2">
              <Search className="h-4 w-4 text-slate-500 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keywords in questions or answers..."
                className="w-full bg-transparent text-xs text-slate-200 focus:outline-none"
                id="history-search-input"
              />
            </div>

            {/* Topic Filter */}
            <div className="relative rounded-xl border border-slate-900 bg-slate-950 px-3 py-2 flex items-center">
              <span className="text-xs font-semibold text-slate-500 mr-2">Track:</span>
              <select
                value={selectedTopicFilter}
                onChange={(e) => setSelectedTopicFilter(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-semibold outline-none"
                id="history-filter-select"
              >
                <option value="All" className="bg-slate-950">All Tracks</option>
                <option value="JavaScript" className="bg-slate-950">JavaScript & Frontend</option>
                <option value="Python" className="bg-slate-950">Python Backend</option>
                <option value="DSA" className="bg-slate-950">Data Structures & Algos</option>
                <option value="AI/ML" className="bg-slate-950">AI & Machine Learning</option>
                <option value="HR Interview" className="bg-slate-950">Behavioral & HR</option>
              </select>
            </div>
          </div>

          {/* Sessions List */}
          {filteredSessions.length === 0 ? (
            /* Filtering leads to empty state */
            <div className="rounded-2xl border border-slate-900 p-8 text-center text-slate-500 text-xs">
              No previous ledger matching selection options. Clear filters to review full records.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => {
                const isExpanded = expandedSessionId === session.id;
                const score = session.evaluation?.score || 0;
                
                let scoreColor = "text-rose-455 bg-rose-500/10 border-rose-500/20";
                if (score >= 8) {
                  scoreColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                } else if (score >= 6) {
                  scoreColor = "text-indigo-400 bg-indigo-500/10 border-indigo-505/20";
                }

                return (
                  <div 
                    key={session.id}
                    className="rounded-2xl border border-slate-900 bg-slate-950/40 overflow-hidden transition-all duration-300"
                    id={`history-row-${session.id}`}
                  >
                    {/* Collapsed Heading Accordion */}
                    <div 
                      onClick={() => toggleExpand(session.id)}
                      className="flex cursor-pointer select-none items-center justify-between p-5 hover:bg-slate-900/15"
                    >
                      <div className="flex items-center space-x-3.5 pr-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide border rounded-lg ${scoreColor}`}>
                          SCORE: {score}/10
                        </span>
                        
                        <div>
                          <p className="text-xs text-slate-300 font-bold line-clamp-1 leading-normal">
                            {session.question}
                          </p>
                          <div className="flex items-center space-x-2.5 text-[10px] text-slate-500 font-bold mt-1">
                            <span className="text-indigo-400 uppercase tracking-widest">{session.topic}</span>
                            <span>•</span>
                            <span className="uppercase tracking-widest">{session.difficulty}</span>
                            <span>•</span>
                            <span className="flex items-center font-normal">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(session.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2.5 shrink-0 pl-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="rounded-lg p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition"
                          title="Delete record"
                          id={`history-delete-btn-${session.id}`}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                        {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && session.evaluation && (
                      <div className="border-t border-slate-900 bg-slate-950/80 px-5 py-6 space-y-5 animate-slideDown">
                        
                        {/* Question details */}
                        <div className="rounded-xl bg-slate-900/30 p-4 border border-indigo-500/10">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">PROMPTED QUESTION:</span>
                          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed font-sans">{session.question}</p>
                        </div>

                        {/* Speech Feedback text */}
                        <div className="rounded-xl bg-slate-900/10 p-4 border border-slate-850">
                          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-1">EVALUATOR REMARKS:</span>
                          <p className="text-xs text-slate-300 leading-relaxed italic">"{session.evaluation.feedback}"</p>
                        </div>

                        {/* Strengths and improvements columns grid */}
                        <div className="grid gap-4 sm:grid-cols-2 text-[11px]">
                          {/* Strengths */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-emerald-450 uppercase tracking-widest block">IDENTIFIED EXPERTISE:</span>
                            <ul className="space-y-1.5 text-slate-300">
                              {session.evaluation.strengths.map((str, i) => (
                                <li key={i} className="flex items-start space-x-1.5 leading-relaxed bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                                  <span className="text-emerald-400">✔</span>
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Improvements */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-purple-450 uppercase tracking-widest block">RECOMMENDED REVISION:</span>
                            <ul className="space-y-1.5 text-slate-300">
                              {session.evaluation.improvements.map((imp, i) => (
                                <li key={i} className="flex items-start space-x-1.5 leading-relaxed bg-purple-500/5 p-2 rounded-lg border border-purple-500/10">
                                  <span className="text-purple-400 font-bold">➜</span>
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Reference Answer Tab layout */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">EXEMPLAR REFERENCE ANSWER:</span>
                          <pre className="whitespace-pre-wrap text-[11px] leading-relaxed font-mono bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-850">
                            {session.evaluation.betterAnswer}
                          </pre>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
