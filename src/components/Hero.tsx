import React from "react";
import { Sparkles, Terminal, BookOpen, Target, CheckCircle2, ArrowRight, Star, Brain, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { HOW_IT_WORKS, ADVANTAGES, TOPICS } from "../data";

interface HeroProps {
  setView: (view: string) => void;
}

export default function Hero({ setView }: HeroProps) {
  // Animation presets
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute -top-10 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 h-[600px] w-[600px] rounded-full bg-pink-500/5 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8">
        
        {/* SECTION 1: HERO DISPLAY */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Tagline Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/25 bg-indigo-500/5 px-3 py-1 text-sm text-indigo-300">
            <Sparkles className="h-4 w-4 animate-spin text-indigo-400" />
            <span className="font-semibold text-xs tracking-wider uppercase">PrepAI AI Studio Mentor Engine v3.5</span>
          </motion.div>

          {/* Heading Title */}
          <motion.h1 
            variants={itemVariants}
            className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
          >
            <span className="block text-slate-100">Supercharge Your Technical</span>
            <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
              Interview Readiness
            </span>
          </motion.h1>

          {/* Supporting Pitch */}
          <motion.p 
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg md:text-xl md:leading-relaxed"
          >
            Unlock internship-level aptitude benchmarks with real-time, topic-driven mock interviews. Powered by the high-caliber Gemini 3.5 Flash server-side engine.
          </motion.p>

          {/* Core Interactive CTAs */}
          <motion.div 
            variants={itemVariants}
            className="mx-auto mt-10 flex max-w-sm flex-col justify-center gap-4 sm:flex-row sm:max-w-none"
          >
            <button
              onClick={() => setView("setup")}
              className="flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/10 hover:from-indigo-500 hover:to-purple-500 transition hover:shadow-indigo-500/25 active:scale-95"
              id="hero-cta-practice"
            >
              Start Practice Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={() => {
                const element = document.getElementById("tracks-syllabi");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-xl border border-slate-800 bg-slate-900/40 px-8 py-4 text-base font-bold text-slate-300 backdrop-blur hover:bg-slate-900 hover:text-white transition active:scale-95"
              id="hero-cta-features"
            >
              Explore Tracks
            </button>
          </motion.div>

          {/* Metrics / Placement Indicators */}
          <motion.div 
            variants={itemVariants}
            className="mt-16 border-t border-slate-900 py-8"
          >
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-white">100%</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">Server-Side Security</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-indigo-400">9.4/10</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">Average User Improvement</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-purple-400">&lt;5s</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">Synthesis Speed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-pink-400">5 Tracks</p>
                <p className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-widest">Comprehensive Syllabus</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* SECTION 2: TRACK SYLLABI / SPECIALIZATIONS */}
        <div id="tracks-syllabi" className="mt-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Professional Evaluation Chambers</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Ace standardized tech challenges custom-tailored to high-demand corporate benchmarks.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((track) => (
              <div 
                key={track.id}
                onClick={() => setView("setup")}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-slate-900/20"
                id={`hero-track-card-${track.id.replace(" ", "-")}`}
              >
                {/* Glowing Overlay border */}
                <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br opacity-0 blur-xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-10 ${track.bgGradient}`} />

                <div className="flex items-start justify-between">
                  <span className={`inline-flex rounded-xl border p-3 ${track.colorClass}`}>
                    {track.id === "JavaScript" && <Terminal className="h-6 w-6" />}
                    {track.id === "Python" && <BookOpen className="h-6 w-6" />}
                    {track.id === "DSA" && <Brain className="h-6 w-6" />}
                    {track.id === "AI/ML" && <Target className="h-6 w-6" />}
                    {track.id === "HR Interview" && <Star className="h-6 w-6" />}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">Active Track</span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {track.name}
                </h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {track.description}
                </p>

                {/* Embedded dynamic core requirements */}
                <div className="mt-4 pt-4 border-t border-slate-900">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Core Competencies:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {track.skillsCovered.map((skill, index) => (
                      <span 
                        key={index}
                        className="rounded bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: HOW IT WORKS STEPPER */}
        <div className="mt-32">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Intelligent Synthesizes Pipeline</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Our automated system processes responses across customized reasoning engines.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((flow) => (
              <div 
                key={flow.step}
                className="relative rounded-2xl border border-slate-900 bg-slate-950 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-3xl font-black text-transparent">
                      {flow.step}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                      {flow.badge}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">{flow.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{flow.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: AI MENTOR VALUE METRICS */}
        <div className="mt-32 rounded-3xl border border-slate-900 bg-gradient-to-b from-slate-950/20 via-slate-900/30 to-slate-950 p-8 sm:p-12">
          <div className="grid gap-12 lg:grid-cols-3">
            <div>
              <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">PrepAI Advantages</span>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Crafted for Top Candidates</h2>
              <p className="mt-4 text-slate-400">
                Study with features custom tuned for job applicants, university students, and boot camp survivors preparing for technical interviews.
              </p>
              <div className="mt-8">
                <button
                  onClick={() => setView("setup")}
                  className="inline-flex items-center space-x-1 font-bold text-indigo-400 hover:text-indigo-300 group"
                  id="hero-value-cta"
                >
                  <span>Build your custom session</span>
                  <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 grid gap-6 sm:grid-cols-3">
              {ADVANTAGES.map((adv, index) => (
                <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                    {adv.icon === "Target" && <Target className="h-5 w-5" />}
                    {adv.icon === "Terminal" && <Terminal className="h-5 w-5" />}
                    {adv.icon === "LineChart" && <CheckCircle2 className="h-5 w-5" />}
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-white">{adv.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{adv.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
