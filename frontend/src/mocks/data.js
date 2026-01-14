// Mock Data Set for English AI Diagnostic Engine

export const mockUser = {
  id: 1,
  fullName: "Umut Özcan",
  email: "umut@example.com",
  role: "User",
  learningPurpose: "Information Systems Engineering & Career Growth", // FR-04
  overallLevel: "B1+", // FR-10
  joinedAt: "2025-12-20"
};

export const mockStats = [
  { skill: "Reading", score: 85, level: "B2" },
  { skill: "Listening", score: 72, level: "B1" },
  { skill: "Writing", score: 64, level: "B1" },
  { skill: "Speaking", score: 45, level: "A2" },
  { skill: "Grammar", score: 90, level: "C1" },
  { skill: "Vocabulary", score: 78, level: "B2" }
]; // FR-12 Analytics Dashboard Data

export const mockHistory = [
  { id: 101, date: "2026-01-10", type: "Full Assessment", result: "B1+" },
  { id: 102, date: "2026-01-12", type: "Grammar Practice", result: "C1" },
  { id: 103, date: "2026-01-13", type: "Vocabulary Test", result: "B2" }
]; // UC-16 Test Pool Simulation

export const mockStudyPlan = {
  weeklyGoal: "15 Hours",
  focusAreas: ["Speaking Fluency", "Listening Comprehension"],
  tasks: [
    { day: "Monday", activity: "Advanced Reading Practice", duration: "45m" },
    { day: "Tuesday", activity: "AI-Generated Grammar Quiz", duration: "30m" }
  ]
}; // UC-18 Personalized Study Plan