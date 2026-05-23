import { TopicMeta } from "./types";

export const TOPICS: TopicMeta[] = [
  {
    id: "JavaScript",
    name: "JavaScript & Frontend",
    iconName: "FileJson",
    description: "Deep-dive into modern ES6+, Async/Await, Closures, DOM, Promises, and state architectures.",
    colorClass: "text-amber-400 border-amber-500/30 bg-amber-500/5",
    bgGradient: "from-amber-500/20 to-orange-500/20",
    skillsCovered: ["Closures & Scope", "Promises & Event Loop", "Protoype Inheritance", "DOM Manipulation", "Framework Fundamentals"]
  },
  {
    id: "Python",
    name: "Python Backend",
    iconName: "FileCode",
    description: "Ace Django/FastAPI conventions, OOP, Decorators, Generatives, Memory Management, and Concurrency.",
    colorClass: "text-sky-400 border-sky-500/30 bg-sky-500/5",
    bgGradient: "from-sky-500/20 to-indigo-500/20",
    skillsCovered: ["Decorators & Generators", "GIL & Multithreading", "Asyncio & Concurrency", "OOP Principles", "APIs & Web Frameworks"]
  },
  {
    id: "DSA",
    name: "Data Structures & Algos",
    iconName: "Binary",
    description: "Examine classic problem-solving, Arrays, Trees, Graphs, Dynamic Programming, and Big O optimization.",
    colorClass: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5",
    bgGradient: "from-emerald-500/20 to-teal-500/20",
    skillsCovered: ["Time & Space Complexity", "Recursion & DP", "Graph Traversals (BFS/DFS)", "Sorting & Searching", "Data Struct Operations"]
  },
  {
    id: "AI/ML",
    name: "AI & Machine Learning",
    iconName: "Cpu",
    description: "Focus on Transformers, Gradient Descent, Deep Learning, Feature Engineering, and LLM Fine-tuning.",
    colorClass: "text-purple-400 border-purple-500/30 bg-purple-500/5",
    bgGradient: "from-purple-500/20 to-fuchsia-500/20",
    skillsCovered: ["Neural Networks", "Loss Functions & Optimizers", "Transformers & Attention", "Data Preprocessing", "Evaluation Metrics"]
  },
  {
    id: "HR Interview",
    name: "Behavioral & HR",
    iconName: "UserCheck",
    description: "Master behavioral patterns (STAR method), leadership standards, conflict resolution, and career drive.",
    colorClass: "text-pink-400 border-pink-500/30 bg-pink-500/5",
    bgGradient: "from-pink-500/20 to-rose-500/20",
    skillsCovered: ["STAR Methodology", "Conflict Resolution", "Leadership Scenarios", "Company Values Alignment", "Ambiguity Handling"]
  }
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Select Your Track",
    description: "Pick your specialization (e.g. JavaScript, DSA, or HR behavioral) and select your target difficulty level.",
    badge: "Flexible"
  },
  {
    step: "02",
    title: "AI Question Synthesis",
    description: "Our Gemini 3.5 Engine generates a live, authentic interview question designed specifically to test critical expertise.",
    badge: "Real-time"
  },
  {
    step: "03",
    title: "Submit & Revise Answers",
    description: "Type your detailed reply in our code/text studio. Gain access to expert hints if you run into blocker constraints.",
    badge: "Code Active"
  },
  {
    step: "04",
    title: "Receive Comprehensive Grades",
    description: "Get immediate feedback: an automated score out of 10, analytical breakdowns of your strengths, and a custom reference response.",
    badge: "Instant Evaluation"
  }
];

export const ADVANTAGES = [
  {
    title: "Aptitude Benchmarking",
    description: "See where your logical explanations shine and which key details were missed according to actual industry grading standards.",
    icon: "Target"
  },
  {
    title: "Constructive Code Snippets",
    description: "Review production-grade, highly-documented refactoring and implementation models side-by-side with your own solution.",
    icon: "Terminal"
  },
  {
    title: "Local State Analytics",
    description: "Your session reviews, completion streaks, and overall score trajectories are saved locally to map continuous improvement.",
    icon: "LineChart"
  }
];
