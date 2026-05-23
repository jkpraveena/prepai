export type Topic = 'JavaScript' | 'Python' | 'DSA' | 'AI/ML' | 'HR Interview';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface InterviewQuestion {
  question: string;
  context?: string;
  hint: string;
}

export interface AIEvaluation {
  score: number; // 1 to 10
  strengths: string[];
  improvements: string[];
  betterAnswer: string;
  feedback: string;
}

export interface InterviewSession {
  id: string;
  topic: Topic;
  difficulty: Difficulty;
  question: string;
  userAnswer: string;
  evaluation?: AIEvaluation;
  timestamp: string;
}

export interface TopicMeta {
  id: Topic;
  name: string;
  iconName: string; // we will map these to lucide icons on the client
  description: string;
  colorClass: string;
  bgGradient: string;
  skillsCovered: string[];
}
