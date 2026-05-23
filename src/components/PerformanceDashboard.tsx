import React from "react";
import { TrendingUp, Award, Play, BookOpen, Flame, Zap, CheckSquare, Target, Activity } from "lucide-react";
import { InterviewSession, Topic } from "../types";
import { TOPICS } from "../data";

interface PerformanceDashboardProps {
  sessions: InterviewSession[];
  streak: number;
  onNavigateToPractice: () => void;
}

export default function PerformanceDashboard({ sessions, streak, onNavigateToPractice }: PerformanceDashboardProps) {
  const totalSessions = sessions.length;

  // Calculate stats
  const averageScore = totalSessions > 0 
    ? +(sessions.reduce((acc, curr) => acc + (curr.evaluation?.score || 0), 0) / totalSessions).toFixed(1)
    : 0;

  // XP Calculation: 100 XP per completed session + multiplier for high score
  const totalXP = sessions.reduce((acc, curr) => {
    const base = 100;
    const scoreBonus = (curr.evaluation?.score || 0) * 15;
    return acc + base + scoreBonus;
  }, 0);

  // User Tier calculation
  let userTier = "Initiate Practitioner";
  let tierColor = "text-indigo-400 border-indigo-500/10 bg-indigo-500/5";
  if (totalXP >= 2000) {
    userTier = "Staff Candidate Alumnus";
    tierColor = "text-amber-400 border-amber-500/10 bg-amber-500/5";
  } else if (totalXP >= 1000) {
    userTier = "Aptitude Scholar Core";
    tierColor = "text-purple-400 border-purple-500/10 bg-purple-500/5";
  } else if (totalXP >= 400) {
    userTier = "Chamber Specialist";
    tierColor = "text-emerald-400 border-emerald-500/10 bg-emerald-500/5";
  }

  // Study Distribution by Topic
  const topicBreakdown = TOPICS.reduce((acc, topic) => {
    const count = sessions.filter(s => s.topic === topic.id).length;
    acc[topic.id] = count;
    return acc;
  }, {} as Record<Topic, number>);

  const maxCategoryCount = Math.max(...Object.values(topicBreakdown), 1);

  // Get score trendline coordinates (SVG spline)
  const lastSessions = [...sessions].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).slice(-10);
  const splineWidth = 450;
  const splineHeight = 130;
  const padding = 20;

  let scorePoints = "";
  if (lastSessions.length > 1) {
    const stepX = (splineWidth - padding * 2) / (lastSessions.length - 1);
    scorePoints = lastSessions.map((session, index) => {
      const score = session.evaluation?.score || 0;
      const x = padding + index * stepX;
      // Invert Y because 0 (top of SVG) must map to highest score (10), and height (bottom) maps to lower score (1)
      const y = splineHeight - padding - ((score - 1) / 9) * (splineHeight - padding * 2);
      return `${x},${y}`;
    }).join(" ");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      
      {/* SECTION 1: USER TIER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-900 bg-slate-950 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 blur-3xl opacity-60 rounded-full" />
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${tierColor}`}>
                {userTier}
              </span>
              <span className="flex items-center text-xs text-amber-500 font-bold">
                <Flame className="h-4 w-4 fill-amber-500 text-amber-500 mr-1 animate-pulse" />
                {streak} Day Practice Streak
              </span>
            </div>

            <h1 className="text-3xl font-black text-white mt-3 tracking-tight">
              Aptitude Analytics Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400 leading-relaxed max-w-xl">
              Track your conceptual mastery curves, examine historical trendlines, and gain competitive industry placement insights.
            </p>
          </div>

          {/* XP Progress Indicator */}
          <div className="flex items-center space-x-4 bg-slate-900/40 border border-slate-900 px-5 py-4 rounded-2xl shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/15">
              <Zap className="h-5 w-5 fill-indigo-400/20 text-indigo-400" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block font-sans">Cumulative Progress Score</span>
              <p className="text-2xl font-black text-white mt-0.5">{totalXP} XP</p>
            </div>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-slate-900 p-16 text-center space-y-4">
          <Activity className="h-10 w-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No evaluation metrics computed yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Complete your first specialized mock interview so PrepAI can begin generating curve metrics and bento stats.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToPractice}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-indigo-500 transition"
              id="dashboard-empty-practice-redirect"
            >
              Start Practice Session
            </button>
          </div>
        </div>
      ) : (
        /* Core Dashboard metrics */
        <div className="grid gap-6 md:grid-cols-3">
          
          {/* Bento Stats Column */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Average score Card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block leading-none">Aptitude Avg Rating</span>
                <p className="text-3xl font-black text-white mt-2 font-mono">
                  {averageScore} <span className="text-sm text-slate-500 font-normal">/ 10</span>
                </p>
                <div className="mt-2.5 flex items-center text-[10px] text-slate-450 font-bold uppercase">
                  <TrendingUp className="h-3.5 w-3.5 mr-1 text-indigo-400" />
                  <span>Topic-wide benchmark</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 shrink-0">
                <Target className="h-6 w-6" />
              </div>
            </div>

            {/* Total Completed Card */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block leading-none">Chamber Completions</span>
                <p className="text-3xl font-black text-white mt-2 font-mono">
                  {totalSessions} <span className="text-sm text-emerald-400 font-normal">Completed</span>
                </p>
                <div className="mt-2.5 flex items-center text-[10px] text-slate-450 font-bold uppercase">
                  <CheckSquare className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  <span>Mock records calculated</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 shrink-0">
                <Award className="h-6 w-6" />
              </div>
            </div>

            {/* Focus Target Category Recommendations */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-3">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Study Mentorship Recommendation:</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {averageScore >= 8.5 ? (
                  "Incredible execution! Your score is in the top 95th percentile. We recommend attempting HR conflict scenarios to complete behavioral training."
                ) : averageScore >= 6.5 ? (
                  "Solid foundation! Review the gaps in your lowest scores to master the remaining 15% edge cases. Try DSA for recursion algorithms."
                ) : (
                  "Focus heavily on reviewing missing parameters and the code samples provided in your completed studies. Consistent practice is key."
                )}
              </p>
            </div>

          </div>

          {/* Graphical/Analytical Dashboard Columns */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Distribution chart by track */}
            <div className="rounded-2xl border border-slate-100 bg-slate-950 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Syllabus Completion Ratio</h3>
                  <p className="text-[10px] text-slate-450 mt-0.5">Quantity of sessions calculated per evaluation focus area</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Active matrix</span>
              </div>

              <div className="space-y-3 pt-2">
                {TOPICS.map((track) => {
                  const count = topicBreakdown[track.id] || 0;
                  const ratio = +(count / maxCategoryCount).toFixed(2) * 100;
                  
                  return (
                    <div key={track.id} className="space-y-1" id={`dashboard-track-metric-${track.id.replace(" ", "-")}`}>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-350">{track.name}</span>
                        <span className="text-slate-500 font-bold">{count} Completed</span>
                      </div>
                      
                      {/* Bar Background */}
                      <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                        {/* Interactive fill state */}
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r from-indigo-500/80 to-purple-500/80 transition-all duration-700`}
                          style={{ width: `${Math.max(ratio, 3)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Score trendline curve */}
            <div className="rounded-2xl border border-slate-900 bg-slate-950 p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Knowledge Performance Curve</h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Trace of Gemini evaluation ratings (Easy vs Hard) across your chronological attempts</p>
              </div>

              {lastSessions.length < 2 ? (
                <div className="h-[130px] flex items-center justify-center border border-dashed border-slate-900 rounded-xl text-center p-4">
                  <p className="text-xs text-slate-500">Need at least 2 completed sessions to compile chronological performance trajectories.</p>
                </div>
              ) : (
                <div className="pt-2">
                  {/* Custom Trendline SVG */}
                  <svg 
                    viewBox={`0 0 ${splineWidth} ${splineHeight}`} 
                    className="w-full h-auto overflow-visible"
                  >
                    {/* Grid lines */}
                    <line x1="10" y1="20" x2={splineWidth - 10} y2="20" className="stroke-slate-900" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="10" y1="65" x2={splineWidth - 10} y2="65" className="stroke-slate-900" strokeWidth="1" strokeDasharray="3 3" />
                    <line x1="10" y1="110" x2={splineWidth - 10} y2="110" className="stroke-slate-900" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Left side metrics markers */}
                    <text x="5" y="24" className="text-[8px] fill-slate-500 font-bold font-mono">10</text>
                    <text x="5" y="69" className="text-[8px] fill-slate-500 font-bold font-mono">5</text>
                    <text x="5" y="114" className="text-[8px] fill-slate-500 font-bold font-mono">1</text>

                    {/* Spline Path stroke */}
                    <polyline
                      fill="none"
                      stroke="url(#splineGradient)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={scorePoints}
                    />

                    {/* Definitions for gorgeous neon color shading */}
                    <defs>
                      <linearGradient id="splineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>

                    {/* Score Point circles */}
                    {lastSessions.map((session, index) => {
                      const score = session.evaluation?.score || 0;
                      const stepX = (splineWidth - padding * 2) / (lastSessions.length - 1);
                      const x = padding + index * stepX;
                      const y = splineHeight - padding - ((score - 1) / 9) * (splineHeight - padding * 2);
                      return (
                        <g key={session.id} className="group cursor-pointer">
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            className="fill-slate-950 stroke-indigo-400 stroke-2"
                          />
                          <circle
                            cx={x}
                            cy={y}
                            r="3"
                            className="fill-pink-500"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
