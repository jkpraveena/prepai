import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SetupForm from "./components/SetupForm";
import InterviewPanel from "./components/InterviewPanel";
import EvaluationPanel from "./components/EvaluationPanel";
import HistoryPanel from "./components/HistoryPanel";
import PerformanceDashboard from "./components/PerformanceDashboard";
import { Topic, Difficulty, InterviewQuestion, AIEvaluation, InterviewSession } from "./types";

// Default onboarding mockup dataset to display on first page load
const DEFAULT_ONBOARDING_SESSIONS: InterviewSession[] = [
  {
    id: "init-01",
    topic: "JavaScript",
    difficulty: "Medium",
    question: "Explain the visual differences between standard Promises, async/await constructs, and classical callbacks in high-traffic JavaScript applications. What key performance bottlenecks are avoided by using promise aggregators like Promise.allSettled?",
    userAnswer: "In JavaScript, callbacks were the traditional way of handling async tasks but they led to nested structures (callback hell). Promises solved this by providing a chainable .then() syntax, while async/await is modern syntax sugar over promises that look synchronous. Bottlenecks are avoided by Promise.allSettled because it runs tasks in parallel without failing the entire chain if only one fails, unlike Promise.all which rejects immediately.",
    evaluation: {
      score: 8,
      strengths: [
        "Accurately described historical progression from standard callbacks to Promises and then async/await.",
        "Demonstrated solid under-the-hood awareness of the microtask queue behaviors by prioritizing parallelization.",
        "Correctly detailed the contrast between Promise.all (fail-fast) and Promise.allSettled (resilient aggregation)."
      ],
      improvements: [
        "Could expand on memory profiling implications when creating excessive thread chains in V8.",
        "Missed out on defining error handling boundaries (e.g. standard try/catch wrappers around async/await blocks)."
      ],
      betterAnswer: `// Complete senior-tier example detailing resilient Promise aggregation & error propagation\n\nasync function performResilientAggregation(apiEndpoints) {\n  const fetchOperations = apiEndpoints.map(endpoint => \n    fetch(endpoint)\n      .then(res => {\n        if (!res.ok) throw new Error(\`Network error on endpoint: \${endpoint}\`);\n        return res.json();\n      })\n  );\n\n  // Promise.allSettled aggregates outcomes as arrays of status objects\n  const results = await Promise.allSettled(fetchOperations);\n\n  return results.map(result => {\n    if (result.status === "fulfilled") {\n      return { status: "success", data: result.value };\n    } else {\n      logger.error(\`Task failed: \${result.reason?.message}\`);\n      return { status: "failure", error: result.reason?.message };\n    }\n  });\n}`,
      feedback: "Excellent layout of Promises vs async/await. Your explanation is concise and technical. Implementing explicit try/catch blocks within async declarations would elevate this response to a Senior tier."
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: "init-02",
    topic: "DSA",
    difficulty: "Hard",
    question: "Analyze the worst-case, average-case, and best-case time and space complexity of Quick Sort. Under what structural configurations does the algorithm degenerate into its worst-case complexity, and how is this avoided in standard libraries?",
    userAnswer: "Quick Sort is a divide and conquer algorithm. Best and average case are O(n log n). Worst case is O(n^2). This worst case happens when the pivot chosen is always the maximum or minimum element, e.g. when the array is already sorted. Standard libraries avoid this by selecting a random pivot, or using 'median-of-three' pivot selection.",
    evaluation: {
      score: 9,
      strengths: [
        "Clearly identified Big O levels for best, average, and worst-case configurations.",
        "Correctly described array states (already sorted/reverse-sorted) that lead to n^2 partition collapses.",
        "Understood industry mitigations using randomized pivots or median-of-three calculations."
      ],
      improvements: [
        "Did not detail auxiliary call stack memory requirements (O(log n) stack space vs O(n) call frames).",
        "Could have mentioned hybrid optimization engines like Dual-Pivot Quicksort used in standard Java or V8 implementations."
      ],
      betterAnswer: `// Median-of-Three pivot selection logic to avoid worst-case degeneration\n\nfunction medianOfThree(arr, left, right) {\n  const mid = Math.floor((left + right) / 2);\n  if (arr[left] > arr[mid]) swap(arr, left, mid);\n  if (arr[left] > arr[right]) swap(arr, left, right);\n  if (arr[mid] > arr[right]) swap(arr, mid, right);\n  \n  // Swap median pivot to element before right index boundary\n  swap(arr, mid, right - 1);\n  return arr[right - 1];\n}`,
      feedback: "Highly rigorous breakdown. You demonstrated excellent conceptual and practical algorithmic control. Adding details regarding auxiliary frame limits makes this partition argument flawless."
    },
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 2 days ago
  }
];

export default function App() {
  const [view, setView] = useState<string>("landing");
  const [streak, setStreak] = useState<number>(3);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  // Selection states
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);

  // Active Loading States
  const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);

  // Loading databases
  useEffect(() => {
    const stored = localStorage.getItem("prepai_sessions");
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch {
        setSessions(DEFAULT_ONBOARDING_SESSIONS);
        localStorage.setItem("prepai_sessions", JSON.stringify(DEFAULT_ONBOARDING_SESSIONS));
      }
    } else {
      setSessions(DEFAULT_ONBOARDING_SESSIONS);
      localStorage.setItem("prepai_sessions", JSON.stringify(DEFAULT_ONBOARDING_SESSIONS));
    }

    const storedStreak = localStorage.getItem("prepai_streak");
    if (storedStreak) {
      const parsed = parseInt(storedStreak, 10);
      setStreak(isNaN(parsed) ? 3 : parsed);
    } else {
      setStreak(3);
      localStorage.setItem("prepai_streak", "3");
    }
  }, []);

  // Request new question
  const handleGenerateQuestion = async (topic: Topic, difficulty: Difficulty) => {
    setIsLoadingQuestion(true);
    setQuestionError(null);
    setSelectedTopic(topic);
    setSelectedDifficulty(difficulty);
    setQuestion(null);
    setUserAnswer("");
    setEvaluation(null);

    try {
      const res = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty })
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || "Synthesis Server failed to compile a question. Please check constraints.");
      }

      const data = await res.json();
      setQuestion(data);
      setView("interview");
    } catch (err: any) {
      console.error(err);
      setQuestionError(err.message || "Failed to make contact with server API.");
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // Submit Answer to evaluation proxy
  const handleSubmitAnswer = async (answerText: string) => {
    if (!selectedTopic || !selectedDifficulty || !question) return;

    setIsEvaluating(true);
    setEvaluationError(null);

    try {
      const res = await fetch("/api/gemini/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          question: question.question,
          userAnswer: answerText
        })
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || "Refining grading analysis timed out. Recommend retry.");
      }

      const evalData = (await res.json()) as AIEvaluation;
      setEvaluation(evalData);
      setUserAnswer(answerText);

      // Aggregate new Session
      const newSession: InterviewSession = {
        id: "session-" + Date.now(),
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        question: question.question,
        userAnswer: answerText,
        evaluation: evalData,
        timestamp: new Date().toISOString()
      };

      const revisedSessions = [newSession, ...sessions];
      setSessions(revisedSessions);
      localStorage.setItem("prepai_sessions", JSON.stringify(revisedSessions));

      // Calculate Practice Streaks
      const todayStr = new Date().toDateString();
      const lastPractice = localStorage.getItem("prepai_last_practice_date");
      if (lastPractice !== todayStr) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        localStorage.setItem("prepai_streak", String(nextStreak));
        localStorage.setItem("prepai_last_practice_date", todayStr);
      }

      setView("evaluation");
    } catch (err: any) {
      console.error(err);
      setEvaluationError(err.message || "Something interrupted reports generation.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Reset core active state to launch fresh configurator
  const handleResetSession = () => {
    setQuestion(null);
    setUserAnswer("");
    setEvaluation(null);
    setQuestionError(null);
    setEvaluationError(null);
    setView("setup");
  };

  // Clear single session row index
  const handleDeleteSession = (id: string) => {
    const kept = sessions.filter(s => s.id !== id);
    setSessions(kept);
    localStorage.setItem("prepai_sessions", JSON.stringify(kept));
  };

  // Absolute wipe history ledger
  const handleClearAllHistory = () => {
    setSessions([]);
    localStorage.setItem("prepai_sessions", JSON.stringify([]));
    localStorage.setItem("prepai_streak", "1");
    setStreak(1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500/30 selection:text-white">
      {/* Navbar Widget */}
      <Navbar currentView={view} setView={setView} streak={streak} />

      {/* Main Container Stage */}
      <main className="flex-grow">
        {view === "landing" && <Hero setView={setView} />}

        {view === "setup" && (
          <SetupForm 
            onGenerate={handleGenerateQuestion} 
            isLoading={isLoadingQuestion} 
            error={questionError} 
          />
        )}

        {view === "interview" && question && selectedTopic && selectedDifficulty && (
          <InterviewPanel
            topic={selectedTopic}
            difficulty={selectedDifficulty}
            questionData={question}
            onSubmitAnswer={handleSubmitAnswer}
            onCancel={handleResetSession}
            isEvaluating={isEvaluating}
            evaluationError={evaluationError}
          />
        )}

        {view === "evaluation" && evaluation && selectedTopic && selectedDifficulty && question && (
          <EvaluationPanel
            topic={selectedTopic}
            difficulty={selectedDifficulty}
            question={question.question}
            userAnswer={userAnswer}
            evaluation={evaluation}
            onNextSession={handleResetSession}
            onGoDashboard={() => setView("dashboard")}
          />
        )}

        {view === "history" && (
          <HistoryPanel 
            sessions={sessions} 
            onDeleteSession={handleDeleteSession} 
            onClearAll={handleClearAllHistory} 
          />
        )}

        {view === "dashboard" && (
          <PerformanceDashboard 
            sessions={sessions} 
            streak={streak} 
            onNavigateToPractice={() => setView("setup")} 
          />
        )}
      </main>

      {/* Humble Professional Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p>© 2026 PrepAI Inc. Professional Mock Interview & Mentorship Workspace.</p>
          <div className="flex items-center justify-center space-x-4">
            <span className="cursor-pointer hover:text-indigo-400 font-medium" onClick={() => setView("landing")}>Overview</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-indigo-400 font-medium" onClick={() => setView("setup")}>Start Mock Practice</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-indigo-400 font-medium" onClick={() => setView("dashboard")}>Personal Stats</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
