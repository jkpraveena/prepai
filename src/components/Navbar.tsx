import React from "react";
import { Sparkles, LayoutDashboard, History, PlayCircle, Flame } from "lucide-react";

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  streak: number;
}

export default function Navbar({ currentView, setView, streak }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0C]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Artistic Flair gradient design */}
        <div 
          onClick={() => setView("landing")} 
          className="flex cursor-pointer items-center space-x-3 transition active:scale-95"
          id="nav-logo"
        >
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-emerald-400 rounded-lg flex items-center justify-center font-bold text-black text-base shadow-lg shadow-indigo-500/10">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-white hover:text-indigo-200 transition-colors">
            PrepAI
          </span>
          <span className="hidden rounded-full bg-indigo-500/10 px-2 py-0.5 text-[9px] font-bold text-indigo-400 border border-indigo-500/15 sm:inline-block uppercase tracking-wider">
            v3.5 Flash
          </span>
        </div>

        {/* Global Navigation Links with active border style */}
        <nav className="hidden items-center space-x-1 md:flex">
          <button
            onClick={() => setView("landing")}
            className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              currentView === "landing"
                ? "bg-white/10 text-white border border-white/15"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
            id="nav-landing-btn"
          >
            Overview
          </button>
          <button
            onClick={() => setView("setup")}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              currentView === "setup" || currentView === "interview"
                ? "bg-white/10 text-white border border-white/15"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
            id="nav-practice-btn"
          >
            <PlayCircle className="h-4 w-4 text-emerald-400" />
            <span>Chamber</span>
          </button>
          <button
            onClick={() => setView("dashboard")}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              currentView === "dashboard"
                ? "bg-white/10 text-white border border-white/15"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
            id="nav-dashboard-btn"
          >
            <LayoutDashboard className="h-4 w-4 text-indigo-400" />
            <span>Analytics</span>
          </button>
          <button
            onClick={() => setView("history")}
            className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              currentView === "history"
                ? "bg-white/10 text-white border border-white/15"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
            id="nav-history-btn"
          >
            <History className="h-4 w-4 text-pink-400" />
            <span>Reviews</span>
          </button>
        </nav>

        {/* Action Widgets - Alex Rivera Profile mockup integration */}
        <div className="flex items-center space-x-4">
          {/* Practice Streak */}
          <div 
            title="Daily Practice Streak" 
            className="flex items-center space-x-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-500 border border-amber-500/20"
          >
            <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{streak} Days</span>
          </div>

          <div className="hidden sm:flex h-8 w-[1px] bg-white/10"></div>

          {/* User Profile Info from Design specifications */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">Alex Rivera</p>
              <p className="text-[10px] font-bold text-emerald-400 leading-none">Pro Plan</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-400/30 flex items-center justify-center text-xs font-bold text-indigo-300">
              AR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
